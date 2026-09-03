"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Report() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page with report modal query parameter open
    router.replace("/?report=true");
  }, [router]);

  return null;
}