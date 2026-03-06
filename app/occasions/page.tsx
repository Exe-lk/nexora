"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FloatingNav } from "@/components/HUDOverlay";
import { useTheme } from "@/contexts/ThemeContext";

// ─── Occasion data ────────────────────────────────────────────────────────────
const OCCASIONS = [
  {
    id: "birthday",
    emoji: "🎂",
    tag: "CELEBRATIONS",
    title: "Birthday Parties",
    subtitle: "Unforgettable milestones",
    description:
      "Step into your own virtual world for the most memorable birthday ever. From floating sky castles to underwater kingdoms — we build the perfect digital realm around you.",
    features: ["Custom VR world themed to your personality", "Up to 30 simultaneous headsets", "Live DJ & spatial audio", "Photo-realistic avatar creation"],
    accent: "#f97316",
    accentSoft: "rgba(249,115,22,",
    gradient: "linear-gradient(135deg, #f97316, #ec4899)",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
  },
  {
    id: "corporate",
    emoji: "🏢",
    tag: "PROFESSIONAL",
    title: "Corporate Events",
    subtitle: "Elevate your brand presence",
    description:
      "Product launches, team-building retreats, and conferences that leave a lasting impression. Immersive XR experiences that position your company at the cutting edge.",
    features: ["Branded virtual environments", "Interactive product demos in XR", "Global team collaboration spaces", "Analytics & engagement reports"],
    accent: "#6366f1",
    accentSoft: "rgba(99,102,241,",
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  },
  {
    id: "family",
    emoji: "👨‍👩‍👧‍👦",
    tag: "FAMILY FUN",
    title: "Family Fun Days",
    subtitle: "Adventures for all ages",
    description:
      "Bring the whole family together in magical XR worlds. Safe, age-appropriate experiences designed to spark wonder, creativity and shared memories that last a lifetime.",
    features: ["All-ages content library", "Multiplayer family adventures", "Educational world tours", "Parental control & safety filters"],
    accent: "#10b981",
    accentSoft: "rgba(16,185,129,",
    gradient: "linear-gradient(135deg, #10b981, #3b82f6)",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80",
  },
  {
    id: "wedding",
    emoji: "💍",
    tag: "SPECIAL OCCASIONS",
    title: "Weddings & Engagements",
    subtitle: "Love stories in new dimensions",
    description:
      "Enchant your guests with breathtaking virtual backdrops, immersive reception lounges and a one-of-a-kind XR experience woven into your most cherished day.",
    features: ["Custom ceremony virtual venue", "Guest XR photo booths", "360° wedding highlights capture", "Virtual guest attendance for remote family"],
    accent: "#e879f9",
    accentSoft: "rgba(232,121,249,",
    gradient: "linear-gradient(135deg, #e879f9, #f43f5e)",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  },
  {
    id: "festival",
    emoji: "🎪",
    tag: "ENTERTAINMENT",
    title: "Festivals & Concerts",
    subtitle: "Crowd-scale immersion",
    description:
      "Transform your festival or live event into a hybrid XR spectacle. Stage visuals, crowd-reactive environments and AR layers that blur the line between physical and digital.",
    features: ["Stage AR mapping & projection", "Crowd-reactive XR effects", "Artist avatar experiences", "Live-stream XR overlay broadcasts"],
    accent: "#f59e0b",
    accentSoft: "rgba(245,158,11,",
    gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
  },
  {
    id: "education",
    emoji: "🎓",
    tag: "LEARNING",
    title: "Educational Programs",
    subtitle: "Learning through immersion",
    description:
      "From school excursions to museum activations, XR education unlocks understanding that textbooks never could. Walk on Mars, dive into ancient history, or explore the human body.",
    features: ["Curriculum-aligned XR journeys", "Museum & heritage partnerships", "STEM interactive simulations", "Classroom headset rental packages"],
    accent: "#06b6d4",
    accentSoft: "rgba(6,182,212,",
    gradient: "linear-gradient(135deg, #06b6d4, #6366f1)",
  },
];

