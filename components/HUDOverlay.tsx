"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import nexoraLogo from "../assets/images/logo.png";
import heavenImg from "../assets/images/heaven.png";
import hellImg from "../assets/images/hell.png";
import { VRHeadset3D } from "./VRHeadset";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

// --- Hook for mouse position ---
function useMouseParallax() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 50, damping: 20 });
  const rawX = useRef(0);
  const rawY = useRef(0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      rawX.current = (e.clientX / window.innerWidth - 0.5) * 2;
      rawY.current = (e.clientY / window.innerHeight - 0.5) * 2;
      x.set(rawX.current);
      y.set(rawY.current);
    };
    window.addEventListener("mousemove", handler, {
      passive: true,
    });
    return () =>
      window.removeEventListener("mousemove", handler);
  }, [x, y]);

  return { smoothX, smoothY, rawX, rawY };
}

// --- Mobile hook ---
function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

// --- Floating Nav ---
export function FloatingNav() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);
  const [mobileExpOpen, setMobileExpOpen] = useState(false);
  const expRef = useRef<HTMLDivElement>(null);
  const expTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (expRef.current && !expRef.current.contains(e.target as Node)) {
        setExpOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleExpEnter = () => {
    clearTimeout(expTimeoutRef.current);
    setExpOpen(true);
  };
  const handleExpLeave = () => {
    expTimeoutRef.current = setTimeout(() => setExpOpen(false), 200);
  };

  const handleNavHome = () => {
    if (pathname !== "/") router.push("/");
  };

  const navItems = ["Occasions", "Pricing", "About"];

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-1"
        style={{
          zIndex: 200,
          backdropFilter: "blur(24px)",
          background: isDark
            ? scrolled
              ? "linear-gradient(135deg, rgba(8,8,16,0.88) 0%, rgba(6,6,14,0.78) 100%)"
              : "linear-gradient(135deg, rgba(8,8,16,0.5) 0%, rgba(6,6,14,0.35) 100%)"
            : scrolled
              ? "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,248,255,0.9) 100%)"
              : "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(250,248,255,0.6) 100%)",
          border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(130,90,220,0.15)",
          borderRadius: "60px",
          padding: isMobile
            ? "6px 10px 6px 14px"
            : "7px 7px 7px 16px",
          boxShadow: isDark
            ? "0 4px 40px rgba(180,100,220,0.06)"
            : "0 4px 40px rgba(130,90,220,0.08), 0 0 0 1px rgba(130,90,220,0.05)",
          transition: "background 0.4s",
          maxWidth: "calc(100vw - 24px)",
        }}
      >
        <Image
          src={nexoraLogo}
          alt="NexoraXR"
          className="select-none cursor-pointer"
          onClick={handleNavHome}
          style={{
            height: isMobile ? "44px" : "56px",
            width: "auto",
            opacity: 0.95,
            marginRight: isMobile ? "10px" : "18px",
          }}
          priority
        />

        {/* Desktop nav items */}
        {!isMobile && (
          <>
            {/* Worlds dropdown trigger */}
            <div
              ref={expRef}
              className="relative"
              onMouseEnter={handleExpEnter}
              onMouseLeave={handleExpLeave}
            >
              <button
                className="px-4 py-2 rounded-full transition-all duration-300 cursor-pointer flex items-center gap-1.5"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: "11.5px",
                  color: isDark
                    ? expOpen ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)"
                    : expOpen ? "rgba(80,50,140,0.95)" : "rgba(80,50,140,0.6)",
                  background: expOpen
                    ? isDark ? "rgba(255,255,255,0.06)" : "rgba(130,90,220,0.08)"
                    : "transparent",
                  border: "none",
                  letterSpacing: "0.06em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.95)" : "rgba(80,50,140,0.95)";
                  e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(130,90,220,0.08)";
                }}
                onMouseLeave={(e) => {
                  if (!expOpen) {
                    e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.55)" : "rgba(80,50,140,0.6)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                Worlds
                <motion.svg
                  animate={{ rotate: expOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M2 3.5L5 6.5L8 3.5" />
                </motion.svg>
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {expOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3"
                    style={{
                      width: "360px",
                      padding: "8px",
                      borderRadius: "20px",
                      background: isDark
                        ? "linear-gradient(160deg, rgba(10,10,20,0.95), rgba(6,6,14,0.92))"
                        : "linear-gradient(160deg, rgba(255,255,255,0.98), rgba(250,248,255,0.95))",
                      border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(130,90,220,0.15)",
                      backdropFilter: "blur(30px)",
                      boxShadow: isDark
                        ? "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(180,100,220,0.06)"
                        : "0 20px 60px rgba(130,90,220,0.15), 0 0 40px rgba(180,100,220,0.08)",
                    }}
                    onMouseEnter={handleExpEnter}
                    onMouseLeave={handleExpLeave}
                  >
                    {/* Header */}
                    <div className="px-4 pt-3 pb-2">
                      <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "8px", letterSpacing: "0.3em", color: isDark ? "rgba(255,255,255,0.3)" : "rgba(80,50,140,0.4)" }}>
                        EXPLORE WORLDS
                      </span>
                    </div>

                    {/* Story cards */}
                    <div className="flex flex-col gap-1.5">
                      {/* Heaven */}
                      <button
                        className="flex items-center gap-4 w-full p-3 rounded-2xl transition-all duration-300 cursor-pointer group"
                        style={{ background: "transparent", border: "none", textAlign: "left" }}
                        onClick={() => { setExpOpen(false); router.push("/story/heaven"); }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(220,200,100,0.06)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <div
                          className="relative overflow-hidden shrink-0"
                          style={{
                            width: "80px",
                            height: "56px",
                            borderRadius: "12px",
                            border: "1px solid rgba(220,200,100,0.12)",
                          }}
                        >
                          <Image
                            src={heavenImg}
                            alt="Swarga"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            style={{ opacity: 0.8 }}
                            fill
                          />
                          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(220,200,100,0.1), transparent)" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "8px", letterSpacing: "0.2em", color: "rgba(220,200,100,0.5)" }}>
                              HEAVEN
                            </span>
                            <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(220,200,100,0.4)" }} />
                          </div>
                          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "12px", fontWeight: 700, color: isDark ? "#fff" : "#1a0a2e", marginBottom: "2px" }}>
                            Swarga: The Celestial Realm
                          </div>
                          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "10px", color: isDark ? "rgba(255,255,255,0.35)" : "rgba(80,50,140,0.5)" }}>
                            Golden temples &amp; divine wonder
                          </div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="rgba(220,200,100,0.4)" strokeWidth="1.2" className="shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                          <path d="M5 3l4 4-4 4" />
                        </svg>
                      </button>

                      {/* Divider */}
                      <div className="mx-4" style={{ height: "1px", background: isDark ? "linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)" : "linear-gradient(to right, transparent, rgba(130,90,220,0.1), transparent)" }} />

                      {/* Hell */}
                      <button
                        className="flex items-center gap-4 w-full p-3 rounded-2xl transition-all duration-300 cursor-pointer group"
                        style={{ background: "transparent", border: "none", textAlign: "left" }}
                        onClick={() => { setExpOpen(false); router.push("/story/hell"); }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(230,80,60,0.06)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <div
                          className="relative overflow-hidden shrink-0"
                          style={{
                            width: "80px",
                            height: "56px",
                            borderRadius: "12px",
                            border: "1px solid rgba(230,80,60,0.12)",
                          }}
                        >
                          <Image
                            src={hellImg}
                            alt="Naraka"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            style={{ opacity: 0.8 }}
                            fill
                          />
                          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(230,80,60,0.1), transparent)" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "8px", letterSpacing: "0.2em", color: "rgba(230,80,60,0.5)" }}>
                              HELL
                            </span>
                            <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(230,80,60,0.4)" }} />
                          </div>
                          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "12px", fontWeight: 700, color: isDark ? "#fff" : "#1a0a2e", marginBottom: "2px" }}>
                            Naraka: The Infernal Depths
                          </div>
                          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "10px", color: isDark ? "rgba(255,255,255,0.35)" : "rgba(80,50,140,0.5)" }}>
                            Volcanic wastelands &amp; rivers of fire
                          </div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="rgba(230,80,60,0.4)" strokeWidth="1.2" className="shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                          <path d="M5 3l4 4-4 4" />
                        </svg>
                      </button>
                    </div>

                    {/* Footer */}
                    <div className="px-4 pt-2 pb-2 mt-1">
                      <div style={{ height: "1px", background: isDark ? "linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)" : "linear-gradient(to right, transparent, rgba(130,90,220,0.1), transparent)", marginBottom: "8px" }} />
                      <span style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "9px", color: isDark ? "rgba(255,255,255,0.2)" : "rgba(80,50,140,0.3)", letterSpacing: "0.1em" }}>
                        More worlds coming soon...
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other nav items */}
            {navItems.map((item) => (
              <button
                key={item}
                className="px-4 py-2 rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: "11.5px",
                  color: isDark ? "rgba(255,255,255,0.55)" : "rgba(80,50,140,0.6)",
                  background: "transparent",
                  border: "none",
                  letterSpacing: "0.06em",
                }}
                onClick={() => {
                  if (item === "Pricing") {
                    router.push("/pricing");
                  } else if (item === "Occasions") {
                    router.push("/occasions");
                  } else if (item === "About") {
                    router.push("/about");
                  } else if (pathname !== "/") {
                    router.push("/");
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.95)" : "rgba(80,50,140,0.95)";
                  e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(130,90,220,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.55)" : "rgba(80,50,140,0.6)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {item}
              </button>
            ))}
          </>
        )}

        {/* Theme Toggle */}
        {!isMobile && (
          <div className="ml-2">
            <ThemeToggle />
          </div>
        )}

        {/* Desktop CTA */}
        {!isMobile && (
          <button
            className="ml-2 px-5 py-2 rounded-full cursor-pointer transition-all duration-300"
            style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: "11.5px",
              color: "#ffffff",
              background: isDark
                ? "linear-gradient(135deg, rgba(140,100,220,0.3), rgba(230,80,160,0.2))"
                : "linear-gradient(135deg, rgba(130,90,220,0.8), rgba(200,100,255,0.7))",
              border: isDark ? "1px solid rgba(200,120,220,0.2)" : "1px solid rgba(130,90,220,0.3)",
              letterSpacing: "0.06em",
            }}
            onClick={() => router.push("/book-now")}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDark
                ? "linear-gradient(135deg, rgba(140,100,220,0.45), rgba(230,80,160,0.35))"
                : "linear-gradient(135deg, rgba(130,90,220,0.9), rgba(200,100,255,0.8))";
              e.currentTarget.style.boxShadow = isDark
                ? "0 0 20px rgba(180,100,220,0.15)"
                : "0 0 20px rgba(130,90,220,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isDark
                ? "linear-gradient(135deg, rgba(140,100,220,0.3), rgba(230,80,160,0.2))"
                : "linear-gradient(135deg, rgba(130,90,220,0.8), rgba(200,100,255,0.7))";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Book Now
          </button>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            className="p-2 rounded-full cursor-pointer"
            style={{
              background: "transparent",
              border: "none",
            }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <div className="flex flex-col gap-1">
              <motion.div
                animate={{
                  rotate: menuOpen ? 45 : 0,
                  y: menuOpen ? 5 : 0,
                }}
                  style={{
                    width: "16px",
                    height: "1.5px",
                    background: isDark ? "rgba(255,255,255,0.7)" : "rgba(80,50,140,0.7)",
                    borderRadius: "2px",
                  }}
              />
              <motion.div
                animate={{ opacity: menuOpen ? 0 : 1 }}
                  style={{
                    width: "16px",
                    height: "1.5px",
                    background: isDark ? "rgba(255,255,255,0.7)" : "rgba(80,50,140,0.7)",
                    borderRadius: "2px",
                  }}
              />
              <motion.div
                animate={{
                  rotate: menuOpen ? -45 : 0,
                  y: menuOpen ? -5 : 0,
                }}
                  style={{
                    width: "16px",
                    height: "1.5px",
                    background: isDark ? "rgba(255,255,255,0.7)" : "rgba(80,50,140,0.7)",
                    borderRadius: "2px",
                  }}
              />
            </div>
          </button>
        )}
      </motion.nav>

      {/* Mobile dropdown */}
      {isMobile && (
        <motion.div
          initial={false}
          animate={{
            opacity: menuOpen ? 1 : 0,
            y: menuOpen ? 0 : -10,
            pointerEvents: menuOpen
              ? ("auto" as const)
              : ("none" as const),
          }}
          transition={{ duration: 0.3 }}
          className="fixed top-16 left-4 right-4 flex flex-col items-center gap-1 py-4 px-3 rounded-2xl"
          style={{
            zIndex: 199,
            backdropFilter: "blur(24px)",
            background: isDark
              ? "linear-gradient(135deg, rgba(8,8,16,0.92), rgba(6,6,14,0.88))"
              : "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(250,248,255,0.92))",
            border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(130,90,220,0.12)",
          }}
        >
          {/* Worlds with expandable sub-items */}
          <button
            className="w-full py-3 rounded-xl transition-all cursor-pointer"
            style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: "13px",
              color: isDark ? "rgba(255,255,255,0.6)" : "rgba(80,50,140,0.7)",
              background: "transparent",
              border: "none",
              letterSpacing: "0.06em",
            }}
            onClick={() => setMobileExpOpen(!mobileExpOpen)}
          >
            <span className="flex items-center justify-center gap-2">
              Worlds
              <motion.svg
                animate={{ rotate: mobileExpOpen ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M2 3.5L5 6.5L8 3.5" />
              </motion.svg>
            </span>
          </button>

          <AnimatePresence>
            {mobileExpOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full overflow-hidden"
              >
                <div className="flex flex-col gap-2 px-2 pb-2">
                  <button
                    className="flex items-center gap-3 w-full p-2.5 rounded-xl cursor-pointer"
                    style={{ background: "rgba(220,200,100,0.05)", border: "1px solid rgba(220,200,100,0.1)", textAlign: "left" }}
                    onClick={() => { setMenuOpen(false); setMobileExpOpen(false); router.push("/story/heaven"); }}
                  >
                    <div style={{ width: "48px", height: "36px", position: "relative", borderRadius: "8px", overflow: "hidden" }}>
                      <Image src={heavenImg} alt="Swarga" fill style={{ objectFit: "cover", opacity: 0.8 }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "10px", fontWeight: 700, color: isDark ? "#fff" : "#1a0a2e" }}>Swarga</div>
                      <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "9px", color: "rgba(220,200,100,0.7)" }}>Heaven</div>
                    </div>
                  </button>
                  <button
                    className="flex items-center gap-3 w-full p-2.5 rounded-xl cursor-pointer"
                    style={{ background: "rgba(230,80,60,0.05)", border: "1px solid rgba(230,80,60,0.1)", textAlign: "left" }}
                    onClick={() => { setMenuOpen(false); setMobileExpOpen(false); router.push("/story/hell"); }}
                  >
                    <div style={{ width: "48px", height: "36px", position: "relative", borderRadius: "8px", overflow: "hidden" }}>
                      <Image src={hellImg} alt="Naraka" fill style={{ objectFit: "cover", opacity: 0.8 }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "10px", fontWeight: 700, color: isDark ? "#fff" : "#1a0a2e" }}>Naraka</div>
                      <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "9px", color: "rgba(230,80,60,0.7)" }}>Hell</div>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {navItems.map((item) => (
            <button
              key={item}
              className="w-full py-3 rounded-xl transition-all cursor-pointer"
              style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: "13px",
                color: isDark ? "rgba(255,255,255,0.6)" : "rgba(80,50,140,0.7)",
                background: "transparent",
                border: "none",
                letterSpacing: "0.06em",
              }}
              onClick={() => {
                setMenuOpen(false);
                if (item === "Pricing") {
                  router.push("/pricing");
                } else if (item === "Occasions") {
                  router.push("/occasions");
                } else if (item === "About") {
                  router.push("/about");
                } else if (pathname !== "/") {
                  router.push("/");
                }
              }}
            >
              {item}
            </button>
          ))}
          <div className="w-full flex items-center justify-center py-3 mt-1">
            <ThemeToggle />
          </div>
          <button
            className="w-full py-3 mt-1 rounded-full cursor-pointer"
            style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: "13px",
              color: "#ffffff",
              background: isDark
                ? "linear-gradient(135deg, rgba(140,100,220,0.3), rgba(230,80,160,0.2))"
                : "linear-gradient(135deg, rgba(130,90,220,0.8), rgba(200,100,255,0.7))",
              border: isDark ? "1px solid rgba(200,120,220,0.2)" : "1px solid rgba(130,90,220,0.3)",
              letterSpacing: "0.06em",
            }}
            onClick={() => {
              setMenuOpen(false);
              router.push("/book-now");
            }}
          >
            Book Now
          </button>
        </motion.div>
      )}
    </>
  );
}

