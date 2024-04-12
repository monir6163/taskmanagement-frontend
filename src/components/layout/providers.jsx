"use client";
import { SessionProvider } from "next-auth/react";
import ThemeProvider from "./ThemeToggle/themeProvider";
export default function Providers({ session, children }) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider session={session}>{children}</SessionProvider>
      </ThemeProvider>
    </>
  );
}
