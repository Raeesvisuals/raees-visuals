"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import Layout from "./Layout";

const STANDALONE_ROUTES = ["/fitness"];

const hasClerkKeys = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const pathname = usePathname();
  const isStandalone = STANDALONE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isStandalone) {
    return <>{children}</>;
  }

  if (!hasClerkKeys) {
    return <Layout>{children}</Layout>;
  }

  return (
    <ClerkProvider>
      <Layout>{children}</Layout>
    </ClerkProvider>
  );
};

export default Providers;
