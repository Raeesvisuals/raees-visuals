"use client";

import React from "react";
import AccountShell from "@/components/account/AccountShell";

export default function ProfilePage() {
  return (
    <AccountShell
      title="My Account"
      subtitle="Manage your profile information and preferences."
    >
      <div className="bg-dark-lighter/60 border border-text-primary/10 rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm text-text-primary/60 mb-2">Full Name</label>
          <input
            type="text"
            placeholder="Your name"
            className="w-full px-4 py-3 bg-dark/60 border border-text-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-text-primary/60 mb-2">Email</label>
          <input
            type="email"
            placeholder="you@email.com"
            className="w-full px-4 py-3 bg-dark/60 border border-text-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
          />
        </div>
        <div className="pt-2">
          <button className="px-6 py-3 rounded-lg bg-primary text-dark font-semibold">
            Save Changes
          </button>
        </div>
        <p className="text-xs text-text-primary/50">
          Payments and invoices will be added when checkout is enabled.
        </p>
      </div>
    </AccountShell>
  );
}
