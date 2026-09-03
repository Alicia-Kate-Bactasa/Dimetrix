"use client";
import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { Toaster } from "@/components/ui";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClientInstance}>
        {children}
        <Toaster />
      </QueryClientProvider>
    </SessionProvider>
  );
}
