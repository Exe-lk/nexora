"use client";

import { Navbar } from "@/components/Navbar";
import { FloatingNav } from "@/components/HUDOverlay";
import { WebGLScene } from "@/components/WebGLScene";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type Field = {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "email" | "tel";
};

function FieldLabel({ label, required, isDark }: { label: string; required?: boolean; isDark: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "10px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: isDark ? "rgba(255,255,255,0.6)" : "rgba(60,40,100,0.7)",
        }}
      >
        {label}
      </span>
      {required && (
        <span
          aria-hidden
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.12em",
            color: isDark ? "rgba(236,72,153,0.9)" : "rgba(190,24,93,0.9)",
          }}
        >
          *
        </span>
      )}
    </div>
  );
}

export default function ContactPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const stateRef = useRef({ scrollY: 0, mouseX: 0, mouseY: 0 });
  const [form, setForm] = useState<Record<string, string>>({});
  const [viewW, setViewW] = useState(0);

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

  useEffect(() => {
    const update = () => setViewW(window.innerWidth);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const fields = useMemo<Field[]>(
    () => [
      { id: "name", label: "Name", placeholder: "Your name", required: true },
      { id: "company", label: "Company", placeholder: "Company / brand / venue" },
      { id: "email", label: "Email", placeholder: "you@company.com", required: true, type: "email" },
      { id: "phone", label: "Phone", placeholder: "+44 …", type: "tel" },
    ],
    [],
  );

  return (
    <div
      className="w-full relative min-h-screen"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #060810 0%, #080c18 20%, #0a0e1a 40%, #070b14 60%, #080c18 80%, #050810 100%)"
          : "linear-gradient(180deg, #faf8ff 0%, #f3eeff 20%, #ffffff 40%, #f8f4ff 60%, #f3eeff 80%, #faf8ff 100%)",
        overflowX: "hidden",
      }}
    >
      <WebGLScene key={theme} state={stateRef} isDark={isDark} />
      <Navbar />

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
              background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 50%, rgba(3,4,8,0.55) 100%)",
            }}
          />
        </>
      )}

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-24 md:pb-28">
        <section className="relative flex flex-col items-center justify-center text-center px-4 sm:px-6">
          {/* Animated background rings inspired by Occasions hero */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {([
              Math.min((viewW || 800) * 0.55, 460),
              Math.min((viewW || 800) * 0.38, 320),
              Math.min((viewW || 800) * 0.24, 190),
            ] as number[]).map((size, i) => (
              <motion.div
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  border: isDark
                    ? `1px solid rgba(168,85,247,${0.06 + i * 0.04})`
                    : `1px solid rgba(130,60,220,${0.06 + i * 0.04})`,
                }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 42 - i * 8, repeat: Infinity, ease: "linear" }}
              />
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <h1
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                backgroundImage: isDark
                  ? "linear-gradient(135deg, #c084fc 0%, #818cf8 40%, #38bdf8 100%)"
                  : "linear-gradient(135deg, #7c3aed 0%, #6366f1 40%, #0ea5e9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "12px",
              }}
            >
              Partner with NexoraXR
              <br />
              bring immersive XR to life
            </h1>
            <p
              className="mx-auto"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1rem",
                lineHeight: 1.7,
                color: isDark ? "rgba(255,255,255,0.5)" : "rgba(60,40,100,0.65)",
                maxWidth: "min(680px, 92vw)",
              }}
            >
              Venues, brands, events, and collaborators—tell us what you’re building. We’ll reply with the fastest path to an XR experience that
              feels cinematic, interactive, and on-theme.
            </p>
          </motion.div>
        </section>

        <section className="mt-12 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: "easeOut" }}
            className="w-full lg:max-w-3xl"
          >
            <div
              className="rounded-3xl p-6 backdrop-blur-xl"
              style={{
                background: isDark
                  ? "linear-gradient(160deg, rgba(10,8,20,0.72) 0%, rgba(15,12,28,0.58) 100%)"
                  : "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(248,246,255,0.86) 100%)",
                border: isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(130,90,220,0.16)",
                boxShadow: isDark ? "0 18px 60px rgba(0,0,0,0.35)" : "0 16px 50px rgba(130,90,220,0.14)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: isDark ? "rgba(168,85,247,0.7)" : "rgba(109,40,217,0.65)",
                }}
              >
                Send a message
              </div>
              <h2
                className="mt-2"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "clamp(1.15rem, 2.2vw, 1.6rem)",
                  fontWeight: 800,
                  color: isDark ? "#fff" : "#1a0a2e",
                }}
              >
                Share the essentials
              </h2>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map((f) => (
                  <div key={f.id} className="flex flex-col gap-2">
                    <FieldLabel label={f.label} required={f.required} isDark={isDark} />
                    <input
                      type={f.type ?? "text"}
                      value={form[f.id] ?? ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, [f.id]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full rounded-2xl px-4 py-3 outline-none"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.95rem",
                        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(130,90,220,0.06)",
                        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(130,90,220,0.12)",
                        color: isDark ? "rgba(255,255,255,0.92)" : "#1a0a2e",
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <FieldLabel label="Project summary" isDark={isDark} />
                <textarea
                  value={form.project ?? ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, project: e.target.value }))}
                  placeholder="What are you launching? Space size, audience, timeline, and what you want people to feel."
                  rows={5}
                  className="w-full rounded-2xl px-4 py-3 outline-none resize-none"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.95rem",
                    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(130,90,220,0.06)",
                    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(130,90,220,0.12)",
                    color: isDark ? "rgba(255,255,255,0.92)" : "#1a0a2e",
                  }}
                />
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="px-7 py-3 rounded-full text-white cursor-not-allowed opacity-75"
                  style={{
                    fontFamily: "'Exo 2', sans-serif",
                    fontSize: "13px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    backgroundImage: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
                    border: "none",
                  }}
                  disabled
                  aria-disabled
                  title="Form submission will be enabled soon. Use the Email Us button for now."
                >
                  Send
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-7 py-3 rounded-full cursor-pointer inline-flex justify-center"
                  style={{
                    fontFamily: "'Exo 2', sans-serif",
                    fontSize: "13px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    color: isDark ? "#c4b5fd" : "#6d28d9",
                    background: isDark ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.85)",
                    border: isDark ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(109,40,217,0.2)",
                  }}
                  href="mailto:hello@nexoraxr.com?subject=Partnership%20enquiry%20(NexoraXR)"
                >
                  Email this instead
                </motion.a>
              </div>

              <div className="mt-4">
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.86rem",
                    lineHeight: 1.6,
                    color: isDark ? "rgba(255,255,255,0.45)" : "rgba(60,40,100,0.62)",
                  }}
                >
                  Keep it short: the venue/event context, timeline, and the vibe you want. We’ll follow up with next steps.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

      </main>
    </div>
  );
}

