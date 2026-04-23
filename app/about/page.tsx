"use client";

import { Navbar } from "@/components/Navbar";
import { FloatingNav } from "@/components/HUDOverlay";
import { WebGLScene } from "@/components/WebGLScene";
import { ReviewSection } from "@/components/ReviewSection";
import { useTheme } from "@/contexts/ThemeContext";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type Feature = {
  title: string;
  description: string;
  icon: string;
  accent: "cyan" | "violet" | "pink";
  image: string;
};

const FEATURES: Feature[] = [
  {
    icon: "",
    title: "Be among the first",
    description:
      "Nexora XR is pioneering Walking XR Theatre—an entirely new way to experience live, story-driven worlds.",
    accent: "violet",
    image: "/be among the first.jpeg",
  },
  {
    icon: "",
    title: "Step inside the story",
    description:
      "You don’t just watch. You walk, explore, and inhabit cinematic worlds that react to you and your group.",
    accent: "cyan",
    image: "/step inside the story.jpeg",
  },
  {
    icon: "",
    title: "Share the journey",
    description:
      "Whether with family, friends, or teammates, it’s all about sharing moments, laughter, and memories together.",
    accent: "pink",
    image: "/share the joerny.jpeg",
  },
  {
    icon: "",
    title: "See it in motion",
    description:
      "Turning real spaces into story worlds, where your actions and curiosity create moments you won’t forget.",
    accent: "violet",
    image: "/vr home 5.jpeg",
  },
];

function accentStyles(isDark: boolean, accent: Feature["accent"]) {
  if (accent === "cyan") {
    return {
      border: isDark ? "rgba(212,165,116,0.22)" : "rgba(184,134,11,0.22)",
      glow: isDark ? "rgba(212,165,116,0.18)" : "rgba(184,134,11,0.14)",
      gradient: "linear-gradient(135deg, #D4A574, #C9933E)",
      pillBg: isDark ? "rgba(212,165,116,0.12)" : "rgba(184,134,11,0.10)",
      pillText: isDark ? "rgba(230,185,115,0.9)" : "rgba(184,134,11,0.9)",
    };
  }
  if (accent === "pink") {
    return {
      border: isDark ? "rgba(184,134,11,0.24)" : "rgba(184,134,11,0.22)",
      glow: isDark ? "rgba(184,134,11,0.16)" : "rgba(184,134,11,0.12)",
      gradient: "linear-gradient(135deg, #E6B973, #D4A574)",
      pillBg: isDark ? "rgba(184,134,11,0.12)" : "rgba(184,134,11,0.10)",
      pillText: isDark ? "rgba(230,185,115,0.9)" : "rgba(184,134,11,0.9)",
    };
  }
  return {
    border: isDark ? "rgba(212,165,116,0.24)" : "rgba(184,134,11,0.22)",
    glow: isDark ? "rgba(212,165,116,0.18)" : "rgba(184,134,11,0.12)",
    gradient: "linear-gradient(135deg, #C9933E, #D4A574, #B8860B)",
    pillBg: isDark ? "rgba(212,165,116,0.12)" : "rgba(184,134,11,0.10)",
    pillText: isDark ? "rgba(230,185,115,0.9)" : "rgba(168,120,10,0.9)",
  };
}

