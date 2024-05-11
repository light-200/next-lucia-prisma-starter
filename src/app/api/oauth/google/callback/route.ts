import { lucia } from "@/lib/auth";
import { google } from "@/lib/auth/oauth";
import { db } from "@/server/db";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  picture: string;
  locale: string;
}

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return Response.json({ error: "Invalid request" }, { status: 404 });
  }

  const codeVerifier = cookies().get("code")?.value;
  const savedState = cookies().get("state")?.value;

  if (!codeVerifier || !savedState) {
    return Response.json({ error: "Invalid request" }, { status: 404 });
  }

  if (savedState !== state) {
    return Response.json({ error: "Invalid request" }, { status: 404 });
  }

  try {
    const { accessToken, idToken } = await google.validateAuthorizationCode(
      code,
      codeVerifier,
    );

    const googleRes = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        method: "Get",
      },
    );

    const googleData = (await googleRes.json()) as GoogleUser;

    const existingUser = await db.user.findUnique({
      where: { google_id: googleData.id },
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
          "Set-Cookie": sessionCookie.serialize(),
        },
      });
    }

    const userId = generateIdFromEntropySize(10); // 16 characters long
    await db.user.create({
      data: {
        id: userId,
        username: googleData.name,
        google_id: googleData.id,
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
        "Set-Cookie": sessionCookie.serialize(),
      },
    });
  } catch (e) {
    console.log(e);
    if (e instanceof OAuth2RequestError) {
      // bad verification code, invalid credentials, etc
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
};
