"use client";

import { FloatingNav } from "@/components/HUDOverlay";
import { WebGLScene } from "@/components/WebGLScene";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";

type SectionId = "who" | "story" | "what" | "why" | "reviews";

type Review = {
  id: string;
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  message: string;
  createdAt: number; // epoch ms
  experience: "XR Walking Theatre" | "World Experience" | "Prototype" | "Event";
};

const ACCENT = {
  a: "rgba(120,180,255,",
  b: "rgba(200,130,255,",
  c: "rgba(230,80,160,",
};

const STORAGE_KEY = "nexora.about.reviews.v1";

const SEED_REVIEWS: Review[] = [
  {
    id: "seed-1",
    name: "Ayesha P.",
    rating: 5,
    title: "Felt like stepping into a film set",
    message:
      "The pacing, lighting, and tiny interaction details were unreal. It wasn’t just VR—it was staged like theatre, but you’re inside the story.",
    createdAt: new Date("2026-01-18T10:20:00Z").getTime(),
    experience: "XR Walking Theatre",
  },
  {
    id: "seed-2",
    name: "Nimal K.",
    rating: 5,
    title: "Premium and comfortable",
    message:
      "No confusion, no motion sickness. The onboarding was smooth and the world reacted to me in a way that felt intentional. Super polished.",
    createdAt: new Date("2026-02-02T12:05:00Z").getTime(),
    experience: "XR Walking Theatre",
  },
  {
    id: "seed-3",
    name: "Sanjana R.",
    rating: 4,
    title: "Great for groups & events",
    message:
      "We tried it at a small event—people immediately understood what to do. The experience had a strong ‘wow’ moment that everyone talked about after.",
    createdAt: new Date("2026-02-19T09:45:00Z").getTime(),
    experience: "Event",
  },
  {
    id: "seed-4",
    name: "Dulshan M.",
    rating: 5,
    title: "Story + interaction done right",
    message:
      "The way the environment guides you is smart. You never feel lost, but you still feel free. That balance is rare.",
    createdAt: new Date("2026-03-01T16:30:00Z").getTime(),
    experience: "World Experience",
  },
];

function safeId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `r-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

function formatDate(ms: number) {
  try {
    return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "2-digit" }).format(new Date(ms));
  } catch {
    return new Date(ms).toDateString();
  }
}

function scrollToId(id: SectionId) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useActiveSection(sectionIds: SectionId[]) {
  const [active, setActive] = useState<SectionId>(sectionIds[0] ?? "who");

  useEffect(() => {
    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (!visible?.target) return;
        const id = (visible.target as HTMLElement).id as SectionId;
        if (id) setActive(id);
      },
      {
        root: null,
        rootMargin: "-18% 0px -62% 0px",
        threshold: [0.08, 0.16, 0.25, 0.35, 0.45, 0.55, 0.65],
      },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sectionIds]);

  return active;
}

function GlassPanel({
  children,
  accent = ACCENT.b,
  className = "",
  style,
  isDark = true,
}: {
  children: React.ReactNode;
  accent?: string;
  className?: string;
  style?: React.CSSProperties;
  isDark?: boolean;
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        background: isDark
          ? "linear-gradient(160deg, rgba(12,10,24,0.7) 0%, rgba(8,6,18,0.5) 100%)"
          : "linear-gradient(160deg, rgba(255,255,255,0.9) 0%, rgba(250,248,255,0.8) 100%)",
        border: `1px solid ${accent}${isDark ? "0.1)" : "0.15)"}`,
        borderRadius: "20px",
        backdropFilter: "blur(20px)",
        boxShadow: isDark
          ? `0 0 40px ${accent}0.04), inset 0 1px 0 rgba(255,255,255,0.04)`
          : `0 0 30px ${accent}0.03), inset 0 1px 0 rgba(0,0,0,0.02)`,
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

function SectionHeader({
  label,
  left = "rgba(200,130,255,0.3)",
  right = "rgba(230,80,160,0.3)",
}: {
  label: string;
  left?: string;
  right?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div style={{ width: "40px", height: "1px", background: `linear-gradient(to right, transparent, ${left})` }} />
      <span
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "10px",
          letterSpacing: "0.4em",
          color: "rgba(255,255,255,0.35)",
        }}
      >
        {label}
      </span>
      <div style={{ width: "40px", height: "1px", background: `linear-gradient(to left, transparent, ${right})` }} />
    </div>
  );
}

function PillButton({
  children,
  onClick,
  primary,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  primary?: boolean;
}) {
  return (
    <button
      className="cursor-pointer transition-all duration-300"
      onClick={onClick}
      style={{
        fontFamily: primary ? "'Orbitron', sans-serif" : "'Exo 2', sans-serif",
        fontSize: "12.5px",
        fontWeight: primary ? 600 : 500,
        letterSpacing: primary ? "0.1em" : "0.06em",
        padding: "12px 24px",
        color: primary ? "#ffffff" : "rgba(255,255,255,0.6)",
        background: primary
          ? "linear-gradient(135deg, rgba(140,100,220,0.3), rgba(230,80,160,0.22))"
          : "rgba(255,255,255,0.04)",
        border: primary ? "1px solid rgba(200,130,255,0.22)" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: "50px",
        boxShadow: primary ? "0 0 24px rgba(180,100,220,0.1)" : "none",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        if (primary) {
          e.currentTarget.style.boxShadow = "0 0 40px rgba(180,100,220,0.2)";
          e.currentTarget.style.borderColor = "rgba(200,130,255,0.35)";
        } else {
          e.currentTarget.style.color = "#ffffff";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
        }
      }}
      onMouseLeave={(e) => {
        if (primary) {
          e.currentTarget.style.boxShadow = "0 0 24px rgba(180,100,220,0.1)";
          e.currentTarget.style.borderColor = "rgba(200,130,255,0.22)";
        } else {
          e.currentTarget.style.color = "rgba(255,255,255,0.6)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        }
      }}
    >
      {children}
    </button>
  );
}

function Stars({ value }: { value: number }) {
  const v = Math.max(0, Math.min(5, value));
  return (
    <div className="flex items-center gap-1">
      {new Array(5).fill(0).map((_, i) => {
        const filled = i < v;
        return (
          <svg
            key={i}
            width="12"
            height="12"
            viewBox="0 0 20 20"
            fill={filled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.18)"}
            style={{ filter: filled ? "drop-shadow(0 0 8px rgba(200,130,255,0.18))" : "none" }}
          >
            <path d="M10 1.6l2.5 5.5 6 .7-4.4 3.9 1.2 5.8L10 14.8 4.7 17.4l1.2-5.8L1.5 7.8l6-.7L10 1.6z" />
          </svg>
        );
      })}
    </div>
  );
}

function RatingPicker({ value, onChange }: { value: Review["rating"]; onChange: (v: Review["rating"]) => void }) {
  const [hover, setHover] = useState<number | null>(null);
  const v = hover ?? value;
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {new Array(5).fill(0).map((_, i) => {
          const n = i + 1;
          const filled = n <= v;
          return (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onChange(n as Review["rating"])}
              className="cursor-pointer"
              style={{ background: "transparent", border: "none", padding: "2px" }}
              aria-label={`Set rating ${n}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill={filled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.18)"}
                style={{ filter: filled ? "drop-shadow(0 0 10px rgba(200,130,255,0.22))" : "none" }}
              >
                <path d="M10 1.6l2.5 5.5 6 .7-4.4 3.9 1.2 5.8L10 14.8 4.7 17.4l1.2-5.8L1.5 7.8l6-.7L10 1.6z" />
              </svg>
            </button>
          );
        })}
      </div>
      <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>
        {value}/5
      </div>
    </div>
  );
}

