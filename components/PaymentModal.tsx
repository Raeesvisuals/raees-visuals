"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FaTimes, FaCreditCard, FaLock, FaDownload } from "react-icons/fa";
type Product = {
  _id: string;
  title: string;
  price: number;
  thumbnail?: any;
};

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onPaymentSuccess: (productId: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  product,
  onPaymentSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = async () => {
    if (!product) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Simulate successful payment
      setTimeout(() => {
        onPaymentSuccess(product._id);
        onClose();
        setIsSuccess(false);
      }, 2000);
    }, 3000);
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-dark/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative z-10 w-full max-w-md bg-dark-lighter/90 backdrop-blur-md border border-primary/30 rounded-2xl overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
          >
            {/* Header */}
            <div className="p-6 border-b border-text-primary/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-primary">
                  {isSuccess ? "Payment Successful!" : "Complete Purchase"}
                </h2>
                <motion.button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center bg-dark/50 rounded-full text-text-primary/70 hover:text-text-primary transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {!isSuccess ? (
                <>
                  {/* Product Info */}
                  <div className="flex items-center gap-4 mb-6 p-4 bg-dark/50 rounded-lg">
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
                    <div>
                      <h3 className="font-semibold text-text-primary">{product.title}</h3>
                      <p className="text-primary font-bold">${product.price}</p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-text-primary mb-3">Payment Method</h3>
                    <div className="space-y-2">
                      <motion.button
                        onClick={() => setPaymentMethod('card')}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                          paymentMethod === 'card'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-text-primary/20 text-text-primary hover:border-primary/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FaCreditCard />
                        <span>Credit/Debit Card</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => setPaymentMethod('paypal')}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                          paymentMethod === 'paypal'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-text-primary/20 text-text-primary hover:border-primary/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.435-.18c-.442-.121-.88-.16-1.316-.16H9.76c-.524 0-.968.382-1.05.9L8.115 16.8h4.61c.524 0 .968-.382 1.05-.9l1.12-7.106h2.19c.524 0 .968-.382 1.05-.9l.632-4.01z"/>
                        </svg>
                        <span>PayPal</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Card Form */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-text-primary/70 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 bg-dark/50 border border-text-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary/70 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 bg-dark/50 border border-text-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-primary/70 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-4 py-3 bg-dark/50 border border-text-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Note */}
                  <div className="flex items-center gap-2 text-sm text-text-primary/70 mb-6">
                    <FaLock />
                    <span>Your payment information is secure and encrypted</span>
                  </div>

                  {/* Pay Button */}
                  <motion.button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full py-4 bg-primary text-dark font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                    whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaCreditCard />
                        Pay ${product.price}
                      </>
                    )}
                  </motion.button>
                </>
              ) : (
                <div className="text-center py-8">
                  <motion.div
                    className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <FaDownload className="text-white text-xl" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-text-primary/70">
                    You can now download your purchase from your account page.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
