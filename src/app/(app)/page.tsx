import Socials from "@/components/socials";
import { validateRequest } from "@/lib/auth";
import { api } from "@/trpc/server";

export default async function Home() {
  const session = await validateRequest();

  const hello = await api.post.hello({
    text: session.user?.username || "twitter",
  });
  return (
    <section className="relative flex h-full w-full flex-1 items-center justify-center">
      <div className="grid">
        <h1 className="text-2xl font-black lg:text-6xl xl:text-8xl">
          {hello.greeting}
        </h1>
        {!session && "you're not signed in!"}
      </div>
      <Socials />
    </section>
  );
}
