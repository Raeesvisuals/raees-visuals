"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  SignOutButton,
  useUser,
} from "@clerk/nextjs";

const accountMenuItems = [
  { label: "My Projects", href: "/account/projects" },
  { label: "My Collections", href: "/account/collections" },
  { label: "My Downloads", href: "/account/downloads" },
  { label: "My Account", href: "/account/profile" },
  { label: "Help Center", href: "/help-center" },
  { label: "Sign Out", href: "/account/sign-out" },
];

const NavbarAccountMenu: React.FC = () => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { user } = useUser();

  return (
    <div className="relative">
      <SignedOut>
        <div className="flex items-center gap-3">
          <SignInButton>
            <button className="px-4 py-2 rounded-full border border-white/20 text-text-primary/80 hover:text-primary hover:border-primary/60 transition-colors">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="px-4 py-2 rounded-full bg-primary text-dark hover:bg-primary/90 transition-colors">
              Create Account
            </button>
          </SignUpButton>
        </div>
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
              <div className="flex items-center gap-3">
                <UserButton />
                <div>
                  <div className="text-sm text-text-primary/60">Account</div>
                  <div className="text-text-primary font-semibold">
                    {user?.fullName || "My Account"}
                  </div>
                </div>
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
  );
};

export default NavbarAccountMenu;
