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
    price: 1000,
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
    price: 300,
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
    price: 2200,
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
      className="w-full relative min-h-screen font-sans"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #060810 0%, #080c18 20%, #0a0e1a 40%, #070b14 60%, #080c18 80%, #050810 100%)"
          : "linear-gradient(180deg, #faf8ff 0%, #f3eeff 20%, #ffffff 40%, #f8f4ff 60%, #f3eeff 80%, #faf8ff 100%)",
        color: isDark ? "#f1f5f9" : "#1a0a2e",
        overflowX: "hidden",
      }}
    >
      <WebGLScene key={theme} state={stateRef} isDark={isDark} />
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

      <div className="relative pt-28 md:pt-32 pb-24 md:pb-48 px-4 z-10 max-w-7xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div
            className="inline-block px-4 py-1.5 rounded-full border text-sm font-medium tracking-wide mb-6 uppercase"
            style={{
              borderColor: isDark ? "rgba(56,189,248,0.3)" : "rgba(14,165,233,0.22)",
              background: isDark ? "rgba(56,189,248,0.10)" : "rgba(14,165,233,0.10)",
              color: isDark ? "rgba(125,211,252,0.95)" : "rgba(2,132,199,0.9)",
            }}
          >
            Admission & Ticketing
          </div>
          <h1
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent"
            style={{
              backgroundImage: isDark
                ? "linear-gradient(to bottom right, #fff, #e2e8f0, #64748b)"
                : "linear-gradient(135deg, #0c4a6e 0%, #0369a1 40%, #0284c7 100%)",
            }}
          >
            Choose Your Reality
          </h1>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto font-light"
            style={{ color: isDark ? "rgba(255,255,255,0.55)" : "rgba(60,40,100,0.65)" }}
          >
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
                className="relative h-full flex flex-col p-8 rounded-3xl backdrop-blur-xl transition-colors duration-500"
                style={{
                  background: isDark
                    ? "rgba(15,23,42,0.6)"
                    : "linear-gradient(160deg, rgba(255,255,255,0.96) 0%, rgba(248,246,255,0.88) 100%)",
                  border: isDark
                    ? "1px solid rgba(51,65,85,1)"
                    : "1px solid rgba(14,165,233,0.2)",
                  boxShadow: isDark ? undefined : "0 16px 50px rgba(14,165,233,0.08)",
                }}
              >
                <div className="mb-8">
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ color: isDark ? "#fff" : "#1a0a2e" }}
                  >
                    {ticket.title}
                  </h3>
                  <p
                    className="text-sm mb-6"
                    style={{
                      color: isDark ? "rgba(255,255,255,0.5)" : "rgba(60,40,100,0.55)",
                    }}
                  >
                    {ticket.age}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-sm font-semibold"
                      style={{
                        color: isDark ? "rgba(148,163,184,1)" : "rgba(60,40,100,0.6)",
                      }}
                    >
                      LKR
                    </span>
                    <span
                      className="text-5xl font-extrabold"
                      style={{
                        color:
                          ticket.id === "adult"
                            ? isDark ? "rgb(34,211,238)" : "rgb(8,145,178)"
                            : ticket.id === "child"
                              ? isDark ? "rgb(244,114,182)" : "rgb(190,24,93)"
                              : isDark ? "rgb(52,211,153)" : "rgb(5,150,105)",
                      }}
                    >
                      {ticket.price.toLocaleString()}
                    </span>
                  </div>
                  <p
                    className="mt-4 text-sm min-h-[40px]"
                    style={{
                      color: isDark ? "rgba(255,255,255,0.55)" : "rgba(60,40,100,0.65)",
                    }}
                  >
                    {ticket.description}
                  </p>
                </div>

                <div className="flex-grow">
                  <ul className="space-y-3 mb-8">
                    {ticket.features.map((feature, j) => (
                      <li
                        key={j}
                        className="flex items-start"
                        style={{
                          color: isDark ? "rgba(203,213,225,1)" : "rgba(60,40,100,0.75)",
                        }}
                      >
                        <svg
                          className="w-5 h-5 mr-3 mt-0.5 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke={
                            ticket.id === "adult"
                              ? isDark ? "rgb(34,211,238)" : "rgb(8,145,178)"
                              : ticket.id === "child"
                                ? isDark ? "rgb(244,114,182)" : "rgb(190,24,93)"
                                : isDark ? "rgb(52,211,153)" : "rgb(5,150,105)"
                          }
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

                <div
                  className="pt-6 border-t flex items-center justify-between"
                  style={{
                    borderColor: isDark ? "rgba(51,65,85,1)" : "rgba(148,163,184,0.35)",
                  }}
                >
                  <span
                    className="font-medium"
                    style={{
                      color: isDark ? "rgba(203,213,225,1)" : "rgba(60,40,100,0.8)",
                    }}
                  >
                    Quantity
                  </span>
                  <div
                    className="flex items-center gap-4 rounded-full p-1 shadow-inner"
                    style={{
                      background: isDark ? "rgba(2,6,23,0.5)" : "rgba(248,250,252,0.9)",
                      border: isDark ? "1px solid rgba(51,65,85,0.5)" : "1px solid rgba(148,163,184,0.4)",
                    }}
                  >
                    <button
                      onClick={() => updateQty(ticket.id, -1)}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: isDark ? "rgb(30,41,59)" : "rgba(255,255,255,0.9)",
                        color: isDark ? "rgba(203,213,225,1)" : "rgba(60,40,100,0.8)",
                      }}
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
                    <span
                      className="w-6 text-center text-lg font-bold"
                      style={{ color: isDark ? "#fff" : "#1a0a2e" }}
                    >
                      {quantities[ticket.id]}
                    </span>
                    <button
                      onClick={() => updateQty(ticket.id, 1)}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                      style={{
                        background: isDark ? "rgb(30,41,59)" : "rgba(255,255,255,0.9)",
                        color:
                          ticket.id === "adult"
                            ? isDark ? "rgb(34,211,238)" : "rgb(8,145,178)"
                            : ticket.id === "child"
                              ? isDark ? "rgb(244,114,182)" : "rgb(190,24,93)"
                              : isDark ? "rgb(52,211,153)" : "rgb(5,150,105)",
                      }}
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
              <div
                className="max-w-2xl mx-auto backdrop-blur-2xl rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between pointer-events-auto"
                style={{
                  background: isDark ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.95)",
                  border: isDark ? "1px solid rgba(71,85,105,0.5)" : "1px solid rgba(14,165,233,0.25)",
                  boxShadow: isDark ? undefined : "0 25px 50px -12px rgba(14,165,233,0.12)",
                }}
              >
                <div className="flex items-center gap-6 mb-4 md:mb-0">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: isDark ? "rgba(34,211,238,0.2)" : "rgba(14,165,233,0.12)",
                      border: isDark ? "1px solid rgba(34,211,238,0.3)" : "1px solid rgba(14,165,233,0.3)",
                    }}
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke={isDark ? "rgb(34,211,238)" : "rgb(8,145,178)"}
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
                    <p
                      className="text-sm font-medium"
                      style={{
                        color: isDark ? "rgba(203,213,225,0.9)" : "rgba(60,40,100,0.7)",
                      }}
                    >
                      {totalItems} Ticket{totalItems !== 1 ? "s" : ""} Selected
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-lg font-semibold"
                        style={{
                          color: isDark ? "rgba(148,163,184,1)" : "rgba(60,40,100,0.6)",
                        }}
                      >
                        LKR
                      </span>
                      <span
                        className="text-3xl font-bold tracking-tight"
                        style={{ color: isDark ? "#fff" : "#1a0a2e" }}
                      >
                        {totalCost.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="w-full md:w-auto px-8 py-4 rounded-xl font-bold tracking-wide transition-colors"
                  style={{
                    background: isDark ? "#fff" : "linear-gradient(135deg, #0c4a6e, #0284c7)",
                    color: isDark ? "#0f172a" : "#fff",
                  }}
                >
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
