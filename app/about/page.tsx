"use client";

import { Navbar } from "@/components/Navbar";
import { FloatingNav } from "@/components/HUDOverlay";
import { WebGLScene } from "@/components/WebGLScene";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

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
      "Designed for families, friends, dates, and teams—everyone moves together, laughs together, and remembers it together.",
    accent: "pink",
    image: "/share the joerny.jpeg",
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
          className="h-9 w-9 rounded-2xl"
          style={{
            backgroundImage: s.gradient,
            boxShadow: `0 10px 30px ${s.glow}`,
            opacity: 0.95,
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
      { value: "Walking", label: "Not seated or static" },
      { value: "Immersive", label: "All around you" },
      { value: "Interactive", label: "You shape moments" },
      { value: "Shared", label: "Move as a group" },
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
                borderColor: isDark ? "rgba(56,189,248,0.28)" : "rgba(124,58,237,0.22)",
                background: isDark ? "rgba(56,189,248,0.10)" : "rgba(124,58,237,0.08)",
                color: isDark ? "rgba(125,211,252,0.95)" : "rgba(109,40,217,0.9)",
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
                  ? "linear-gradient(135deg, #c084fc 0%, #818cf8 40%, #38bdf8 100%)"
                  : "linear-gradient(135deg, #7c3aed 0%, #6366f1 40%, #0ea5e9 100%)",
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
                  backgroundImage: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
                  boxShadow: "0 6px 30px rgba(168,85,247,0.35)",
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
                  background: isDark ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.85)",
                  border: isDark ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(109,40,217,0.2)",
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
                color: isDark ? "rgba(168,85,247,0.7)" : "rgba(109,40,217,0.65)",
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <Card
                key={f.title}
                isDark={isDark}
                accent={f.accent}
                badge={`${f.icon}  ${f.title}`}
                title={f.title}
                description={f.description}
            image={f.image}
              />
            ))}
          </div>
        </section>

        {/* Our Vision & Our Mission */}
        <section className="mt-14 md:mt-20">
          <div className="flex items-center justify-center gap-3 mb-8 md:mb-10">
            <div
              style={{
                width: "40px",
                height: "1px",
                background: isDark
                  ? "linear-gradient(to right, transparent, rgba(200,130,255,0.3))"
                  : "linear-gradient(to right, transparent, rgba(124,58,237,0.35))",
              }}
            />
            <span
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: isDark ? "rgba(255,255,255,0.35)" : "rgba(80,50,140,0.65)",
              }}
            >
              Manifesto
            </span>
            <div
              style={{
                width: "40px",
                height: "1px",
                background: isDark
                  ? "linear-gradient(to left, transparent, rgba(230,80,160,0.3))"
                  : "linear-gradient(to left, transparent, rgba(219,39,119,0.35))",
              }}
            />
          </div>
          <div className="mx-auto max-w-3xl flex flex-col items-center gap-6">
            <motion.div
              className="w-full rounded-3xl p-6 sm:p-8 md:p-10 text-center"
              style={{
                background: isDark
                  ? "linear-gradient(160deg, rgba(15,12,28,0.74) 0%, rgba(10,8,20,0.58) 100%)"
                  : "linear-gradient(160deg, rgba(255,255,255,0.96) 0%, rgba(248,246,255,0.88) 100%)",
                border: isDark ? "1px solid rgba(200,130,255,0.22)" : "1px solid rgba(124,58,237,0.2)",
                boxShadow: isDark ? "0 18px 60px rgba(0,0,0,0.35)" : "0 16px 50px rgba(124,58,237,0.08)",
              }}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.35em",
                  color: isDark ? "rgba(255,255,255,0.4)" : "rgba(80,50,140,0.65)",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                Our Vision
              </div>
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
                    background: "linear-gradient(135deg, #C77DFF, #E84393)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  imagination, culture, and emotion
                </span>{" "}
                into immersive reality.
              </h2>
            </motion.div>

            <div
              style={{
                width: "1px",
                height: "50px",
                background: isDark
                  ? "linear-gradient(to bottom, rgba(200,130,255,0.15), rgba(230,80,160,0.15))"
                  : "linear-gradient(to bottom, rgba(124,58,237,0.15), rgba(219,39,119,0.15))",
              }}
            />

            <motion.div
              className="w-full rounded-3xl p-6 sm:p-8 md:p-10 text-center"
              style={{
                background: isDark
                  ? "linear-gradient(160deg, rgba(15,12,28,0.74) 0%, rgba(10,8,20,0.58) 100%)"
                  : "linear-gradient(160deg, rgba(255,255,255,0.96) 0%, rgba(248,246,255,0.88) 100%)",
                border: isDark ? "1px solid rgba(120,180,255,0.22)" : "1px solid rgba(14,165,233,0.2)",
                boxShadow: isDark ? "0 18px 60px rgba(0,0,0,0.35)" : "0 16px 50px rgba(14,165,233,0.08)",
              }}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            >
              <div
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.35em",
                  color: isDark ? "rgba(255,255,255,0.4)" : "rgba(80,50,140,0.65)",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                Our Mission
              </div>
              <p
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
                  fontWeight: 400,
                  lineHeight: 1.8,
                  color: isDark ? "rgba(255,255,255,0.6)" : "rgba(80,50,140,0.7)",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                To develop innovative{" "}
                <span style={{ color: isDark ? "rgba(200,160,255,0.9)" : "rgba(120,60,220,0.95)" }}>
                  digital worlds and experiences
                </span>{" "}
                that inspire creativity, connection, and exploration.
              </p>
            </motion.div>
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