function Card({
  isDark,
  accent,
  badge,
  title,
  description,
  image,
}: {
  isDark: boolean;
  accent: Feature["accent"];
  badge: string;
  title: string;
  description: string;
  image: string;
}) {
  const s = accentStyles(isDark, accent);
  return (
    <motion.div
      className="rounded-3xl p-6 backdrop-blur-xl"
      style={{
        background: isDark
          ? "linear-gradient(160deg, rgba(15,12,28,0.74) 0%, rgba(10,8,20,0.58) 100%)"
          : "linear-gradient(160deg, rgba(255,255,255,0.96) 0%, rgba(248,246,255,0.88) 100%)",
        border: `1px solid ${s.border}`,
        boxShadow: isDark ? `0 18px 60px rgba(0,0,0,0.35), 0 0 0 1px ${s.glow}` : `0 16px 50px ${s.glow}`,
      }}
      initial={{ opacity: 0, y: 22, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
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
          aria-hidden="true"
          className="h-9 w-9 rounded-2xl"
          style={{
            backgroundImage: "none",
            boxShadow: "none",
            opacity: 0,
            pointerEvents: "none",
          }}
        />
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/5">
        <Image
          src={image}
          alt={title}
          width={640}
          height={360}
          className="h-36 w-full object-cover"
          priority={false}
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
    </motion.div>
  );
}

function ManifestoCard({
  isDark,
  label,
  delay = 0,
  children,
}: {
  isDark: boolean;
  label: string;
  delay?: number;
  children: React.ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const accent = "#D4A574";
  const accentSoft = "rgba(212,165,116,";
  const gradient = "linear-gradient(135deg, #D4A574, #C9933E)";

  // Pointer-driven tilt (same interaction model as occasion cards)
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

  const shineX = useTransform(mxSpring, [-0.5, 0.5], [30, 70]);
  const shineY = useTransform(mySpring, [-0.5, 0.5], [30, 70]);
  const shineBg = useMotionTemplate`radial-gradient(600px circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.22), transparent 55%)`;
  const radialGlowBg = useMotionTemplate`radial-gradient(circle at ${shineX}% ${shineY}%, ${accentSoft}0.14), transparent 70%)`;

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
      className="group relative w-full rounded-3xl cursor-pointer"
      style={{
        background: isDark
          ? "linear-gradient(160deg, rgba(15,12,28,0.74) 0%, rgba(10,8,20,0.58) 100%)"
          : "linear-gradient(160deg, rgba(255,255,255,0.96) 0%, rgba(248,246,255,0.88) 100%)",
        border: isDark ? `1px solid ${accentSoft}0.12)` : `1px solid ${accentSoft}0.2)`,
        boxShadow: isDark
          ? `0 18px 60px rgba(0,0,0,0.35), 0 0 0 1px ${accentSoft}0.06)`
          : `0 18px 60px ${accentSoft}0.10), 0 0 0 1px ${accentSoft}0.10)`,
        backdropFilter: "blur(20px)",
        isolation: "isolate",
      }}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 22, scale: 0.99, filter: "blur(10px)" }}
      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.7,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* clip container (prevents hover overlays bleeding past radius when parent transforms) */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ backgroundImage: gradient }}
        />
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ opacity: glowOpacity, background: radialGlowBg }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: useTransform(hoverSpring, [0, 1], prefersReducedMotion ? [0, 0.25] : [0, 0.55]),
            background: shineBg,
            mixBlendMode: isDark ? ("screen" as const) : ("overlay" as const),
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(800px circle at 50% 0%, ${accentSoft}${isDark ? "0.08" : "0.06"}), transparent 55%)`,
          }}
        />
      </div>

      <motion.div
        ref={cardRef}
        className="relative rounded-3xl p-6 sm:p-8 md:p-10 text-center"
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
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          aria-hidden="true"
          style={{
            boxShadow: isDark
              ? `0 18px 70px rgba(0,0,0,0.35), 0 0 0 1px ${accentSoft}0.06)`
              : `0 18px 70px ${accentSoft}0.10), 0 0 0 1px ${accentSoft}0.10)`,
            opacity: prefersReducedMotion ? 0.35 : 1,
          }}
        />

        <div
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "9px",
            letterSpacing: "0.35em",
            color: isDark ? "rgba(255,255,255,0.4)" : "rgba(100,70,20,0.75)",
            textTransform: "uppercase",
            marginBottom: "16px",
            transform: "translateZ(18px)",
          }}
        >
          {label}
        </div>

        <div style={{ transform: "translateZ(26px)" }}>{children}</div>

        <div
          aria-hidden="true"
          className="mx-auto mt-7 h-[1px] w-28 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ backgroundImage: `linear-gradient(to right, transparent, ${accent}, transparent)` }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function AboutPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const stateRef = useRef({ scrollY: 0, mouseX: 0, mouseY: 0 });
  const featureScrollerRef = useRef<HTMLDivElement | null>(null);
  const featureSegmentWidthRef = useRef(0);
  const featureIsLoopingRef = useRef(false);
  const [featureLoopReady, setFeatureLoopReady] = useState(false);

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
      { value: "Walking", label: "Not seated or static" },
      { value: "Immersive", label: "All around you" },
      { value: "Interactive", label: "You shape moments" },
      { value: "Shared", label: "Move as a group" },
    ],
    [],
  );

  const featureEdgeFade = useMemo(() => {
    return isDark
      ? {
          left: "linear-gradient(90deg, rgba(6,8,16,1), rgba(6,8,16,0))",
          right: "linear-gradient(270deg, rgba(6,8,16,1), rgba(6,8,16,0))",
        }
      : {
          left: "linear-gradient(90deg, rgba(250,248,255,1), rgba(250,248,255,0))",
          right: "linear-gradient(270deg, rgba(250,248,255,1), rgba(250,248,255,0))",
        };
  }, [isDark]);

  const featureLoopItems = useMemo(() => {
    // Render 3 segments so we can keep the user in the middle and wrap seamlessly.
    return [...FEATURES, ...FEATURES, ...FEATURES];
  }, []);

  const measureAndCenterFeatures = () => {
    const el = featureScrollerRef.current;
    if (!el) return;
    const seg = el.scrollWidth / 3;
    if (!Number.isFinite(seg) || seg <= 0) return;
    featureSegmentWidthRef.current = seg;
    // Start in the middle segment so users can scroll both ways immediately.
    el.scrollLeft = seg;
    setFeatureLoopReady(true);
  };

  const handleFeatureLoopScroll = () => {
    const el = featureScrollerRef.current;
    if (!el) return;
    if (!featureLoopReady) return;
    if (featureIsLoopingRef.current) return;

    const seg = featureSegmentWidthRef.current || el.scrollWidth / 3;
    if (!Number.isFinite(seg) || seg <= 0) return;

    // Small epsilon avoids flicker near wrap points due to fractional pixels.
    const eps = 2;
    // Keep the user in the middle segment; wrap only when well into first/third.
    const leftEdge = seg * 0.5 - eps;
    const rightEdge = seg * 1.5 + eps;

    if (el.scrollLeft <= leftEdge) {
      featureIsLoopingRef.current = true;
      el.scrollLeft = el.scrollLeft + seg;
      requestAnimationFrame(() => {
        featureIsLoopingRef.current = false;
      });
      return;
    }

    if (el.scrollLeft >= rightEdge) {
      featureIsLoopingRef.current = true;
      el.scrollLeft = el.scrollLeft - seg;
      requestAnimationFrame(() => {
        featureIsLoopingRef.current = false;
      });
    }
  };

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setFeatureLoopReady(false);
      measureAndCenterFeatures();
    });

    const onResize = () => {
      setFeatureLoopReady(false);
      requestAnimationFrame(() => measureAndCenterFeatures());
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  const scrollFeaturesByCards = (dir: "left" | "right") => {
    const el = featureScrollerRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.9, 560);
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

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
      <Navbar />

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
                borderColor: isDark ? "rgba(212,165,116,0.28)" : "rgba(184,134,11,0.22)",
                background: isDark ? "rgba(212,165,116,0.10)" : "rgba(184,134,11,0.08)",
                color: isDark ? "rgba(230,185,115,0.95)" : "rgba(168,120,10,0.9)",
              }}
            >
              NEXORA XR • About
            </div>
            <h1
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.6rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                backgroundImage: isDark
                  ? "linear-gradient(135deg, #D4A574 0%, #C9933E 40%, #B8860B 100%)"
                  : "linear-gradient(135deg, #C9933E 0%, #D4A574 40%, #B8860B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "14px",
              }}
            >
              Pioneering XR Walking Theatre
              <br />
              where stories move with you
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
              At Nexora XR, we merge theatre, VR, and interactive entertainment into Walking XR Theatre—live, shared journeys
              where audiences step inside legendary stories and move through them together.
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
                  backgroundImage: "linear-gradient(135deg, #C9933E, #D4A574, #E6B973)",
                  boxShadow: "0 6px 30px rgba(212,165,116,0.35)",
                  border: "none",
                }}
                onClick={() => router.push("/contact")}
              >
                Contact us
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
                  background: isDark ? "rgba(184,134,11,0.12)" : "rgba(255,255,255,0.85)",
                  border: isDark ? "1px solid rgba(184,134,11,0.3)" : "1px solid rgba(168,120,10,0.2)",
                }}
                onClick={() => router.push("/#experiences")}
              >
                Explore Experiences
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
              <motion.div
                key={stat.label}
                className="flex flex-col items-center justify-center py-5 px-3 text-center"
                style={{
                  background: isDark
                    ? "linear-gradient(160deg, rgba(15,12,28,0.78), rgba(10,8,20,0.56))"
                    : "linear-gradient(160deg, rgba(255,255,255,0.92), rgba(248,246,255,0.84))",
                }}
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "1rem",
                    fontWeight: 800,
                    backgroundImage: isDark ? "linear-gradient(135deg, #D4A574, #C9933E)" : "linear-gradient(135deg, #C9933E, #B8860B)",
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
              </motion.div>
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
                color: isDark ? "rgba(212,165,116,0.7)" : "rgba(168,120,10,0.65)",
              }}
            >
              Why XR walking theatre
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
              Why people fall in love with the experience
            </h2>
          </div>
          <div className="relative">
            {/* Full-bleed scroller like the review section */}
            <div className="-mx-4 sm:-mx-6 relative">
              <div
                ref={featureScrollerRef}
                onScroll={handleFeatureLoopScroll}
                className="flex gap-5 overflow-x-auto pb-3 px-4 sm:px-6"
                style={{
                  scrollSnapType: "x proximity",
                  WebkitOverflowScrolling: "touch",
                  scrollBehavior: "smooth",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {featureLoopItems.map((f, idx) => (
                  <div
                    key={`${f.title}-${idx}`}
                    className="shrink-0"
                    style={{
                      scrollSnapAlign: "start",
                      width: "min(420px, 88vw)",
                    }}
                  >
                    <Card
                      isDark={isDark}
                      accent={f.accent}
                      badge={`${f.icon}  ${f.title}`}
                      title={f.title}
                      description={f.description}
                      image={f.image}
                    />
                  </div>
                ))}
              </div>

              {/* Edge fades */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-14 sm:w-20"
                style={{ background: featureEdgeFade.left }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 w-14 sm:w-20"
                style={{ background: featureEdgeFade.right }}
              />

              {/* Scroll buttons */}
              <button
                type="button"
                aria-label="Scroll features left"
                onClick={() => scrollFeaturesByCards("left")}
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-11 sm:w-11 rounded-full grid place-items-center backdrop-blur-md transition-opacity"
                style={{
                  background: isDark ? "rgba(12,10,24,0.55)" : "rgba(255,255,255,0.70)",
                  border: isDark ? "1px solid rgba(212,165,116,0.22)" : "1px solid rgba(168,120,10,0.18)",
                  boxShadow: isDark ? "0 14px 40px rgba(0,0,0,0.35)" : "0 14px 40px rgba(201,147,62,0.14)",
                  opacity: featureLoopReady ? 1 : 0,
                  pointerEvents: featureLoopReady ? "auto" : "none",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden style={{ display: "block" }}>
                  <path
                    d="M14.5 5.5L8 12l6.5 6.5"
                    fill="none"
                    stroke={isDark ? "rgba(230,185,115,0.92)" : "rgba(168,120,10,0.9)"}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                aria-label="Scroll features right"
                onClick={() => scrollFeaturesByCards("right")}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-11 sm:w-11 rounded-full grid place-items-center backdrop-blur-md transition-opacity"
                style={{
                  background: isDark ? "rgba(12,10,24,0.55)" : "rgba(255,255,255,0.70)",
                  border: isDark ? "1px solid rgba(212,165,116,0.22)" : "1px solid rgba(168,120,10,0.18)",
                  boxShadow: isDark ? "0 14px 40px rgba(0,0,0,0.35)" : "0 14px 40px rgba(201,147,62,0.14)",
                  opacity: featureLoopReady ? 1 : 0,
                  pointerEvents: featureLoopReady ? "auto" : "none",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden style={{ display: "block" }}>
                  <path
                    d="M9.5 5.5L16 12l-6.5 6.5"
                    fill="none"
                    stroke={isDark ? "rgba(230,185,115,0.92)" : "rgba(168,120,10,0.9)"}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>

        <ReviewSection />

        {/* Our Vision & Our Mission */}
        <section className="mt-14 md:mt-20">
          <div className="flex items-center justify-center gap-3 mb-8 md:mb-10">
            <div
              style={{
                width: "40px",
                height: "1px",
                background: isDark
                  ? "linear-gradient(to right, transparent, rgba(212,165,116,0.3))"
                  : "linear-gradient(to right, transparent, rgba(184,134,11,0.35))",
              }}
            />
            <span
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: isDark ? "rgba(255,255,255,0.35)" : "rgba(100,70,20,0.75)",
              }}
            >
              Manifesto
            </span>
            <div
              style={{
                width: "40px",
                height: "1px",
                background: isDark
                  ? "linear-gradient(to left, transparent, rgba(212,165,116,0.3))"
                  : "linear-gradient(to left, transparent, rgba(184,134,11,0.35))",
              }}
            />
          </div>
          <div className="mx-auto max-w-3xl flex flex-col items-center gap-6">
            <ManifestoCard isDark={isDark} label="Our Vision">
              <h2
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
                  fontWeight: 700,
                  lineHeight: 1.6,
                  color: isDark ? "#ffffff" : "#1a0a2e",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                To bring{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #D4A574, #C9933E)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  imagination, culture, and emotion
                </span>{" "}
                into immersive reality.
              </h2>
            </ManifestoCard>

            <div
              style={{
                width: "1px",
                height: "50px",
                background: isDark
                  ? "linear-gradient(to bottom, rgba(212,165,116,0.15), rgba(212,165,116,0.15))"
                  : "linear-gradient(to bottom, rgba(184,134,11,0.15), rgba(184,134,11,0.15))",
              }}
            />

            <ManifestoCard isDark={isDark} label="Our Mission" delay={0.15}>
              <p
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
                  fontWeight: 400,
                  lineHeight: 1.8,
                  color: isDark ? "rgba(255,255,255,0.6)" : "rgba(100,70,20,0.75)",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                To develop innovative{" "}
                <span style={{ color: isDark ? "rgba(212,165,116,0.9)" : "rgba(168,120,10,0.95)" }}>
                  digital worlds and experiences
                </span>{" "}
                that inspire creativity, connection, and exploration.
              </p>
            </ManifestoCard>
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
