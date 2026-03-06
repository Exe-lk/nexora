"use client";

import { FloatingNav } from "@/components/HUDOverlay";
import { WebGLScene } from "@/components/WebGLScene";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const tickets = [
  {
    id: "adult",
    title: "Adult Pass",
    age: "Ages 16+",
    price: 2500,
    description: "The complete NexoraXR immersive experience.",
    features: ["Full immersive experience", "Access to all VR zones", "Free locker access"],
    color: "from-cyan-500/20 to-blue-600/20",
    border: "group-hover:border-cyan-400/50",
    accent: "text-cyan-400",
  },
  {
    id: "child",
    title: "Children Pass",
    age: "Ages 4-15",
    price: 1500,
    description: "Curated experiences tailored for younger users.",
    features: ["Kid-friendly VR zones", "Supervised activities", "Complimentary drink"],
    color: "from-pink-500/20 to-purple-600/20",
    border: "group-hover:border-pink-400/50",
    accent: "text-pink-400",
  },
  {
    id: "family",
    title: "Family Bundle",
    age: "2 Adults + 2 Kids",
    price: 6500,
    description: "The best value to bring the whole family together.",
    features: ["All individual perks", "Discounted total rate", "Priority line access"],
    color: "from-emerald-500/20 to-teal-600/20",
    border: "group-hover:border-emerald-400/50",
    accent: "text-emerald-400",
  },
];

export default function PricingPage() {
  const { theme } = useTheme();
  const stateRef = useRef({ scrollY: 0, mouseX: 0, mouseY: 0 });
  const isDark = theme === "dark";

  const [quantities, setQuantities] = useState<Record<string, number>>({
    adult: 0,
    child: 0,
    family: 0,
  });

  useEffect(() => {
    const onScroll = () => {
      stateRef.current.scrollY = window.scrollY;
    };
    const onMouse = (e: MouseEvent) => {
      stateRef.current.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      stateRef.current.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  const totalCost = Object.entries(quantities).reduce((acc, [id, qty]) => {
    const ticket = tickets.find((t) => t.id === id);
    return acc + (ticket ? ticket.price * qty : 0);
  }, 0);

  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);

  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta),
    }));
  };

  return (
    <div
      className="w-full relative min-h-screen text-slate-100 font-sans"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #060810 0%, #080c18 20%, #0a0e1a 40%, #070b14 60%, #080c18 80%, #050810 100%)"
          : "transparent",
        overflowX: "hidden",
      }}
    >
      <WebGLScene key={theme} state={stateRef} />
      <FloatingNav />

      {isDark && (
        <>
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 0,
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
              mixBlendMode: "multiply",
            }}
          />
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 0,
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 50%, rgba(3,4,8,0.5) 100%)",
            }}
          />
        </>
      )}

      <div className="relative pt-32 pb-48 px-4 z-10 max-w-7xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-medium tracking-wide mb-6 uppercase">
            Admission & Ticketing
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-slate-500">
            Choose Your Reality
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Step into the future with our flexible pricing tiers. Whether solo or
            with family, unlocking new dimensions has never been easier.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl relative z-20">
          {tickets.map((ticket, i) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * i, ease: "easeOut" }}
              className="group relative"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${ticket.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />
              <div
                className={`relative h-full flex flex-col p-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 transition-colors duration-500 ${ticket.border}`}
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{ticket.title}</h3>
                  <p className="text-sm text-slate-400 mb-6">{ticket.age}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-slate-500">
                      LKR
                    </span>
                    <span className={`text-5xl font-extrabold ${ticket.accent}`}>
                      {ticket.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-400 mt-4 text-sm min-h-[40px]">
                    {ticket.description}
                  </p>
                </div>

                <div className="flex-grow">
                  <ul className="space-y-3 mb-8">
                    {ticket.features.map((feature, j) => (
                      <li key={j} className="flex items-start text-slate-300">
                        <svg
                          className={`w-5 h-5 mr-3 mt-0.5 ${ticket.accent}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Quantity</span>
                  <div className="flex items-center gap-4 bg-slate-950/50 rounded-full p-1 border border-slate-800/50 shadow-inner">
                    <button
                      onClick={() => updateQty(ticket.id, -1)}
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantities[ticket.id] === 0}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <span className="w-6 text-center text-lg font-bold">
                      {quantities[ticket.id]}
                    </span>
                    <button
                      onClick={() => updateQty(ticket.id, 1)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors ${ticket.accent}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating Cart Panel */}
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed bottom-8 left-0 right-0 z-50 px-4 pointer-events-none"
            >
              <div className="max-w-2xl mx-auto bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-6 mb-4 md:mb-0">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                    <svg
                      className="w-8 h-8 text-cyan-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 font-medium">
                      {totalItems} Ticket{totalItems !== 1 ? "s" : ""} Selected
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg text-slate-500 font-semibold">
                        LKR
                      </span>
                      <span className="text-3xl font-bold text-white tracking-tight">
                        {totalCost.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="w-full md:w-auto px-8 py-4 bg-white text-slate-900 rounded-xl font-bold tracking-wide hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  Proceed to Checkout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
