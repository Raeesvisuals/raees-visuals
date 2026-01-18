import React from "react";
import Link from "next/link";
import { FaDownload, FaFolderOpen, FaStar, FaUserCircle } from "react-icons/fa";
import AccountShell from "@/components/account/AccountShell";

export default function AccountPage() {
  return (
    <AccountShell
      title="Account Dashboard"
      subtitle="Manage purchases, projects, collections, and profile settings."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-dark-lighter/60 border border-text-primary/10 rounded-2xl p-5">
          <div className="text-text-primary/60 text-sm mb-2">My Downloads</div>
          <div className="text-2xl font-bold text-text-primary">0</div>
        </div>
        <div className="bg-dark-lighter/60 border border-text-primary/10 rounded-2xl p-5">
          <div className="text-text-primary/60 text-sm mb-2">My Projects</div>
          <div className="text-2xl font-bold text-text-primary">0</div>
        </div>
        <div className="bg-dark-lighter/60 border border-text-primary/10 rounded-2xl p-5">
          <div className="text-text-primary/60 text-sm mb-2">My Collections</div>
          <div className="text-2xl font-bold text-text-primary">0</div>
        </div>
        <div className="bg-dark-lighter/60 border border-text-primary/10 rounded-2xl p-5">
          <div className="text-text-primary/60 text-sm mb-2">Account Status</div>
          <div className="text-2xl font-bold text-primary">Active</div>
        </div>
      </div>

      <div className="bg-dark-lighter/60 border border-text-primary/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaUserCircle className="text-primary text-2xl" />
          <div>
            <div className="text-text-primary font-semibold">Guest User</div>
            <div className="text-text-primary/60 text-sm">Sign in and purchases will appear here.</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/account/downloads"
            className="px-4 py-2 rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
          >
            <span className="inline-flex items-center gap-2">
              <FaDownload /> My Downloads
            </span>
          </Link>
          <Link
            href="/account/projects"
            className="px-4 py-2 rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
          >
            <span className="inline-flex items-center gap-2">
              <FaFolderOpen /> My Projects
            </span>
          </Link>
          <Link
            href="/account/collections"
            className="px-4 py-2 rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
          >
            <span className="inline-flex items-center gap-2">
              <FaStar /> My Collections
            </span>
          </Link>
        </div>
      </div>
    </AccountShell>
  );
}
