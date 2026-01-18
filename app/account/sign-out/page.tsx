"use client";

import React from "react";
import Link from "next/link";
import AccountShell from "@/components/account/AccountShell";

export default function SignOutPage() {
  return (
    <AccountShell
      title="Sign Out"
      subtitle="Account sign out will be enabled when authentication is connected."
    >
      <div className="bg-dark-lighter/60 border border-text-primary/10 rounded-2xl p-8 text-center">
        <p className="text-text-primary/70 mb-6">
          Authentication is not enabled yet. This is a placeholder page.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-dark font-semibold"
        >
          Return to Shop
        </Link>
      </div>
    </AccountShell>
  );
}
