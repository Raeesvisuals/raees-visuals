"use client";

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageTransition from "./PageTransition";
import CursorTrail from "./CursorTrail";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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