// --- Animated Section Wrapper ---
function Section({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 1.2,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// --- Parallax wrapper ---
function ParallaxLayer({
  children,
  speed = 0.5,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [speed * 80, speed * -80],
  );

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// --- Glass Panel ---
function GlassPanel({
  children,
  className = "",
  accent = "rgba(180,120,220,",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: string;
  style?: React.CSSProperties;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div
      className={`relative ${className}`}
      style={{
        background: isDark
          ? "linear-gradient(160deg, rgba(12,10,24,0.7) 0%, rgba(8,6,18,0.5) 100%)"
          : "linear-gradient(160deg, rgba(255,255,255,0.9) 0%, rgba(250,248,255,0.8) 100%)",
        border: `1px solid ${accent}${isDark ? "0.1)" : "0.2)"}`,
        borderRadius: "20px",
        backdropFilter: "blur(20px)",
        boxShadow: isDark
          ? `0 0 40px ${accent}0.04), inset 0 1px 0 rgba(255,255,255,0.04)`
          : `0 0 40px ${accent}0.08), inset 0 1px 0 rgba(255,255,255,0.5)`,
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        className="absolute top-0 left-8 right-8"
        style={{
          height: "1px",
          background: `linear-gradient(to right, transparent, ${accent}0.2), transparent)`,
        }}
      />
      {children}
    </div>
  );
}

// --- Main HUD Content ---
export function HUDContent({ skipHero = false }: { skipHero?: boolean }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isMobile = useIsMobile();
  const { smoothX, smoothY, rawX, rawY } = useMouseParallax();
  const [mouseXRaw, setMouseXRaw] = useState(0);
  const [mouseYRaw, setMouseYRaw] = useState(0);

  // Hoist all useTransform calls to top level (hooks can't be conditional)
  const headsetX = useTransform(smoothX, [-1, 1], [-20, 20]);
  const headsetY = useTransform(smoothY, [-1, 1], [-15, 15]);
  const hudLeftX = useTransform(smoothX, [-1, 1], [-12, 12]);
  const hudLeftY = useTransform(smoothY, [-1, 1], [-8, 8]);
  const hudRightX = useTransform(smoothX, [-1, 1], [10, -10]);
  const hudRightY = useTransform(smoothY, [-1, 1], [6, -6]);

  useEffect(() => {
    let raf: number;
    const update = () => {
      setMouseXRaw(rawX.current);
      setMouseYRaw(rawY.current);
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [rawX, rawY]);

  return (
    <div
      className="relative w-full"
      style={{ zIndex: 10, pointerEvents: "none" }}
    >
      {/* ===== 1. HERO / PORTAL ENTRY ===== */}
      {!skipHero && <section
        className="flex items-center justify-center relative"
        style={{
          height: "100vh",
          perspective: "1200px",
          overflow: "hidden",
        }}
      >
        {/* VR Headset 3D - behind text, with parallax */}
        <motion.div
          style={{
            position: "absolute",
            width: isMobile ? "280px" : "500px",
            height: isMobile ? "280px" : "500px",
            x: headsetX,
            y: headsetY,
            zIndex: 0,
          }}
        >
          <VRHeadset3D mouseX={mouseXRaw} mouseY={mouseYRaw} />
        </motion.div>

        <div
          className="flex flex-col items-center text-center relative px-5"
          style={{ pointerEvents: "auto", zIndex: 1 }}
        >
          {/* Micro label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.0 }}
            className="mb-4 md:mb-5 flex items-center gap-3"
          >
            <div
              style={{
                width: "30px",
                height: "1px",
                  background: isDark
                    ? "linear-gradient(to right, transparent, rgba(180,120,220,0.4))"
                    : "linear-gradient(to right, transparent, rgba(130,90,220,0.5))",
              }}
            />
            <span
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: isMobile ? "8px" : "10px",
                letterSpacing: "0.35em",
                color: isDark ? "rgba(255,255,255,0.5)" : "rgba(80,50,140,0.6)",
                textTransform: "uppercase",
              }}
            >
              Immersive XR Platform
            </span>
            <div
              style={{
                width: "30px",
                height: "1px",
                background: isDark
                  ? "linear-gradient(to left, transparent, rgba(230,80,160,0.4))"
                  : "linear-gradient(to left, transparent, rgba(200,100,255,0.5))",
              }}
            />
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 1.4,
              delay: 1.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: isMobile
                ? "clamp(28px, 9vw, 40px)"
                : "clamp(36px, 5vw, 64px)",
              fontWeight: 800,
              lineHeight: 1.1,
              color: isDark ? "#ffffff" : "#1a0a2e",
              textShadow: isDark
                ? "0 0 60px rgba(180,100,220,0.2), 0 0 120px rgba(120,180,255,0.08)"
                : "0 0 40px rgba(130,90,220,0.15)",
              letterSpacing: "0.03em",
            }}
          >
            Step Into
            <br />
            <span
              style={{
                background: isDark
                  ? "linear-gradient(135deg, #7BB8FF 0%, #C77DFF 40%, #E84393 100%)"
                  : "linear-gradient(135deg, #4a6fd8 0%, #7b52c4 40%, #c44a8f 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: isDark
                  ? "drop-shadow(0 0 20px rgba(180,100,220,0.3))"
                  : "drop-shadow(0 0 15px rgba(130,90,220,0.2))",
              }}
            >
              New Worlds
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
            style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: isMobile ? "13px" : "15px",
              lineHeight: 1.8,
              color: isDark ? "rgba(255,255,255,0.5)" : "rgba(80,50,140,0.6)",
              maxWidth: "420px",
              marginTop: isMobile ? "14px" : "20px",
              letterSpacing: "0.02em",
            }}
          >
            Immersive XR/VR experiences for events &amp;
            <br />
            next-generation VR game development
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.2 }}
            className={`flex gap-3 md:gap-4 ${isMobile ? "mt-6 flex-col items-center" : "mt-9"}`}
          >
            <CTAButton primary>Explore Experiences</CTAButton>
            <CTAButton>View VR Games</CTAButton>
          </motion.div>
        </div>

        {/* Floating HUD data - left (hidden on mobile) */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 2.8 }}
            className="absolute left-[5%] top-[33%]"
            style={{
              pointerEvents: "auto",
              x: hudLeftX,
              y: hudLeftY,
            }}
          >
            <HUDChip>
              <div className="flex items-center gap-2 mb-2">
                <div
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "rgba(80,220,140,0.7)",
                    boxShadow: "0 0 8px rgba(80,220,140,0.5)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "8px",
                    letterSpacing: "0.2em",
                    color: isDark ? "rgba(255,255,255,0.35)" : "rgba(80,50,140,0.5)",
                  }}
                >
                  SYSTEM STATUS
                </span>
              </div>
              <div
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: "10px",
                  color: isDark ? "rgba(255,255,255,0.3)" : "rgba(80,50,140,0.5)",
                  lineHeight: 2,
                }}
              >
                <div>
                  RENDER ENGINE{" "}
                  <span
                    style={{ color: "rgba(80,220,140,0.6)" }}
                  >
                    ACTIVE
                  </span>
                </div>
                <div>
                  XR PIPELINE{" "}
                  <span
                    style={{ color: "rgba(80,220,140,0.6)" }}
                  >
                    ONLINE
                  </span>
                </div>
                <div>
                  WORLD SYNC{" "}
                  <span
                    style={{ color: "rgba(180,120,255,0.6)" }}
                  >
                    98.7%
                  </span>
                </div>
              </div>
            </HUDChip>
          </motion.div>
        )}

        {/* Floating HUD data - right (hidden on mobile) */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 3.0 }}
            className="absolute right-[5%] top-[28%]"
            style={{
              pointerEvents: "auto",
              x: hudRightX,
              y: hudRightY,
            }}
          >
            <HUDChip accent="rgba(230,80,160,">
              <span
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "8px",
                  letterSpacing: "0.2em",
                  color: isDark ? "rgba(255,255,255,0.35)" : "rgba(80,50,140,0.5)",
                }}
              >
                SCENE DEPTH
              </span>
              <div
                className="mt-2"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: "10px",
                  color: isDark ? "rgba(255,255,255,0.3)" : "rgba(80,50,140,0.5)",
                  lineHeight: 2,
                }}
              >
                <div>
                  OBJECTS{" "}
                  <span
                    style={{ color: "rgba(200,130,255,0.6)" }}
                  >
                    2,847
                  </span>
                </div>
                <div>
                  DRAW CALLS{" "}
                  <span
                    style={{ color: "rgba(200,130,255,0.6)" }}
                  >
                    124
                  </span>
                </div>
                <div>
                  FPS{" "}
                  <span
                    style={{ color: "rgba(80,220,140,0.6)" }}
                  >
                    120
                  </span>
                </div>
              </div>
            </HUDChip>
          </motion.div>
        )}

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 1 }}
          className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
            <span
              style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.3em",
                color: isDark ? "rgba(255,255,255,0.2)" : "rgba(80,50,140,0.3)",
              }}
            >
              SCROLL TO EXPLORE
            </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: "1px",
              height: "24px",
              background:
                "linear-gradient(to bottom, rgba(200,130,255,0.3), transparent)",
            }}
          />
        </motion.div>
      </section>}

      {/* ===== 4.25 OUR STORIES ===== */}
      <section
        className="flex flex-col items-center py-16 md:py-24 px-5 md:px-8"
        style={{ minHeight: isMobile ? "auto" : "auto" }}
      >
        <ParallaxLayer speed={-0.1}>
          <Section>
            <div className="text-center mb-10 md:mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div
                  style={{
                    width: "40px",
                    height: "1px",
                    background:
                      "linear-gradient(to right, transparent, rgba(200,180,100,0.4))",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "10px",
                    letterSpacing: "0.4em",
                    color: isDark ? "rgba(255,255,255,0.35)" : "rgba(80,50,140,0.5)",
                  }}
                >
                  NARRATIVE WORLDS
                </span>
                <div
                  style={{
                    width: "40px",
                    height: "1px",
                    background:
                      "linear-gradient(to left, transparent, rgba(230,80,60,0.4))",
                  }}
                />
              </div>
              <h2
                className="mt-2"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: isMobile ? "22px" : "32px",
                  fontWeight: 700,
                  color: isDark ? "#ffffff" : "#1a0a2e",
                  lineHeight: 1.3,
                }}
              >
                Our{" "}
                <span
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #7BB8FF 0%, #C77DFF 50%, #E84393 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                  }}
                >
                  Stories
                </span>
              </h2>
              <p
                className="mt-3"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: isMobile ? "12px" : "14px",
                  color: isDark ? "rgba(255,255,255,0.4)" : "rgba(80,50,140,0.6)",
                  maxWidth: "520px",
                  margin: "12px auto 0",
                  lineHeight: 1.7,
                }}
              >
                Step beyond the veil of reality into mythological realms
                brought to life through immersive VR storytelling.
              </p>
            </div>
          </Section>
        </ParallaxLayer>

        <div
          className={`flex ${isMobile ? "flex-col" : ""} gap-6 md:gap-8 w-full max-w-[960px] justify-center items-stretch`}
          style={{ pointerEvents: "auto", perspective: "1000px" }}
        >
          {/* Heaven Card */}
          <Section delay={0.15}>
            <StoryCard
              img={heavenImg.src}
              title="Swarga: The Celestial Realm"
              subtitle="HEAVEN"
              desc="Ascend through golden temples, lotus gardens, and luminous skies. Walk among celestial beings in a world of eternal beauty, serenity, and divine wonder — an immersive journey into the heavens."
              accent="rgba(200,180,100,"
              glowColor="rgba(220,200,100,0.12)"
              isMobile={isMobile}
              link="/story/heaven"
            />
          </Section>

          {/* Hell Card */}
          <Section delay={0.3}>
            <StoryCard
              img={hellImg.src}
              title="Naraka: The Infernal Depths"
              subtitle="HELL"
              desc="Descend into volcanic wastelands, crumbling fortresses, and rivers of fire. Face the guardians of the underworld in a harrowing VR experience that tests your courage at every turn."
              accent="rgba(230,80,60,"
              glowColor="rgba(230,80,60,0.12)"
              isMobile={isMobile}
              link="/story/hell"
            />
          </Section>
        </div>
      </section>

      {/* ===== 2. CORE EXPERIENCE ZONES ===== */}
      <section
        className="flex flex-col items-center py-16 md:py-24 px-5 md:px-8"
        style={{ minHeight: isMobile ? "auto" : "100vh" }}
      >
        <ParallaxLayer speed={-0.15}>
          <Section>
            <div className="flex items-center gap-3 mb-10 md:mb-16">
              <div
                style={{
                  width: "40px",
                  height: "1px",
                  background: isDark
                    ? "linear-gradient(to right, transparent, rgba(120,180,255,0.3))"
                    : "linear-gradient(to right, transparent, rgba(130,90,220,0.4))",
                }}
              />
              <span
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.4em",
                  color: isDark ? "rgba(255,255,255,0.35)" : "rgba(80,50,140,0.5)",
                }}
              >
                CORE EXPERIENCE ZONES
              </span>
              <div
                style={{
                  width: "40px",
                  height: "1px",
                  background: isDark
                    ? "linear-gradient(to left, transparent, rgba(230,80,160,0.3))"
                    : "linear-gradient(to left, transparent, rgba(200,100,255,0.4))",
                }}
              />
            </div>
          </Section>
        </ParallaxLayer>

        <div
          className={`flex ${isMobile ? "flex-col" : ""} gap-6 md:gap-10 items-stretch w-full max-w-[860px]`}
          style={{
            pointerEvents: "auto",
            perspective: "800px",
          }}
        >
          <Section delay={0.15}>
            <ServiceModule
              tag="XR-EXP"
              title={"Immersive XR/VR\nExperiences for Events"}
              desc="Transform physical events into multi-sensory journeys. Our spatial experiences merge real-world environments with digital dimensions, creating moments that transcend ordinary reality."
              stats={[
                { label: "IMMERSION", value: "99.2%" },
                { label: "LATENCY", value: "<8ms" },
              ]}
              accent="rgba(120,180,255,"
              icon={<EyeIcon />}
            />
          </Section>
          <Section delay={0.35}>
            <ServiceModule
              tag="VR-DEV"
              title={"VR Game\nDevelopment"}
              desc="We build virtual worlds that players inhabit, not just visit. From narrative adventures to competitive arenas, our games push the boundaries of interactive storytelling in true VR."
              stats={[
                { label: "FRAMERATE", value: "120fps" },
                { label: "WORLDS", value: "∞" },
              ]}
              accent="rgba(200,100,220,"
              icon={<GamepadIcon />}
            />
          </Section>
        </div>
      </section>

      {/* ===== 3. EXPERIENCE HIGHLIGHTS ===== */}
      <section
        className="flex flex-col items-center py-16 md:py-24 px-5 md:px-8"
        style={{ minHeight: isMobile ? "auto" : "80vh" }}
      >
        <ParallaxLayer speed={-0.1}>
          <Section>
            <div className="text-center mb-10 md:mb-12">
              <span
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.4em",
                  color: isDark ? "rgba(255,255,255,0.35)" : "rgba(80,50,140,0.5)",
                }}
              >
                EXPERIENCE HIGHLIGHTS
              </span>
              <h2
                className="mt-3"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: isMobile ? "22px" : "28px",
                  fontWeight: 700,
                  color: isDark ? "#ffffff" : "#1a0a2e",
                  lineHeight: 1.3,
                }}
              >
                What Defines Our Worlds
              </h2>
            </div>
          </Section>
        </ParallaxLayer>

        <div
          className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl"
          style={{ pointerEvents: "auto" }}
        >
          {[
            { label: "Immersive Storytelling", icon: "✦" },
            { label: "Interactive Environments", icon: "◈" },
            { label: "Emotional Engagement", icon: "♡" },
            { label: "Culture-Driven Experiences", icon: "◎" },
            { label: "Innovation Through VR", icon: "⚡" },
          ].map((item, i) => (
            <Section key={item.label} delay={0.1 + i * 0.08}>
              <DataNode label={item.label} icon={item.icon} />
            </Section>
          ))}
        </div>
      </section>

      {/* ===== 4. FEATURED WORLDS ===== */}
      <section
        className="flex flex-col items-center py-16 md:py-24 px-5 md:px-8"
        style={{ minHeight: isMobile ? "auto" : "100vh" }}
      >
        <ParallaxLayer speed={-0.12}>
          <Section>
            <div className="text-center mb-10 md:mb-14">
              <span
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.4em",
                  color: isDark ? "rgba(255,255,255,0.35)" : "rgba(80,50,140,0.5)",
                }}
              >
                FEATURED WORLDS
              </span>
              <h2
                className="mt-3"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: isMobile ? "22px" : "28px",
                  fontWeight: 700,
                  color: isDark ? "#ffffff" : "#1a0a2e",
                  lineHeight: 1.3,
                }}
              >
                Explore Our Dimensions
              </h2>
            </div>
          </Section>
        </ParallaxLayer>

        <div
          className={`flex ${isMobile ? "flex-col items-center" : ""} gap-5 md:gap-7 w-full max-w-[1020px] justify-center`}
          style={{
            pointerEvents: "auto",
            perspective: "1000px",
          }}
        >
          {[
            {
              tag: "EVT-ACT",
              title: "Event Activations",
              desc: "Transform venues into multi-dimensional experiences. Spatial audio, reactive visuals, and immersive storytelling converge.",
              accent: "rgba(120,180,255,",
              img: "https://images.unsplash.com/photo-1571917687771-094c2a557ed4?w=600&q=80",
            },
            {
              tag: "VRT-SHW",
              title: "Virtual Showcases",
              desc: "Digital exhibition spaces that transcend physical limitations. Present products and art in impossible environments.",
              accent: "rgba(200,130,255,",
              img: "https://images.unsplash.com/photo-1687389806477-22be64a5480f?w=600&q=80",
            },
            {
              tag: "VR-GAME",
              title: "VR Game Universes",
              desc: "Fully realized game worlds built for presence. Adventure, competition, and narrative depth in virtual reality.",
              accent: "rgba(230,80,160,",
              img: "https://images.unsplash.com/photo-1728198349686-c51f8899d2a9?w=600&q=80",
            },
          ].map((world, i) => (
            <Section key={world.tag} delay={0.15 + i * 0.15}>
              <WorldCapsule {...world} isMobile={isMobile} />
            </Section>
          ))}
        </div>
      </section>

      {/* ===== 4.5 VR & XR BRANDS ===== */}
      <section
        className="flex flex-col items-center py-16 md:py-24 px-5 md:px-8"
        style={{ minHeight: isMobile ? "auto" : "auto" }}
      >
        <ParallaxLayer speed={-0.1}>
          <Section>
            <div className="text-center mb-10 md:mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div
                  style={{
                    width: "40px",
                    height: "1px",
                    background:
                      "linear-gradient(to right, transparent, rgba(120,180,255,0.3))",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "10px",
                    letterSpacing: "0.4em",
                    color: isDark ? "rgba(255,255,255,0.35)" : "rgba(80,50,140,0.5)",
                  }}
                >
                  ECOSYSTEM
                </span>
                <div
                  style={{
                    width: "40px",
                    height: "1px",
                    background:
                      "linear-gradient(to left, transparent, rgba(230,80,160,0.3))",
                  }}
                />
              </div>
              <h2
                className="mt-2"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: isMobile ? "22px" : "32px",
                  fontWeight: 700,
                  color: isDark ? "#ffffff" : "#1a0a2e",
                  lineHeight: 1.3,
                }}
              >
                Built for the{" "}
                <span
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #7BB8FF 0%, #C77DFF 50%, #E84393 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                  }}
                >
                  Leading Platforms
                </span>
              </h2>
              <p
                className="mt-3"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: isMobile ? "12px" : "14px",
                  color: isDark ? "rgba(255,255,255,0.4)" : "rgba(80,50,140,0.6)",
                  maxWidth: "520px",
                  margin: "12px auto 0",
                  lineHeight: 1.7,
                }}
              >
                We develop across every major VR &amp; XR platform,
                ensuring our experiences reach audiences wherever
                they are.
              </p>
            </div>
          </Section>
        </ParallaxLayer>

        <Section delay={0.15}>
          <div
            className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-4"} gap-4 md:gap-5 w-full max-w-[900px]`}
            style={{ pointerEvents: "auto" }}
          >
            {([
              { name: "Meta Quest", tag: "MR / VR", accent: "rgba(120,180,255,", logo: "meta" },
              { name: "Apple Vision Pro", tag: "Spatial Computing", accent: "rgba(200,130,255,", logo: "apple" },
              { name: "PlayStation VR2", tag: "Console VR", accent: "rgba(230,80,160,", logo: "playstation" },
              { name: "Valve Index", tag: "PC VR", accent: "rgba(120,180,255,", logo: "valve" },
              { name: "HTC Vive", tag: "Enterprise XR", accent: "rgba(200,130,255,", logo: "htc" },
              { name: "Pico", tag: "Standalone VR", accent: "rgba(230,80,160,", logo: "pico" },
              { name: "Unity", tag: "Engine", accent: "rgba(120,180,255,", logo: "unity" },
              { name: "Unreal Engine", tag: "Engine", accent: "rgba(200,130,255,", logo: "unreal" },
              { name: "Magic Leap", tag: "AR / MR", accent: "rgba(230,80,160,", logo: "magicleap" },
              { name: "Varjo", tag: "Enterprise XR", accent: "rgba(120,180,255,", logo: "varjo" },
              { name: "OpenXR", tag: "Standard", accent: "rgba(200,130,255,", logo: "openxr" },
              { name: "WebXR", tag: "Web Platform", accent: "rgba(230,80,160,", logo: "webxr" },
            ] as const).map((brand, i) => (
              <Section key={brand.name} delay={0.05 + i * 0.04}>
                <BrandCard
                  name={brand.name}
                  tag={brand.tag}
                  accent={brand.accent}
                  logo={brand.logo}
                />
              </Section>
            ))}
          </div>
        </Section>
      </section>

      {/* ===== 5. VISION & MISSION ===== */}
      <section
        className="flex flex-col items-center justify-center py-16 md:py-24 px-5 md:px-8"
        style={{ minHeight: isMobile ? "auto" : "90vh" }}
      >
        <ParallaxLayer speed={-0.1}>
          <Section>
            <div className="flex items-center gap-3 mb-10 md:mb-14">
              <div
                style={{
                  width: "40px",
                  height: "1px",
                  background:
                    "linear-gradient(to right, transparent, rgba(200,130,255,0.3))",
                }}
              />
              <span
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.4em",
                  color: isDark ? "rgba(255,255,255,0.35)" : "rgba(80,50,140,0.5)",
                }}
              >
                MANIFESTO
              </span>
              <div
                style={{
                  width: "40px",
                  height: "1px",
                  background:
                    "linear-gradient(to left, transparent, rgba(230,80,160,0.3))",
                }}
              />
            </div>
          </Section>
        </ParallaxLayer>

        <div
          className="flex flex-col items-center gap-6 w-full max-w-3xl"
          style={{ pointerEvents: "auto" }}
        >
          <Section delay={0.2}>
            <GlassPanel
              accent="rgba(200,130,255,"
              className={`${isMobile ? "p-7" : "p-12"} text-center`}
              style={{ position: "relative" }}
            >
              <CornerAccents />
              <div
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.35em",
                  color: isDark ? "rgba(255,255,255,0.4)" : "rgba(80,50,140,0.5)",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                Our Vision
              </div>
              <h2
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: isMobile ? "18px" : "24px",
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
                    background:
                      "linear-gradient(135deg, #C77DFF, #E84393)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  imagination, culture, and emotion
                </span>{" "}
                into immersive reality.
              </h2>
            </GlassPanel>
          </Section>

          <Section delay={0.4}>
            <div
              style={{
                width: "1px",
                height: "50px",
                background:
                  "linear-gradient(to bottom, rgba(200,130,255,0.15), rgba(230,80,160,0.15))",
              }}
            />
          </Section>

          <Section delay={0.5}>
            <GlassPanel
              accent="rgba(120,180,255,"
              className={`${isMobile ? "p-7" : "p-12"} text-center`}
              style={{ position: "relative" }}
            >
              <CornerAccents flip />
              <div
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.35em",
                  color: isDark ? "rgba(255,255,255,0.4)" : "rgba(80,50,140,0.5)",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                Our Mission
              </div>
              <p
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: isMobile ? "15px" : "18px",
                  fontWeight: 400,
                  lineHeight: 1.8,
                  color: isDark ? "rgba(255,255,255,0.6)" : "rgba(80,50,140,0.7)",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                To develop innovative{" "}
                <span
                  style={{ color: "rgba(200,160,255,0.9)" }}
                >
                  digital worlds and experiences
                </span>{" "}
                that inspire creativity, connection, and
                exploration.
              </p>
            </GlassPanel>
          </Section>
        </div>
      </section>

      {/* ===== 6. FINAL CTA ===== */}
      <section
        className="flex flex-col items-center justify-center py-16 md:py-24 px-5 md:px-8 relative"
        style={{ minHeight: isMobile ? "70vh" : "80vh" }}
      >
        <Section>
          <div
            className="flex flex-col items-center text-center"
            style={{ pointerEvents: "auto" }}
          >
            <span
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.4em",
                color: isDark ? "rgba(255,255,255,0.35)" : "rgba(80,50,140,0.5)",
              }}
            >
              INITIALIZE
            </span>
            <h2
              className="mt-4 mb-4"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: isMobile
                  ? "clamp(22px, 7vw, 32px)"
                  : "clamp(28px, 4vw, 42px)",
                fontWeight: 800,
                lineHeight: 1.25,
                color: isDark ? "#ffffff" : "#1a0a2e",
              }}
            >
              Build With{" "}
              <span
                style={{
                  backgroundImage: isDark
                    ? "linear-gradient(135deg, #7BB8FF, #C77DFF, #E84393)"
                    : "linear-gradient(135deg, #4a6fd8, #7b52c4, #c44a8f)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                NexoraXR
              </span>
            </h2>
            <p
              className="mb-8 md:mb-10"
              style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: isMobile ? "13px" : "14px",
                lineHeight: 1.8,
                color: isDark ? "rgba(255,255,255,0.45)" : "rgba(80,50,140,0.6)",
                maxWidth: "400px",
              }}
            >
              Ready to create experiences that transcend
              reality?
              <br />
              Your XR journey begins here.
            </p>

            <div
              className={`flex gap-4 md:gap-5 ${isMobile ? "flex-col items-center" : ""}`}
            >
              <CTAButton primary large>
                Start Your XR Journey
              </CTAButton>
              <CTAButton large>Contact Us</CTAButton>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <div
          className={`${isMobile ? "mt-16" : "absolute bottom-6 left-1/2 -translate-x-1/2"} flex items-center gap-4 md:gap-5 flex-wrap justify-center`}
          style={{ pointerEvents: "auto" }}
        >
          <Image
            src={nexoraLogo}
            alt="NexoraXR"
            style={{
              height: "14px",
              width: "auto",
              opacity: 0.3,
            }}
          />
          <div
            style={{
              width: "1px",
              height: "10px",
              background: isDark ? "rgba(255,255,255,0.1)" : "rgba(130,90,220,0.15)",
            }}
          />
          <span
            style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: "10px",
              color: isDark ? "rgba(255,255,255,0.2)" : "rgba(80,50,140,0.3)",
            }}
          >
            2026
          </span>
          <div
            style={{
              width: "1px",
              height: "10px",
              background: isDark ? "rgba(255,255,255,0.1)" : "rgba(130,90,220,0.15)",
            }}
          />
          <span
            style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: "10px",
              color: isDark ? "rgba(255,255,255,0.2)" : "rgba(80,50,140,0.3)",
            }}
          >
            Immersive Reality Platform
          </span>
        </div>
      </section>
    </div>
  );
}

