"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  );
}
