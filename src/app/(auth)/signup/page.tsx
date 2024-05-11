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
import { useSession } from "@/components/session-context";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { signup } from "@/lib/auth/actions";

export default function Page() {
  const { session } = useSession();
  const router = useRouter();
  const [state, formAction] = useFormState(signup, null);

  if (session) {
    router.push("/");
  }

  return (
    <>
      <Card className="mx-auto w-full max-w-sm">
        <form action={formAction}>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {/* <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" placeholder="Max" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" placeholder="Robinson" required />
                </div>
              </div> */}
              <div className="grid gap-2">
                <Label htmlFor="userName">Username</Label>
                <Input
                  id="userName"
                  name="username"
                  type="text"
                  placeholder="0x128k"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" />
              </div>
              <Button type="submit" className="w-full">
                Create an account
              </Button>
              <Button
                variant="outline"
                title="coming soon!!"
                disabled
                className="w-full"
              >
                Sign up with GitHub
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/signin" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
          {state?.error ? (
            <CardDescription className="bg-destructive/10 text-destructive rounded-lg border p-2 text-[0.8rem] font-medium">
              {state?.error}
            </CardDescription>
          ) : null}
        </form>
      </Card>
    </>
  );
}
