import "@/app/globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Dimetrix — Cebu Power Outage Map & Analytics",
  description:
    "Dimetrix tracks power outages, brownouts, and transformer incidents across Cebu on one interactive map.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dc2626'><path d='M13 2L3 14h9l-1 8 10-12h-9l1-8z'/></svg>",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Turret+Road:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
