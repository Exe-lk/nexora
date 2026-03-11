"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const quickLinks = [
  { label: "Partner with us", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
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

  const shellOverlayBg = isDark
    ? "linear-gradient(180deg, rgba(4,6,16,0.65) 0%, rgba(6,10,24,0.78) 40%, rgba(4,6,16,0.9) 100%)"
    : "linear-gradient(180deg, rgba(246,241,255,0.55) 0%, rgba(242,236,255,0.7) 45%, rgba(255,255,255,0.9) 100%)";

  const labelColor = isDark ? "rgba(148,163,184,0.85)" : "rgba(88,28,135,0.9)";
  const textSoft = isDark ? "rgba(148,163,184,0.7)" : "rgba(76,29,149,0.72)";
  const linkColor = isDark ? "rgba(226,232,240,0.85)" : "rgba(55,48,163,0.95)";
  const bulletGradient = isDark
    ? "linear-gradient(to right, rgba(148,163,184,0.2), rgba(148,163,184,0.7))"
    : "linear-gradient(to right, rgba(129,140,248,0.4), rgba(56,189,248,0.8))";

  return (
    <footer
      className="relative w-full"
      style={{
        background: "transparent",
        borderTop: isDark ? "1px solid rgba(15,23,42,0.9)" : "1px solid rgba(148,163,184,0.3)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: shellOverlayBg }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-12 pb-0 md:pt-16">
        {/* Main content: left = logo + tagline + social; right = vertical quick links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-start md:items-start justify-between gap-10 md:gap-12 pb-8 md:pb-10"
        >
          {/* Left: logo, tagline, social */}
          <div className="space-y-4 max-w-md">
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
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                color: textSoft,
              }}
            >
              XR Walking Theatre: Walk the Story, Live the Experience!
            </p>
            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map((s) => (
                <Link
                  key={s.id}
                  href={s.href}
                  aria-label={s.label}
                  className="h-10 w-10 rounded-full flex items-center justify-center transition-transform duration-150 hover:-translate-y-0.5"
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
                  {s.id === "x" && (
                    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" style={{ fill: "none", stroke: isDark ? "#e5e7eb" : "#1f2933", strokeWidth: 1.7 }}>
                      <path d="M4 4l16 16M20 4L4 20" />
                    </svg>
                  )}
                  {s.id === "instagram" && (
                    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" style={{ fill: "none", stroke: isDark ? "#e5e7eb" : "#1f2933", strokeWidth: 1.5 }}>
                      <rect x="4" y="4" width="16" height="16" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17" cy="7" r="0.8" />
                    </svg>
                  )}
                  {s.id === "tiktok" && (
                    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" style={{ fill: "none", stroke: isDark ? "#e5e7eb" : "#1f2933", strokeWidth: 1.6 }}>
                      <path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5" />
                      <path d="M14 6.5c.7 1 1.9 2 3.5 2" />
                    </svg>
                  )}
                  {s.id === "linkedin" && (
                    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" style={{ fill: "none", stroke: isDark ? "#e5e7eb" : "#1f2933", strokeWidth: 1.6 }}>
                      <path d="M6 9h3v9H6zM9 7.3A1.7 1.7 0 1 1 5.6 7.3 1.7 1.7 0 0 1 9 7.3" />
                      <path d="M13 9h2.5A3.5 3.5 0 0 1 19 12.5V18h-3v-5c0-.8-.7-1.5-1.5-1.5S13 12.2 13 13v5h-3V9z" />
                    </svg>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Company heading + vertical quick links */}
          <nav aria-label="Footer navigation" className="flex flex-col items-start">
            <span
              className="text-sm font-semibold mb-3"
              style={{
                fontFamily: "'Exo 2', sans-serif",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: labelColor,
              }}
            >
              Company
            </span>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 text-sm transition-colors duration-150 hover:opacity-90"
                    style={{
                      fontFamily: "'Exo 2', sans-serif",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: linkColor,
                    }}
                  >
                    <span
                      className="h-[1px] w-3 rounded-full shrink-0"
                      style={{ background: bulletGradient }}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </motion.div>

        {/* Bottom strip: copyright + legal */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4 px-4 -mx-4 sm:px-0 sm:mx-0 border-t text-[11px] tracking-[0.18em] uppercase"
          style={{
            borderColor: isDark ? "rgba(148,163,184,0.2)" : "rgba(130,90,220,0.2)",
          }}
        >
          <span
            style={{
              fontFamily: "'Exo 2', sans-serif",
              color: isDark ? "rgba(148,163,184,0.7)" : "rgba(88,28,135,0.8)",
            }}
          >
            © 2026 NexoraXR. All rights reserved.
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
              Privacy Policy
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
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
