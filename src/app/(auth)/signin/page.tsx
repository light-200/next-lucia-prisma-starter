"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { login } from "@/lib/auth/actions";
import { useFormState } from "react-dom";
import { useSession } from "@/components/session-context";
import { useRouter } from "next/navigation";
export default function Page() {
  const { session } = useSession();
  const router = useRouter();
  const [state, formAction] = useFormState(login, null);

  if (session) {
    router.push("/");
  }

  return (
    <>
      <Card className="mx-auto w-full max-w-sm">
        <form action={formAction}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enter your username to login</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="userName">Username</Label>
                <Input
                  id="userName"
                  type="text"
                  name="username"
                  placeholder="0x128k"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" name="password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button
                variant="outline"
                title="coming soon!!"
                disabled
                className="w-full"
              >
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </form>
      </Card>
    </>
  );
}
