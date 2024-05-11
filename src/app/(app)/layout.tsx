import Nav from "@/components/nav";
import React, { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="flex h-screen max-h-screen flex-col bg-opacity-5 bg-[url('/box-bg.svg')] bg-[size:7px] p-4">
      <Nav />
      {children}
    </main>
  );
}
