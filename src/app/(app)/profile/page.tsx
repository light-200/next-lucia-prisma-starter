"use client";
import { buttonVariants } from "@/components/ui/button";
import { logout } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";
import { useFormState } from "react-dom";
import { HiOutlineLogout } from "react-icons/hi";

export default function Page() {
  const [state, formAction] = useFormState(logout, null);
  return (
    <section className="container">
      <form action={formAction}>
        <button
          className={cn(
            "flex items-center gap-2 !rounded-full",
            buttonVariants({ variant: "ghost" }),
          )}
        >
          <HiOutlineLogout /> logout
        </button>
      </form>
    </section>
  );
}
