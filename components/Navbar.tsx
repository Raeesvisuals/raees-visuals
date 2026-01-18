"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import GooeyNav from "./GooeyNav";
import { SignedIn, SignedOut, SignOutButton, useUser } from "@clerk/nextjs";


const navItems = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" },
];

const accountMenuItems = [
  { label: "My Projects", href: "/account/projects" },
  { label: "My Collections", href: "/account/collections" },
  { label: "My Downloads", href: "/account/downloads" },
  { label: "My Account", href: "/account/profile" },
  { label: "Help Center", href: "/help-center" },
  { label: "Sign Out", href: "/account/sign-out" },
];

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { user } = useUser();
  const initialIndex = navItems.findIndex(item =>
  pathname === item.href ||
  (item.href !== "/" && pathname.startsWith(item.href))
);

  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <nav className="sticky top-0 z-50 bg-dark/80 backdrop-blur-md border-b border-dark-lighter shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="text-2xl font-bold tracking-tight"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-primary glow-text">Raees</span>
              <span className="text-text-primary"> Visuals</span>
            </motion.div>
          </Link>

          {/* Desktop Menu with Gooey Animation */}
          <div className="hidden md:flex items-center gap-6">
            <GooeyNav
              items={navItems}
              particleCount={12}
              particleDistances={[70, 8]}
              particleR={80}
              initialActiveIndex={initialIndex >= 0 ? initialIndex : 0}
              animationTime={500}
              timeVariance={250}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />

            {/* Account Menu */}
            <div className="relative">
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="px-4 py-2 rounded-full border border-white/20 text-text-primary/80 hover:text-primary hover:border-primary/60 transition-colors"
                >
                  Sign In
                </Link>
              </SignedOut>
              <SignedIn>
                <button
                  onClick={() => setIsAccountOpen((prev) => !prev)}
                  className="px-4 py-2 rounded-full border border-white/20 text-text-primary/80 hover:text-primary hover:border-primary/60 transition-colors"
                  aria-haspopup="menu"
                  aria-expanded={isAccountOpen}
                >
                  {user?.fullName || user?.primaryEmailAddress?.emailAddress || "My Account"}
                </button>

                {isAccountOpen && (
                  <div
                    className="absolute right-0 mt-3 w-56 rounded-2xl border border-text-primary/10 bg-dark/95 backdrop-blur-md shadow-xl overflow-hidden z-50"
                    onMouseLeave={() => setIsAccountOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-text-primary/10">
                      <div className="text-sm text-text-primary/60">Account</div>
                      <div className="text-text-primary font-semibold">
                        {user?.fullName || "My Account"}
                      </div>
                    </div>
                    <div className="py-2">
                      {accountMenuItems
                        .filter((item) => item.href !== "/account/sign-out")
                        .map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-2 text-sm text-text-primary/80 hover:bg-primary/10 hover:text-primary transition-colors"
                            onClick={() => setIsAccountOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      <SignOutButton>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-text-primary/80 hover:bg-primary/10 hover:text-primary transition-colors"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          Sign Out
                        </button>
                      </SignOutButton>
                    </div>
                  </div>
                )}
              </SignedIn>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
};

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-text-primary hover:text-primary transition-colors p-2"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-16 left-0 right-0 bg-dark/95 backdrop-blur-md border-b border-dark-lighter"
        >
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <div
                  className={`block text-lg font-medium transition-colors ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-text-primary hover:text-primary"
                  }`}
                >
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Navbar;

