"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";

const accountNavItems = [
  { label: "Dashboard", href: "/account" },
  { label: "My Projects", href: "/account/projects" },
  { label: "My Collections", href: "/account/collections" },
  { label: "My Downloads", href: "/account/downloads" },
  { label: "My Account", href: "/account/profile" },
  { label: "Help Center", href: "/help-center" },
  { label: "Sign Out", href: "/account/sign-out" },
];

interface AccountShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AccountShell({ title, subtitle, children }: AccountShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-dark">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-dark to-dark" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-lighter/20 to-dark pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-text-primary">{title}</h1>
          {subtitle && <p className="text-text-primary/70 mt-2">{subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-8">
          {/* Sidebar */}
          <aside className="bg-dark-lighter/60 border border-text-primary/10 rounded-2xl p-4 h-fit">
            <div className="text-sm text-text-primary/50 mb-3">Account</div>
            <nav className="flex flex-col gap-1">
              {accountNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/account" && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-primary/20 text-primary"
                        : "text-text-primary/70 hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main */}
          <main className="space-y-6">
            <SignedOut>
              <div className="bg-dark-lighter/60 border border-text-primary/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  Sign in to access your account
                </h2>
                <p className="text-text-primary/70 mb-6">
                  Create a free account to manage your downloads, projects, and collections.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/sign-in"
                    className="px-5 py-3 rounded-lg bg-primary text-dark font-semibold"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="px-5 py-3 rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </SignedOut>
            <SignedIn>{children}</SignedIn>
          </main>
        </div>
      </div>
    </div>
  );
}
