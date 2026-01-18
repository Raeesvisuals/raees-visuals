import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/Layout";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Raees Visuals | Creative Video Editing",
  description: "Professional video editing services creating cinematic content and compelling visual stories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Layout>{children}</Layout>
        </body>
      </html>
    </ClerkProvider>
  );
}

