"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Navbar } from "@/components/Navbar";
import { FloatingNav } from "@/components/HUDOverlay";
import { WebGLScene } from "@/components/WebGLScene";

export default function BookNowPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const stateRef = useRef({ scrollY: 0, mouseX: 0, mouseY: 0 });

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

  const bg = isDark
    ? "radial-gradient(circle at top, rgba(120,180,255,0.12), transparent 55%), radial-gradient(circle at bottom, rgba(236,72,153,0.14), transparent 60%), #050712"
    : "radial-gradient(circle at top, rgba(120,180,255,0.14), transparent 55%), radial-gradient(circle at bottom, rgba(236,72,153,0.12), transparent 60%), #f7f3ff";

  const cardBg = isDark
    ? "linear-gradient(145deg, rgba(15,18,35,0.96), rgba(7,10,22,0.96))"
    : "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(246,240,255,0.98))";

  const borderColor = isDark
    ? "1px solid rgba(120,180,255,0.22)"
    : "1px solid rgba(130,90,220,0.2)";

  const inputBg = isDark ? "rgba(10,12,24,0.95)" : "rgba(255,255,255,0.9)";
  const inputBorder = isDark
    ? "1px solid rgba(148,163,184,0.35)"
    : "1px solid rgba(148,118,224,0.45)";

  const labelColor = isDark
    ? "rgba(209,213,219,0.75)"
    : "rgba(76,29,149,0.85)";

  const textColor = isDark ? "rgba(255,255,255,0.7)" : "#433264";

  const accent = isDark ? "#a07de8" : "#6b3fbf";

  return (
    <div
      className="w-full relative min-h-screen"
      style={{
        background: bg,
        overflowX: "hidden",
      }}
    >
      <WebGLScene key={theme} state={stateRef} isDark={isDark} />
      <Navbar />
      <main
        className="w-full flex items-center justify-center px-4 py-24 md:py-32"
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(120,180,255,0.12) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(120,180,255,0.12) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            opacity: isDark ? 0.35 : 0.6,
            mixBlendMode: isDark ? "screen" : "normal",
          }}
        />

        {/* glow orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute rounded-full blur-3xl"
            style={{
              width: 260,
              height: 260,
              top: "-40px",
              left: "-40px",
              background:
                "radial-gradient(circle, rgba(96,165,250,0.35), transparent 60%)",
            }}
            animate={{ opacity: [0.5, 0.9, 0.5], y: [0, 10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute rounded-full blur-3xl"
            style={{
              width: 260,
              height: 260,
              bottom: "-60px",
              right: "-40px",
              background:
                "radial-gradient(circle, rgba(236,72,153,0.35), transparent 60%)",
            }}
            animate={{ opacity: [0.4, 0.8, 0.4], y: [0, -10, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10 w-full max-w-5xl xl:max-w-6xl grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start"
        >
        {/* Left copy */}
        <div className="space-y-6 md:space-y-8">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] tracking-[0.2em] uppercase"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              color: isDark
                ? "rgba(192, 210, 255, 0.75)"
                : "rgba(91, 61, 179, 0.9)",
              backgroundColor: isDark
                ? "rgba(15,23,42,0.9)"
                : "rgba(255,255,255,0.9)",
              border: isDark
                ? "1px solid rgba(148,163,184,0.5)"
                : "1px solid rgba(148,118,224,0.7)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
            Live XR / VR Sessions
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.05]"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              backgroundImage: isDark
                ? "linear-gradient(135deg,#6b8ef0 0%,#a07de8 30%,#e06aac 65%,#5ec4e0 100%)"
                : "linear-gradient(135deg,#4a6fd8 0%,#7b52c4 30%,#c44a8f 65%,#e06aac 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Book your next immersive world.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="text-sm md:text-base max-w-xl"
            style={{
              fontFamily: "'Exo 2', sans-serif",
              color: textColor,
            }}
          >
            Tell us about your event, pick your world, and we&apos;ll craft a
            bespoke XR storyline, hardware setup, and on-site support that feels
            straight out of the Nexora portal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="grid gap-4 text-xs md:text-sm grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          >
            <div
              className="rounded-2xl p-3.5 md:p-4"
              style={{
                background: isDark
                  ? "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(15,23,42,0.75))"
                  : "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(244,240,255,0.9))",
                border: isDark
                  ? "1px solid rgba(96,165,250,0.35)"
                  : "1px solid rgba(129,140,248,0.4)",
              }}
            >
              <p
                className="tracking-[0.18em] uppercase mb-1 text-[9px]"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  color: isDark
                    ? "rgba(191,219,254,0.8)"
                    : "rgba(79,70,229,0.9)",
                }}
              >
                Experiences
              </p>
              <p
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  color: textColor,
                }}
              >
                Swarga, Naraka & custom XR stories for launches, weddings,
                festivals and more.
              </p>
            </div>
            <div
              className="rounded-2xl p-3.5 md:p-4"
              style={{
                background: isDark
                  ? "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(24,21,40,0.78))"
                  : "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(244,240,255,0.9))",
                border: isDark
                  ? "1px solid rgba(248,113,113,0.28)"
                  : "1px solid rgba(244,114,182,0.45)",
              }}
            >
              <p
                className="tracking-[0.18em] uppercase mb-1 text-[9px]"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  color: isDark
                    ? "rgba(254,202,202,0.85)"
                    : "rgba(219,39,119,0.95)",
                }}
              >
                Scale
              </p>
              <p
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  color: textColor,
                }}
              >
                From intimate 20-person showcases to 500+ guest arenas with
                synced XR.
              </p>
            </div>
            <div
              className="rounded-2xl p-3.5 md:p-4"
              style={{
                background: isDark
                  ? "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(15,23,42,0.78))"
                  : "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(244,240,255,0.9))",
                border: isDark
                  ? "1px solid rgba(52,211,153,0.3)"
                  : "1px solid rgba(52,211,153,0.45)",
              }}
            >
              <p
                className="tracking-[0.18em] uppercase mb-1 text-[9px]"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  color: isDark
                    ? "rgba(167,243,208,0.85)"
                    : "rgba(22,163,74,0.95)",
                }}
              >
                Support
              </p>
              <p
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  color: textColor,
                }}
              >
                On-site XR operators, safety onboarding, hardware, calibration
                and live monitoring.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="flex flex-wrap items-center gap-3 text-[11px] md:text-xs"
            style={{ fontFamily: "'Exo 2', sans-serif", color: textColor }}
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              <span>Typical response time &lt; 24h</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
              <span>Hardware, setup & crew included</span>
            </div>
          </motion.div>
        </div>

        {/* Right form card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.9 }}
          className="relative rounded-3xl p-5 md:p-7 shadow-xl"
          style={{
            background: cardBg,
            border: borderColor,
            boxShadow: isDark
              ? "0 30px 80px rgba(15,23,42,0.9), 0 0 40px rgba(120,180,255,0.25)"
              : "0 26px 70px rgba(129,140,248,0.26), 0 0 40px rgba(244,114,182,0.18)",
          }}
        >
          {/* corner accents */}
          <div className="pointer-events-none">
            <div className="absolute -top-px left-7 w-8 h-[1px] bg-gradient-to-r from-transparent via-indigo-400/80 to-transparent" />
            <div className="absolute -bottom-px right-7 w-8 h-[1px] bg-gradient-to-r from-transparent via-pink-400/80 to-transparent" />
          </div>

          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <p
                className="tracking-[0.26em] uppercase text-[10px] mb-1"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  color: isDark
                    ? "rgba(156,163,175,0.9)"
                    : "rgba(88,28,135,0.9)",
                }}
              >
                Booking Request
              </p>
              <p
                className="text-sm md:text-base"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  color: textColor,
                }}
              >
                Share a few details and we&apos;ll come back with a tailored XR
                proposal.
              </p>
            </div>
            <div className="hidden md:flex flex-col items-end text-[11px] gap-1">
              <div
                className="px-2.5 py-1 rounded-full"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  backgroundColor: isDark
                    ? "rgba(15,23,42,0.95)"
                    : "rgba(255,255,255,0.95)",
                  border: isDark
                    ? "1px solid rgba(148,163,184,0.5)"
                    : "1px solid rgba(148,118,224,0.7)",
                  color: labelColor,
                }}
              >
                Worlds: Swarga / Naraka / Custom
              </div>
              <span
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  color: textColor,
                }}
              >
                Avg. event duration: 2–6 hours
              </span>
            </div>
          </div>

          <form className="space-y-4 md:space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name" labelColor={labelColor}>
                <input
                  type="text"
                  placeholder="Nexora event coordinator"
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                  style={{
                    fontFamily: "'Exo 2', sans-serif",
                    backgroundColor: inputBg,
                    border: inputBorder,
                    color: isDark ? "#e5e7eb" : "#1f2937",
                  }}
                />
              </Field>
              <Field label="Email" labelColor={labelColor}>
                <input
                  type="email"
                  placeholder="you@studio.com"
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                  style={{
                    fontFamily: "'Exo 2', sans-serif",
                    backgroundColor: inputBg,
                    border: inputBorder,
                    color: isDark ? "#e5e7eb" : "#1f2937",
                  }}
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Event date (approx.)" labelColor={labelColor}>
                <input
                  type="date"
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                  style={{
                    fontFamily: "'Exo 2', sans-serif",
                    backgroundColor: inputBg,
                    border: inputBorder,
                    color: isDark ? "#e5e7eb" : "#1f2937",
                  }}
                />
              </Field>
              <Field label="Guest count (estimate)" labelColor={labelColor}>
                <input
                  type="text"
                  placeholder="e.g. 80–120 guests"
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                  style={{
                    fontFamily: "'Exo 2', sans-serif",
                    backgroundColor: inputBg,
                    border: inputBorder,
                    color: isDark ? "#e5e7eb" : "#1f2937",
                  }}
                />
              </Field>
            </div>

            <Field label="Preferred world" labelColor={labelColor}>
              <div className="grid gap-2 md:grid-cols-3 text-xs">
                <Chip accent={accent} isDark={isDark}>
                  Swarga (Heaven)
                </Chip>
                <Chip accent={accent} isDark={isDark}>
                  Naraka (Hell)
                </Chip>
                <Chip accent={accent} isDark={isDark}>
                  Custom storyline
                </Chip>
              </div>
            </Field>

            <Field label="Tell us about the experience" labelColor={labelColor}>
              <textarea
                rows={4}
                placeholder="Event type, venue, desired mood, any specific scenes you imagine..."
                className="w-full rounded-xl px-3 py-2.5 text-sm resize-none outline-none"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  backgroundColor: inputBg,
                  border: inputBorder,
                  color: isDark ? "#e5e7eb" : "#1f2937",
                }}
              />
            </Field>

            <div className="flex flex-col gap-3 pt-1">
              <motion.button
                type="button"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className="w-full rounded-full py-3 text-sm font-semibold tracking-[0.16em] uppercase"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  backgroundImage: isDark
                    ? "linear-gradient(135deg, rgba(140,100,220,0.9), rgba(230,80,160,0.85))"
                    : "linear-gradient(135deg, rgba(122,92,230,0.98), rgba(236,72,153,0.95))",
                  color: "#ffffff",
                  boxShadow: isDark
                    ? "0 18px 45px rgba(168,85,247,0.6)"
                    : "0 18px 45px rgba(168,85,247,0.5)",
                  letterSpacing: "0.16em",
                }}
              >
                Submit booking request
              </motion.button>

              <p
                className="text-[11px] leading-relaxed"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  color: textColor,
                }}
              >
                We&apos;ll review your request and reply with availability,
                pricing, and a proposed XR flow. This doesn&apos;t lock in any
                payment yet.
              </p>
            </div>
          </form>
        </motion.div>
      </motion.section>
      </main>
    </div>
  );
}

function Field({
  label,
  labelColor,
  children,
}: {
  label: string;
  labelColor: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5 text-xs md:text-sm">
      <span
        className="tracking-[0.16em] uppercase text-[10px]"
        style={{
          fontFamily: "'Orbitron', sans-serif",
          color: labelColor,
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

function Chip({
  children,
  accent,
  isDark,
}: {
  children: React.ReactNode;
  accent: string;
  isDark: boolean;
}) {
  return (
    <button
      type="button"
      className="w-full px-3 py-2 rounded-full text-left text-[11px]"
      style={{
        fontFamily: "'Exo 2', sans-serif",
        backgroundColor: isDark
          ? "rgba(15,23,42,0.9)"
          : "rgba(255,255,255,0.98)",
        border: `1px solid ${accent}40`,
        color: isDark ? "rgba(209,213,219,0.9)" : "#433264",
        boxShadow: isDark
          ? "0 0 0 1px rgba(148,163,184,0.2)"
          : "0 0 0 1px rgba(148,118,224,0.3)",
      }}
    >
      {children}
    </button>
  );
}