// ---- Sub-components ----

function CTAButton({
  children,
  primary,
  large,
}: {
  children: React.ReactNode;
  primary?: boolean;
  large?: boolean;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      className="cursor-pointer transition-all duration-300"
      style={{
        fontFamily: primary
          ? "'Orbitron', sans-serif"
          : "'Exo 2', sans-serif",
        fontSize: large ? "13px" : "12.5px",
        fontWeight: primary ? 600 : 500,
        letterSpacing: primary ? "0.1em" : "0.06em",
        padding: large ? "14px 32px" : "12px 24px",
        color: primary
          ? "#ffffff"
          : isDark ? "rgba(255,255,255,0.6)" : "rgba(80,50,140,0.7)",
        background: primary
          ? isDark
            ? "linear-gradient(135deg, rgba(140,100,220,0.3), rgba(230,80,160,0.22))"
            : "linear-gradient(135deg, rgba(130,90,220,0.8), rgba(200,100,255,0.7))"
          : isDark
            ? "rgba(255,255,255,0.04)"
            : "rgba(130,90,220,0.08)",
        border: primary
          ? isDark
            ? "1px solid rgba(200,130,255,0.22)"
            : "1px solid rgba(130,90,220,0.3)"
          : isDark
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(130,90,220,0.2)",
        borderRadius: "50px",
        boxShadow: primary
          ? isDark
            ? "0 0 24px rgba(180,100,220,0.1)"
            : "0 0 24px rgba(130,90,220,0.15)"
          : "none",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        if (primary) {
          e.currentTarget.style.boxShadow = isDark
            ? "0 0 40px rgba(180,100,220,0.2)"
            : "0 0 40px rgba(130,90,220,0.25)";
          e.currentTarget.style.borderColor = isDark
            ? "rgba(200,130,255,0.35)"
            : "rgba(130,90,220,0.4)";
        } else {
          e.currentTarget.style.color = isDark ? "#ffffff" : "rgba(80,50,140,0.9)";
          e.currentTarget.style.borderColor = isDark
            ? "rgba(255,255,255,0.2)"
            : "rgba(130,90,220,0.3)";
        }
      }}
      onMouseLeave={(e) => {
        if (primary) {
          e.currentTarget.style.boxShadow = isDark
            ? "0 0 24px rgba(180,100,220,0.1)"
            : "0 0 24px rgba(130,90,220,0.15)";
          e.currentTarget.style.borderColor = isDark
            ? "rgba(200,130,255,0.22)"
            : "rgba(130,90,220,0.3)";
        } else {
          e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.6)" : "rgba(80,50,140,0.7)";
          e.currentTarget.style.borderColor = isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(130,90,220,0.2)";
        }
      }}
    >
      {children}
    </button>
  );
}

