"use client";

import React from "react";
import Link from "next/link";
import { FaDownload } from "react-icons/fa";
import AccountShell from "@/components/account/AccountShell";

export default function DownloadsPage() {
  return (
    <AccountShell
      title="My Downloads"
      subtitle="Access your purchased products and download them anytime."
    >
      <div className="bg-dark-lighter/60 border border-text-primary/10 rounded-2xl p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
          <FaDownload className="text-primary text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          No downloads yet
        </h3>
        <p className="text-text-primary/60 mb-6">
          When you purchase a product, it will appear here.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-dark font-semibold"
        >
          View Products
        </Link>
      </div>
    </AccountShell>
  );
}