function TiltCard({
  children,
  accent = ACCENT.b,
  className = "",
}: {
  children: React.ReactNode;
  accent?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0, glow: 0 });

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const ry = (px - 0.5) * 10;
        const rx = -(py - 0.5) * 8;
        setT({ rx, ry, glow: clamp01(1 - Math.abs(px - 0.5) * 2) });
      }}
      onMouseLeave={() => setT({ rx: 0, ry: 0, glow: 0 })}
      style={{
        perspective: "900px",
      }}
    >
      <div
        style={{
          transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg) translateZ(0px)`,
          transition: "transform 180ms ease, box-shadow 180ms ease",
          boxShadow: t.glow
            ? `0 0 60px ${accent}${0.05 + t.glow * 0.05}), 0 20px 60px rgba(0,0,0,0.35)`
            : "0 0 0 rgba(0,0,0,0)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function averageRating(reviews: Review[]) {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((a, r) => a + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

function loadUserReviews(): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const cleaned: Review[] = [];
    for (const x of parsed) {
      if (!x || typeof x !== "object") continue;
      const r = x as Partial<Review>;
      if (
        typeof r.id !== "string" ||
        typeof r.name !== "string" ||
        typeof r.title !== "string" ||
        typeof r.message !== "string" ||
        typeof r.createdAt !== "number" ||
        typeof r.rating !== "number"
      ) {
        continue;
      }
      const rating = Math.max(1, Math.min(5, Math.round(r.rating))) as Review["rating"];
      const experience =
        r.experience === "XR Walking Theatre" ||
        r.experience === "World Experience" ||
        r.experience === "Prototype" ||
        r.experience === "Event"
          ? r.experience
          : "XR Walking Theatre";
      cleaned.push({
        id: r.id,
        name: r.name.slice(0, 40),
        rating,
        title: r.title.slice(0, 80),
        message: r.message.slice(0, 800),
        createdAt: r.createdAt,
        experience,
      });
    }
    return cleaned;
  } catch {
    return [];
  }
}

function saveUserReviews(reviews: Review[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    // ignore
  }
}

export default function AboutPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const stateRef = useRef({ scrollY: 0, mouseX: 0, mouseY: 0 });

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

  const sections = useMemo(
    () =>
      [
        { id: "who" as const, label: "Who are we" },
        { id: "story" as const, label: "Our story" },
        { id: "what" as const, label: "What is XR Walking Theatre?" },
        { id: "why" as const, label: "Why experience it?" },
        { id: "reviews" as const, label: "Reviews" },
      ] satisfies { id: SectionId; label: string }[],
    [],
  );

  const active = useActiveSection(sections.map((s) => s.id));
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  const [userReviews, setUserReviews] = useState<Review[]>(() => loadUserReviews());

  const allReviews = useMemo(() => {
    const merged = [...SEED_REVIEWS, ...userReviews];
    return merged.sort((a, b) => b.createdAt - a.createdAt);
  }, [userReviews]);

  const avg = useMemo(() => averageRating(allReviews), [allReviews]);

  const [journeyStep, setJourneyStep] = useState<"Arrival" | "Threshold" | "Encounter" | "Finale">("Arrival");

  const journey = useMemo(
    () => ({
      Arrival: {
        title: "Arrival",
        body: "The space introduces mood and rules quietly—light, sound, and a first interaction that builds confidence.",
      },
      Threshold: {
        title: "Threshold",
        body: "You cross into the world. The environment begins responding—subtle guidance, clear objectives, no UI overload.",
      },
      Encounter: {
        title: "Encounter",
        body: "The story becomes interactive. You make choices, handle artifacts, and feel the ‘theatre direction’ through pacing.",
      },
      Finale: {
        title: "Finale",
        body: "A designed climax: a reveal, a transformation, or a resolution. The final moment is engineered for recall.",
      },
    }),
    [],
  );

  const benefits = useMemo(
    () => [
      {
        title: "It’s theatre—so it has pacing",
        body: "XR Walking Theatre is not a free-roam tech demo. It’s staged: moments are sequenced, attention is guided, and the user always knows what matters next.",
        accent: ACCENT.b,
      },
      {
        title: "Presence creates emotional memory",
        body: "When you walk through a scene instead of watching it, the brain stores it differently. Presence turns story into lived experience.",
        accent: ACCENT.c,
      },
      {
        title: "Comfort-first design keeps people inside",
        body: "We design movement, interaction, and readability to reduce discomfort. Comfort is treated like performance: a non-negotiable budget.",
        accent: ACCENT.a,
      },
      {
        title: "Perfect for culture, brands, and education",
        body: "A single format can deliver mythic worlds, product showcases, training simulations, or museum narratives—without sacrificing premium feel.",
        accent: ACCENT.b,
      },
    ],
    [],
  );

  const sideNav = (
    <div className="hidden lg:block w-[240px] shrink-0">
      <div className="sticky top-28">
        <div
          className="mb-4"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "9px",
            letterSpacing: "0.35em",
            color: "rgba(255,255,255,0.28)",
          }}
        >
          NAVIGATION
        </div>
        <GlassPanel className="p-2" accent="rgba(255,255,255," isDark={isDark}>
          <div className="flex flex-col gap-1" style={{ pointerEvents: "auto" }}>
            {sections.map((s) => {
              const isActive = s.id === active;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollToId(s.id)}
                  className="w-full px-3 py-2 rounded-xl transition-all cursor-pointer text-left"
                  style={{
                    background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                    border: "none",
                    color: isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)",
                    fontFamily: "'Exo 2', sans-serif",
                    fontSize: "12px",
                    letterSpacing: "0.06em",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.95)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isActive ? "rgba(255,255,255,0.06)" : "transparent";
                    e.currentTarget.style.color = isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)";
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </GlassPanel>
      </div>
    </div>
  );

  const [form, setForm] = useState<{
    name: string;
    rating: Review["rating"];
    title: string;
    message: string;
    experience: Review["experience"];
  }>({
    name: "",
    rating: 5,
    title: "",
    message: "",
    experience: "XR Walking Theatre",
  });
  const [submitState, setSubmitState] = useState<{ ok?: string; err?: string }>({});

  const onSubmitReview = useCallback(() => {
    setSubmitState({});
    const name = form.name.trim();
    const title = form.title.trim();
    const message = form.message.trim();
    if (name.length < 2) return setSubmitState({ err: "Please enter your name." });
    if (title.length < 4) return setSubmitState({ err: "Add a short review title (at least 4 characters)." });
    if (message.length < 20) return setSubmitState({ err: "Write a bit more detail (at least 20 characters)." });

    const r: Review = {
      id: safeId(),
      name: name.slice(0, 40),
      rating: form.rating,
      title: title.slice(0, 80),
      message: message.slice(0, 800),
      createdAt: Date.now(),
      experience: form.experience,
    };

    setUserReviews((prev) => {
      const next = [r, ...prev].slice(0, 30);
      saveUserReviews(next);
      return next;
    });

    setForm((p) => ({ ...p, name: "", title: "", message: "", rating: 5, experience: "XR Walking Theatre" }));
    setSubmitState({ ok: "Thanks—your review is now live on this page." });
  }, [form]);

  return (
    <div
      className="w-full relative"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #060810 0%, #080c18 20%, #0a0e1a 40%, #070b14 60%, #080c18 80%, #050810 100%)"
          : "linear-gradient(180deg, #faf8ff 0%, #f3eeff 20%, #ffffff 40%, #f8f4ff 60%, #f3eeff 80%, #faf8ff 100%)",
        overflowX: "hidden",
      }}
    >
      <WebGLScene key={theme} state={stateRef} />
      <FloatingNav />

      <motion.div
        className="fixed left-0 right-0"
        style={{
          top: 0,
          height: "2px",
          zIndex: 150,
          background:
            "linear-gradient(90deg, rgba(123,184,255,0.0) 0%, rgba(123,184,255,0.9) 20%, rgba(199,125,255,0.9) 50%, rgba(232,67,147,0.9) 80%, rgba(232,67,147,0.0) 100%)",
          transformOrigin: "0% 50%",
          scaleX: progress,
          opacity: 0.85,
        }}
      />

      {isDark && (
        <>
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 100,
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
              mixBlendMode: "multiply",
            }}
          />
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 99,
              background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 50%, rgba(3,4,8,0.55) 100%)",
            }}
          />
        </>
      )}

      <div className="relative" style={{ zIndex: 2 }}>
        <main className="mx-auto max-w-6xl px-5 md:px-8 pt-28 pb-24">
          {/* HERO */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3">
              <div style={{ width: "44px", height: "1px", background: "linear-gradient(to right, transparent, rgba(200,130,255,0.25))" }} />
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "10px", letterSpacing: "0.4em", color: "rgba(255,255,255,0.35)" }}>
                ABOUT
              </span>
              <div style={{ width: "44px", height: "1px", background: "linear-gradient(to left, transparent, rgba(230,80,160,0.25))" }} />
            </div>

            <h1
              className="mt-5"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(28px, 5vw, 52px)",
                fontWeight: 900,
                lineHeight: 1.18,
                color: "#ffffff",
              }}
            >
              XR Walking Theatre—{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #7BB8FF 0%, #C77DFF 50%, #E84393 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                staged inside reality
              </span>
              .
            </h1>

            <p
              className="mt-4 mx-auto"
              style={{
                maxWidth: "820px",
                fontFamily: "'Exo 2', sans-serif",
                fontSize: "14px",
                lineHeight: 1.9,
                color: "rgba(255,255,255,0.45)",
              }}
            >
              NexoraXR builds immersive business experiences where story, comfort, and interaction design work like theatre direction: users feel guided, present, and emotionally connected—while you get a premium, repeatable format.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4 flex-wrap" style={{ pointerEvents: "auto" }}>
              <PillButton primary onClick={() => router.push("/story/heaven")}>
                Explore Worlds
              </PillButton>
              <PillButton onClick={() => scrollToId("what")}>What is it?</PillButton>
              <PillButton onClick={() => scrollToId("reviews")}>See Reviews</PillButton>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 max-w-4xl mx-auto">
              <GlassPanel className="p-5" accent={ACCENT.a} isDark={isDark}>
                <div style={{ pointerEvents: "auto" }}>
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.32em", color: "rgba(255,255,255,0.32)" }}>
                    FORMAT
                  </div>
                  <div
                    className="mt-3"
                    style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: "18px",
                      fontWeight: 900,
                      color: "#fff",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Walking Theatre
                  </div>
                  <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "6px" }}>
                    Guided presence + interaction
                  </div>
                </div>
              </GlassPanel>
              <GlassPanel className="p-5" accent={ACCENT.b} isDark={isDark}>
                <div style={{ pointerEvents: "auto" }}>
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.32em", color: "rgba(255,255,255,0.32)" }}>
                    BUSINESS
                  </div>
                  <div
                    className="mt-3"
                    style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: "18px",
                      fontWeight: 900,
                      color: "#fff",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Premium Experiences
                  </div>
                  <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "6px" }}>
                    Culture • brands • training
                  </div>
                </div>
              </GlassPanel>
              <GlassPanel className="p-5" accent={ACCENT.c} isDark={isDark}>
                <div style={{ pointerEvents: "auto" }}>
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.32em", color: "rgba(255,255,255,0.32)" }}>
                    TRUST
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        fontSize: "18px",
                        fontWeight: 900,
                        color: "#fff",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {avg.toFixed(1)}/5
                    </div>
                    <Stars value={Math.round(avg)} />
                  </div>
                  <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "6px" }}>
                    Based on {allReviews.length} reviews
                  </div>
                </div>
              </GlassPanel>
            </div>
          </motion.div>

          <div className="mt-14 lg:mt-16 flex items-start gap-10">
            {sideNav}

            <div className="flex-1 min-w-0">
              {/* WHO ARE WE */}
              <section id="who" className="scroll-mt-28">
                <SectionHeader label="WHO ARE WE" />

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 md:gap-5">
                  <TiltCard accent={ACCENT.b}>
                    <GlassPanel className="p-7 md:p-10" accent={ACCENT.b} isDark={isDark}>
                      <div style={{ pointerEvents: "auto" }}>
                        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.35em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
                          NexoraXR
                        </div>
                        <div className="mt-4" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "20px", fontWeight: 900, lineHeight: 1.5, color: "#fff" }}>
                          We build{" "}
                          <span
                            style={{
                              background: "linear-gradient(135deg, #7BB8FF, #C77DFF, #E84393)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            immersive business worlds
                          </span>{" "}
                          that people remember.
                        </div>
                        <div className="mt-4" style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "13px", lineHeight: 1.9, color: "rgba(255,255,255,0.52)" }}>
                          We’re a team focused on a specific outcome: experiences that feel premium in the headset and understandable in the first 30 seconds.
                          Our core offering is XR Walking Theatre—a repeatable format with theatre-like pacing, guided interaction, and comfort-first design.
                        </div>

                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { k: "Culture", v: "Myth, heritage, and story worlds" },
                            { k: "Brands", v: "Product presence + memorable reveals" },
                            { k: "Education", v: "Training simulations & guided learning" },
                            { k: "Events", v: "High-impact activations & demos" },
                          ].map((x, i) => (
                            <div
                              key={x.k}
                              style={{
                                borderRadius: "16px",
                                padding: "12px 14px",
                                background: "rgba(255,255,255,0.02)",
                                border: `1px solid ${(i % 3 === 0 ? ACCENT.a : i % 3 === 1 ? ACCENT.b : ACCENT.c)}0.12)`,
                              }}
                            >
                              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.28em", color: "rgba(255,255,255,0.28)" }}>
                                {x.k.toUpperCase()}
                              </div>
                              <div className="mt-2" style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "12.5px", lineHeight: 1.7, color: "rgba(255,255,255,0.55)" }}>
                                {x.v}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </GlassPanel>
                  </TiltCard>

                  <GlassPanel className="p-7 md:p-8" accent={ACCENT.a} isDark={isDark}>
                    <div style={{ pointerEvents: "auto" }}>
                      <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.35em", color: "rgba(255,255,255,0.35)" }}>
                        WHAT YOU GET
                      </div>

                      <div className="mt-4 flex flex-col gap-3">
                        {[
                          { t: "Fast prototyping", d: "Validate ‘feel’ early with interactive scenes." },
                          { t: "Comfort & clarity", d: "Guidance without UI overload or nausea." },
                          { t: "Premium polish", d: "Lighting, motion, and micro-feedback that sells quality." },
                          { t: "Delivery discipline", d: "Performance budgets protected throughout build." },
                        ].map((x, i) => (
                          <div
                            key={x.t}
                            style={{
                              borderRadius: "16px",
                              padding: "12px 14px",
                              background: "rgba(255,255,255,0.02)",
                              border: "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "12px", fontWeight: 800, color: "#fff" }}>
                              {x.t}
                            </div>
                            <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.42)", marginTop: "4px" }}>
                              {x.d}
                            </div>
                            <div style={{ height: "1px", background: `linear-gradient(to right, ${i % 2 ? "rgba(230,80,160,0.22)" : "rgba(120,180,255,0.22)"}, transparent)`, marginTop: "10px" }} />
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 flex gap-3 flex-wrap">
                        <PillButton primary onClick={() => scrollToId("story")}>
                          Our Story
                        </PillButton>
                        <PillButton onClick={() => router.push("/")}>Home</PillButton>
                      </div>
                    </div>
                  </GlassPanel>
                </div>
              </section>

              {/* OUR STORY */}
              <section id="story" className="scroll-mt-28 mt-14 md:mt-16">
                <SectionHeader label="OUR STORY" left="rgba(120,180,255,0.3)" right="rgba(200,130,255,0.3)" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <TiltCard accent={ACCENT.b}>
                    <GlassPanel className="p-7 md:p-10" accent={ACCENT.b} isDark={isDark}>
                      <div style={{ pointerEvents: "auto" }}>
                        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.35em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
                          Our Mission
                        </div>
                        <div className="mt-4" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "18px", fontWeight: 900, lineHeight: 1.6, color: "#fff" }}>
                          Deliver XR experiences that{" "}
                          <span style={{ color: "rgba(200,160,255,0.92)" }}>feel guided</span>, premium, and unforgettable.
                        </div>
                        <div className="mt-4" style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "13px", lineHeight: 1.9, color: "rgba(255,255,255,0.52)" }}>
                          Our mission is to ship with confidence: build the story and interaction systems that make users understand what to do, while keeping performance and comfort at the center.
                        </div>
                      </div>
                    </GlassPanel>
                  </TiltCard>

                  <TiltCard accent={ACCENT.a}>
                    <GlassPanel className="p-7 md:p-10" accent={ACCENT.a} isDark={isDark}>
                      <div style={{ pointerEvents: "auto" }}>
                        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.35em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
                          Our Vision
                        </div>
                        <div className="mt-4" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "18px", fontWeight: 900, lineHeight: 1.6, color: "#fff" }}>
                          Make culture, brands, and learning{" "}
                          <span
                            style={{
                              background: "linear-gradient(135deg, #7BB8FF, #C77DFF, #E84393)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            walkable
                          </span>
                          .
                        </div>
                        <div className="mt-4" style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "13px", lineHeight: 1.9, color: "rgba(255,255,255,0.52)" }}>
                          A future where people can step into worlds and understand them through presence—where storytelling and product communication become experiences, not slides.
                        </div>
                      </div>
                    </GlassPanel>
                  </TiltCard>
                </div>

                <div className="mt-6 md:mt-7">
                  <GlassPanel className="p-7 md:p-10" accent={ACCENT.c} isDark={isDark}>
                    <div style={{ pointerEvents: "auto" }}>
                      <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.35em", color: "rgba(255,255,255,0.4)" }}>
                        HOW WE WORK
                      </div>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { t: "Discover", d: "Outcomes, audience, constraints, emotional core." },
                          { t: "Prototype", d: "Validate the ‘feel’ with interactive scenes early." },
                          { t: "Ship", d: "Polish, performance budgets, device testing." },
                        ].map((x, i) => (
                          <div
                            key={x.t}
                            style={{
                              borderRadius: "16px",
                              padding: "14px 14px",
                              background: "rgba(255,255,255,0.02)",
                              border: `1px solid ${(i === 0 ? ACCENT.a : i === 1 ? ACCENT.b : ACCENT.c)}0.14)`,
                            }}
                          >
                            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "12px", fontWeight: 900, color: "#fff", letterSpacing: "0.06em" }}>
                              {x.t}
                            </div>
                            <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.45)", marginTop: "6px", lineHeight: 1.8 }}>
                              {x.d}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassPanel>
                </div>
              </section>

              {/* WHAT IS XR WALKING THEATRE */}
              <section id="what" className="scroll-mt-28 mt-14 md:mt-16">
                <SectionHeader label="WHAT IS XR WALKING THEATRE?" left="rgba(230,80,160,0.3)" right="rgba(200,130,255,0.3)" />

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 md:gap-5">
                  <GlassPanel className="p-7 md:p-10" accent={ACCENT.b} isDark={isDark}>
                    <div style={{ pointerEvents: "auto" }}>
                      <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "18px", fontWeight: 900, color: "#fff", lineHeight: 1.5 }}>
                        A guided XR format where the user{" "}
                        <span style={{ color: "rgba(200,160,255,0.92)" }}>walks through designed scenes</span>.
                      </div>
                      <div className="mt-4" style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "13px", lineHeight: 1.95, color: "rgba(255,255,255,0.52)" }}>
                        Think of it like theatre direction applied to XR: lighting, audio, and interaction cues guide attention. The experience feels free, but it’s staged—so pacing, comfort, and storytelling land reliably for every user.
                      </div>

                      <div className="mt-6">
                        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.35em", color: "rgba(255,255,255,0.35)" }}>
                          EXPERIENCE ARC
                        </div>
                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {(["Arrival", "Threshold", "Encounter", "Finale"] as const).map((k, idx) => {
                            const active = k === journeyStep;
                            const accent = idx % 3 === 0 ? ACCENT.a : idx % 3 === 1 ? ACCENT.b : ACCENT.c;
                            return (
                              <button
                                key={k}
                                onClick={() => setJourneyStep(k)}
                                className="px-3 py-3 rounded-2xl cursor-pointer transition-all text-left"
                                style={{
                                  background: active ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                                  border: `1px solid ${accent}${active ? "0.22)" : "0.10)"}`,
                                }}
                              >
                                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "11px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
                                  {k}
                                </div>
                                <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.38)", marginTop: "2px" }}>
                                  Step {idx + 1}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-5">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={journeyStep}
                            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                            style={{
                              borderRadius: "16px",
                              padding: "14px 14px",
                              background: "rgba(255,255,255,0.02)",
                              border: "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "12px", fontWeight: 900, color: "#fff" }}>
                              {journey[journeyStep].title}
                            </div>
                            <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "13px", lineHeight: 1.9, color: "rgba(255,255,255,0.52)", marginTop: "6px" }}>
                              {journey[journeyStep].body}
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </GlassPanel>

                  <GlassPanel className="p-7 md:p-8" accent={ACCENT.a} isDark={isDark}>
                    <div style={{ pointerEvents: "auto" }}>
                      <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.35em", color: "rgba(255,255,255,0.35)" }}>
                        WHERE IT FITS
                      </div>
                      <div className="mt-4 flex flex-col gap-3">
                        {[
                          { t: "Museums & culture", d: "Walk through a myth, a timeline, or a heritage space." },
                          { t: "Brand storytelling", d: "A product reveal staged like a scene." },
                          { t: "Training & safety", d: "Guided scenarios with clear cues and feedback." },
                          { t: "Entertainment", d: "Interactive chapters with cinematic direction." },
                        ].map((x, i) => (
                          <div
                            key={x.t}
                            style={{
                              borderRadius: "16px",
                              padding: "12px 14px",
                              background: "rgba(255,255,255,0.02)",
                              border: `1px solid ${(i % 2 ? ACCENT.c : ACCENT.b)}0.12)`,
                            }}
                          >
                            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "12px", fontWeight: 900, color: "#fff" }}>
                              {x.t}
                            </div>
                            <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.42)", marginTop: "4px", lineHeight: 1.75 }}>
                              {x.d}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassPanel>
                </div>
              </section>

              {/* WHY EXPERIENCE */}
              <section id="why" className="scroll-mt-28 mt-14 md:mt-16">
                <SectionHeader label="WHY EXPERIENCE XR WALKING THEATRE?" left="rgba(120,180,255,0.3)" right="rgba(230,80,160,0.3)" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  {benefits.map((b) => (
                    <TiltCard key={b.title} accent={b.accent}>
                      <GlassPanel className="p-7 md:p-8" accent={b.accent} isDark={isDark} style={{ pointerEvents: "auto" }}>
                        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "13px", fontWeight: 900, letterSpacing: "0.06em", color: "#fff" }}>
                          {b.title}
                        </div>
                        <div className="mt-3" style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "13px", lineHeight: 1.9, color: "rgba(255,255,255,0.52)" }}>
                          {b.body}
                        </div>
                      </GlassPanel>
                    </TiltCard>
                  ))}
                </div>

                <div className="mt-6 md:mt-7">
                  <GlassPanel className="p-7 md:p-10" accent={ACCENT.b} isDark={isDark}>
                    <div style={{ pointerEvents: "auto" }}>
                      <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.35em", color: "rgba(255,255,255,0.35)" }}>
                        QUICK COMPARISON
                      </div>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { k: "Video / 2D", v: "Watched" },
                          { k: "VR free-roam", v: "Explored" },
                          { k: "XR walking theatre", v: "Experienced" },
                        ].map((x, i) => (
                          <div
                            key={x.k}
                            style={{
                              borderRadius: "16px",
                              padding: "14px 14px",
                              background: "rgba(255,255,255,0.02)",
                              border: `1px solid ${(i === 2 ? ACCENT.c : "rgba(255,255,255,")}0.10)`,
                            }}
                          >
                            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.28em", color: "rgba(255,255,255,0.28)" }}>
                              {x.k.toUpperCase()}
                            </div>
                            <div
                              className="mt-2"
                              style={{
                                fontFamily: "'Orbitron', sans-serif",
                                fontSize: "16px",
                                fontWeight: 900,
                                color: "#fff",
                                letterSpacing: "0.06em",
                              }}
                            >
                              {x.v}
                            </div>
                            <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "6px", lineHeight: 1.8 }}>
                              {i === 0
                                ? "Great reach, low presence."
                                : i === 1
                                  ? "High freedom, but users can get lost."
                                  : "Guided presence + premium pacing."}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 flex items-center gap-4 flex-wrap">
                        <PillButton primary onClick={() => scrollToId("reviews")}>
                          Read customer feedback
                        </PillButton>
                        <PillButton onClick={() => router.push("/story/hell")}>Visit a World</PillButton>
                        <PillButton onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Back to top</PillButton>
                      </div>
                    </div>
                  </GlassPanel>
                </div>
              </section>

              {/* REVIEWS */}
              <section id="reviews" className="scroll-mt-28 mt-14 md:mt-16">
                <SectionHeader label="CUSTOMER REVIEWS" left="rgba(200,130,255,0.3)" right="rgba(120,180,255,0.3)" />

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 md:gap-5">
                  <GlassPanel className="p-7 md:p-10" accent={ACCENT.b} isDark={isDark}>
                    <div style={{ pointerEvents: "auto" }}>
                      <div className="flex items-start justify-between gap-6 flex-wrap">
                        <div>
                          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "18px", fontWeight: 900, color: "#fff" }}>
                            {avg.toFixed(1)} / 5
                          </div>
                          <div className="mt-2">
                            <Stars value={Math.round(avg)} />
                          </div>
                          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "8px" }}>
                            Total reviews: {allReviews.length} (includes on-page submissions)
                          </div>
                        </div>
                        <div
                          style={{
                            borderRadius: "16px",
                            padding: "12px 14px",
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            minWidth: "220px",
                          }}
                        >
                          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.28em", color: "rgba(255,255,255,0.28)" }}>
                            NOTE
                          </div>
                          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.45)", marginTop: "6px", lineHeight: 1.8 }}>
                            Reviews you submit here are stored in your browser (local) and shown immediately below.
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {allReviews.slice(0, 6).map((r, idx) => (
                          <TiltCard key={r.id} accent={idx % 3 === 0 ? ACCENT.a : idx % 3 === 1 ? ACCENT.b : ACCENT.c}>
                            <GlassPanel className="p-6" accent={idx % 3 === 0 ? ACCENT.a : idx % 3 === 1 ? ACCENT.b : ACCENT.c} isDark={isDark}>
                              <div style={{ pointerEvents: "auto" }}>
                                <div className="flex items-center justify-between gap-4">
                                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "12px", fontWeight: 900, color: "#fff" }}>
                                    {r.title}
                                  </div>
                                  <Stars value={r.rating} />
                                </div>
                                <div className="mt-2" style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
                                  {r.name} • {formatDate(r.createdAt)} • {r.experience}
                                </div>
                                <div className="mt-4" style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "13px", lineHeight: 1.9, color: "rgba(255,255,255,0.52)" }}>
                                  {r.message}
                                </div>
                              </div>
                            </GlassPanel>
                          </TiltCard>
                        ))}
                      </div>

                      {allReviews.length > 6 && (
                        <div className="mt-5" style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
                          Showing 6 of {allReviews.length}. (We can add pagination / “Load more” next.)
                        </div>
                      )}
                    </div>
                  </GlassPanel>

                  <GlassPanel className="p-7 md:p-8" accent={ACCENT.c} isDark={isDark}>
                    <div style={{ pointerEvents: "auto" }}>
                      <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.35em", color: "rgba(255,255,255,0.35)" }}>
                        LEAVE A REVIEW
                      </div>

                      <div className="mt-4 flex flex-col gap-3">
                        <div>
                          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "6px" }}>
                            Your name
                          </div>
                          <input
                            value={form.name}
                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                            placeholder="Enter name"
                            className="w-full"
                            style={{
                              borderRadius: "14px",
                              padding: "12px 12px",
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              color: "rgba(255,255,255,0.9)",
                              outline: "none",
                              fontFamily: "'Exo 2', sans-serif",
                              fontSize: "13px",
                            }}
                          />
                        </div>

                        <div>
                          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "6px" }}>
                            Rating
                          </div>
                          <RatingPicker value={form.rating} onChange={(v) => setForm((p) => ({ ...p, rating: v }))} />
                        </div>

                        <div>
                          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "6px" }}>
                            Experience type
                          </div>
                          <select
                            value={form.experience}
                            onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value as Review["experience"] }))}
                            style={{
                              width: "100%",
                              borderRadius: "14px",
                              padding: "12px 12px",
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              color: "rgba(255,255,255,0.9)",
                              outline: "none",
                              fontFamily: "'Exo 2', sans-serif",
                              fontSize: "13px",
                            }}
                          >
                            <option value="XR Walking Theatre">XR Walking Theatre</option>
                            <option value="World Experience">World Experience</option>
                            <option value="Prototype">Prototype</option>
                            <option value="Event">Event</option>
                          </select>
                        </div>

                        <div>
                          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "6px" }}>
                            Title
                          </div>
                          <input
                            value={form.title}
                            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                            placeholder="Short summary"
                            className="w-full"
                            style={{
                              borderRadius: "14px",
                              padding: "12px 12px",
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              color: "rgba(255,255,255,0.9)",
                              outline: "none",
                              fontFamily: "'Exo 2', sans-serif",
                              fontSize: "13px",
                            }}
                          />
                        </div>

                        <div>
                          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "6px" }}>
                            Review
                          </div>
                          <textarea
                            value={form.message}
                            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                            placeholder="What did you like? What surprised you?"
                            rows={5}
                            className="w-full resize-none"
                            style={{
                              borderRadius: "14px",
                              padding: "12px 12px",
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              color: "rgba(255,255,255,0.9)",
                              outline: "none",
                              fontFamily: "'Exo 2', sans-serif",
                              fontSize: "13px",
                              lineHeight: 1.7,
                            }}
                          />
                        </div>

                        {submitState.err && (
                          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "12px", color: "rgba(255,120,140,0.9)" }}>
                            {submitState.err}
                          </div>
                        )}
                        {submitState.ok && (
                          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "12px", color: "rgba(140,255,200,0.8)" }}>
                            {submitState.ok}
                          </div>
                        )}

                        <div className="mt-1 flex items-center gap-3 flex-wrap">
                          <PillButton primary onClick={onSubmitReview}>
                            Submit review
                          </PillButton>
                          <PillButton
                            onClick={() => {
                              setSubmitState({});
                              setForm({ name: "", rating: 5, title: "", message: "", experience: "XR Walking Theatre" });
                            }}
                          >
                            Clear
                          </PillButton>
                          {userReviews.length > 0 && (
                            <PillButton
                              onClick={() => {
                                setUserReviews([]);
                                try {
                                  window.localStorage.removeItem(STORAGE_KEY);
                                } catch {
                                  // ignore
                                }
                              }}
                            >
                              Reset my reviews
                            </PillButton>
                          )}
                        </div>
                      </div>
                    </div>
                  </GlassPanel>
                </div>

                <div className="mt-16 flex items-center justify-center gap-5 flex-wrap" style={{ pointerEvents: "auto" }}>
                  <div style={{ height: "1px", width: "48px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08))" }} />
                  <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em" }}>
                    NexoraXR • XR Walking Theatre • 2026
                  </div>
                  <div style={{ height: "1px", width: "48px", background: "linear-gradient(to left, transparent, rgba(255,255,255,0.08))" }} />
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

