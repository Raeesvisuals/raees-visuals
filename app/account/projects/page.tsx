"use client";

import React from "react";
import Link from "next/link";
import { FaFolderOpen, FaPlus } from "react-icons/fa";
import AccountShell from "@/components/account/AccountShell";

export default function ProjectsPage() {
  return (
    <AccountShell
      title="My Projects"
      subtitle="Organize purchases by project and keep everything in one place."
    >
      <div className="flex items-center justify-between">
        <div className="text-text-primary/70">No projects yet.</div>
        <button className="px-4 py-2 rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-colors">
          <span className="inline-flex items-center gap-2">
            <FaPlus /> New Project
          </span>
        </button>
      </div>

      <div className="bg-dark-lighter/60 border border-text-primary/10 rounded-2xl p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
          <FaFolderOpen className="text-primary text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          Start your first project
        </h3>
        <p className="text-text-primary/60 mb-6">
          Keep assets organized by client, campaign, or production.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-dark font-semibold"
        >
          Browse Shop
        </Link>
      </div>
    </AccountShell>
  );
}
