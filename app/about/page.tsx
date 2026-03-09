"use client";

import { FloatingNav } from "@/components/HUDOverlay";
import { WebGLScene } from "@/components/WebGLScene";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

type Feature = {
  title: string;
  description: string;
  icon: string;
  accent: "cyan" | "violet" | "pink";
};

const FEATURES: Feature[] = [
  {
    icon: "🎭",
    title: "Staged storytelling",
    description: "Theatre-like pacing so users feel guided—never lost.",
    accent: "violet",
  },
  {
    icon: "🧭",
    title: "Clarity in 30 seconds",
    description: "First moments show what to do, where to look, why it matters.",
    accent: "cyan",
  },
  {
    icon: "🫧",
    title: "Comfort-first interaction",
    description: "Premium feel, reduced discomfort across audiences.",
    accent: "pink",
  },
];

function accentStyles(isDark: boolean, accent: Feature["accent"]) {
  if (accent === "cyan") {
    return {
      border: isDark ? "rgba(56,189,248,0.22)" : "rgba(14,165,233,0.22)",
      glow: isDark ? "rgba(56,189,248,0.18)" : "rgba(14,165,233,0.14)",
      gradient: "linear-gradient(135deg, #38bdf8, #818cf8)",
      pillBg: isDark ? "rgba(56,189,248,0.12)" : "rgba(14,165,233,0.10)",
      pillText: isDark ? "rgba(125,211,252,0.9)" : "rgba(2,132,199,0.9)",
    };
  }
  if (accent === "pink") {
    return {
      border: isDark ? "rgba(236,72,153,0.24)" : "rgba(219,39,119,0.22)",
      glow: isDark ? "rgba(236,72,153,0.16)" : "rgba(219,39,119,0.12)",
      gradient: "linear-gradient(135deg, #ec4899, #a855f7)",
      pillBg: isDark ? "rgba(236,72,153,0.12)" : "rgba(219,39,119,0.10)",
      pillText: isDark ? "rgba(251,113,133,0.9)" : "rgba(190,24,93,0.9)",
    };
  }
  return {
    border: isDark ? "rgba(168,85,247,0.24)" : "rgba(124,58,237,0.22)",
    glow: isDark ? "rgba(168,85,247,0.18)" : "rgba(124,58,237,0.12)",
    gradient: "linear-gradient(135deg, #c084fc, #818cf8, #38bdf8)",
    pillBg: isDark ? "rgba(168,85,247,0.12)" : "rgba(124,58,237,0.10)",
    pillText: isDark ? "rgba(216,180,254,0.9)" : "rgba(109,40,217,0.9)",
  };
}

function Card({
  isDark,
  accent,
  badge,
  title,
  description,
}: {
  isDark: boolean;
  accent: Feature["accent"];
  badge: string;
  title: string;
  description: string;
}) {
  const s = accentStyles(isDark, accent);
  return (
    <div
      className="rounded-3xl p-6 backdrop-blur-xl"
      style={{
        background: isDark
          ? "linear-gradient(160deg, rgba(15,12,28,0.74) 0%, rgba(10,8,20,0.58) 100%)"
          : "linear-gradient(160deg, rgba(255,255,255,0.96) 0%, rgba(248,246,255,0.88) 100%)",
        border: `1px solid ${s.border}`,
        boxShadow: isDark ? `0 18px 60px rgba(0,0,0,0.35), 0 0 0 1px ${s.glow}` : `0 16px 50px ${s.glow}`,
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div
          className="inline-flex items-center rounded-full px-3 py-1"
          style={{
            background: s.pillBg,
            color: s.pillText,
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          {badge}
        </div>
        <div
          className="h-9 w-9 rounded-2xl"
          style={{
            backgroundImage: s.gradient,
            boxShadow: `0 10px 30px ${s.glow}`,
            opacity: 0.95,
          }}
        />
      </div>
      <div
        className="mt-4"
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "16px",
          fontWeight: 800,
          letterSpacing: "-0.01em",
          color: isDark ? "#fff" : "#1a0a2e",
        }}
      >
        {title}
      </div>
      <p
        className="mt-2"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.9rem",
          lineHeight: 1.6,
          color: isDark ? "rgba(255,255,255,0.52)" : "rgba(60,40,100,0.65)",
        }}
      >
        {description}
      </p>
    </div>
  );
}

