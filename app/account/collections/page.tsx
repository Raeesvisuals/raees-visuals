"use client";

import React from "react";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import AccountShell from "@/components/account/AccountShell";

export default function CollectionsPage() {
  return (
    <AccountShell
      title="My Collections"
      subtitle="Save favorite products and build curated lists."
    >
      <div className="bg-dark-lighter/60 border border-text-primary/10 rounded-2xl p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
          <FaStar className="text-primary text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          No collections yet
        </h3>
        <p className="text-text-primary/60 mb-6">
          Save items you love and access them quickly later.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-dark font-semibold"
        >
          Explore Shop
        </Link>
      </div>
    </AccountShell>
  );
}
