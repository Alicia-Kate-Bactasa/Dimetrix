"use client";
import dynamic from "next/dynamic";

const OAuthConsent = dynamic(() => import("@/components/pages/OAuthConsent"), { ssr: false });

export default function OAuthConsentPage() {
  return <OAuthConsent />;
}
