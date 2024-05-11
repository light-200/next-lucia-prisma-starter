import Link from "next/link";
import { FaGithub, FaXTwitter } from "react-icons/fa6";

export default function Socials() {
  return (
    <div className="absolute bottom-0 right-0 m-5 flex w-fit gap-4">
      <Link href={"https://twitter.com/0x128k"} target="_blank">
        <FaXTwitter />
      </Link>
      <Link href={"https://github.com/light-200"} target="_blank">
        <FaGithub />
      </Link>
    </div>
  );
}
