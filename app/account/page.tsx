"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getUserPurchases, setCurrentUser, currentUser, mockUsers } from "@/data/user";
import { shopProducts } from "@/data/shop";
import { FaDownload, FaArrowLeft, FaUser, FaShoppingBag, FaSignInAlt } from "react-icons/fa";

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!currentUser);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const purchases = getUserPurchases();

  const handleLogin = () => {
    if (email && name) {
      const newUser = {
        id: Date.now().toString(),
        email,
        name,
        purchases: [],
        createdAt: new Date().toISOString()
      };
      setCurrentUser(newUser);
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setEmail("");
    setName("");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-dark">
        {/* Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-dark to-dark" />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-lighter/20 to-dark pointer-events-none" />

        <div className="relative z-10 max-w-md mx-auto px-4 py-20">
          {/* Back Button */}
          <motion.div className="mb-8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link href="/shop">
              <motion.button
                className="flex items-center gap-2 text-text-primary hover:text-primary transition-colors"
                whileHover={{ x: -5 }}
              >
                <FaArrowLeft />
                Back to Shop
              </motion.button>
            </Link>
          </motion.div>

          {/* Login Form */}
          <motion.div
            className="bg-dark-lighter/90 backdrop-blur-md border border-primary/30 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUser className="text-primary text-2xl" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">Account Access</h1>
              <p className="text-text-primary/70">Sign in to view your purchases and downloads</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary/70 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-dark/50 border border-text-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary/70 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-dark/50 border border-text-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
                />
              </div>

              <motion.button
                onClick={handleLogin}
                disabled={!email || !name}
                className="w-full py-3 bg-primary text-dark font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaSignInAlt />
                Access Account
              </motion.button>

              <p className="text-xs text-text-primary/50 text-center">
                Demo mode: No real authentication required
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-dark to-dark" />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-lighter/20 to-dark pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <Link href="/shop">
              <motion.button
                className="flex items-center gap-2 text-text-primary hover:text-primary transition-colors mb-4"
                whileHover={{ x: -5 }}
              >
                <FaArrowLeft />
                Back to Shop
              </motion.button>
            </Link>
            <h1 className="text-4xl font-bold text-text-primary">My Account</h1>
            <p className="text-text-primary/70">Welcome back, {currentUser?.name}</p>
          </div>
          
          <motion.button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </motion.button>
        </div>

        {/* Account Info */}
        <motion.div
          className="bg-dark-lighter/90 backdrop-blur-md border border-primary/30 rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <FaUser className="text-primary text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">{currentUser?.name}</h2>
              <p className="text-text-primary/70">{currentUser?.email}</p>
              <p className="text-sm text-text-primary/50">
                Member since {new Date(currentUser?.createdAt || '').toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Purchases Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <FaShoppingBag className="text-primary text-xl" />
            <h2 className="text-2xl font-bold text-text-primary">My Purchases</h2>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-semibold">
              {purchases.length}
            </span>
          </div>

          {purchases.length === 0 ? (
            <div className="bg-dark-lighter/50 backdrop-blur-md border border-text-primary/20 rounded-2xl p-12 text-center">
              <div className="w-20 h-20 bg-text-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShoppingBag className="text-text-primary/50 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">No purchases yet</h3>
              <p className="text-text-primary/70 mb-6">
                Start building your collection by purchasing some amazing templates and LUTs.
              </p>
              <Link href="/shop">
                <motion.button
                  className="px-6 py-3 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse Shop
                </motion.button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases.map((purchase) => {
                const product = shopProducts.find(
  p => String(p.id) === String(purchase.productId)
);

                if (!product) return null;

                return (
                  <motion.div
                    key={purchase.id}
                    className="bg-dark-lighter/50 backdrop-blur-md border border-text-primary/20 rounded-2xl p-6 hover:border-primary/50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      {product.thumbnail && !product.thumbnail.includes('placeholder') ? (
                        <Image 
                          src={product.thumbnail} 
                          alt={product.title}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-dark-lighter rounded-lg" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-text-primary mb-1">{product.title}</h3>
                        <p className="text-sm text-text-primary/70">{product.category}</p>
                        <p className="text-sm text-text-primary/50">
                          Purchased on {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-primary font-bold">${purchase.amount}</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                          purchase.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : purchase.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {purchase.status}
                        </span>
                      </div>
                      
                      {purchase.status === 'completed' && (
                        <motion.a
                          href={purchase.downloadUrl || '#'}
                          download
                          className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/50 rounded-lg text-primary hover:bg-primary/30 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaDownload />
                          Download
                        </motion.a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
