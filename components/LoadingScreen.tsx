"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── constants ────────────────────────────────────────────────────────────────
const GLITCH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%<>[]{}ΨΩΔΛΣΞφ⊕⊗◈⊘⟡∇∆".split("");

// Brand-gradient colours per letter — matches the logo's cyan→purple→pink
const NEXORA_CLR = ["#22d3ee", "#6b8ef0", "#818cf8", "#a855f7", "#e879f9", "#ec4899"];
const XR_CLR     = ["#f472b6", "#fb7185"];
const PART_CLR   = ["#6b8ef0","#a07de8","#e06aac","#5ec4e0","#7c3aed","#ec4899"];

const STATUSES = [
  "BOOT SEQUENCE INITIATED",
  "XR CORE LOADED",
  "SPATIAL SYSTEMS ONLINE",
  "PORTAL READY",
] as const;

const BOOT_LINES = [
  "> KERNEL_INIT ............... [OK]",
  "> XR_CORE_LOAD .............. [OK]",
  "> HAPTIC_FEEDBACK ........... [OK]",
  "> SPATIAL_AUDIO ............. [OK]",
  "> PORTAL_GATEWAY ............ [READY]",
];

// ─── helpers ──────────────────────────────────────────────────────────────────
function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }

// ─── letter-scramble hook (SSR-safe) ─────────────────────────────────────────
function useLetterReveal(target: string[], startMs: number, gapMs = 130) {
  // Start with plain dashes — same on server & first client render → no hydration mismatch
  const [chars,  setChars]  = useState<string[]>(target.map(() => "─"));
  const [locked, setLocked] = useState<boolean[]>(target.map(() => false));
  const lockedRef = useRef<boolean[]>(target.map(() => false));

  useEffect(() => {
    // Scramble every 50 ms
    const iv = setInterval(() => {
      setChars(target.map((c, i) =>
        lockedRef.current[i] || c === " " ? c
          : GLITCH[Math.floor(Math.random() * GLITCH.length)]
      ));
    }, 50);

    // Lock each letter in sequence
    const timers = target.map((_, i) =>
      setTimeout(() => {
        lockedRef.current[i] = true;
        setLocked(prev => prev.map((v, j) => (j === i ? true : v)));
      }, startMs + i * gapMs)
    );

    // Stop scrambling 500 ms after last lock
    const stop = setTimeout(() => clearInterval(iv), startMs + target.length * gapMs + 500);

    return () => {
      clearInterval(iv);
      timers.forEach(clearTimeout);
      clearTimeout(stop);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { chars, locked };
}

// ─── main component ───────────────────────────────────────────────────────────
export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [mounted,    setMounted]    = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [statusIdx,  setStatusIdx]  = useState(0);
  const [bootCount,  setBootCount]  = useState(0);
  const [visible,    setVisible]    = useState(true);

  // NEXORA: scramble starts at 650 ms, 125 ms between letters
  const nexora = useLetterReveal("NEXORA".split(""), 650, 125);
  // XR: starts after NEXORA finishes (~650+6*125 = 1400 ms), 220 ms gap
  const xr     = useLetterReveal("XR".split(""), 1480, 220);

  // Client-only particles
  const particles = useMemo(() => {
    if (!mounted) return [];
    return Array.from({ length: 26 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: Math.random() * 3 + 1.5,
      dur: Math.random() * 4 + 3,
      del: Math.random() * 2.5,
      drift: Math.random() * 22 - 11,
      color: PART_CLR[Math.floor(Math.random() * PART_CLR.length)],
    }));
  }, [mounted]);

  // Static ring-dot angles (no Math.random — safe for hydration)
  const ring3Dots = [0, 72, 144, 216, 288];
  const ring2Dots = [0, 60, 120, 180, 240, 300].map(d => ({ d, big: d % 120 === 0 }));

  useEffect(() => {
    setMounted(true);
    const TOTAL = 3400;
    const start = Date.now();
    const tick = () => {
      const t = Math.min((Date.now() - start) / TOTAL, 1);
      setProgress(Math.round(easeOutCubic(t) * 100));
      if (t < 1) requestAnimationFrame(tick);
      else setTimeout(() => setTimeout(() => { setVisible(false); onComplete(); }, 700), 250);
    };
    requestAnimationFrame(tick);

    const s1 = setTimeout(() => setStatusIdx(1), 850);
    const s2 = setTimeout(() => setStatusIdx(2), 1700);
    const s3 = setTimeout(() => setStatusIdx(3), 2600);

    // Boot log lines drip in
    BOOT_LINES.forEach((_, i) => setTimeout(() => setBootCount(i + 1), 350 + i * 520));

    return () => { clearTimeout(s1); clearTimeout(s2); clearTimeout(s3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="nexora-loader"
          className="fixed inset-0 select-none"
          style={{ zIndex: 99999, overflow: "hidden", background: "#03050d" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* ── grid ── */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage:
              "linear-gradient(rgba(99,120,255,0.06) 1px,transparent 1px)," +
              "linear-gradient(90deg,rgba(99,120,255,0.06) 1px,transparent 1px)",
            backgroundSize: "70px 70px",
          }} />

          {/* ── vignette ── */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 48%,transparent 28%,rgba(3,5,13,0.9) 100%)",
          }} />

          {/* ── ambient glow ── */}
          <div className="absolute pointer-events-none rounded-full" style={{
            width: 680, height: 680,
            top: "50%", left: "50%", transform: "translate(-50%,-58%)",
            background:
              "radial-gradient(circle,rgba(99,102,241,0.15) 0%,rgba(168,85,247,0.07) 40%,transparent 70%)",
          }} />

          {/* ═══ TOP HUD BAR ═══ */}
          <motion.div
            className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3 pointer-events-none"
            style={{ borderBottom: "1px solid rgba(99,102,241,0.14)" }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.55 }}
          >
            <span style={{
              fontFamily: "'Orbitron', sans-serif", fontSize: "0.58rem",
              letterSpacing: "0.28em", color: "rgba(130,100,230,0.7)",
            }}>
              ◢&nbsp;NEXORA XR&nbsp;
              <span style={{ color: "rgba(100,80,160,0.4)", marginLeft: 6 }}>v2.1.0</span>
            </span>

            <div className="flex items-center gap-2">
              <motion.div
                className="rounded-full"
                style={{ width: 6, height: 6, background: "#22d3ee", boxShadow: "0 0 8px #22d3ee" }}
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              />
              <span style={{
                fontFamily: "'Orbitron', sans-serif", fontSize: "0.58rem",
                letterSpacing: "0.28em", color: "rgba(130,100,230,0.7)",
              }}>HEADSET LINKED&nbsp;◣</span>
            </div>
          </motion.div>

          {/* ── particles ── */}
          {mounted && particles.map(p => (
            <motion.div key={p.id}
              className="absolute rounded-full pointer-events-none"
              style={{ width: p.s, height: p.s, left: `${p.x}%`, top: `${p.y}%`, backgroundColor: p.color, boxShadow: `0 0 ${p.s * 4}px ${p.color}88` }}
              animate={{ opacity: [0.12, 0.6, 0.12], scale: [1, 1.6, 1], y: [0, p.drift, 0] }}
              transition={{ duration: p.dur, delay: p.del, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}

          {/* ── scan line ── */}
          <motion.div className="absolute inset-x-0 pointer-events-none" style={{
            height: 1,
            background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.35),rgba(168,85,247,0.9),rgba(99,102,241,0.35),transparent)",
            boxShadow: "0 0 16px rgba(168,85,247,0.5)",
          }} animate={{ top: ["0%", "100%"] }}
             transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 0.3 }} />

          {/* ═══════════════ CENTRE STAGE ═══════════════ */}
          <div className="absolute inset-0 flex flex-col items-center justify-center"
               style={{ gap: 0, paddingBottom: 90, paddingTop: 48 }}>

            {/* Ring container */}
            <div className="relative flex items-center justify-center"
                 style={{ width: 480, height: 480, flexShrink: 0 }}>

              {/* Ring 3 — outer, slow CW */}
              <motion.div className="absolute rounded-full" style={{
                width: 480, height: 480,
                border: "1px solid rgba(99,102,241,0.2)",
                boxShadow: "0 0 35px rgba(99,102,241,0.06)",
                top: 0, left: 0,
              }} initial={{ opacity: 0, scale: 0.55 }} animate={{ opacity: 1, scale: 1, rotate: 360 }}
                 transition={{ opacity: { delay: 0.6, duration: 0.9 }, scale: { delay: 0.6, duration: 0.9, type: "spring", stiffness: 80 }, rotate: { duration: 40, repeat: Infinity, ease: "linear" } }}>
                {ring3Dots.map(deg => (
                  <div key={deg} className="absolute rounded-full" style={{
                    width: 5, height: 5, background: "rgba(99,102,241,0.5)", boxShadow: "0 0 8px rgba(99,102,241,0.7)",
                    top: "50%", left: "50%", transform: `rotate(${deg}deg) translateX(240px) translate(-50%,-50%)`,
                  }} />
                ))}
              </motion.div>

              {/* Ring 2 — middle, CCW, dashed */}
              <motion.div className="absolute rounded-full" style={{
                width: 340, height: 340,
                border: "1.5px dashed rgba(168,85,247,0.32)",
                boxShadow: "0 0 50px rgba(168,85,247,0.1),inset 0 0 50px rgba(168,85,247,0.05)",
                top: 70, left: 70,
              }} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1, rotate: -360 }}
                 transition={{ opacity: { delay: 0.38, duration: 0.9 }, scale: { delay: 0.38, duration: 0.9, type: "spring", stiffness: 95 }, rotate: { duration: 25, repeat: Infinity, ease: "linear" } }}>
                {ring2Dots.map(({ d, big }) => (
                  <motion.div key={d} className="absolute rounded-full" style={{
                    width: big ? 9 : 5, height: big ? 9 : 5,
                    background: big ? "linear-gradient(135deg,#a855f7,#6366f1)" : "rgba(168,85,247,0.65)",
                    boxShadow: `0 0 ${big ? 14 : 7}px rgba(168,85,247,0.9)`,
                    top: "50%", left: "50%", transform: `rotate(${d}deg) translateX(170px) translate(-50%,-50%)`,
                  }} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, delay: d / 360, repeat: Infinity }} />
                ))}
              </motion.div>

              {/* Ring 1 — inner, fast CW */}
              <motion.div className="absolute rounded-full" style={{
                width: 210, height: 210,
                border: "2px solid rgba(236,72,153,0.28)",
                boxShadow: "0 0 70px rgba(236,72,153,0.16),inset 0 0 70px rgba(236,72,153,0.07)",
                top: 135, left: 135,
              }} initial={{ opacity: 0, scale: 0.25 }} animate={{ opacity: 1, scale: 1, rotate: 360 }}
                 transition={{ opacity: { delay: 0.18, duration: 0.6 }, scale: { delay: 0.18, duration: 0.6, type: "spring", stiffness: 145 }, rotate: { duration: 12, repeat: Infinity, ease: "linear" } }}>
                {/* Comet dot on ring 1 */}
                <div className="absolute rounded-full" style={{
                  width: 9, height: 9, background: "linear-gradient(135deg,#ec4899,#a855f7)",
                  boxShadow: "0 0 18px rgba(236,72,153,1)", top: "50%", left: "50%",
                  transform: "translateX(105px) translate(-50%,-50%)",
                }} />
              </motion.div>

              {/* Core breathing glow */}
              <motion.div className="absolute rounded-full pointer-events-none" style={{
                width: 150, height: 150, top: 165, left: 165,
                background: "radial-gradient(circle,rgba(139,92,246,0.28) 0%,rgba(99,102,241,0.12) 50%,transparent 70%)",
              }} animate={{ scale: [1, 1.3, 1], opacity: [0.55, 1, 0.55] }}
                 transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }} />
            </div>

            {/* ── Text block below rings ── */}
            <div className="flex flex-col items-center" style={{ marginTop: -8, gap: 6 }}>

              {/* EXORA row — scramble (uses NEXORA hook, skip index 0 which is N) */}
              <motion.div
                className="flex"
                style={{ gap: "0.12em" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.3 }}
              >
                {"NEXORA".split("").map((target, i) => {
                  const isLocked = nexora.locked[i];
                  const display  = isLocked ? target : nexora.chars[i];
                  return (
                    <motion.span
                      key={i}
                      animate={isLocked ? { scale: [1.35, 1] } : {}}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        fontSize: "clamp(22px,3vw,34px)",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        color: isLocked ? NEXORA_CLR[i] : "rgba(90,110,180,0.28)",
                        textShadow: isLocked
                          ? `0 0 18px ${NEXORA_CLR[i]}, 0 0 36px ${NEXORA_CLR[i]}88`
                          : "none",
                        display: "inline-block",
                        minWidth: "0.65em",
                        textAlign: "center",
                        transition: "color 0.12s, text-shadow 0.2s",
                      }}
                    >{display}</motion.span>
                  );
                })}
              </motion.div>

              {/* XR row */}
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.35, duration: 0.3 }}
              >
                {/* Decorative line before XR */}
                <motion.div style={{
                  width: 32, height: 1,
                  background: "linear-gradient(90deg,transparent,rgba(244,114,182,0.5))",
                }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                   transition={{ delay: 1.5, duration: 0.5 }} />

                {"XR".split("").map((target, i) => {
                  const isLocked = xr.locked[i];
                  const display  = isLocked ? target : xr.chars[i];
                  return (
                    <motion.span
                      key={i}
                      animate={isLocked ? { scale: [1.4, 1] } : {}}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        fontSize: "clamp(14px,2vw,20px)",
                        fontWeight: 700,
                        letterSpacing: "0.35em",
                        color: isLocked ? XR_CLR[i] : "rgba(90,110,180,0.22)",
                        textShadow: isLocked
                          ? `0 0 14px ${XR_CLR[i]}, 0 0 28px ${XR_CLR[i]}88`
                          : "none",
                        display: "inline-block",
                        minWidth: "0.65em",
                        textAlign: "center",
                        transition: "color 0.12s, text-shadow 0.2s",
                      }}
                    >{display}</motion.span>
                  );
                })}

                {/* Decorative line after XR */}
                <motion.div style={{
                  width: 32, height: 1,
                  background: "linear-gradient(90deg,rgba(251,113,133,0.5),transparent)",
                }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                   transition={{ delay: 1.5, duration: 0.5 }} />
              </motion.div>

              {/* Tagline */}
              <motion.p
                style={{
                  fontFamily: "'Orbitron', sans-serif", fontSize: "0.52rem",
                  letterSpacing: "0.45em", color: "rgba(140,110,220,0.45)",
                  marginTop: 6, textTransform: "uppercase",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.1, duration: 0.8 }}
              >
                Immersive XR / VR Experiences
              </motion.p>
            </div>
          </div>

          {/* ═══ BOOT LOG (bottom-left) ═══ */}
          <div className="absolute pointer-events-none" style={{ left: 32, bottom: 90 }}>
            {BOOT_LINES.slice(0, bootCount).map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
                style={{
                  fontFamily: "monospace", fontSize: "0.58rem",
                  color: line.includes("READY")
                    ? "rgba(34,211,238,0.8)"
                    : "rgba(110,90,180,0.55)",
                  letterSpacing: "0.05em", marginBottom: 2,
                  textShadow: line.includes("READY") ? "0 0 10px rgba(34,211,238,0.5)" : "none",
                }}
              >{line}</motion.p>
            ))}
          </div>

          {/* ═══ RIGHT HUD STATS ═══ */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ right: 32, bottom: 90 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            {[
              ["RESOLUTION", "4K × 4K"],
              ["REFRESH",    "120 Hz"],
              ["LATENCY",    "3.2 ms"],
              ["FOV",        "220°"],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between gap-6 mb-1.5">
                <span style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "rgba(100,80,170,0.4)", letterSpacing: "0.06em" }}>{label}</span>
                <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.55rem", color: "rgba(130,100,220,0.6)", letterSpacing: "0.1em" }}>{val}</span>
              </div>
            ))}
          </motion.div>

          {/* ═══ PROGRESS BAR ═══ */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ padding: "0 32px 24px" }}>

            {/* status + percentage */}
            <div className="flex justify-between items-center mb-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={statusIdx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontFamily: "'Orbitron', sans-serif", fontSize: "0.58rem",
                    letterSpacing: "0.2em", color: "rgba(140,110,230,0.75)",
                  }}
                >{STATUSES[statusIdx]}</motion.span>
              </AnimatePresence>

              <span style={{
                fontFamily: "'Orbitron', sans-serif", fontSize: "0.72rem", fontWeight: 700,
                backgroundImage: "linear-gradient(135deg,#6b8ef0,#a07de8,#ec4899)",
                WebkitBackgroundClip: "text", backgroundClip: "text",
                WebkitTextFillColor: "transparent", color: "transparent",
              }}>{progress}%</span>
            </div>

            {/* track */}
            <div style={{ width: "100%", height: 2, background: "rgba(99,102,241,0.12)", borderRadius: 1, position: "relative", overflow: "visible" }}>
              <div style={{
                position: "absolute", left: 0, top: 0, height: "100%", width: `${progress}%`,
                backgroundImage: "linear-gradient(90deg,#6366f1,#a855f7,#ec4899)",
                boxShadow: "0 0 10px rgba(168,85,247,0.8)", borderRadius: 1,
                transition: "width 0.05s linear",
              }} />
              <div style={{
                position: "absolute", top: "50%", left: `${progress}%`,
                transform: "translate(-50%,-50%)", width: 7, height: 7,
                background: "#fff", borderRadius: "50%",
                boxShadow: "0 0 14px rgba(255,255,255,0.9),0 0 22px rgba(168,85,247,1)",
                transition: "left 0.05s linear",
              }} />
            </div>

            {/* pips */}
            <div className="flex gap-2 mt-3 justify-center">
              {[0,1,2,3,4].map(i => (
                <div key={i} style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: progress >= (i+1)*20 ? "#a855f7" : "rgba(99,102,241,0.18)",
                  boxShadow: progress >= (i+1)*20 ? "0 0 8px rgba(168,85,247,0.9)" : "none",
                  transition: "all 0.4s ease",
                }} />
              ))}
            </div>
          </div>

          {/* ═══ CORNER BRACKETS ═══ */}
          {(["tl","tr","bl","br"] as const).map(pos => (
            <motion.div key={pos}
              className="absolute pointer-events-none"
              style={{
                top:    pos.startsWith("t") ?  20 : undefined,
                bottom: pos.startsWith("b") ?  20 : undefined,
                left:   pos.endsWith("l")   ?  20 : undefined,
                right:  pos.endsWith("r")   ?  20 : undefined,
                width: 30, height: 30,
                borderTop:    pos.startsWith("t") ? "1.5px solid rgba(99,102,241,0.55)" : undefined,
                borderBottom: pos.startsWith("b") ? "1.5px solid rgba(99,102,241,0.55)" : undefined,
                borderLeft:   pos.endsWith("l")   ? "1.5px solid rgba(99,102,241,0.55)" : undefined,
                borderRight:  pos.endsWith("r")   ? "1.5px solid rgba(99,102,241,0.55)" : undefined,
              }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08, duration: 0.6, type: "spring" }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
