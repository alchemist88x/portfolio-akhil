"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SystemBoot() {
  const [booting, setBooting] = useState(true);
  const [bootStep, setBootStep] = useState(0);

  const steps = [
    "INITIALIZING CONTROL PLANE...",
    "LOADING INFRASTRUCTURE TOPOLOGY...",
    "VERIFYING CI/CD PIPELINE STAGES...",
    "SYNCING CLOUD METRICS...",
    "SYSTEM READY · ALL NODES ONLINE",
  ];

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setBooting(false);
      return;
    }

    // Fast 500-650ms boot progression
    const interval = setInterval(() => {
      setBootStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => setBooting(false), 180);
          return prev;
        }
      });
    }, 110);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <AnimatePresence>
      {booting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A] font-mono text-zinc-300 p-6 select-none"
        >
          <div className="w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 status-pulse" />
                <span className="text-xs font-bold tracking-widest text-zinc-100">
                  SYSTEM BOOT // V10.4
                </span>
              </div>
              <span className="text-[10px] text-zinc-500">INIT</span>
            </div>

            <div className="space-y-1 text-xs">
              {steps.slice(0, bootStep + 1).map((stepText, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 ${
                    idx === bootStep ? "text-emerald-400" : "text-zinc-500"
                  }`}
                >
                  <span className="text-[10px]">{idx === bootStep ? "►" : "✓"}</span>
                  <span>{stepText}</span>
                </div>
              ))}
            </div>

            <div className="h-0.5 w-full bg-zinc-900 rounded overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500"
                initial={{ width: "0%" }}
                animate={{ width: `${((bootStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
