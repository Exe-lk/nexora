"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import nexoraLogo from "../assets/images/logo.png";
import heavenImg from "../assets/images/heaven.png";
import hellImg from "../assets/images/hell.png";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "./HUDOverlay";

export function Navbar() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);
  const [mobileExpOpen, setMobileExpOpen] = useState(false);
  const expRef = useRef<HTMLDivElement>(null);
  const expTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isMobile = useIsMobile();
  const [isTabletOrSmall, setIsTabletOrSmall] = useState(false);

  useEffect(() => {
    const check = () => setIsTabletOrSmall(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

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
        className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center justify-between gap-1"
        style={{
          zIndex: 200,
          backdropFilter: scrolled ? "blur(28px) saturate(1.4)" : "blur(8px)",
          WebkitBackdropFilter: scrolled ? "blur(28px) saturate(1.4)" : "blur(8px)",
          background: isDark
            ? scrolled
              ? "linear-gradient(135deg, rgba(6,6,14,0.55) 0%, rgba(4,4,10,0.42) 100%)"
              : "transparent"
            : scrolled
              ? "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(250,248,255,0.28) 100%)"
              : "transparent",
          border: isDark
            ? scrolled
              ? "1px solid rgba(255,255,255,0.10)"
              : "1px solid rgba(255,255,255,0.06)"
            : scrolled
              ? "1px solid rgba(130,90,220,0.20)"
              : "1px solid rgba(130,90,220,0.10)",
          borderRadius: "60px",
          padding: isMobile
            ? "8px 12px 8px 14px"
            : isTabletOrSmall
              ? "8px 14px 8px 18px"
              : "10px 10px 10px 22px",
          boxShadow: isDark
            ? scrolled
              ? "0 4px 40px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.04) inset"
              : "none"
            : scrolled
              ? "0 4px 32px rgba(130,90,220,0.12), 0 1px 0 rgba(255,255,255,0.6) inset"
              : "none",
          transition: "background 0.5s ease, border 0.5s ease, backdrop-filter 0.5s ease, box-shadow 0.5s ease",
          width: "min(960px, 95vw)",
          overflow: "visible",
        }}
      >
        <Image
          src={nexoraLogo}
          alt="NexoraXR"
          className="select-none cursor-pointer"
          onClick={handleNavHome}
          style={{
            height: isMobile ? "110px" : isTabletOrSmall ? "78px" : "116px",
            width: "auto",
            opacity: 1,
            marginRight: isMobile ? "6px" : isTabletOrSmall ? "10px" : "20px",
            marginTop: isMobile ? "-14px" : isTabletOrSmall ? "-10px" : "-15px",
            marginBottom: isMobile ? "-14px" : isTabletOrSmall ? "-10px" : "-15px",
            filter: isDark
              ? "drop-shadow(0 0 12px rgba(120,160,255,0.35)) drop-shadow(0 2px 8px rgba(0,0,0,0.5))"
              : "drop-shadow(0 0 10px rgba(130,90,220,0.25)) drop-shadow(0 2px 6px rgba(0,0,0,0.15))",
            transition: "filter 0.4s ease",
          }}
          priority
        />

        {!isTabletOrSmall && (
          <>
            <div
              ref={expRef}
              className="relative"
              onMouseEnter={handleExpEnter}
              onMouseLeave={handleExpLeave}
            >
              <button
                className="px-4 py-2 rounded-full transition-all duration-300 cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: "15px",
                  color: isDark
                    ? expOpen ? "#ffffff" : "rgba(255,255,255,0.88)"
                    : expOpen ? "rgba(60,30,120,1)" : "rgba(60,30,120,0.85)",
                  background: expOpen
                    ? isDark ? "rgba(255,255,255,0.08)" : "rgba(130,90,220,0.1)"
                    : "transparent",
                  border: "none",
                  letterSpacing: "0.06em",
                  textShadow: isDark
                    ? "0 1px 8px rgba(0,0,0,0.7)"
                    : "0 1px 6px rgba(255,255,255,0.8)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = isDark ? "#ffffff" : "rgba(60,30,120,1)";
                  e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.08)" : "rgba(130,90,220,0.1)";
                }}
                onMouseLeave={(e) => {
                  if (!expOpen) {
                    e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.88)" : "rgba(60,30,120,0.85)";
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
                    <div className="px-4 pt-3 pb-2">
                      <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "8px", letterSpacing: "0.3em", color: isDark ? "rgba(255,255,255,0.3)" : "rgba(80,50,140,0.65)" }}>
                        EXPLORE WORLDS
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
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
                            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "8px", letterSpacing: "0.2em", color: isDark ? "rgba(220,200,100,0.5)" : "rgba(120,90,0,0.75)" }}>
                              HEAVEN
                            </span>
                            <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(220,200,100,0.4)" }} />
                          </div>
                          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "12px", fontWeight: 700, color: isDark ? "#fff" : "#1a0a2e", marginBottom: "2px" }}>
                            Swarga: The Celestial Realm
                          </div>
                          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "10px", color: isDark ? "rgba(255,255,255,0.35)" : "rgba(80,50,140,0.65)" }}>
                            Golden temples &amp; divine wonder
                          </div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="rgba(220,200,100,0.4)" strokeWidth="1.2" className="shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                          <path d="M5 3l4 4-4 4" />
                        </svg>
                      </button>

                      <div className="mx-4" style={{ height: "1px", background: isDark ? "linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)" : "linear-gradient(to right, transparent, rgba(130,90,220,0.1), transparent)" }} />

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
                            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "8px", letterSpacing: "0.2em", color: isDark ? "rgba(230,80,60,0.5)" : "rgba(180,40,20,0.75)" }}>
                              HELL
                            </span>
                            <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(230,80,60,0.4)" }} />
                          </div>
                          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "12px", fontWeight: 700, color: isDark ? "#fff" : "#1a0a2e", marginBottom: "2px" }}>
                            Naraka: The Infernal Depths
                          </div>
                          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "10px", color: isDark ? "rgba(255,255,255,0.35)" : "rgba(80,50,140,0.65)" }}>
                            Volcanic wastelands &amp; rivers of fire
                          </div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="rgba(230,80,60,0.4)" strokeWidth="1.2" className="shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                          <path d="M5 3l4 4-4 4" />
                        </svg>
                      </button>
                    </div>

                    <div className="px-4 pt-2 pb-2 mt-1">
                      <div style={{ height: "1px", background: isDark ? "linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)" : "linear-gradient(to right, transparent, rgba(130,90,220,0.1), transparent)", marginBottom: "8px" }} />
                      <span style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "9px", color: isDark ? "rgba(255,255,255,0.2)" : "rgba(80,50,140,0.65)", letterSpacing: "0.1em" }}>
                        More worlds coming soon...
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navItems.map((item) => (
              <button
                key={item}
                className="px-4 py-2 rounded-full transition-all duration-300 cursor-pointer shrink-0 whitespace-nowrap"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: "15px",
                  color: isDark ? "rgba(255,255,255,0.88)" : "rgba(60,30,120,0.85)",
                  background: "transparent",
                  border: "none",
                  letterSpacing: "0.06em",
                  textShadow: isDark
                    ? "0 1px 8px rgba(0,0,0,0.7)"
                    : "0 1px 6px rgba(255,255,255,0.8)",
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
                  e.currentTarget.style.color = isDark ? "#ffffff" : "rgba(60,30,120,1)";
                  e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.08)" : "rgba(130,90,220,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.88)" : "rgba(60,30,120,0.85)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {item}
              </button>
            ))}
          </>
        )}

        {!isTabletOrSmall && (
          <div className="ml-2">
            <ThemeToggle />
          </div>
        )}

        {isTabletOrSmall && (
          <button
            className="p-2.5 rounded-full cursor-pointer"
            style={{
              background: "transparent",
              border: "none",
            }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <div className="flex flex-col gap-1.5">
              <motion.div
                animate={{
                  rotate: menuOpen ? 45 : 0,
                  y: menuOpen ? 6 : 0,
                }}
                style={{
                  width: "22px",
                  height: "2px",
                  background: isDark ? "rgba(255,255,255,0.95)" : "rgba(60,30,120,0.9)",
                  borderRadius: "2px",
                  boxShadow: isDark ? "0 0 6px rgba(255,255,255,0.4)" : "0 0 4px rgba(255,255,255,0.6)",
                }}
              />
              <motion.div
                animate={{ opacity: menuOpen ? 0 : 1 }}
                style={{
                  width: "22px",
                  height: "2px",
                  background: isDark ? "rgba(255,255,255,0.95)" : "rgba(60,30,120,0.9)",
                  borderRadius: "2px",
                  boxShadow: isDark ? "0 0 6px rgba(255,255,255,0.4)" : "0 0 4px rgba(255,255,255,0.6)",
                }}
              />
              <motion.div
                animate={{
                  rotate: menuOpen ? -45 : 0,
                  y: menuOpen ? -6 : 0,
                }}
                style={{
                  width: "22px",
                  height: "2px",
                  background: isDark ? "rgba(255,255,255,0.95)" : "rgba(60,30,120,0.9)",
                  borderRadius: "2px",
                  boxShadow: isDark ? "0 0 6px rgba(255,255,255,0.4)" : "0 0 4px rgba(255,255,255,0.6)",
                }}
              />
            </div>
          </button>
        )}
      </motion.nav>

      {isTabletOrSmall && (
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
          className="fixed top-[5.5rem] left-4 right-4 flex flex-col items-center gap-1 py-5 px-4 rounded-2xl"
          style={{
            zIndex: 199,
            backdropFilter: "blur(32px) saturate(1.5)",
            WebkitBackdropFilter: "blur(32px) saturate(1.5)",
            background: isDark
              ? "linear-gradient(135deg, rgba(6,6,14,0.72), rgba(4,4,10,0.60))"
              : "linear-gradient(135deg, rgba(255,255,255,0.65), rgba(250,248,255,0.55))",
            border: isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(130,90,220,0.18)",
            boxShadow: isDark
              ? "0 8px 40px rgba(0,0,0,0.4)"
              : "0 8px 40px rgba(130,90,220,0.12)",
          }}
        >
          <button
            className="w-full py-3.5 rounded-xl transition-all cursor-pointer"
            style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: "15px",
              color: isDark ? "rgba(255,255,255,0.90)" : "rgba(60,30,120,0.88)",
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
                      <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "9px", color: isDark ? "rgba(220,200,100,0.7)" : "rgba(120,90,0,0.75)" }}>Heaven</div>
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
                      <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "9px", color: isDark ? "rgba(230,80,60,0.7)" : "rgba(180,40,20,0.8)" }}>Hell</div>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {navItems.map((item) => (
            <button
              key={item}
              className="w-full py-3.5 rounded-xl transition-all cursor-pointer"
              style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: "15px",
                color: isDark ? "rgba(255,255,255,0.90)" : "rgba(60,30,120,0.88)",
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
        </motion.div>
      )}
    </>
  );
}