// ─── Card component ──────────────────────────────────────────────────────────
function OccasionCard({
  occasion,
  index,
  isDark,
}: {
  occasion: (typeof OCCASIONS)[0];
  index: number;
  isDark: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: (index % 3) * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative rounded-3xl overflow-hidden cursor-pointer"
      style={{
        background: isDark
          ? "linear-gradient(160deg, rgba(15,12,28,0.8) 0%, rgba(10,8,20,0.6) 100%)"
          : "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(248,246,255,0.9) 100%)",
        border: isDark
          ? `1px solid ${occasion.accentSoft}0.12)`
          : `1px solid ${occasion.accentSoft}0.2)`,
        backdropFilter: "blur(20px)",
        boxShadow: isDark
          ? `0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px ${occasion.accentSoft}0.05)`
          : `0 8px 40px ${occasion.accentSoft}0.08), 0 0 0 1px ${occasion.accentSoft}0.08)`,
      }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
    >
      {/* Hover glow top line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ backgroundImage: occasion.gradient }}
      />

      <div className="p-8">
        {/* Tag + emoji */}
        <div className="flex items-center justify-between mb-5">
          <span
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.25em",
              color: isDark ? `${occasion.accentSoft}0.6)` : `${occasion.accentSoft}0.7)`,
            }}
          >
            {occasion.tag}
          </span>
          <span className="text-3xl">{occasion.emoji}</span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: isDark ? "#fff" : "#1a0a2e",
            marginBottom: "4px",
          }}
        >
          {occasion.title}
        </h2>
        <p
          style={{
            fontFamily: "'Exo 2', sans-serif",
            fontSize: "12px",
            letterSpacing: "0.05em",
            color: isDark ? `${occasion.accentSoft}0.7)` : `${occasion.accentSoft}0.8)`,
            marginBottom: "16px",
          }}
        >
          {occasion.subtitle}
        </p>

        {/* Description */}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.9rem",
            lineHeight: 1.7,
            color: isDark ? "rgba(255,255,255,0.5)" : "rgba(60,40,100,0.65)",
            marginBottom: "24px",
          }}
        >
          {occasion.description}
        </p>

        {/* Divider */}
        <div
          className="mb-5"
          style={{
            height: "1px",
            backgroundImage: `linear-gradient(to right, ${occasion.accentSoft}0.3), transparent)`,
          }}
        />

        {/* Features */}
        <ul className="flex flex-col gap-2.5">
          {occasion.features.map((f, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-1 shrink-0 rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  backgroundImage: occasion.gradient,
                  boxShadow: `0 0 8px ${occasion.accentSoft}0.6)`,
                }}
              />
              <span
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: "12px",
                  color: isDark ? "rgba(255,255,255,0.4)" : "rgba(60,40,100,0.6)",
                  lineHeight: 1.5,
                }}
              >
                {f}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 w-full py-3 rounded-2xl text-white cursor-pointer"
          style={{
            fontFamily: "'Exo 2', sans-serif",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            backgroundImage: occasion.gradient,
            boxShadow: `0 4px 20px ${occasion.accentSoft}0.35)`,
            border: "none",
          }}
        >
          BOOK THIS EXPERIENCE
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function OccasionsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="w-full min-h-screen relative"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #060810 0%, #080c18 30%, #0a0e1a 60%, #060810 100%)"
          : "linear-gradient(180deg, #faf8ff 0%, #f3eeff 30%, #ffffff 60%, #f8f4ff 100%)",
        overflowX: "hidden",
      }}
    >
      <FloatingNav />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center text-center px-6"
        style={{ minHeight: "55vh", paddingTop: "120px", paddingBottom: "60px" }}
      >
        {/* Background rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          {[520, 360, 220].map((size, i) => (
            <motion.div
              key={size}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                border: isDark
                  ? `1px solid rgba(168,85,247,${0.06 + i * 0.04})`
                  : `1px solid rgba(130,60,220,${0.06 + i * 0.04})`,
              }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 40 - i * 8, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 flex items-center gap-3"
        >
          <div style={{ width: 30, height: 1, backgroundImage: isDark ? "linear-gradient(to right, transparent, rgba(168,85,247,0.5))" : "linear-gradient(to right, transparent, rgba(130,60,220,0.4))" }} />
          <span
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.35em",
              color: isDark ? "rgba(168,85,247,0.7)" : "rgba(100,50,180,0.65)",
              textTransform: "uppercase",
            }}
          >
            NexoraXR Experiences
          </span>
          <div style={{ width: 30, height: 1, backgroundImage: isDark ? "linear-gradient(to left, transparent, rgba(236,72,153,0.5))" : "linear-gradient(to left, transparent, rgba(200,80,200,0.4))" }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(2.2rem, 5vw, 4.2rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            backgroundImage: isDark
              ? "linear-gradient(135deg, #c084fc 0%, #818cf8 40%, #38bdf8 100%)"
              : "linear-gradient(135deg, #7c3aed 0%, #6366f1 40%, #0ea5e9 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "20px",
          }}
        >
          Every Occasion,
          <br />
          Reimagined in XR
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "1.05rem",
            lineHeight: 1.8,
            color: isDark ? "rgba(255,255,255,0.5)" : "rgba(60,40,100,0.65)",
            maxWidth: "520px",
          }}
        >
          From intimate birthday celebrations to massive festival stages — NexoraXR crafts immersive experiences tailored to every moment that matters.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.65 }}
          className="flex gap-4 mt-10 flex-wrap justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 rounded-full text-white cursor-pointer"
            style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              backgroundImage: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
              boxShadow: "0 6px 30px rgba(168,85,247,0.4)",
              border: "none",
            }}
          >
            Get a Custom Quote
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/")}
            className="px-8 py-3.5 rounded-full cursor-pointer"
            style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: isDark ? "#c4b5fd" : "#6d28d9",
              background: isDark ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.8)",
              border: isDark ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(109,40,217,0.2)",
            }}
          >
            View Worlds
          </motion.button>
        </motion.div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="mx-auto max-w-5xl px-6 mb-20"
      >
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden"
          style={{
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(130,60,220,0.08)",
          }}
        >
          {[
            { value: "500+", label: "Events Delivered" },
            { value: "30", label: "Headsets Per Event" },
            { value: "98%", label: "Client Satisfaction" },
            { value: "6", label: "Occasion Types" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center py-6 px-4 text-center"
              style={{
                background: isDark
                  ? "linear-gradient(160deg, rgba(15,12,28,0.8), rgba(10,8,20,0.6))"
                  : "linear-gradient(160deg, rgba(255,255,255,0.9), rgba(248,246,255,0.8))",
              }}
            >
              <span
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  backgroundImage: "linear-gradient(135deg, #a78bfa, #818cf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  color: isDark ? "rgba(255,255,255,0.35)" : "rgba(60,40,100,0.5)",
                  marginTop: "4px",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Cards grid ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OCCASIONS.map((occasion, i) => (
            <OccasionCard key={occasion.id} occasion={occasion} index={i} isDark={isDark} />
          ))}
        </div>
      </section>

      {/* ── CTA band ───────────────────────────────────────────── */}
      <section
        className="relative mx-4 mb-16 rounded-3xl overflow-hidden"
        style={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }}
      >
        <div
          className="relative flex flex-col md:flex-row items-center justify-between gap-8 px-10 py-14"
          style={{
            backgroundImage: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)",
          }}
        >
          {/* subtle noise overlay */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

          <div className="relative text-left">
            <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "10px", letterSpacing: "0.3em", color: "rgba(255,255,255,0.6)", marginBottom: "10px" }}>
              READY TO BEGIN?
            </p>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.4rem, 3vw, 2.2rem)", fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
              Let&apos;s build your perfect
              <br />XR experience together
            </h2>
          </div>

          <div className="relative flex flex-col sm:flex-row gap-4 shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-full cursor-pointer"
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
            >
              Contact Us Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/")}
              className="px-8 py-3.5 rounded-full cursor-pointer"
              style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: "#fff",
                background: "rgba(255,255,255,0.15)",
                border: "1.5px solid rgba(255,255,255,0.4)",
              }}
            >
              Explore Worlds
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
}