function HUDChip({
  children,
  accent = "rgba(180,120,220,",
}: {
  children: React.ReactNode;
  accent?: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div
      style={{
        padding: "14px 18px",
        background: isDark
          ? "linear-gradient(135deg, rgba(12,10,24,0.6), rgba(8,6,18,0.4))"
          : "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(250,248,255,0.7))",
        border: `1px solid ${accent}${isDark ? "0.08)" : "0.15)"}`,
        borderRadius: "12px",
        backdropFilter: "blur(12px)",
      }}
    >
      {children}
    </div>
  );
}

function ServiceModule({
  tag,
  title,
  desc,
  stats,
  accent,
  icon,
}: {
  tag: string;
  title: string;
  desc: string;
  stats: { label: string; value: string }[];
  accent: string;
  icon: React.ReactNode;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <GlassPanel
      accent={accent}
      className="group cursor-pointer transition-transform duration-500 hover:scale-[1.02] w-full"
      style={{ maxWidth: "440px", padding: "28px 24px" }}
    >
      <div className="flex items-center justify-between mb-5 md:mb-6">
        <div className="flex items-center gap-3">
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: `${accent}0.08)`,
              border: `1px solid ${accent}0.12)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
          <span
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.25em",
              color: `${accent}0.5)`,
            }}
          >
            {tag}
          </span>
        </div>
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            border: `1px solid ${accent}0.2)`,
            background: `${accent}0.05)`,
            flexShrink: 0,
          }}
        />
      </div>
      <h3
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "18px",
          fontWeight: 700,
          lineHeight: 1.4,
          color: isDark ? "#ffffff" : "#1a0a2e",
          whiteSpace: "pre-line",
          marginBottom: "12px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "'Exo 2', sans-serif",
          fontSize: "13px",
          lineHeight: 1.8,
          color: isDark ? "rgba(255,255,255,0.4)" : "rgba(80,50,140,0.6)",
          marginBottom: "20px",
        }}
      >
        {desc}
      </p>
      <div className="flex gap-6">
        {stats.map((s) => (
          <div key={s.label}>
            <div
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "8px",
                letterSpacing: "0.2em",
                color: isDark ? "rgba(255,255,255,0.25)" : "rgba(80,50,140,0.4)",
                marginBottom: "4px",
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                color: `${accent}${isDark ? "0.75)" : "0.85)"}`,
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[20px]"
        style={{
          boxShadow: `0 0 60px ${accent}0.07), inset 0 0 30px ${accent}0.03)`,
        }}
      />
    </GlassPanel>
  );
}

function DataNode({
  label,
  icon,
}: {
  label: string;
  icon: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div
      className="group cursor-pointer flex items-center gap-3 px-4 md:px-5 py-2.5 md:py-3 transition-all duration-300 hover:scale-105"
      style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(12,10,24,0.5), rgba(8,6,18,0.3))"
          : "linear-gradient(135deg, rgba(255,255,255,0.7), rgba(250,248,255,0.6))",
        border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(130,90,220,0.15)",
        borderRadius: "40px",
        backdropFilter: "blur(12px)",
        pointerEvents: "auto",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = isDark
          ? "rgba(200,130,255,0.18)"
          : "rgba(130,90,220,0.3)";
        e.currentTarget.style.boxShadow = isDark
          ? "0 0 20px rgba(180,100,220,0.08)"
          : "0 0 20px rgba(130,90,220,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isDark
          ? "rgba(255,255,255,0.06)"
          : "rgba(130,90,220,0.15)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <span style={{ fontSize: "14px", opacity: isDark ? 0.6 : 0.7 }}>
        {icon}
      </span>
      <span
        style={{
          fontFamily: "'Exo 2', sans-serif",
          fontSize: "12px",
          color: isDark ? "rgba(255,255,255,0.6)" : "rgba(80,50,140,0.7)",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function BrandCard({
  name,
  tag,
  accent,
  logo,
}: {
  name: string;
  tag: string;
  accent: string;
  logo?: PlatformLogoKey;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const logoColor = isDark ? `${accent}0.92)` : `${accent}0.85)`;
  return (
    <div
      className="group cursor-default flex flex-col items-center justify-center text-center p-5 md:p-6 rounded-2xl transition-all duration-300"
      style={{
        background: isDark
          ? "linear-gradient(160deg, rgba(12,10,24,0.55), rgba(8,6,18,0.35))"
          : "linear-gradient(160deg, rgba(255,255,255,0.8), rgba(250,248,255,0.7))",
        border: `1px solid ${accent}${isDark ? "0.08)" : "0.15)"}`,
        backdropFilter: "blur(14px)",
        minHeight: "110px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${accent}${isDark ? "0.22)" : "0.3)"}`;
        e.currentTarget.style.boxShadow = `0 0 28px ${accent}${isDark ? "0.08)" : "0.12)"}`;
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${accent}${isDark ? "0.08)" : "0.15)"}`;
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {logo ? (
        <div className="flex items-center justify-center mb-3">
          <div
            aria-hidden="true"
            className="flex items-center justify-center"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "12px",
              background: isDark ? `${accent}0.06)` : `${accent}0.08)`,
              border: `1px solid ${accent}${isDark ? "0.14)" : "0.18)"}`,
              boxShadow: isDark ? `0 0 18px ${accent}0.05)` : `0 0 18px ${accent}0.07)`,
              backdropFilter: "blur(10px)",
            }}
          >
            <PlatformLogo kind={logo} color={logoColor} size={20} />
          </div>
          <span className="sr-only">{name} logo</span>
        </div>
      ) : null}
      <span
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "13px",
          fontWeight: 700,
          color: isDark ? "#ffffff" : "#1a0a2e",
          marginBottom: "8px",
          letterSpacing: "0.02em",
        }}
      >
        {name}
      </span>
      <span
        style={{
          fontFamily: "'Exo 2', sans-serif",
          fontSize: "9px",
          letterSpacing: "0.2em",
          color: `${accent}0.55)`,
          textTransform: "uppercase",
        }}
      >
        {tag}
      </span>
    </div>
  );
}

type PlatformLogoKey =
  | "meta"
  | "apple"
  | "playstation"
  | "valve"
  | "htc"
  | "pico"
  | "unity"
  | "unreal"
  | "magicleap"
  | "varjo"
  | "openxr"
  | "webxr";

function PlatformLogo({
  kind,
  color,
  size = 20,
}: {
  kind: PlatformLogoKey;
  color: string;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    style: { display: "block" as const },
  };

  switch (kind) {
    case "meta":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none">
          <path
            d="M3 12c1.6-5.6 6.2-5.6 9 0s7.4 5.6 9 0"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 12c-1.6-5.6-6.2-5.6-9 0S4.6 17.6 3 12"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.75"
          />
        </svg>
      );

    case "apple":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none">
          <path
            d="M15.3 6.3c.9-1 1.6-2.4 1.4-3.8-1.3.1-2.8.9-3.7 1.9-.8.9-1.6 2.3-1.4 3.7 1.4.1 2.8-.7 3.7-1.8Z"
            fill={color}
            opacity="0.95"
          />
          <path
            d="M12.2 8.2c1.9 0 2.7-1 4.3-1 1.5 0 2.8.9 3.6 2.1-1.7 1-2.4 2.8-2.1 4.6.3 2 1.9 3.6 3 4.2-.7 1.7-1.6 3.3-2.8 3.3-1.2 0-1.6-.8-3.1-.8s-2 .8-3.1.8c-1.2 0-2.5-1.7-3.4-3.4-1.8-3.4-2-7.8.9-10 .9-.7 2.1-1.1 3.2-1.1Z"
            fill={color}
            opacity="0.85"
          />
        </svg>
      );

    case "playstation":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none">
          <path
            d="M11 4.5v14"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M11 6.2c4.2.6 6.8 2.1 6.8 4.1 0 1.4-1.3 2.4-3.6 2.8"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 18.4c-3.8.1-6.5-1-6.5-2.7 0-1.3 1.6-2.4 4.2-2.9l6.9-1.4c2.5-.5 5 .1 6.2 1.4"
            stroke={color}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </svg>
      );

    case "valve":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="14.5" r="3.2" stroke={color} strokeWidth="2" />
          <circle cx="18.2" cy="7.2" r="2.2" fill={color} opacity="0.95" />
          <path
            d="M11.8 12.9 16.6 9.6"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M6.3 17.3h6.2"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      );

    case "htc":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none">
          <text
            x="12"
            y="15.8"
            textAnchor="middle"
            fontSize="9.5"
            fontFamily="'Orbitron', sans-serif"
            fontWeight="800"
            fill={color}
            letterSpacing="1.2"
          >
            HTC
          </text>
        </svg>
      );

    case "pico":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none">
          <text
            x="12"
            y="15.8"
            textAnchor="middle"
            fontSize="10"
            fontFamily="'Orbitron', sans-serif"
            fontWeight="800"
            fill={color}
            letterSpacing="1.1"
          >
            PICO
          </text>
        </svg>
      );

    case "unity":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3.8 19 7.9v8.2l-7 4.1-7-4.1V7.9l7-4.1Z"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M12 3.8v8.1l7 4.2M12 11.9 5 16.1"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
            opacity="0.7"
          />
        </svg>
      );

    case "unreal":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" opacity="0.9" />
          <path
            d="M9 8.5v6.2c0 1.8 1.4 3 3 3s3-1.2 3-3V8.5"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "magicleap":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none">
          <path
            d="M6.5 17V7.8l5.5 6.2 5.5-6.2V17"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="18.5" r="1.1" fill={color} opacity="0.9" />
        </svg>
      );

    case "varjo":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none">
          <path
            d="M5.5 7.2 12 18.2l6.5-11"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.2 7.2 12 13.8l3.8-6.6"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.65"
          />
        </svg>
      );

    case "openxr":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none">
          <rect
            x="4.5"
            y="6.5"
            width="15"
            height="11"
            rx="3"
            stroke={color}
            strokeWidth="2"
            opacity="0.9"
          />
          <text
            x="12"
            y="14.8"
            textAnchor="middle"
            fontSize="8.4"
            fontFamily="'Orbitron', sans-serif"
            fontWeight="800"
            fill={color}
            letterSpacing="1.2"
          >
            XR
          </text>
        </svg>
      );

    case "webxr":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none">
          <circle cx="8" cy="12" r="4.2" stroke={color} strokeWidth="2" opacity="0.9" />
          <path
            d="M3.8 12h8.4M8 7.8c1.4 1.2 2.2 2.6 2.2 4.2S9.4 15 8 16.2"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.7"
          />
          <text
            x="17.2"
            y="14.8"
            textAnchor="middle"
            fontSize="8.2"
            fontFamily="'Orbitron', sans-serif"
            fontWeight="800"
            fill={color}
            letterSpacing="1"
          >
            XR
          </text>
        </svg>
      );

    default:
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
        </svg>
      );
  }
}

function StoryCard({
  img,
  title,
  subtitle,
  desc,
  accent,
  glowColor,
  isMobile,
  link,
}: {
  img: string;
  title: string;
  subtitle: string;
  desc: string;
  accent: string;
  glowColor: string;
  isMobile?: boolean;
  link?: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  return (
    <div
      onClick={() => link && router.push(link)}
      className="group relative cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-2"
      style={{
        flex: 1,
        maxWidth: isMobile ? "100%" : "460px",
        borderRadius: "22px",
        background: isDark
          ? "linear-gradient(160deg, rgba(12,10,24,0.75) 0%, rgba(8,6,18,0.55) 100%)"
          : "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(250,248,255,0.85) 100%)",
        border: `1px solid ${accent}${isDark ? "0.1)" : "0.2)"}`,
        backdropFilter: "blur(20px)",
        boxShadow: `0 0 40px ${accent}${isDark ? "0.04)" : "0.08)"}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${accent}0.25)`;
        e.currentTarget.style.boxShadow = `0 0 60px ${glowColor}, inset 0 0 30px ${accent}0.03)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${accent}0.1)`;
        e.currentTarget.style.boxShadow = `0 0 40px ${accent}0.04)`;
      }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{
          height: isMobile ? "200px" : "260px",
          borderRadius: "22px 22px 0 0",
        }}
      >
        <Image
          src={img}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ opacity: 0.85 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? `linear-gradient(to bottom, transparent 30%, rgba(8,6,18,0.95) 100%), linear-gradient(135deg, ${accent}0.05), transparent 60%)`
              : `linear-gradient(to bottom, transparent 30%, rgba(250,248,255,0.95) 100%), linear-gradient(135deg, ${accent}0.08), transparent 60%)`,
          }}
        />
        <div
          className="absolute inset-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
          style={{ border: `1px solid ${accent}0.15)` }}
        />
        <div
          className="absolute top-4 left-4 px-3 py-1.5 rounded-full"
          style={{
            background: isDark ? "rgba(6,6,14,0.65)" : "rgba(255,255,255,0.8)",
            border: `1px solid ${accent}${isDark ? "0.2)" : "0.25)"}`,
            backdropFilter: "blur(10px)",
          }}
        >
          <span
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.25em",
              color: `${accent}0.8)`,
            }}
          >
            {subtitle}
          </span>
        </div>
        <div
          className="absolute top-4 right-4"
          style={{ opacity: 0.4 }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={`${accent}0.7)`}
            strokeWidth="1.2"
          >
            <path d="M2 10a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4h-2.28l-1.44-1.44a2 2 0 0 0-2.56 0L10.28 18H8a4 4 0 0 1-4-4v-4Z" />
            <circle cx="8" cy="12" r="2" />
            <circle cx="16" cy="12" r="2" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: isMobile ? "20px" : "26px 28px 28px" }}>
        <h3
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: isMobile ? "16px" : "18px",
            fontWeight: 700,
            color: isDark ? "#ffffff" : "#1a0a2e",
            marginBottom: "10px",
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: "'Exo 2', sans-serif",
            fontSize: isMobile ? "12px" : "13px",
            lineHeight: 1.8,
            color: isDark ? "rgba(255,255,255,0.4)" : "rgba(80,50,140,0.6)",
            marginBottom: "20px",
          }}
        >
          {desc}
        </p>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 group-hover:scale-105"
            style={{
              border: `1px solid ${accent}0.15)`,
              background: `${accent}0.05)`,
            }}
          >
            <span
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.12em",
                color: `${accent}0.75)`,
              }}
            >
              Enter Story
            </span>
            <div
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: `${accent}0.6)`,
                boxShadow: `0 0 8px ${accent}0.5)`,
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: "10px",
              color: isDark ? "rgba(255,255,255,0.2)" : "rgba(80,50,140,0.3)",
              letterSpacing: "0.1em",
            }}
          >
            VR EXPERIENCE
          </span>
        </div>
      </div>

      {/* Top glow line */}
      <div
        className="absolute top-0 left-8 right-8"
        style={{
          height: "1px",
          background: `linear-gradient(to right, transparent, ${accent}0.2), transparent)`,
        }}
      />
    </div>
  );
}

function WorldCapsule({
  tag,
  title,
  desc,
  accent,
  img,
  isMobile,
}: {
  tag: string;
  title: string;
  desc: string;
  accent: string;
  img: string;
  isMobile?: boolean;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <GlassPanel
      accent={accent}
      className="group cursor-pointer overflow-hidden transition-transform duration-500 hover:-translate-y-2"
      style={{
        width: isMobile ? "100%" : "320px",
        maxWidth: "340px",
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{ height: isMobile ? "160px" : "180px" }}
      >
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{
            opacity: isDark ? 0.55 : 0.75,
            filter: isDark ? "saturate(0.6) brightness(0.55)" : "saturate(0.8) brightness(0.9)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? `linear-gradient(to bottom, transparent 20%, rgba(6,6,14,0.9) 100%), linear-gradient(135deg, ${accent}0.06), transparent 60%)`
              : `linear-gradient(to bottom, transparent 20%, rgba(250,248,255,0.9) 100%), linear-gradient(135deg, ${accent}0.1), transparent 60%)`,
          }}
        />
        <div
          className="absolute inset-3 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-xl"
          style={{ border: `1px solid ${accent}0.12)` }}
        />
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full"
          style={{
            background: isDark ? "rgba(6,6,14,0.6)" : "rgba(255,255,255,0.75)",
            border: `1px solid ${accent}${isDark ? "0.15)" : "0.2)"}`,
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "8px",
              letterSpacing: "0.2em",
              color: `${accent}0.7)`,
            }}
          >
            {tag}
          </span>
        </div>
      </div>
      <div style={{ padding: isMobile ? "18px" : "22px" }}>
        <h3
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "15px",
            fontWeight: 700,
            color: isDark ? "#ffffff" : "#1a0a2e",
            marginBottom: "8px",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: "'Exo 2', sans-serif",
            fontSize: "12px",
            lineHeight: 1.7,
            color: isDark ? "rgba(255,255,255,0.38)" : "rgba(80,50,140,0.6)",
          }}
        >
          {desc}
        </p>
        <div className="mt-4 md:mt-5 flex items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              border: `1px solid ${accent}0.12)`,
              background: `${accent}0.04)`,
            }}
          >
            <span
              style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: "10.5px",
                letterSpacing: "0.1em",
                color: `${accent}0.65)`,
              }}
            >
              Enter World
            </span>
            <div
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: `${accent}0.5)`,
                boxShadow: `0 0 6px ${accent}0.4)`,
              }}
            />
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

function CornerAccents({ flip }: { flip?: boolean }) {
  return (
    <>
      <div
        className="absolute"
        style={{
          width: "35px",
          height: "35px",
          ...(flip
            ? {
                top: 0,
                right: 0,
                borderTop: "1px solid rgba(120,180,255,0.15)",
                borderRight: "1px solid rgba(120,180,255,0.15)",
                borderRadius: "0 20px 0 0",
              }
            : {
                top: 0,
                left: 0,
                borderTop: "1px solid rgba(200,130,255,0.15)",
                borderLeft: "1px solid rgba(200,130,255,0.15)",
                borderRadius: "20px 0 0 0",
              }),
        }}
      />
      <div
        className="absolute"
        style={{
          width: "35px",
          height: "35px",
          ...(flip
            ? {
                bottom: 0,
                left: 0,
                borderBottom: "1px solid rgba(230,80,160,0.12)",
                borderLeft: "1px solid rgba(230,80,160,0.12)",
                borderRadius: "0 0 0 20px",
              }
            : {
                bottom: 0,
                right: 0,
                borderBottom:
                  "1px solid rgba(120,180,255,0.12)",
                borderRight: "1px solid rgba(120,180,255,0.12)",
                borderRadius: "0 0 20px 0",
              }),
        }}
      />
    </>
  );
}

// Mini SVG icons
function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgba(120,180,255,0.65)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function GamepadIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgba(200,100,220,0.65)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="6" y1="12" x2="10" y2="12" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <line x1="15" y1="13" x2="15.01" y2="13" />
      <line x1="18" y1="11" x2="18.01" y2="11" />
      <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.544-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
    </svg>
  );
}