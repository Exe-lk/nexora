"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

type Review = {
  name: string;
  title: string;
  quote: string;
  rating: number;
};

const REVIEWS: Review[] = [
  {
    name: "Ayesha",
    title: "Birthday group • Colombo",
    quote:
      "It felt like stepping into a living movie. The moment we started moving together, the story became ours.",
    rating: 5,
  },
  {
    name: "Daniel",
    title: "Team outing • 12 people",
    quote:
      "The ‘walking theatre’ format is unreal—no one was left out. We laughed, explored, and came out buzzing.",
    rating: 5,
  },
  {
    name: "Maya",
    title: "First-time VR • Couple",
    quote:
      "I was nervous about VR, but this was smooth and magical. The visuals and sound design were next level.",
    rating: 5,
  },
];

function Star({ filled, color }: { filled: boolean; color: string }) {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 24 24"
      style={{
        display: "block",
        fill: filled ? color : "transparent",
        stroke: filled ? color : "rgba(255,255,255,0.28)",
        strokeWidth: 1.4,
      }}
    >
      <path d="M12 17.3l-6.2 3.5 1.4-7.1L2 8.9l7.2-.9L12 1.6l2.8 6.4 7.2.9-5.2 4.8 1.4 7.1z" />
    </svg>
  );
}

export function ReviewSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const label = isDark ? "rgba(255,255,255,0.35)" : "rgba(100,70,20,0.75)";
  const heading = isDark ? "#ffffff" : "#1a0a2e";
  const body = isDark ? "rgba(255,255,255,0.55)" : "rgba(60,40,100,0.65)";

  const gold = isDark ? "#D4A574" : "#B8860B";
  const border = isDark ? "rgba(212,165,116,0.18)" : "rgba(201,147,62,0.18)";
  const panelBg = isDark
    ? "linear-gradient(160deg, rgba(12,10,24,0.72) 0%, rgba(8,6,18,0.52) 100%)"
    : "linear-gradient(160deg, rgba(255,255,255,0.94) 0%, rgba(250,248,255,0.86) 100%)";

  return (
    <section className="py-14 md:py-20 px-4 sm:px-6 md:px-8 relative">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <div
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: label,
            }}
          >
            Feedback loop
          </div>
          <h2
            className="mt-3"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(22px, 4vw, 36px)",
              fontWeight: 800,
              lineHeight: 1.2,
              color: heading,
            }}
          >
            Loved by first-time explorers
            <br />
            and XR veterans alike
          </h2>
          <p
            className="mx-auto mt-4"
            style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: "14px",
              lineHeight: 1.8,
              color: body,
              maxWidth: "640px",
            }}
          >
            A few words from people who stepped into NexoraXR worlds and walked out
            with real memories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {REVIEWS.map((r, idx) => (
            <motion.div
              key={r.name}
              className="rounded-3xl p-6 md:p-7 backdrop-blur-xl relative overflow-hidden"
              style={{
                background: panelBg,
                border: `1px solid ${border}`,
                boxShadow: isDark
                  ? "0 18px 60px rgba(0,0,0,0.35)"
                  : "0 16px 50px rgba(201,147,62,0.10)",
              }}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, delay: idx * 0.05, ease: "easeOut" }}
              whileHover={{ y: -6 }}
            >
              <div
                aria-hidden
                className="absolute -top-24 -right-24 h-52 w-52 rounded-full"
                style={{
                  background: isDark
                    ? "radial-gradient(circle at 30% 30%, rgba(212,165,116,0.18), transparent 60%)"
                    : "radial-gradient(circle at 30% 30%, rgba(201,147,62,0.16), transparent 60%)",
                }}
              />

              <div className="flex items-center justify-between gap-4">
                <div
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: isDark ? "rgba(230,185,115,0.85)" : "rgba(168,120,10,0.85)",
                  }}
                >
                  Verified guest
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} filled={i < r.rating} color={gold} />
                  ))}
                </div>
              </div>

              <p
                className="mt-4"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.95rem",
                  lineHeight: 1.75,
                  color: isDark ? "rgba(255,255,255,0.62)" : "rgba(60,40,100,0.72)",
                }}
              >
                “{r.quote}”
              </p>

              <div className="mt-6 flex items-center justify-between gap-4">
                <div>
                  <div
                    style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: "12px",
                      fontWeight: 800,
                      color: heading,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {r.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Exo 2', sans-serif",
                      fontSize: "11px",
                      letterSpacing: "0.08em",
                      color: label,
                      marginTop: "4px",
                    }}
                  >
                    {r.title}
                  </div>
                </div>

                <div
                  className="h-10 w-10 rounded-2xl shrink-0"
                  aria-hidden
                  style={{
                    backgroundImage: isDark
                      ? "linear-gradient(135deg, rgba(212,165,116,0.55), rgba(201,147,62,0.35))"
                      : "linear-gradient(135deg, rgba(201,147,62,0.65), rgba(212,165,116,0.45))",
                    boxShadow: isDark
                      ? "0 12px 32px rgba(212,165,116,0.10)"
                      : "0 12px 32px rgba(201,147,62,0.12)",
                    opacity: 0.95,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

