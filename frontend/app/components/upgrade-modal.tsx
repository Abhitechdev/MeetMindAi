"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Script from "next/script";
import { createOrder, verifyPayment } from "@/lib/api";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);

  // ponytail: close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, loading]);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const order = await createOrder();
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "MeetMind AI",
        description: "Pro Upgrade - 100 Meetings",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            window.dispatchEvent(new Event("usage-updated"));
            onClose();
          } catch (err) {
            console.error(err);
            alert("Payment verification failed. Please contact support at meetmindai.help@zohomail.in");
          }
        },
        prefill: {
          name: "User",
          email: "",
        },
        theme: {
          color: "#8b5cf6"
        }
      };

      if (!window.Razorpay) {
        alert("Payment gateway is still loading. Please wait a second and try again.");
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        console.error(response.error);
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Failed to initiate checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !loading && onClose()}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-background/60 p-8 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-foreground">Upgrade Your Plan</h2>
              <p className="mt-2 text-sm text-muted">Unlock the full potential of MeetMind AI</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {/* Free */}
              <div className="rounded-xl border border-white/5 bg-white/5 p-6 opacity-80 flex flex-col">
                <div className="text-xl font-bold text-foreground mb-1">Free</div>
                <div className="text-2xl font-bold text-foreground mb-4">₹0</div>
                <ul className="text-sm text-muted space-y-2 mb-6 flex-grow">
                  <li className="flex items-center gap-2">✓ 3 Meetings</li>
                  <li className="flex items-center gap-2">✓ Meeting History</li>
                  <li className="flex items-center gap-2">✓ AI Summary</li>
                  <li className="flex items-center gap-2">✓ Action Items</li>
                </ul>
              </div>

              {/* Pro */}
              <div className="rounded-xl border border-purple-500/50 bg-purple-500/10 p-6 flex flex-col relative">
                <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">Most Popular</div>
                <div className="text-xl font-bold text-foreground mb-1">Pro</div>
                <div className="text-2xl font-bold text-foreground mb-4">₹299 <span className="text-sm font-normal text-muted">one-time</span></div>
                <ul className="text-sm text-foreground space-y-2 mb-6 flex-grow">
                  <li className="flex items-center gap-2 text-purple-400">✓ 100 Meetings</li>
                  <li className="flex items-center gap-2">✓ Unlimited AI Chat</li>
                  <li className="flex items-center gap-2">✓ Priority Processing</li>
                  <li className="flex items-center gap-2">✓ Future Premium Features</li>
                </ul>
                <button
                  className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                  onClick={handleUpgrade}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Upgrade To Pro"}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                className="w-full rounded-xl py-3 text-sm font-medium text-muted transition-colors hover:text-foreground disabled:opacity-50"
                onClick={onClose}
                disabled={loading}
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}
