"use server";
import { lucia, validateRequest } from "@/lib/auth";
import { db } from "@/server/db";
import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";
import { verify } from "@node-rs/argon2";
import { generateCodeVerifier, generateState } from "arctic";
import { google } from "./oauth";

interface ActionResult {
  error: string;
}

export async function login(
  _: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const username = formData.get("username");
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: "Invalid username",
    };
  }
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }

  const existingUser = await db.user.findUnique({
    where: {
      username: username,
    },
    select: {
      password_hash: true,
      id: true,
    },
  });

  if (!existingUser) {
    return {
      error: "Incorrect username or password",
    };
  }
  if (!existingUser.password_hash) {
    return {
      error: "Password not set, consider using google sign in.",
    };
  }

  const validPassword = await verify(existingUser.password_hash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  if (!validPassword) {
    return {
      error: "Incorrect username or password",
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}

export async function signup(
  _: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const username = formData.get("username");

  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: "Invalid username",
    };
  }
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }

  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const userId = generateIdFromEntropySize(10); // 16 characters long

  // TODO: check if username is already used
  const existingUser = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    return {
      error: "Username unavailable",
    };
  }

  const user = await db.user.create({
    data: {
      id: userId,
      username: username,
      password_hash: passwordHash,
    },
  });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}

export async function logout(): Promise<ActionResult> {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}

export async function createGoogleAuthUrl() {
  try {
    // generate state
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    cookies().set("code", codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    cookies().set("state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    // pass state (and code verifier for PKCE)
    // returns the authorization url only
    const authorizationURL = await google.createAuthorizationURL(
      state,
      codeVerifier,
    );

    return {
      success: true,
      data: authorizationURL.toString(),
    };
  } catch (error: unknown) {
    return {
      error: (error as Error)?.message,
    };
  }
}
