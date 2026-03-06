"use client"

import { FloatingNav, HUDContent } from "@/components/HUDOverlay";
import { WebGLScene } from "@/components/WebGLScene";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Home() {
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

  return (
    <div
      className="w-full relative"
      style={{
        background:
          "linear-gradient(180deg, #060810 0%, #080c18 20%, #0a0e1a 40%, #070b14 60%, #080c18 80%, #050810 100%)",
        overflowX: "hidden",
      }}
    >
      <WebGLScene state={stateRef} />
      <FloatingNav />

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
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 50%, rgba(3,4,8,0.5) 100%)",
        }}
      />

      <div className="relative" style={{ zIndex: 2 }}>
        <HUDContent />
      </div>
    </div>
  );
}
