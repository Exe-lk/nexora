"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

export function HeroPortal() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [windowW, setWindowW] = useState(1200);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const portalY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const portalScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const isDark = theme === "dark";

  useEffect(() => {
    setMounted(true);
    const updateW = () => setWindowW(window.innerWidth);
    updateW();
    window.addEventListener("resize", updateW);
    return () => window.removeEventListener("resize", updateW);
  }, []);

  // Responsive ring sizing: clamp to viewport width so rings never overflow
  const ringBase = Math.min(windowW * 0.72, 620);
  const ring1Size = ringBase;
  const ring2Size = ringBase * (440 / 620);
  const ring3Size = ringBase * (320 / 620);
  const coreSize  = ringBase * (260 / 620);
  const innerSize = ringBase * (100 / 620);
  // Dot orbit radius
  const ring1Orbit = ring1Size / 2;

  const particles = useMemo(() => {
    if (!mounted) return [];
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      w: Math.random() * 5 + 1.5,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: isDark
        ? ["#6b8ef0", "#a07de8", "#e06aac", "#5ec4e0"][Math.floor(Math.random() * 4)]
        : ["#4a6fd8", "#7b52c4", "#c44a8f", "#3d9bc8"][Math.floor(Math.random() * 4)],
      dur: Math.random() * 3 + 2.5,
      del: Math.random() * 3,
    }));
  }, [isDark, mounted]);

  // Theme-aware colors
  const ringBorderColor   = isDark ? "rgba(120,180,255,0.25)"  : "rgba(100,60,200,0.2)";
  const ringShadow        = isDark
    ? "0 0 80px rgba(120,180,255,0.12), inset 0 0 80px rgba(120,180,255,0.06)"
    : "0 0 80px rgba(100,60,200,0.1),  inset 0 0 80px rgba(100,60,200,0.05)";

  const dotGradient = "linear-gradient(135deg, #7b9ef5, #b88ef5)";
  const dotColor    = isDark ? "rgba(168,120,240,0.7)" : "rgba(130,80,220,0.5)";
  const dotShadow   = isDark ? "0 0 18px rgba(140,100,240,0.8)" : "0 0 12px rgba(130,80,220,0.5)";

  const ring2Border = isDark ? "1.5px dashed rgba(96,165,250,0.2)"  : "1.5px dashed rgba(96,100,250,0.18)";
  const ring2Shadow = isDark ? "0 0 100px rgba(96,165,250,0.1)"     : "0 0 100px rgba(96,100,250,0.08)";
  const ring3Border = isDark ? "1px solid rgba(220,100,180,0.15)"   : "1px solid rgba(200,80,180,0.15)";

  const coreGlow  = isDark
    ? "radial-gradient(circle, rgba(120,180,255,0.18) 0%, rgba(99,102,241,0.1) 40%, transparent 70%)"
    : "radial-gradient(circle, rgba(100,60,220,0.12)  0%, rgba(99,102,241,0.07) 40%, transparent 70%)";
  const coreShadow = isDark
    ? "0 0 150px rgba(120,180,255,0.15), 0 0 300px rgba(99,102,241,0.08)"
    : "0 0 150px rgba(100,60,220,0.12),  0 0 300px rgba(99,102,241,0.06)";

  const innerGlow = isDark
    ? "radial-gradient(circle, rgba(236,72,153,0.25) 0%, rgba(168,85,247,0.12) 50%, transparent 70%)"
    : "radial-gradient(circle, rgba(220,60,160,0.2)  0%, rgba(168,85,247,0.1)  50%, transparent 70%)";

  const lightTrail1 = isDark
    ? "linear-gradient(90deg, transparent, rgba(96,165,250,0.4),  rgba(168,85,247,0.2),  transparent)"
    : "linear-gradient(90deg, transparent, rgba(96,100,250,0.3),  rgba(168,85,247,0.18), transparent)";
  const lightTrail2 = isDark
    ? "linear-gradient(90deg, transparent, rgba(236,72,153,0.35), transparent)"
    : "linear-gradient(90deg, transparent, rgba(210,60,160,0.28), transparent)";
  const lightTrail3 = isDark
    ? "linear-gradient(90deg, transparent, rgba(99,102,241,0.3),  transparent)"
    : "linear-gradient(90deg, transparent, rgba(90,90,240,0.22),  transparent)";

  const taglineColor   = isDark ? "#a07de8"              : "#6b3fbf";
  const headingGradient = isDark
    ? "linear-gradient(135deg, #6b8ef0 0%, #a07de8 30%, #e06aac 60%, #5ec4e0 100%)"
    : "linear-gradient(135deg, #4a6fd8 0%, #7b52c4 30%, #c44a8f 60%, #e06aac 100%)";
  const textColor = isDark ? "rgba(255,255,255,0.7)" : "#4a3a70";

  const button1Shadow = isDark
    ? "0 6px 30px rgba(168,85,247,0.45), 0 0 80px rgba(168,85,247,0.15)"
    : "0 6px 30px rgba(168,85,247,0.35), 0 0 80px rgba(168,85,247,0.1)";

  const button2Bg     = isDark ? "rgba(130,90,220,0.15)" : "rgba(255,255,255,0.6)";
  const button2Border = isDark ? "1.5px solid rgba(130,90,220,0.35)" : "1.5px solid rgba(100,60,200,0.3)";
  const button2Color  = isDark ? "#c4a5f0" : "#5a45a0";

  const scrollBorder = isDark ? "1.5px solid rgba(130,90,220,0.4)" : "1.5px solid rgba(100,60,200,0.3)";
  const scrollDot    = isDark ? "rgba(130,90,220,0.7)"             : "rgba(100,60,200,0.5)";
  const scrollText   = isDark ? "rgba(150,120,220,0.5)"            : "rgba(90,50,160,0.45)";

  const gridColor = isDark ? "rgba(120,180,255,0.15)" : "rgba(100,60,200,0.07)";

  const handleExploreClick = () => {
    const target = document.getElementById("discover-worlds");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "transparent" }}
    >
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px),
                            linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          opacity: isDark ? 0.4 : 1,
        }}
      />

      {/* Background particles */}
      {mounted && (
        <motion.div className="absolute inset-0 overflow-hidden" style={{ y: portalY, scale: portalScale }}>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: p.w,
                height: p.w,
                left: `${p.x}%`,
                top: `${p.y}%`,
                backgroundColor: p.color,
                opacity: isDark ? 0.45 : 0.35,
              }}
              animate={{
                opacity: isDark ? [0.3, 0.65, 0.3] : [0.2, 0.5, 0.2],
                scale: [1, 1.8, 1],
                y: [0, -30, 0],
              }}
              transition={{ duration: p.dur, repeat: Infinity, delay: p.del, ease: "easeInOut" }}
            />
          ))}
        </motion.div>
      )}

      {/* Portal rings */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ y: portalY, scale: portalScale }}
      >
        {/* Ring 1 - rotating with dots */}
        <motion.div
          className="relative"
          style={{ width: ring1Size, height: ring1Size }}
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: `2px solid ${ringBorderColor}`, boxShadow: ringShadow }}
          />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <motion.div
              key={deg}
              className="absolute rounded-full"
              style={{
                width: deg % 90 === 0 ? Math.max(6, ring1Size * 0.016) : Math.max(4, ring1Size * 0.008),
                height: deg % 90 === 0 ? Math.max(6, ring1Size * 0.016) : Math.max(4, ring1Size * 0.008),
                backgroundImage: deg % 90 === 0 ? dotGradient : undefined,
                backgroundColor: deg % 90 === 0 ? undefined : dotColor,
                boxShadow: deg % 90 === 0 ? dotShadow : `0 0 8px ${dotColor}`,
                top: "50%",
                left: "50%",
                transform: `rotate(${deg}deg) translateX(${ring1Orbit}px) translate(-50%, -50%)`,
              }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, delay: deg * 0.005 }}
            />
          ))}
        </motion.div>

        {/* Ring 2 */}
        <motion.div
          className="absolute rounded-full"
          style={{ width: ring2Size, height: ring2Size, border: ring2Border, boxShadow: ring2Shadow }}
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        />

        {/* Ring 3 */}
        <motion.div
          className="absolute rounded-full"
          style={{ width: ring3Size, height: ring3Size, border: ring3Border }}
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        />

        {/* Core glow */}
        <div
          className="absolute rounded-full"
          style={{ width: coreSize, height: coreSize, backgroundImage: coreGlow, boxShadow: coreShadow }}
        />

        {/* Inner pulse */}
        <motion.div
          className="absolute rounded-full"
          style={{ width: innerSize, height: innerSize, backgroundImage: innerGlow }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Light trails */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute"
          style={{ width: 500, height: 2, top: "28%", left: "-15%", backgroundImage: lightTrail1, filter: "blur(1px)" }}
          animate={{ x: ["0%", "350%"] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute"
          style={{ width: 350, height: 1.5, top: "62%", right: "-10%", backgroundImage: lightTrail2, filter: "blur(1px)" }}
          animate={{ x: ["0%", "-400%"] }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute"
          style={{ width: 250, height: 1, top: "45%", left: "-5%", backgroundImage: lightTrail3, filter: "blur(0.5px)" }}
          animate={{ x: ["0%", "500%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Content (push down so fixed nav never overlaps hero text) */}
      <motion.div
        className="relative z-10 text-center w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-28 md:pt-32"
        style={{ y: contentY, opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <p
            className="tracking-[0.4em] uppercase mb-6"
            style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(0.55rem, 1.2vw, 0.8rem)", fontWeight: 500, color: taglineColor }}
          >
            Immersive XR/VR Experiences
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(2rem, 6vw, 5rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            backgroundImage: headingGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Step Into
          <br />
          New Worlds
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-6 md:mt-7 max-w-xl mx-auto px-2"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(0.9rem, 2vw, 1.1rem)", lineHeight: 1.75, fontWeight: 400, color: textColor }}
        >
          NexoraXR creates breathtaking immersive XR/VR experiences for events and develops genre-defining VR games
          that push the boundaries of reality.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 md:mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExploreClick}
            className="w-full sm:w-auto px-7 md:px-9 py-3.5 md:py-4 rounded-full text-white cursor-pointer"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.8rem, 1.5vw, 0.92rem)",
              fontWeight: 600,
              letterSpacing: "0.03em",
              backgroundImage: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
              boxShadow: button1Shadow,
            }}
          >
            Explore Experiences
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-16 md:mt-20 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
            style={{ border: scrollBorder }}
          >
            <motion.div
              className="w-1 h-2 rounded-full"
              style={{ backgroundColor: scrollDot }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </motion.div>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              color: scrollText,
              textTransform: "uppercase",
            }}
          >
            Scroll
          </span>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? "linear-gradient(to top, #060810, transparent)"
            : "linear-gradient(to top, rgba(255,255,255,0.6), transparent)",
        }}
      />
    </section>
  );
}
