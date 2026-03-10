"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { FloatingNav } from "@/components/HUDOverlay";
import { useTheme } from "@/contexts/ThemeContext";
import { FAQ_CATEGORIES } from "./faqData";
import { FAQAccordion } from "@/components/FAQAccordion";
import { WebGLScene } from "@/components/WebGLScene";

type CategoryId = (typeof FAQ_CATEGORIES)[number]["id"] | "all";

export default function FAQPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const reduceMotion = useReducedMotion();

  const stateRef = useRef({ scrollY: 0, mouseX: 0, mouseY: 0 });

  useEffect(() => {
    const onScroll = () => {
      const raw = window.scrollY;
      const cap = window.innerHeight * 1.5;
      stateRef.current.scrollY = Math.min(raw, cap);
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

  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [query, setQuery] = useState("");

  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

  const bg = isDark
    ? "linear-gradient(180deg, #060810 0%, #080c18 20%, #0a0e1a 40%, #070b14 60%, #080c18 80%, #050810 100%)"
    : "linear-gradient(180deg, #faf8ff 0%, #f3eeff 20%, #ffffff 40%, #f8f4ff 60%, #f3eeff 80%, #faf8ff 100%)";

  const categories = useMemo(() => {
    const q = query.trim().toLowerCase();

    return FAQ_CATEGORIES.map((c) => {
      const items = c.items
        .filter((it) => {
          if (!q) return true;
          const inQ = it.q.toLowerCase().includes(q);
          const inBullets = it.bullets.some((b) => b.toLowerCase().includes(q));
          const inTags = (it.tags || []).some((t) => t.toLowerCase().includes(q));
          return inQ || inBullets || inTags;
        })
        .map((it) => ({
          id: it.id,
          question: it.q,
          bullets: it.bullets,
          tags: it.tags,
        }));

      return { ...c, items };
    })
      .filter((c) => (activeCategory === "all" ? true : c.id === activeCategory))
      .filter((c) => c.items.length > 0);
  }, [activeCategory, query]);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const heroAccent = isDark
    ? "linear-gradient(135deg,#6b8ef0 0%,#a07de8 30%,#e06aac 65%,#5ec4e0 100%)"
    : "linear-gradient(135deg,#4a6fd8 0%,#7b52c4 30%,#c44a8f 65%,#e06aac 100%)";

  const searchBg = isDark ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.86)";
  const searchBorder = isDark ? "1px solid rgba(148,163,184,0.35)" : "1px solid rgba(130,90,220,0.22)";
  const searchText = isDark ? "rgba(255,255,255,0.85)" : "rgba(60,30,120,0.9)";
  const searchPlaceholder = isDark ? "rgba(255,255,255,0.35)" : "rgba(60,40,100,0.45)";

  const chipBase = {
    fontFamily: "'Exo 2', sans-serif",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.06em",
  } as const;

  return (
    <div className="w-full min-h-screen relative" style={{ background: bg, overflowX: "hidden" }}>
      <WebGLScene key={theme} state={stateRef} isDark={isDark} />
      <Navbar />

      {/* Dark scanlines + vignette like home/pricing */}
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
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 50%, rgba(3,4,8,0.5) 100%)",
            }}
          />
        </>
      )}

      <main className="relative z-10 max-w-6xl mx-auto px-4 pt-28 md:pt-32 pb-24 md:pb-32">
        {/* Hero */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-semibold tracking-[0.24em] uppercase mb-6"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              borderColor: isDark ? "rgba(168,85,247,0.28)" : "rgba(124,58,237,0.22)",
              background: isDark ? "rgba(168,85,247,0.10)" : "rgba(124,58,237,0.10)",
              color: isDark ? "rgba(216,180,254,0.92)" : "rgba(109,40,217,0.9)",
            }}
          >
            Quick answers, zero noise
          </div>

          <h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-5 bg-clip-text text-transparent"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              backgroundImage: heroAccent,
            }}
          >
            FAQ
          </h1>

          <p
            className="text-sm md:text-base max-w-2xl mx-auto"
            style={{
              fontFamily: "'Exo 2', sans-serif",
              color: isDark ? "rgba(255,255,255,0.55)" : "rgba(60,40,100,0.65)",
              lineHeight: 1.8,
            }}
          >
            Everything you need to know—short, scannable, and event-ready.
          </p>
        </motion.div>

        {/* Search + category pills */}
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="mt-10 md:mt-12"
        >
          <div className="grid gap-4 items-center">
            <div
              className="rounded-2xl px-4 py-3"
              style={{
                background: searchBg,
                border: searchBorder,
                boxShadow: isDark ? "0 20px 70px rgba(0,0,0,0.35)" : "0 18px 60px rgba(124,58,237,0.08)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
              }}
            >
              <div className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
                    stroke={isDark ? "rgba(255,255,255,0.6)" : "rgba(60,30,120,0.7)"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search: booking, age, motion sickness…"
                  className="w-full bg-transparent outline-none text-sm"
                  style={{
                    fontFamily: "'Exo 2', sans-serif",
                    color: searchText,
                  }}
                />
              </div>
              <style jsx>{`
                input::placeholder {
                  color: ${searchPlaceholder};
                }
              `}</style>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5 justify-center">
            <CategoryPill id="all" label="All" active={activeCategory === "all"} isDark={isDark} onClick={() => setActiveCategory("all")} />
            <CategoryPill id="about" label="About" active={activeCategory === "about"} isDark={isDark} onClick={() => setActiveCategory("about")} />
            <CategoryPill id="who" label="Who" active={activeCategory === "who"} isDark={isDark} onClick={() => setActiveCategory("who")} />
            <CategoryPill
              id="experiences"
              label="Experiences"
              active={activeCategory === "experiences"}
              isDark={isDark}
              onClick={() => setActiveCategory("experiences")}
            />
            <CategoryPill
              id="booking_pricing"
              label="Booking & Pricing"
              active={activeCategory === "booking_pricing"}
              isDark={isDark}
              onClick={() => setActiveCategory("booking_pricing")}
            />
            <CategoryPill id="safety" label="Safety" active={activeCategory === "safety"} isDark={isDark} onClick={() => setActiveCategory("safety")} />
            <CategoryPill id="events" label="Events" active={activeCategory === "events"} isDark={isDark} onClick={() => setActiveCategory("events")} />
          </div>
        </motion.section>

        {/* Categories */}
        <section className="mt-12 md:mt-14 space-y-12">
          {categories.map((c, idx) => {
            const anyClosed = c.items.some((it) => !openIds.has(it.id));
            const anyOpen = c.items.some((it) => openIds.has(it.id));

            return (
              <motion.div
                key={c.id}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 * idx, ease: "easeOut" }}
                className="relative"
              >
                <div className="mb-6">
                  <div
                    className="tracking-[0.28em] uppercase text-[10px] mb-2"
                    style={{
                      fontFamily: "'Orbitron', sans-serif",
                      color: isDark ? `${c.accentSoft}0.78)` : `${c.accentSoft}0.95)`,
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    className="text-sm md:text-base"
                    style={{
                      fontFamily: "'Exo 2', sans-serif",
                      color: isDark ? "rgba(255,255,255,0.5)" : "rgba(60,40,100,0.65)",
                    }}
                  >
                    {c.subtitle}
                  </div>
                </div>

                <FAQAccordion
                  items={c.items}
                  openIds={openIds}
                  onToggle={toggle}
                  isDark={isDark}
                  accentGradient={c.accentGradient}
                  accentSoft={c.accentSoft}
                />
              </motion.div>
            );
          })}

          {categories.length === 0 && (
            <div
              className="rounded-3xl p-8 text-center"
              style={{
                background: isDark ? "rgba(15,23,42,0.5)" : "rgba(255,255,255,0.85)",
                border: isDark ? "1px solid rgba(148,163,184,0.25)" : "1px solid rgba(130,90,220,0.18)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
              }}
            >
              <div
                className="text-lg font-semibold"
                style={{ fontFamily: "'Orbitron', sans-serif", color: isDark ? "#fff" : "#1a0a2e" }}
              >
                No matches
              </div>
              <div
                className="mt-2 text-sm"
                style={{ fontFamily: "'Exo 2', sans-serif", color: isDark ? "rgba(255,255,255,0.55)" : "rgba(60,40,100,0.65)" }}
              >
                Try a different keyword.
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function CategoryPill({
  label,
  active,
  isDark,
  onClick,
}: {
  id: string;
  label: string;
  active: boolean;
  isDark: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2.5 rounded-full transition-all duration-300"
      style={{
        fontFamily: "'Exo 2', sans-serif",
        fontSize: "12px",
        fontWeight: 800,
        letterSpacing: "0.06em",
        color: active
          ? isDark
            ? "#0b1222"
            : "#ffffff"
          : isDark
            ? "rgba(209,213,219,0.85)"
            : "rgba(60,40,100,0.85)",
        background: active
          ? isDark
            ? "linear-gradient(135deg, rgba(120,180,255,0.92), rgba(168,85,247,0.9))"
            : "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(236,72,153,0.92))"
          : isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(255,255,255,0.78)",
        border: active
          ? "1px solid rgba(255,255,255,0.0)"
          : isDark
            ? "1px solid rgba(255,255,255,0.10)"
            : "1px solid rgba(130,90,220,0.16)",
        boxShadow: active
          ? isDark
            ? "0 18px 50px rgba(120,180,255,0.18)"
            : "0 18px 50px rgba(124,58,237,0.14)"
          : "none",
      }}
    >
      {label}
    </button>
  );
}

