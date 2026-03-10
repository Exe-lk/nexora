export type FaqItem = {
  id: string;
  q: string;
  bullets: string[];
  tags?: string[];
};

export type FaqCategory = {
  id: "about" | "who" | "experiences" | "booking_pricing" | "safety" | "events";
  title: string;
  subtitle: string;
  accentGradient: string;
  accentSoft: string; // rgba(...,  e.g. "rgba(168,85,247,"
  items: FaqItem[];
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "about",
    title: "About NexoraXR",
    subtitle: "What we are, how it works, what’s included",
    accentGradient: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)",
    accentSoft: "rgba(168,85,247,",
    items: [
      {
        id: "about-what-is",
        q: "What is NexoraXR?",
        bullets: [
          "Immersive XR/VR experiences designed for events and venues.",
          "Story-led, guided sessions (no “gaming skills” required).",
          "Built for shared moments: friends, families, teams.",
        ],
        tags: ["XR", "Guided", "Social"],
      },
      {
        id: "about-how-different",
        q: "How is NexoraXR different from a typical VR arcade?",
        bullets: [
          "Focus on cinematic, event-ready flows (not isolated booths).",
          "On-site operators handle setup, safety, and pacing.",
          "Designed for groups and guests with mixed tech comfort.",
        ],
        tags: ["Events", "Host-guided"],
      },
      {
        id: "about-what-included",
        q: "What’s included when we book NexoraXR?",
        bullets: [
          "Headsets + calibration + on-site crew.",
          "Safety onboarding + live monitoring during sessions.",
          "Experience setup tailored to your venue and guest flow.",
        ],
        tags: ["Hardware", "Crew", "Setup"],
      },
    ],
  },
  {
    id: "who",
    title: "Who can attend?",
    subtitle: "Ages, accessibility, and suitability",
    accentGradient: "linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)",
    accentSoft: "rgba(56,189,248,",
    items: [
      {
        id: "who-ages",
        q: "What ages are suitable?",
        bullets: [
          "We tailor content by event type and audience.",
          "Family-friendly options are available for mixed-age groups.",
          "We’ll confirm age guidance during planning.",
        ],
        tags: ["Ages", "Family"],
      },
      {
        id: "who-first-time",
        q: "Is it okay for first-time VR users?",
        bullets: [
          "Yes—operators guide guests step-by-step.",
          "No controllers required for most flows (depends on experience).",
          "We keep sessions paced and easy to follow.",
        ],
        tags: ["Beginner-friendly"],
      },
      {
        id: "who-accessibility",
        q: "Is NexoraXR accessible?",
        bullets: [
          "We can adapt session pacing and supervision by guest needs.",
          "Tell us about mobility or sensory requirements in advance.",
          "We’ll propose an accessible floor plan and support approach.",
        ],
        tags: ["Accessibility", "Support"],
      },
    ],
  },
  {
    id: "experiences",
    title: "Experiences",
    subtitle: "Worlds, duration, and what guests do",
    accentGradient: "linear-gradient(135deg, #22c55e 0%, #38bdf8 60%, #a855f7 100%)",
    accentSoft: "rgba(52,211,153,",
    items: [
      {
        id: "exp-how-long",
        q: "How long is an experience?",
        bullets: [
          "We offer flexible session lengths based on your event flow.",
          "Plan extra time for onboarding and headset fitting.",
          "We can run continuous rotations for large crowds.",
        ],
        tags: ["Duration", "Rotations"],
      },
      {
        id: "exp-what-do-guests-do",
        q: "What do guests actually do inside XR?",
        bullets: [
          "Explore guided story moments and interactive scenes.",
          "Move naturally in the space (no joystick locomotion).",
          "Enjoy shared reactions with friends/teammates nearby.",
        ],
        tags: ["Interactive", "Social"],
      },
      {
        id: "exp-multiplayer",
        q: "Can people experience it together?",
        bullets: [
          "Yes—group sessions are available depending on package.",
          "We manage spacing and pacing to keep it safe and smooth.",
          "Perfect for teams, families, and friend groups.",
        ],
        tags: ["Group", "Multiplayer"],
      },
    ],
  },
  {
    id: "booking_pricing",
    title: "Booking & Pricing",
    subtitle: "How to book, what it costs, and what happens next",
    accentGradient: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #7c3aed 100%)",
    accentSoft: "rgba(14,165,233,",
    items: [
      {
        id: "book-how",
        q: "How do we book NexoraXR?",
        bullets: [
          "Send your event date, venue, and guest estimate.",
          "We’ll reply with a tailored package + timeline.",
          "Then we confirm schedule, staffing, and setup plan.",
        ],
        tags: ["Booking"],
      },
      {
        id: "book-pricing",
        q: "How is pricing calculated?",
        bullets: [
          "Based on duration, headsets, crew, and complexity.",
          "Venue type and guest throughput affect staffing needs.",
          "We’ll provide a clear quote with inclusions listed.",
        ],
        tags: ["Quote"],
      },
      {
        id: "book-deposit",
        q: "Do you require a deposit?",
        bullets: [
          "Some packages require a deposit to lock the date.",
          "We’ll clarify payment milestones in your proposal.",
          "No surprises—everything is confirmed upfront.",
        ],
        tags: ["Payments"],
      },
    ],
  },
  {
    id: "safety",
    title: "Safety & Comfort",
    subtitle: "Motion sickness, hygiene, and supervision",
    accentGradient: "linear-gradient(135deg, #ec4899 0%, #a855f7 55%, #38bdf8 100%)",
    accentSoft: "rgba(236,72,153,",
    items: [
      {
        id: "safe-motion-sickness",
        q: "Will guests get motion sickness?",
        bullets: [
          "We prioritize natural movement (no forced joystick motion).",
          "Sessions are paced and supervised by operators.",
          "If someone feels discomfort, they can stop immediately.",
        ],
        tags: ["Comfort"],
      },
      {
        id: "safe-hygiene",
        q: "How do you handle hygiene for headsets?",
        bullets: [
          "Sanitization between sessions is built into operations.",
          "We use guest-safe cleaning methods and replaceable interfaces when required.",
          "Crew monitors fit and comfort throughout.",
        ],
        tags: ["Hygiene"],
      },
      {
        id: "safe-supervision",
        q: "Is there supervision during XR sessions?",
        bullets: [
          "Yes—operators supervise, guide, and assist guests.",
          "We manage spacing to prevent collisions and confusion.",
          "Clear safety brief before every session.",
        ],
        tags: ["Crew", "Guided"],
      },
    ],
  },
  {
    id: "events",
    title: "Events & Groups",
    subtitle: "Corporate, schools, festivals, and large crowds",
    accentGradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 45%, #ec4899 100%)",
    accentSoft: "rgba(245,158,11,",
    items: [
      {
        id: "evt-corporate",
        q: "Do you do corporate events and team days?",
        bullets: [
          "Yes—great for team bonding and brand activations.",
          "We can run scheduled sessions or continuous rotations.",
          "We’ll tailor pacing and content to your audience.",
        ],
        tags: ["Corporate"],
      },
      {
        id: "evt-schools",
        q: "Do you support school or educational groups?",
        bullets: [
          "Yes—supervised sessions with age-appropriate content.",
          "We can structure group rotations for classroom sizes.",
          "Share learning goals and we’ll propose a plan.",
        ],
        tags: ["Schools"],
      },
      {
        id: "evt-large-crowds",
        q: "Can you handle big crowds?",
        bullets: [
          "Yes—multi-headset rotations designed for throughput.",
          "Queue design + operator staffing keeps it moving.",
          "We’ll estimate capacity per hour for your venue.",
        ],
        tags: ["Throughput"],
      },
    ],
  },
];

