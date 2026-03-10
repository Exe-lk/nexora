"use client";

import { Navbar } from "@/components/Navbar";
import { FloatingNav } from "@/components/HUDOverlay";
import { WebGLScene } from "@/components/WebGLScene";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

type Section = {
  title: string;
  bullets: string[];
  accent: "cyan" | "violet" | "pink";
};

function accentStyles(isDark: boolean, accent: Section["accent"]) {
  if (accent === "cyan") {
    return {
      border: isDark ? "rgba(56,189,248,0.22)" : "rgba(14,165,233,0.22)",
      glow: isDark ? "rgba(56,189,248,0.16)" : "rgba(14,165,233,0.12)",
      title: isDark ? "rgba(125,211,252,0.95)" : "rgba(2,132,199,0.95)",
    };
  }
  if (accent === "pink") {
    return {
      border: isDark ? "rgba(236,72,153,0.22)" : "rgba(219,39,119,0.20)",
      glow: isDark ? "rgba(236,72,153,0.14)" : "rgba(219,39,119,0.10)",
      title: isDark ? "rgba(251,113,133,0.9)" : "rgba(190,24,93,0.9)",
    };
  }
  return {
    border: isDark ? "rgba(168,85,247,0.22)" : "rgba(124,58,237,0.20)",
    glow: isDark ? "rgba(168,85,247,0.16)" : "rgba(124,58,237,0.10)",
    title: isDark ? "rgba(216,180,254,0.92)" : "rgba(109,40,217,0.92)",
  };
}

function PolicyCard({ isDark, section }: { isDark: boolean; section: Section }) {
  const s = accentStyles(isDark, section.accent);
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
      <div
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "11px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: s.title,
        }}
      >
        {section.title}
      </div>
      <ul className="mt-4 space-y-2">
        {section.bullets.map((b) => (
          <li
            key={b}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.95rem",
              lineHeight: 1.7,
              color: isDark ? "rgba(255,255,255,0.55)" : "rgba(60,40,100,0.7)",
            }}
          >
            <span aria-hidden style={{ marginRight: 8, color: isDark ? "rgba(255,255,255,0.25)" : "rgba(60,40,100,0.35)" }}>
              •
            </span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PrivacyPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const stateRef = useRef({ scrollY: 0, mouseX: 0, mouseY: 0 });

  const sections = useMemo<Section[]>(
    () => [
      {
        title: "Information we collect",
        accent: "cyan",
        bullets: [
          "Details you share when you contact us (name, email, phone if provided, and your message).",
          "Basic site usage signals (approx. device/browser info and pages visited).",
          "We don’t intentionally collect sensitive personal data through this website.",
        ],
      },
      {
        title: "How we use it",
        accent: "violet",
        bullets: [
          "To respond to enquiries and plan partnerships or projects.",
          "To improve site performance, usability, and content relevance.",
          "To meet legal obligations and protect the site from abuse.",
        ],
      },
      {
        title: "Cookies & analytics",
        accent: "pink",
        bullets: [
          "We may use cookies and similar technologies to understand usage and keep the site reliable.",
          "You can control cookies in your browser settings; disabling them may impact some features.",
        ],
      },
      {
        title: "Sharing",
        accent: "cyan",
        bullets: [
          "We don’t sell personal information.",
          "We may share limited data with service providers that help us operate the site (hosting/analytics), under appropriate safeguards.",
          "We may disclose information if required by law or to protect our rights and users.",
        ],
      },
      {
        title: "Your choices",
        accent: "violet",
        bullets: [
          "You can request access, correction, or deletion of your information where applicable.",
          "To make a request, contact us and include enough detail for us to verify and help quickly.",
        ],
      },
    ],
    [],
  );

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

  return (
    <div
      className="w-full relative min-h-screen"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #060810 0%, #080c18 25%, #0a0e1a 55%, #070b14 100%)"
          : "linear-gradient(180deg, #faf8ff 0%, #f3eeff 25%, #ffffff 55%, #f8f4ff 100%)",
        overflowX: "hidden",
      }}
    >
      <WebGLScene key={theme} state={stateRef} isDark={isDark} />
      <Navbar />

      {/* Subtle readable overlay (keep motion light for policy pages) */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: isDark
            ? "radial-gradient(ellipse 60% 50% at 50% 25%, rgba(99,102,241,0.10) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 50% 70%, rgba(236,72,153,0.08) 0%, transparent 60%)"
            : "radial-gradient(ellipse 60% 50% at 50% 25%, rgba(124,58,237,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 50% 70%, rgba(14,165,233,0.06) 0%, transparent 60%)",
        }}
      />

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-24 md:pb-28">
        <section className="text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
            <h1
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(1.9rem, 4.6vw, 3rem)",
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
                backgroundImage: isDark
                  ? "linear-gradient(135deg, #c084fc 0%, #818cf8 40%, #38bdf8 100%)"
                  : "linear-gradient(135deg, #7c3aed 0%, #6366f1 40%, #0ea5e9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "10px",
              }}
            >
              Privacy & data use
            </h1>
            <p
              className="mx-auto"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1rem",
                lineHeight: 1.75,
                color: isDark ? "rgba(255,255,255,0.55)" : "rgba(60,40,100,0.7)",
                maxWidth: "min(720px, 92vw)",
              }}
            >
              This is a short summary of how NexoraXR handles information on this website. If you have questions, reach us via{" "}
              <Link href="/contact" style={{ color: isDark ? "rgba(125,211,252,0.95)" : "rgba(37,99,235,0.92)" }}>
                /contact
              </Link>
              .
            </p>
          </motion.div>
        </section>

        <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          {sections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 + idx * 0.06, ease: "easeOut" }}
            >
              <PolicyCard isDark={isDark} section={section} />
            </motion.div>
          ))}
        </section>

      </main>
    </div>
  );
}