export default function AboutPage() {
  const router = useRouter();
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

  const stats = useMemo(
    () => [
      { value: "Guided", label: "Story-led worlds" },
      { value: "Comfort", label: "Designed for audiences" },
      { value: "Premium", label: "Polish & performance" },
      { value: "Repeatable", label: "Delivery system" },
    ],
    [],
  );

  return (
    <div
      className="w-full relative min-h-screen"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #060810 0%, #080c18 20%, #0a0e1a 40%, #070b14 60%, #080c18 80%, #050810 100%)"
          : "linear-gradient(180deg, #faf8ff 0%, #f3eeff 20%, #ffffff 40%, #f8f4ff 60%, #f3eeff 80%, #faf8ff 100%)",
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
              background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 50%, rgba(3,4,8,0.5) 100%)",
            }}
          />
        </>
      )}

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-20">
        {/* Hero */}
        <section className="text-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <div
              className="inline-block px-4 py-1.5 rounded-full border text-sm font-medium tracking-wide mb-5 uppercase"
              style={{
                borderColor: isDark ? "rgba(56,189,248,0.28)" : "rgba(124,58,237,0.22)",
                background: isDark ? "rgba(56,189,248,0.10)" : "rgba(124,58,237,0.08)",
                color: isDark ? "rgba(125,211,252,0.95)" : "rgba(109,40,217,0.9)",
              }}
            >
              About NexoraXR
            </div>
            <h1
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.6rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                backgroundImage: isDark
                  ? "linear-gradient(135deg, #c084fc 0%, #818cf8 40%, #38bdf8 100%)"
                  : "linear-gradient(135deg, #7c3aed 0%, #6366f1 40%, #0ea5e9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "14px",
              }}
            >
              XR experiences that feel
              <br />
              directed—not confusing
            </h1>
            <p
              className="mx-auto"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1rem",
                lineHeight: 1.7,
                color: isDark ? "rgba(255,255,255,0.5)" : "rgba(60,40,100,0.65)",
                maxWidth: "min(520px, 92vw)",
              }}
            >
              Premium, story-led XR for culture, brands, learning, and events—built for clarity, comfort, and performance.
            </p>
            <div className="flex gap-3 mt-8 flex-wrap justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-3 rounded-full text-white cursor-pointer"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  backgroundImage: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
                  boxShadow: "0 6px 30px rgba(168,85,247,0.35)",
                  border: "none",
                }}
                onClick={() => router.push("/story/heaven")}
              >
                Explore Worlds
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-3 rounded-full cursor-pointer"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  color: isDark ? "#c4b5fd" : "#6d28d9",
                  background: isDark ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.85)",
                  border: isDark ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(109,40,217,0.2)",
                }}
                onClick={() => router.push("/pricing")}
              >
                View Pricing
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="mx-auto max-w-4xl mt-10"
        >
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden"
            style={{
              background: isDark ? "rgba(255,255,255,0.04)" : "rgba(130,60,220,0.08)",
            }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center py-5 px-3 text-center"
                style={{
                  background: isDark
                    ? "linear-gradient(160deg, rgba(15,12,28,0.78), rgba(10,8,20,0.56))"
                    : "linear-gradient(160deg, rgba(255,255,255,0.92), rgba(248,246,255,0.84))",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "1rem",
                    fontWeight: 800,
                    backgroundImage: isDark ? "linear-gradient(135deg, #a78bfa, #818cf8)" : "linear-gradient(135deg, #7c3aed, #0ea5e9)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily: "'Exo 2', sans-serif",
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    color: isDark ? "rgba(255,255,255,0.35)" : "rgba(60,40,100,0.65)",
                    marginTop: "4px",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* What we do */}
        <section className="mt-14">
          <div className="text-center mb-6">
            <div
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: isDark ? "rgba(168,85,247,0.7)" : "rgba(109,40,217,0.65)",
              }}
            >
              What we optimize for
            </div>
            <h2
              className="mt-2"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(1.25rem, 2.5vw, 1.8rem)",
                fontWeight: 800,
                color: isDark ? "#fff" : "#1a0a2e",
              }}
            >
              Premium XR, built like a show
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <Card
                key={f.title}
                isDark={isDark}
                accent={f.accent}
                badge={`${f.icon}  ${f.title}`}
                title={f.title}
                description={f.description}
              />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-14">
          <div className="relative rounded-2xl overflow-hidden">
            <div
              className="relative flex flex-col sm:flex-row items-center justify-between gap-6 px-5 sm:px-8 py-8 sm:py-10"
              style={{
                backgroundImage: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)",
              }}
            >
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
              <div className="relative text-center sm:text-left z-10">
                <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "10px", letterSpacing: "0.3em", color: "rgba(255,255,255,0.85)", marginBottom: "6px" }}>
                  READY TO BUILD?
                </p>
                <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.2rem, 2.5vw, 1.9rem)", fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
                  Let's create an XR experience people will talk about
                </h2>
              </div>
              <div className="relative flex gap-3 shrink-0 z-10">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  className="px-7 py-3 rounded-full cursor-pointer"
                  style={{
                    fontFamily: "'Exo 2', sans-serif",
                    fontSize: "13px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    color: "#7c3aed",
                    background: "#fff",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                  }}
                  onClick={() => router.push("/pricing")}
                >
                  Get Pricing
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.25)" }}
                  whileTap={{ scale: 0.97 }}
                  className="px-7 py-3 rounded-full cursor-pointer transition-colors"
                  style={{
                    fontFamily: "'Exo 2', sans-serif",
                    fontSize: "13px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    color: "#fff",
                    background: "rgba(255,255,255,0.15)",
                    border: "1.5px solid rgba(255,255,255,0.4)",
                  }}
                  onClick={() => router.push("/book-now")}
                >
                  Book Now
                </motion.button>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-12 flex items-center justify-center gap-4 flex-wrap">
          <div style={{ height: "1px", width: "40px", background: isDark ? "linear-gradient(to right, transparent, rgba(255,255,255,0.08))" : "linear-gradient(to right, transparent, rgba(60,40,100,0.14))" }} />
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "11px", color: isDark ? "rgba(255,255,255,0.25)" : "rgba(60,40,100,0.6)", letterSpacing: "0.08em" }}>
            NexoraXR • About • 2026
          </div>
          <div style={{ height: "1px", width: "40px", background: isDark ? "linear-gradient(to left, transparent, rgba(255,255,255,0.08))" : "linear-gradient(to left, transparent, rgba(60,40,100,0.14))" }} />
        </div>
      </main>
    </div>
  );
}
