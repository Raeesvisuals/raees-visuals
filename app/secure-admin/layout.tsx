"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaSignOutAlt, 
  FaHome, 
  FaVideo, 
  FaImage, 
  FaUser, 
  FaBlog, 
  FaShoppingBag,
  FaCog
} from 'react-icons/fa';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/secure-admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const adminMenuItems = [
    { href: '/secure-admin', label: 'Dashboard', icon: FaHome },
    { href: '/secure-admin/portfolio/new', label: 'New Portfolio', icon: FaVideo },
    { href: '/secure-admin/media', label: 'Media Library', icon: FaImage },
    { href: '/secure-admin/profile', label: 'Profile Settings', icon: FaUser },
    { href: '/secure-admin/blog/new', label: 'New Blog Post', icon: FaBlog },
    { href: '/secure-admin/shop/new', label: 'New Product', icon: FaShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-dark">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark-lighter/90 backdrop-blur-md border-r border-text-primary/20 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-text-primary/10">
            <h1 className="text-2xl font-bold text-text-primary">
              Admin <span className="text-primary">Panel</span>
            </h1>
            <p className="text-text-primary/60 text-sm">Content Management</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {adminMenuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-text-primary/80 hover:text-text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <IconComponent className="text-primary" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-text-primary/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Mobile header */}
        <div className="lg:hidden bg-dark-lighter/50 backdrop-blur-md border-b border-text-primary/10 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-text-primary hover:text-primary transition-colors"
            >
              <FaCog className="text-xl" />
            </button>
            <h1 className="text-lg font-semibold text-text-primary">Admin Panel</h1>
            <div className="w-6" />
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
