 "use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Worlds", href: "/story/heaven" },
  { label: "Occasions", href: "/occasions" },
  { label: "Pricing", href: "/book-now" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQs", href: "/faq" },
];

const socialLinks = [
  { id: "x", label: "X (Twitter)", href: "#" },
  { id: "instagram", label: "Instagram", href: "#" },
  { id: "tiktok", label: "TikTok", href: "#" },
  { id: "linkedin", label: "LinkedIn", href: "#" },
];

export function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Slightly translucent shell so the global 3D background can subtly shine through
  const shellOverlayBg = isDark
    ? "linear-gradient(180deg, rgba(4,6,16,0.65) 0%, rgba(6,10,24,0.78) 40%, rgba(4,6,16,0.9) 100%)"
    : "linear-gradient(180deg, rgba(246,241,255,0.55) 0%, rgba(242,236,255,0.7) 45%, rgba(255,255,255,0.9) 100%)";

  const cardBg = isDark
    ? "linear-gradient(150deg, rgba(15,12,28,0.9) 0%, rgba(10,8,20,0.85) 100%)"
    : "linear-gradient(150deg, rgba(255,255,255,0.98) 0%, rgba(248,246,255,0.96) 100%)";

  const borderColor = isDark ? "rgba(148,163,184,0.28)" : "rgba(130,90,220,0.25)";
  const glowOuter = isDark ? "0 32px 80px rgba(0,0,0,0.8)" : "0 26px 70px rgba(130,90,220,0.22)";
  const glowInner = isDark ? "0 0 0 1px rgba(99,102,241,0.35)" : "0 0 0 1px rgba(129,140,248,0.3)";

  const labelColor = isDark ? "rgba(148,163,184,0.85)" : "rgba(88,28,135,0.9)";
  const textSoft = isDark ? "rgba(148,163,184,0.7)" : "rgba(76,29,149,0.72)";

  return (
    <footer
      className="relative w-full"
      style={{
        // Keep border framing but let the interactive 3D canvas behind the page remain visible
        background: "transparent",
        borderTop: isDark ? "1px solid rgba(15,23,42,0.9)" : "1px solid rgba(148,163,184,0.3)",
      }}
    >
      {/* translucent shell overlay so 3D background shows through while preserving readability */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: shellOverlayBg,
        }}
      />

      {/* subtle glow blob behind card */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 h-56"
        style={{
          background: isDark
            ? "radial-gradient(circle at 50% 0%, rgba(96,165,250,0.25) 0%, transparent 65%)"
            : "radial-gradient(circle at 50% 0%, rgba(129,140,248,0.25) 0%, transparent 65%)",
          opacity: 0.7,
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-12 md:pt-20 md:pb-16">
        {/* top band - logo, tagline, CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="rounded-3xl px-5 sm:px-8 py-7 sm:py-8 mb-8 md:mb-10 relative overflow-hidden"
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            boxShadow: `${glowOuter}, ${glowInner}`,
            backdropFilter: "blur(22px)",
          }}
        >
          {/* animated accent strip */}
          <motion.div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(56,189,248,0.14), rgba(236,72,153,0.18))",
              mixBlendMode: isDark ? "screen" : "multiply",
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2">
                <Image
                  src={isDark ? "/dark%20logo.png" : "/light%20logo.png"}
                  alt="NexoraXR logo"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <span
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "0.8rem",
                    letterSpacing: "0.26em",
                    textTransform: "uppercase",
                    color: labelColor,
                  }}
                >
                  NexoraXR
                </span>
              </div>

              <h2
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "clamp(1.4rem, 2.6vw, 2rem)",
                  fontWeight: 800,
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  backgroundImage: isDark
                    ? "linear-gradient(135deg, #c084fc 0%, #818cf8 40%, #38bdf8 100%)"
                    : "linear-gradient(135deg, #7c3aed 0%, #6366f1 40%, #0ea5e9 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Walk the story, live the world.
              </h2>

              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.95rem",
                  lineHeight: 1.7,
                  color: textSoft,
                }}
              >
                XR walking-theatre style experiences and VR worlds that move with you. No seats, no passive
                watching – just you, your crew and a story you can physically step into.
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="shrink-0"
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#0b1020",
                  backgroundImage: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
                  boxShadow: "0 8px 26px rgba(168,85,247,0.5)",
                }}
              >
                Contact us
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* middle quick links - single strip */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 md:mb-10"
        >
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3"
          >
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="inline-flex items-center gap-2 text-sm"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: isDark ? "rgba(226,232,240,0.85)" : "rgba(55,48,163,0.95)",
                }}
              >
                <span
                  className="h-[1px] w-4 rounded-full"
                  style={{
                    backgroundImage: isDark
                      ? "linear-gradient(to right, rgba(148,163,184,0.2), rgba(148,163,184,0.7))"
                      : "linear-gradient(to right, rgba(129,140,248,0.4), rgba(56,189,248,0.8))",
                  }}
                />
                <span className="tracking-[0.14em] hover:translate-x-0.5 transition-transform duration-150">
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
        </motion.div>

        {/* bottom strip - social icons + legal links */}
        <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-center md:justify-start gap-3">
            {socialLinks.map((s) => (
              <Link
                key={s.id}
                href={s.href}
                aria-label={s.label}
                className="h-11 w-11 rounded-full flex items-center justify-center transition-transform duration-150 hover:-translate-y-0.5"
                style={{
                  border: isDark ? "1px solid rgba(148,163,184,0.45)" : "1px solid rgba(148,163,184,0.7)",
                  background: isDark
                    ? "radial-gradient(circle at 30% 0%, rgba(148,163,184,0.2), rgba(15,23,42,0.9))"
                    : "radial-gradient(circle at 30% 0%, rgba(191,219,254,0.8), rgba(255,255,255,0.95))",
                  boxShadow: isDark
                    ? "0 6px 14px rgba(15,23,42,0.9)"
                    : "0 6px 14px rgba(129,140,248,0.45)",
                }}
              >
                {/* simple brand-style icons */}
                {s.id === "x" && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    style={{
                      fill: "none",
                      stroke: isDark ? "#e5e7eb" : "#1f2933",
                      strokeWidth: 1.7,
                    }}
                  >
                    <path d="M4 4l16 16M20 4L4 20" />
                  </svg>
                )}
                {s.id === "instagram" && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    style={{
                      fill: "none",
                      stroke: isDark ? "#e5e7eb" : "#1f2933",
                      strokeWidth: 1.5,
                    }}
                  >
                    <rect x="4" y="4" width="16" height="16" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17" cy="7" r="0.8" />
                  </svg>
                )}
                {s.id === "tiktok" && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    style={{
                      fill: "none",
                      stroke: isDark ? "#e5e7eb" : "#1f2933",
                      strokeWidth: 1.6,
                    }}
                  >
                    <path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5" />
                    <path d="M14 6.5c.7 1 1.9 2 3.5 2" />
                  </svg>
                )}
                {s.id === "linkedin" && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    style={{
                      fill: "none",
                      stroke: isDark ? "#e5e7eb" : "#1f2933",
                      strokeWidth: 1.6,
                    }}
                  >
                    <path d="M6 9h3v9H6zM9 7.3A1.7 1.7 0 1 1 5.6 7.3 1.7 1.7 0 0 1 9 7.3" />
                    <path d="M13 9h2.5A3.5 3.5 0 0 1 19 12.5V18h-3v-5c0-.8-.7-1.5-1.5-1.5S13 12.2 13 13v5h-3V9z" />
                  </svg>
                )}
              </Link>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] tracking-[0.18em] uppercase">
            <span
              style={{
                fontFamily: "'Exo 2', sans-serif",
                color: isDark ? "rgba(148,163,184,0.7)" : "rgba(88,28,135,0.8)",
              }}
            >
              © {new Date().getFullYear()} NexoraXR. All rights reserved.
            </span>

            <div className="flex items-center gap-3">
              <Link
                href="/privacy"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: isDark ? "rgba(148,163,184,0.8)" : "rgba(88,28,135,0.85)",
                }}
              >
                Privacy
              </Link>
              <span
                aria-hidden
                style={{
                  width: 1,
                  height: 12,
                  backgroundColor: isDark ? "rgba(148,163,184,0.4)" : "rgba(148,163,184,0.7)",
                }}
              />
              <Link
                href="/privacy#terms"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: isDark ? "rgba(148,163,184,0.8)" : "rgba(88,28,135,0.85)",
                }}
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

