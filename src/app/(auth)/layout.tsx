import Image from "next/image";
import { ReactNode } from "react";

export default function Dashboard({ children }: { children: ReactNode }) {
  return (
    <div className="relative grid max-h-screen min-h-screen w-full overflow-hidden lg:grid-cols-2">
      <div className="sticky hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex items-center justify-center py-12">{children}</div>
    </div>
  );
}
