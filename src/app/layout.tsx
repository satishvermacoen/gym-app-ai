
import type { Metadata } from "next";
import Providers from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gym-Fussion",
  description: "AI-powered Gym Management System",
  icons: {
    icon: "/logo.png",
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
