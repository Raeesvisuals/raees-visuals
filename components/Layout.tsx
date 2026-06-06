"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageTransition from "./PageTransition";
import CursorTrail from "./CursorTrail";

interface LayoutProps {
  children: React.ReactNode;
}

const STANDALONE_ROUTES = ["/fitness"];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const isStandalone = STANDALONE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <CursorTrail />
      <Navbar />
      <PageTransition>
        <main className="flex-grow">{children}</main>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default Layout;

