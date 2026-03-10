"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useMemo } from "react";

export type FAQAccordionItem = {
  id: string;
  question: string;
  bullets: string[];
  tags?: string[];
};

export function FAQAccordion({
  items,
  openIds,
  onToggle,
  isDark,
  accentGradient,
  accentSoft,
}: {
  items: FAQAccordionItem[];
  openIds: Set<string>;
  onToggle: (id: string) => void;
  isDark: boolean;
  accentGradient: string;
  accentSoft: string; // e.g. "rgba(168,85,247,"
}) {
  const reduceMotion = useReducedMotion();
  const baseId = useId();

  const styles = useMemo(() => {
    const cardBg = isDark
      ? "linear-gradient(160deg, rgba(12,10,24,0.70) 0%, rgba(8,6,18,0.52) 100%)"
      : "linear-gradient(160deg, rgba(255,255,255,0.94) 0%, rgba(248,246,255,0.86) 100%)";
    const border = isDark ? `1px solid ${accentSoft}0.14)` : `1px solid ${accentSoft}0.20)`;
    const shadow = isDark
      ? `0 18px 60px rgba(0,0,0,0.35), 0 0 0 1px ${accentSoft}0.05)`
      : `0 16px 50px ${accentSoft}0.08), 0 0 0 1px ${accentSoft}0.07)`;
    const muted = isDark ? "rgba(255,255,255,0.55)" : "rgba(60,40,100,0.65)";
    const strong = isDark ? "#ffffff" : "#1a0a2e";
    return { cardBg, border, shadow, muted, strong };
  }, [accentSoft, isDark]);

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        const contentId = `${baseId}-${item.id}-content`;
        const buttonId = `${baseId}-${item.id}-button`;

        return (
          <motion.div
            key={item.id}
            className="group relative rounded-3xl"
            whileHover={reduceMotion ? undefined : { y: -3, transition: { duration: 0.25 } }}
            style={{
              background: styles.cardBg,
              border: styles.border,
              boxShadow: styles.shadow,
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              overflow: "hidden",
              isolation: "isolate",
            }}
          >
            {/* Hover glow + top accent line */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at 20% 0%, ${accentSoft}0.18), transparent 55%)`,
                }}
              />
              <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ backgroundImage: accentGradient }} />
            </div>

            <button
              id={buttonId}
              type="button"
              className="w-full text-left px-5 md:px-7 py-5 md:py-6 outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-0"
              aria-expanded={isOpen}
              aria-controls={contentId}
              onClick={() => onToggle(item.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div
                    className="tracking-[0.22em] uppercase text-[10px] mb-2"
                    style={{
                      fontFamily: "'Orbitron', sans-serif",
                      color: isDark ? `${accentSoft}0.78)` : `${accentSoft}0.95)`,
                    }}
                  >
                    FAQ
                  </div>

                  <div
                    className="text-base md:text-lg font-semibold leading-snug"
                    style={{
                      fontFamily: "'Orbitron', sans-serif",
                      color: styles.strong,
                      textShadow: isDark ? "0 1px 12px rgba(0,0,0,0.45)" : undefined,
                    }}
                  >
                    {item.question}
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.tags.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-full text-[11px]"
                          style={{
                            fontFamily: "'Exo 2', sans-serif",
                            background: isDark ? "rgba(15,23,42,0.65)" : "rgba(255,255,255,0.75)",
                            border: isDark ? `1px solid ${accentSoft}0.20)` : `1px solid ${accentSoft}0.24)`,
                            color: isDark ? "rgba(209,213,219,0.85)" : "rgba(60,40,100,0.78)",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <motion.div
                  className="shrink-0 mt-1.5 w-10 h-10 rounded-2xl flex items-center justify-center"
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          rotate: isOpen ? 180 : 0,
                        }
                  }
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{
                    background: isDark ? "rgba(255,255,255,0.06)" : "rgba(130,90,220,0.10)",
                    border: isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(130,90,220,0.16)",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M6 9l6 6 6-6"
                      stroke={isDark ? "rgba(255,255,255,0.85)" : "rgba(60,30,120,0.9)"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={contentId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                  animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                  exit={reduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                  transition={reduceMotion ? undefined : { duration: 0.25, ease: "easeOut" }}
                  className="px-5 md:px-7 pb-5 md:pb-6"
                  style={{
                    borderTop: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(130,90,220,0.10)",
                  }}
                >
                  <ul className="mt-4 space-y-2.5">
                    {item.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span
                          className="mt-2 shrink-0 rounded-full"
                          style={{
                            width: 6,
                            height: 6,
                            backgroundImage: accentGradient,
                            boxShadow: `0 0 10px ${accentSoft}0.45)`,
                          }}
                        />
                        <span
                          className="text-[13px] md:text-sm leading-relaxed"
                          style={{
                            fontFamily: "'Exo 2', sans-serif",
                            color: styles.muted,
                          }}
                        >
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

