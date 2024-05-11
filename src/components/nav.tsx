import { validateRequest } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";

export default async function Nav() {
  const { session } = await validateRequest();
  return (
    <nav className="mx-auto flex h-fit w-[250px] items-center justify-between rounded-full bg-gray-200 bg-opacity-40 p-2  px-3 text-xs text-black backdrop-blur-sm">
      <span className="aspect-square w-6">
        <Image
          src={"/icon-dark.svg"}
          alt={"icon"}
          width={24}
          height={24}
          objectFit="cover"
        />
      </span>

      <ul className="flex gap-2">
        <li>
          <Link
            href={"/"}
            className="inline-flex items-center justify-center rounded-full px-2 py-1 hover:bg-black hover:bg-opacity-10 active:bg-opacity-5"
          >
            Home
          </Link>
        </li>

        {!session ? (
          <li>
            <Link
              href={"/signin"}
              className="inline-flex items-center justify-center rounded-full px-2 py-1 hover:bg-black hover:bg-opacity-10 active:bg-opacity-5"
              inline-flex
              justify-center
              items-center
              py-1
            >
              Sign in
            </Link>
          </li>
        ) : (
          <li>
            <Link
              href={"/profile"}
              className="inline-flex items-center justify-center rounded-full px-2 py-1 hover:bg-black hover:bg-opacity-10 active:bg-opacity-5"
              inline-flex
              justify-center
              items-center
              py-1
            >
              Profile
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
