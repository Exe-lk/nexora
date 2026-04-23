"use client";

import { useRef, useState, useEffect, useId } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useMotionTemplate,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
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
    accent: "#B8860B",
    accentSoft: "rgba(249,115,22,",
    gradient: "linear-gradient(135deg, #B8860B, #E6B973)",
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
    accent: "#D4A574",
    accentSoft: "rgba(201,147,62,",
    gradient: "linear-gradient(135deg, #D4A574, #B8860B)",
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
    accent: "#D4A574",
    accentSoft: "rgba(212,165,116,",
    gradient: "linear-gradient(135deg, #D4A574, #C9933E)",
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
    accent: "#C9933E",
    accentSoft: "rgba(6,182,212,",
    gradient: "linear-gradient(135deg, #C9933E, #D4A574)",
    image: "/vr educational programs.jpeg",
  },
];

// Unify card palette (match "Corporate Events" card)
const OCCASION_CARD_THEME = {
  accent: "#D4A574",
  accentSoft: "rgba(201,147,62,",
  gradient: "linear-gradient(135deg, #D4A574, #B8860B)",
} as const;

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
  const prefersReducedMotion = useReducedMotion();
  const cardId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Always keep a base scale of 1.2 so the image fully covers the container
  // even when translateY shifts it. y goes -10% → +10% (upward parallax).
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.2, 1.3]);

  // Motion-driven pointer interaction (no React re-render on hover)
  const mx = useMotionValue(0); // -0.5 .. 0.5
  const my = useMotionValue(0); // -0.5 .. 0.5
  const hover = useMotionValue(0); // 0 .. 1

  const mxSpring = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.9 });
  const mySpring = useSpring(my, { stiffness: 260, damping: 28, mass: 0.9 });
  const hoverSpring = useSpring(hover, { stiffness: 340, damping: 30, mass: 0.8 });

  const rotateY = useTransform(mxSpring, [-0.5, 0.5], prefersReducedMotion ? [0, 0] : [-10, 10]);
  const rotateX = useTransform(mySpring, [-0.5, 0.5], prefersReducedMotion ? [0, 0] : [10, -10]);
  const lift = useTransform(hoverSpring, [0, 1], prefersReducedMotion ? [0, 0] : [0, -10]);
  const scale = useTransform(hoverSpring, [0, 1], prefersReducedMotion ? [1, 1] : [1, 1.02]);
  const glowOpacity = useTransform(hoverSpring, [0, 1], prefersReducedMotion ? [0, 0.6] : [0, 1]);
  const imageHoverScale = useTransform(hoverSpring, [0, 1], prefersReducedMotion ? [1, 1.015] : [1, 1.05]);

  const shineX = useTransform(mxSpring, [-0.5, 0.5], [30, 70]);
  const shineY = useTransform(mySpring, [-0.5, 0.5], [30, 70]);
  const shineBg = useMotionTemplate`radial-gradient(600px circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.22), transparent 55%)`;
  const radialGlowBg = useMotionTemplate`radial-gradient(circle at ${shineX}% ${shineY}%, ${OCCASION_CARD_THEME.accentSoft}0.14), transparent 70%)`;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      mx.set(Math.max(-0.5, Math.min(0.5, px)));
      my.set(Math.max(-0.5, Math.min(0.5, py)));
    };
    const onPointerEnter = () => hover.set(1);
    const onPointerLeave = () => {
      hover.set(0);
      mx.set(0);
      my.set(0);
    };

    el.addEventListener("pointermove", onPointerMove, { passive: true });
    el.addEventListener("pointerenter", onPointerEnter, { passive: true });
    el.addEventListener("pointerleave", onPointerLeave, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerenter", onPointerEnter);
      el.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [hover, mx, my]);

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 26, scale: 0.985, filter: "blur(10px)" }}
      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.7,
        delay: prefersReducedMotion ? 0 : index * 0.01,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative rounded-3xl cursor-pointer"
      style={{
        background: isDark
          ? "linear-gradient(160deg, rgba(15,12,28,0.8) 0%, rgba(10,8,20,0.6) 100%)"
          : "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(248,246,255,0.9) 100%)",
        border: isDark
          ? `1px solid ${OCCASION_CARD_THEME.accentSoft}0.12)`
          : `1px solid ${OCCASION_CARD_THEME.accentSoft}0.2)`,
        backdropFilter: "blur(20px)",
        boxShadow: isDark
          ? `0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px ${OCCASION_CARD_THEME.accentSoft}0.05)`
          : `0 8px 40px ${OCCASION_CARD_THEME.accentSoft}0.08), 0 0 0 1px ${OCCASION_CARD_THEME.accentSoft}0.08)`,
        isolation: "isolate",
      }}
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
          style={{ backgroundImage: OCCASION_CARD_THEME.gradient }}
        />

        {/* Mouse-tracking radial glow */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            opacity: glowOpacity,
            background: radialGlowBg,
          }}
        />

        {/* Specular "glass" shine */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: useTransform(hoverSpring, [0, 1], prefersReducedMotion ? [0, 0.25] : [0, 0.55]),
            background: shineBg,
            mixBlendMode: isDark ? ("screen" as const) : ("overlay" as const),
          }}
        />
      </div>

      <motion.div
        ref={cardRef}
        className="relative p-5 md:p-8 z-10"
        style={{
          y: lift,
          scale,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        transition={{ type: "spring", stiffness: 520, damping: 40, mass: 0.8 }}
      >
        {/* subtle depth plane */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          aria-hidden="true"
          style={{
            boxShadow: isDark
              ? `0 18px 70px rgba(0,0,0,0.35), 0 0 0 1px ${OCCASION_CARD_THEME.accentSoft}0.06)`
              : `0 18px 70px ${OCCASION_CARD_THEME.accentSoft}0.10), 0 0 0 1px ${OCCASION_CARD_THEME.accentSoft}0.10)`,
            opacity: prefersReducedMotion ? 0.35 : 1,
          }}
        />

        {/* Tag */}
        <div className="flex items-center mb-5" style={{ transform: "translateZ(18px)" }}>
          <span
            className="tracking-[0.25em] transition-colors duration-300 group-hover:text-white"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "9px",
              color: isDark ? `${OCCASION_CARD_THEME.accentSoft}0.8)` : `${OCCASION_CARD_THEME.accentSoft}1)`,
            }}
          >
            {occasion.tag}
          </span>
        </div>

        {/* Title */}
        <h2
          id={`${cardId}-title`}
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: isDark ? "#fff" : "#1a0a2e",
            marginBottom: "4px",
            transform: "translateZ(26px)",
          }}
        >
          {occasion.title}
        </h2>
        <p
          style={{
            fontFamily: "'Exo 2', sans-serif",
            fontSize: "12px",
            letterSpacing: "0.05em",
            color: isDark ? `${OCCASION_CARD_THEME.accentSoft}0.7)` : `${OCCASION_CARD_THEME.accentSoft}0.8)`,
            marginBottom: "16px",
            transform: "translateZ(20px)",
          }}
        >
          {occasion.subtitle}
        </p>

        {/* Inline image for each occasion */}
        <div className="relative w-full h-40 md:h-48 mb-5 overflow-hidden rounded-2xl" style={{ transform: "translateZ(30px)" }}>
          <motion.img
            src={occasion.image}
            alt={occasion.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{
              scale: imageHoverScale,
              filter: isDark ? "brightness(0.8) saturate(1.2)" : "brightness(0.95) saturate(1.1)",
            }}
          />
          <motion.div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              opacity: useTransform(hoverSpring, [0, 1], prefersReducedMotion ? [0, 0.12] : [0, 0.18]),
              backgroundImage: `linear-gradient(135deg, ${OCCASION_CARD_THEME.accentSoft}0.18), transparent 55%)`,
            }}
          />
        </div>

        {/* Divider */}
        <div
          className="mb-5"
          style={{
            height: "1px",
            backgroundImage: `linear-gradient(to right, ${OCCASION_CARD_THEME.accentSoft}0.3), transparent)`,
          }}
        />

        {/* Features */}
        <ul className="flex flex-col gap-2.5" style={{ transform: "translateZ(16px)" }}>
          {occasion.features.map((f, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-1 shrink-0 rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  backgroundImage: OCCASION_CARD_THEME.gradient,
                  boxShadow: `0 0 8px ${OCCASION_CARD_THEME.accentSoft}0.6)`,
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
          whileHover={prefersReducedMotion ? {} : { scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.985 }}
          className="mt-8 w-full py-3 rounded-2xl text-white cursor-pointer"
          style={{
            fontFamily: "'Exo 2', sans-serif",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            backgroundImage: OCCASION_CARD_THEME.gradient,
            boxShadow: `0 4px 20px ${OCCASION_CARD_THEME.accentSoft}0.35)`,
            border: "none",
            transform: "translateZ(34px)",
          }}
          aria-describedby={`${cardId}-title`}
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
  const cardsRef = useRef<HTMLElement>(null);
  const [viewW, setViewW] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // Section-wide premium spotlight (subtle, premium, same theme)
  const spotX = useMotionValue(50);
  const spotY = useMotionValue(40);
  const spotHover = useMotionValue(0);
  const spotXSpring = useSpring(spotX, { stiffness: 120, damping: 30, mass: 0.9 });
  const spotYSpring = useSpring(spotY, { stiffness: 120, damping: 30, mass: 0.9 });
  const spotHoverSpring = useSpring(spotHover, { stiffness: 240, damping: 32, mass: 0.8 });
  const spotlightBg = useMotionTemplate`radial-gradient(720px circle at ${spotXSpring}% ${spotYSpring}%, ${
    isDark ? "rgba(212,165,116,0.14)" : "rgba(130,60,220,0.10)"
  }, transparent 58%)`;

  useEffect(() => {
    const update = () => setViewW(window.innerWidth);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      spotX.set(Math.max(0, Math.min(100, x)));
      spotY.set(Math.max(0, Math.min(100, y)));
    };
    const onEnter = () => spotHover.set(1);
    const onLeave = () => spotHover.set(0);
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerenter", onEnter, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [spotHover, spotX, spotY]);

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
                  ? `1px solid rgba(212,165,116,${0.06 + i * 0.04})`
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
          <div style={{ width: 30, height: 1, backgroundImage: isDark ? "linear-gradient(to right, transparent, rgba(212,165,116,0.5))" : "linear-gradient(to right, transparent, rgba(130,60,220,0.4))" }} />
          <span
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.35em",
              color: isDark ? "rgba(212,165,116,0.7)" : "rgba(168,120,10,0.65)",
              textTransform: "uppercase",
            }}
          >
            NexoraXR Experiences
          </span>
          <div style={{ width: 30, height: 1, backgroundImage: isDark ? "linear-gradient(to left, transparent, rgba(184,134,11,0.5))" : "linear-gradient(to left, transparent, rgba(200,80,200,0.4))" }} />
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
              ? "linear-gradient(135deg, #D4A574 0%, #C9933E 40%, #B8860B 100%)"
              : "linear-gradient(135deg, #C9933E 0%, #D4A574 40%, #D4A574 100%)",
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
              backgroundImage: "linear-gradient(135deg, #C9933E, #D4A574, #E6B973)",
              boxShadow: "0 6px 30px rgba(212,165,116,0.4)",
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
              background: isDark ? "rgba(184,134,11,0.12)" : "rgba(255,255,255,0.8)",
              border: isDark ? "1px solid rgba(184,134,11,0.3)" : "1px solid rgba(168,120,10,0.2)",
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
                  backgroundImage: "linear-gradient(135deg, #D4A574, #C9933E)",
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
      <motion.section
        ref={cardsRef}
        className="mx-auto max-w-7xl px-4 sm:px-6 pb-20 md:pb-32"
        style={{ position: "relative", zIndex: 1 }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
        variants={{
          hidden: prefersReducedMotion ? {} : { opacity: 1 },
          show: prefersReducedMotion
            ? { opacity: 1 }
            : {
                opacity: 1,
                transition: { staggerChildren: 0.075, delayChildren: 0.08 },
              },
        }}
      >
        {/* shared spotlight */}
        <motion.div
          className="absolute inset-0 rounded-[32px] pointer-events-none"
          aria-hidden="true"
          style={{
            opacity: prefersReducedMotion ? 0.12 : useTransform(spotHoverSpring, [0, 1], [0.08, 0.22]),
            background: spotlightBg,
            filter: "blur(2px)",
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OCCASIONS.map((occasion, i) => (
            <motion.div
              key={occasion.id}
              variants={{
                hidden: prefersReducedMotion ? {} : { opacity: 0, y: 18, scale: 0.99, filter: "blur(10px)" },
                show: prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <OccasionCard occasion={occasion} index={i} isDark={isDark} />
            </motion.div>
          ))}
        </div>
      </motion.section>

    </div>
  );
}
