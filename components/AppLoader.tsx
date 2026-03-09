"use client";

import { useState } from "react";
import { LoadingScreen } from "./LoadingScreen";

export function AppLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      {/* Children render underneath immediately so the page is ready when loader exits */}
      <div
        style={{
          opacity: loading ? 0 : 1,
          transition: "opacity 0.4s ease",
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        {children}
      </div>
    </>
  );
}
