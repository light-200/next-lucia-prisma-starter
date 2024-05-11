import "@/styles/globals.css";

import { Space_Mono, Space_Grotesk } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-context";
import { validateRequest } from "@/lib/auth";

const space_mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-mono",
});

const space_grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700", "300", "400", "500", "600"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata = {
  title: "Nextjs starter",
  description:
    "Boilerplate code for your nextjs app with lucia authentication and prisma.",
  icons: [{ rel: "icon", url: "/icon-dark.svg" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();
  return (
    <html lang="en">
      <body
        className={`font-sans ${space_mono.variable} ${space_grotesk.variable}`}
      >
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SessionProvider value={session}>{children}</SessionProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
