"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
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
    image: "/vr birthday parties.jpeg",
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
    image: "/vr corporate events.jpeg",
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
    image: "/vr family fun days.jpeg",
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
    image: "/vr weddings and engagement.jpeg",
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
    image: "/vr festivals and concerts.jpeg",
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
    image: "/vr educational programs.jpeg",
  },
];

// ─── Mouse parallax hook ──────────────────────────────────────────────────────
function useMouseParallax() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      x.set((e.clientX / window.innerWidth - 0.5) * 2);
      y.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [x, y]);

  return { smoothX, smoothY };
}

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
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Always keep a base scale of 1.2 so the image fully covers the container
  // even when translateY shifts it. y goes -10% → +10% (upward parallax).
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.2, 1.3]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        });
      }
    };
    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };
    const card = cardRef.current;
    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: (index % 3) * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative rounded-3xl cursor-pointer"
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
        isolation: "isolate",
      }}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
    >
      {/* ── Dedicated clip container ────────────────────────────────────────
           All absolute overlay layers live here so overflow-hidden is applied
           on a NON-transformed element. This prevents the background image and
           glow effects from bleeding outside the card border-radius when
           Framer Motion applies scale/translateY transforms on the parent. */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Background image with scroll-driven parallax */}
        <motion.div
          className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-all duration-700 ease-out"
          style={{ y: imageY, scale: imageScale }}
        >
          <img
            src={occasion.image}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: isDark ? "brightness(0.3) saturate(1.4)" : "brightness(0.8) saturate(1.2)" }}
          />
          <div
            className="absolute inset-0 transition-colors duration-500"
            style={{
              backgroundImage: `linear-gradient(to bottom, transparent 0%, ${isDark ? "rgba(10,8,20,0.9)" : "rgba(255,255,255,0.95)"} 100%)`,
            }}
          />
        </motion.div>

        {/* Hover glow — top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ backgroundImage: occasion.gradient }}
        />

        {/* Mouse-tracking radial glow */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${50 + mousePosition.x * 100}% ${50 + mousePosition.y * 100}%, ${occasion.accentSoft}0.15), transparent 70%)`,
          }}
        />
      </div>

      <motion.div
        ref={cardRef}
        className="relative p-5 md:p-8 z-10"
        animate={{
          x: mousePosition.x * 4,
          y: mousePosition.y * 4,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Tag */}
        <div className="flex items-center mb-5">
          <span
            className="tracking-[0.25em] transition-colors duration-300 group-hover:text-white"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "9px",
              color: isDark ? `${occasion.accentSoft}0.8)` : `${occasion.accentSoft}1)`,
            }}
          >
            {occasion.tag}
          </span>
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

        {/* Inline image for each occasion */}
        <div className="relative w-full h-40 md:h-48 mb-5 overflow-hidden rounded-2xl">
          <img
            src={occasion.image}
            alt={occasion.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ filter: isDark ? "brightness(0.8) saturate(1.2)" : "brightness(0.95) saturate(1.1)" }}
          />
        </div>

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
                  color: isDark ? "rgba(255,255,255,0.4)" : "rgba(60,40,100,0.7)",
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
      </motion.div>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function OccasionsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const [viewW, setViewW] = useState(0);

  useEffect(() => {
    const update = () => setViewW(window.innerWidth);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

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
      <Navbar />

      {/* ── Interactive background particles ───────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} suppressHydrationWarning>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2 + (i % 5),
              height: 2 + (i % 5),
              left: `${(i * 13) % 100}%`,
              top: `${(i * 17) % 100}%`,
              background: isDark
                ? `rgba(${i % 2 === 0 ? "168,85,247" : "236,72,153"}, ${0.3 + (i % 4) * 0.1})`
                : `rgba(${i % 2 === 0 ? "130,60,220" : "200,100,255"}, ${0.2 + (i % 4) * 0.1})`,
            }}
            animate={{
              y: [0, (i % 7) * 10 - 30, 0],
              x: [0, (i % 6) * 10 - 30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + (i % 5),
              repeat: Infinity,
              delay: (i % 3) * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center text-center px-4 sm:px-6"
        style={{ minHeight: "55vh", paddingTop: "clamp(80px, 14vw, 120px)", paddingBottom: "60px", zIndex: 1 }}
      >
        {/* Background rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          {([
            Math.min((viewW || 800) * 0.65, 520),
            Math.min((viewW || 800) * 0.45, 360),
            Math.min((viewW || 800) * 0.28, 220),
          ] as number[]).map((size, i) => (
            <motion.div
              key={i}
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
            maxWidth: "min(520px, 92vw)",
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
        className="mx-auto max-w-5xl px-4 sm:px-6 mb-16 md:mb-20"
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

      {/* ── Cards grid ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20 md:pb-32" style={{ position: "relative", zIndex: 1 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OCCASIONS.map((occasion, i) => (
            <OccasionCard key={occasion.id} occasion={occasion} index={i} isDark={isDark} />
          ))}
        </div>
      </section>

    </div>
  );
}
