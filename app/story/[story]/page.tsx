"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FloatingNav } from "@/components/HUDOverlay";
import heavenImg from "@/assets/images/heaven.png";
import hellImg from "@/assets/images/hell.png";
import * as THREE from "three";

// ==================== STORY DATA ====================
const STORIES = {
  heaven: {
    title: "Swarga",
    subtitle: "The Celestial Realm",
    tagline: "ASCEND BEYOND",
    heroImg: heavenImg,
    description:
      "Rise through golden temples and infinite lotus gardens. Walk among celestial beings in a world of eternal beauty, serenity, and divine wonder.",
    longDescription:
      "Swarga is a VR journey unlike any other — a full-body immersion into the mythological heavens. You'll traverse floating palaces made of light, cross bridges woven from starlight, and witness celestial dances that have echoed through eternity. Every breath brings warmth. Every step reveals new wonder.",
    color1: "rgba(220,200,100,",
    color2: "rgba(255,220,120,",
    color3: "rgba(180,160,80,",
    hex1: "#DCC864",
    hex2: "#FFDC78",
    gradient: "linear-gradient(135deg, #DCC864 0%, #FFD700 50%, #FFA500 100%)",
    bgGradient:
      "linear-gradient(180deg, #0a0c08 0%, #12140a 15%, #0e1008 30%, #080a06 50%, #060806 70%, #040604 100%)",
    particleColor: 0xdcc864,
    particleColor2: 0xffd700,
    ambientColor: 0x332800,
    chapters: [
      {
        num: "I",
        title: "The Golden Ascent",
        desc: "Begin your journey on the Stairway of Light — an infinite golden staircase rising through clouds of luminous mist. Each step resonates with harmonic tones that guide you upward.",
        stat: { label: "ALTITUDE", value: "∞" },
      },
      {
        num: "II",
        title: "Garden of Eternal Bloom",
        desc: "A vast floating garden where lotus flowers the size of rooms open and close in rhythmic breathing patterns. Bioluminescent pollen drifts through the air like living starlight.",
        stat: { label: "FLORA SPECIES", value: "10,000+" },
      },
      {
        num: "III",
        title: "The Celestial Court",
        desc: "Stand before the Devas in their palace of crystallized sound. Witness the cosmic dance — Tandava in reverse — where destruction becomes creation before your eyes.",
        stat: { label: "IMMERSION", value: "99.8%" },
      },
    ],
    features: [
      { icon: "✦", label: "Spatial Audio", desc: "360° divine harmonics" },
      { icon: "◈", label: "Haptic Warmth", desc: "Feel celestial radiance" },
      { icon: "☀", label: "Dynamic Light", desc: "Living golden illumination" },
      { icon: "∞", label: "Infinite Scale", desc: "Boundless realm exploration" },
    ],
  },
  hell: {
    title: "Naraka",
    subtitle: "The Infernal Depths",
    tagline: "DESCEND INTO DARKNESS",
    heroImg: hellImg,
    description:
      "Descend into volcanic wastelands, crumbling fortresses, and rivers of fire. Face the guardians of the underworld in a harrowing journey through the abyss.",
    longDescription:
      "Naraka is a descent into the mythological underworld — a visceral, heart-pounding VR experience that tests every nerve. Traverse molten rivers, navigate crumbling obsidian bridges over bottomless chasms, and confront the Yamadutas — fearsome guardians whose judgments echo through volcanic halls. This isn't horror. It's reckoning.",
    color1: "rgba(230,80,60,",
    color2: "rgba(255,100,50,",
    color3: "rgba(180,40,30,",
    hex1: "#E6503C",
    hex2: "#FF6432",
    gradient: "linear-gradient(135deg, #E6503C 0%, #FF4500 50%, #8B0000 100%)",
    bgGradient:
      "linear-gradient(180deg, #0c0604 0%, #140806 15%, #100604 30%, #0a0604 50%, #080404 70%, #040202 100%)",
    particleColor: 0xe6503c,
    particleColor2: 0xff4500,
    ambientColor: 0x330800,
    chapters: [
      {
        num: "I",
        title: "The Descent",
        desc: "Plunge through the Mouth of Yama — a spiraling obsidian tunnel where gravity itself warps. The walls pulse with veins of magma, and distant screams echo from below.",
        stat: { label: "DEPTH", value: "-∞" },
      },
      {
        num: "II",
        title: "Rivers of Vaitarani",
        desc: "Cross the river of boiling blood and pus on a bridge of swords. Each step is a test of will. The guardians watch from the shores, their eyes burning with ancient judgment.",
        stat: { label: "TEMPERATURE", value: "1,200°C" },
      },
      {
        num: "III",
        title: "The Court of Yama",
        desc: "Face the Lord of Death himself in his obsidian throne room. Your deeds are weighed on cosmic scales. The verdict shapes reality around you — redemption or damnation.",
        stat: { label: "INTENSITY", value: "MAX" },
      },
    ],
    features: [
      { icon: "🔥", label: "Heat Simulation", desc: "Feel the infernal warmth" },
      { icon: "💀", label: "Adaptive Fear", desc: "AI-driven tension system" },
      { icon: "⚡", label: "Seismic Haptics", desc: "Ground-shaking feedback" },
      { icon: "◉", label: "Moral Choices", desc: "Shape your fate" },
    ],
  },
};

// ==================== 3D PARTICLE BACKGROUND ====================
function StoryCanvas({
  particleColor,
  particleColor2,
  ambientColor,
  theme,
}: {
  particleColor: number;
  particleColor2: number;
  ambientColor: number;
  theme: "heaven" | "hell";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let stopped = false;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, theme === "heaven" ? 0.015 : 0.02);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0, 30);

    // Ambient light
    const ambient = new THREE.AmbientLight(ambientColor, 0.3);
    scene.add(ambient);

    // Point lights
    const light1 = new THREE.PointLight(particleColor, 2, 80);
    light1.position.set(10, 15, 20);
    scene.add(light1);

    const light2 = new THREE.PointLight(particleColor2, 1.5, 60);
    light2.position.set(-15, -10, 15);
    scene.add(light2);

    // === Floating particles ===
    const particleCount = 600;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities: { x: number; y: number; z: number; phase: number }[] = [];

    const c1 = new THREE.Color(particleColor);
    const c2 = new THREE.Color(particleColor2);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;

      const mix = Math.random();
      const c = new THREE.Color().lerpColors(c1, c2, mix);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = Math.random() * 3 + 0.5;

      velocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: theme === "heaven" ? Math.random() * 0.03 + 0.005 : -Math.random() * 0.02 - 0.005,
        z: (Math.random() - 0.5) * 0.01,
        phase: Math.random() * Math.PI * 2,
      });
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uPixelRatio;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float dist = length(mvPosition.xyz);
          vAlpha = smoothstep(80.0, 10.0, dist) * 0.8;
          gl_PointSize = size * uPixelRatio * (30.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // === Floating geometric shapes ===
    const shapes: THREE.Mesh[] = [];
    const shapeCount = theme === "heaven" ? 8 : 6;
    for (let i = 0; i < shapeCount; i++) {
      let geo: THREE.BufferGeometry;
      if (theme === "heaven") {
        geo =
          i % 3 === 0
            ? new THREE.IcosahedronGeometry(Math.random() * 1.5 + 0.5, 0)
            : i % 3 === 1
              ? new THREE.OctahedronGeometry(Math.random() * 1 + 0.4, 0)
              : new THREE.TetrahedronGeometry(Math.random() * 1.2 + 0.3, 0);
      } else {
        geo =
          i % 3 === 0
            ? new THREE.OctahedronGeometry(Math.random() * 1.5 + 0.5, 0)
            : i % 3 === 1
              ? new THREE.TetrahedronGeometry(Math.random() * 1.2 + 0.4, 0)
              : new THREE.BoxGeometry(
                  Math.random() * 1 + 0.3,
                  Math.random() * 1 + 0.3,
                  Math.random() * 1 + 0.3,
                );
      }

      const mat = new THREE.MeshPhongMaterial({
        color: new THREE.Color().lerpColors(c1, c2, Math.random()),
        transparent: true,
        opacity: 0.12,
        wireframe: true,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30 - 15,
      );
      mesh.userData = {
        rotSpeed: { x: (Math.random() - 0.5) * 0.008, y: (Math.random() - 0.5) * 0.008 },
        floatPhase: Math.random() * Math.PI * 2,
        floatAmp: Math.random() * 0.02 + 0.005,
        baseY: mesh.position.y,
      };
      scene.add(mesh);
      shapes.push(mesh);
    }

    // === Central glowing orb ===
    const orbGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const orbMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: c1 },
        uColor2: { value: c2 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec3 pos = position;
          pos += normal * sin(pos.y * 4.0 + uTime * 1.5) * 0.15;
          pos += normal * cos(pos.x * 3.0 + uTime * 1.2) * 0.1;
          vPosition = pos;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
          vec3 color = mix(uColor1, uColor2, fresnel + sin(uTime) * 0.3);
          float pulse = 0.15 + fresnel * 0.85;
          float glow = pulse * (0.8 + sin(uTime * 2.0) * 0.2);
          gl_FragColor = vec4(color * glow, glow * 0.6);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.set(0, 0, -5);
    scene.add(orb);

    // === Ring around orb ===
    const ringGeo = new THREE.TorusGeometry(4, 0.05, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: particleColor,
      transparent: true,
      opacity: 0.2,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(orb.position);
    ring.rotation.x = Math.PI * 0.5;
    scene.add(ring);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(5.5, 0.03, 16, 100),
      new THREE.MeshBasicMaterial({ color: particleColor2, transparent: true, opacity: 0.1 }),
    );
    ring2.position.copy(orb.position);
    ring2.rotation.x = Math.PI * 0.35;
    ring2.rotation.z = Math.PI * 0.2;
    scene.add(ring2);

    // Mouse handler
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Scroll handler
    let scrollY = 0;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Animate
    let time = 0;
    const animate = () => {
      if (stopped) return;
      time += 0.016;

      // Camera subtle movement with mouse + scroll
      const targetCamX = mouseRef.current.x * 3;
      const targetCamY = -mouseRef.current.y * 2 - scrollY * 0.003;
      camera.position.x += (targetCamX - camera.position.x) * 0.02;
      camera.position.y += (targetCamY - camera.position.y) * 0.02;
      camera.lookAt(0, -scrollY * 0.002, -5);

      // Particles
      const posArr = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const v = velocities[i];
        posArr[i * 3] += v.x + Math.sin(time + v.phase) * 0.005;
        posArr[i * 3 + 1] += v.y;
        posArr[i * 3 + 2] += v.z;

        // Wrap
        if (posArr[i * 3 + 1] > 40) posArr[i * 3 + 1] = -40;
        if (posArr[i * 3 + 1] < -40) posArr[i * 3 + 1] = 40;
        if (Math.abs(posArr[i * 3]) > 40) posArr[i * 3] *= -0.9;
      }
      particleGeometry.attributes.position.needsUpdate = true;
      particleMaterial.uniforms.uTime.value = time;

      // Shapes
      shapes.forEach((s) => {
        s.rotation.x += s.userData.rotSpeed.x;
        s.rotation.y += s.userData.rotSpeed.y;
        s.position.y = s.userData.baseY + Math.sin(time + s.userData.floatPhase) * s.userData.floatAmp * 30;
      });

      // Orb
      orbMat.uniforms.uTime.value = time;
      orbMat.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
      orb.rotation.y += 0.003;
      orb.rotation.x = Math.sin(time * 0.5) * 0.1;

      // Rings
      ring.rotation.z += 0.004;
      ring2.rotation.z -= 0.003;
      ring2.rotation.x = Math.PI * 0.35 + Math.sin(time * 0.3) * 0.1;

      // Lights follow mouse
      light1.position.x = 10 + mouseRef.current.x * 8;
      light1.position.y = 15 + mouseRef.current.y * 5;
      light2.position.x = -15 - mouseRef.current.x * 5;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      stopped = true;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);

      // Dispose
      particles.geometry.dispose();
      (particles.material as THREE.Material).dispose();
      shapes.forEach((s) => {
        s.geometry.dispose();
        (s.material as THREE.Material).dispose();
      });
      orbGeo.dispose();
      orbMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ring2.geometry.dispose();
      (ring2.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, [particleColor, particleColor2, ambientColor, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: "none" }}
    />
  );
}

// ==================== INTERACTIVE ORB CURSOR ====================
function OrbCursor({ hex }: { hex: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 150, damping: 25 });
  const smoothY = useSpring(y, { stiffness: 150, damping: 25 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [x, y]);

  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{
        x: smoothX,
        y: smoothY,
        width: 200,
        height: 200,
        marginLeft: -100,
        marginTop: -100,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${hex}15 0%, transparent 70%)`,
        zIndex: 5,
      }}
    />
  );
}

// ==================== SECTION WRAPPER ====================
function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// ==================== INTERACTIVE 3D CHAPTER CARD ====================
function ChapterCard({
  chapter,
  index,
  color1,
  hex1,
}: {
  chapter: { num: string; title: string; desc: string; stat: { label: string; value: string } };
  index: number;
  color1: string;
  hex1: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setTilt({ x: y * -8, y: x * 8 });
    },
    [],
  );

  return (
    <Section delay={0.15 + index * 0.15}>
      <motion.div
        ref={ref}
        animate={{
          rotateX: hovering ? tilt.x : 0,
          rotateY: hovering ? tilt.y : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => {
          setHovering(false);
          setTilt({ x: 0, y: 0 });
        }}
        className="relative cursor-pointer"
        style={{
          perspective: "800px",
          transformStyle: "preserve-3d",
          background: "linear-gradient(160deg, rgba(12,10,24,0.75) 0%, rgba(8,6,18,0.55) 100%)",
          border: `1px solid ${color1}${hovering ? "0.2)" : "0.08)"}`,
          borderRadius: "22px",
          backdropFilter: "blur(20px)",
          padding: "32px 28px",
          boxShadow: hovering ? `0 20px 60px ${color1}0.1)` : "none",
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}
      >
        {/* Chapter number */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: `${color1}0.08)`,
                border: `1px solid ${color1}0.15)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "16px",
                fontWeight: 800,
                color: hex1,
              }}
            >
              {chapter.num}
            </div>
            <span
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.3em",
                color: `${color1}0.45)`,
              }}
            >
              CHAPTER {chapter.num}
            </span>
          </div>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: `${color1}${hovering ? "0.6)" : "0.15)"}`,
              boxShadow: hovering ? `0 0 12px ${color1}0.4)` : "none",
              transition: "all 0.3s",
            }}
          />
        </div>

        <h3
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "20px",
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: "12px",
          }}
        >
          {chapter.title}
        </h3>
        <p
          style={{
            fontFamily: "'Exo 2', sans-serif",
            fontSize: "13px",
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.4)",
            marginBottom: "20px",
          }}
        >
          {chapter.desc}
        </p>

        {/* Stat */}
        <div className="flex items-center gap-4">
          <div>
            <div
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "8px",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.25)",
                marginBottom: "4px",
              }}
            >
              {chapter.stat.label}
            </div>
            <div
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "22px",
                fontWeight: 800,
                color: `${color1}0.75)`,
              }}
            >
              {chapter.stat.value}
            </div>
          </div>
        </div>

        {/* Subtle glow line at top */}
        <div
          className="absolute top-0 left-8 right-8"
          style={{
            height: "1px",
            background: `linear-gradient(to right, transparent, ${color1}${hovering ? "0.3)" : "0.1)"},  transparent)`,
            transition: "background 0.3s",
          }}
        />

        {/* 3D-depth inner shadow on hover */}
        {hovering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 rounded-[22px] pointer-events-none"
            style={{
              boxShadow: `inset 0 0 40px ${color1}0.05), 0 0 30px ${color1}0.05)`,
            }}
          />
        )}
      </motion.div>
    </Section>
  );
}

// ==================== HOOKS ====================
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

// ==================== MAIN STORY PAGE ====================
export default function StoryPage({ params }: { params: { story: string } }) {
  const storyParam = params.story;
  const isValidStory = storyParam === "heaven" || storyParam === "hell";
  const story = (isValidStory ? storyParam : "heaven") as "heaven" | "hell";

  const data = STORIES[story];
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -150]);

  if (!isValidStory) {
    return <div>Story not found</div>;
  }

  return (
    <div
      ref={containerRef}
      className="w-full relative min-h-screen"
      style={{ background: data.bgGradient, overflowX: "hidden" }}
    >
      {/* 3D canvas background */}
      <StoryCanvas
        particleColor={data.particleColor}
        particleColor2={data.particleColor2}
        ambientColor={data.ambientColor}
        theme={story}
      />

      {/* Orb cursor follower */}
      {!isMobile && <OrbCursor hex={data.hex1} />}

      {/* Nav */}
      <FloatingNav />

      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 100,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 99,
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 50%, rgba(3,4,8,0.6) 100%)",
        }}
      />

      {/* ====== HERO ====== */}
      <section
        className="relative flex items-center justify-center"
        style={{ height: "100vh", zIndex: 2, overflow: "hidden" }}
      >
        {/* Background image with parallax */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: heroScale, y: parallaxY }}
        >
          <Image
            src={data.heroImg}
            alt={data.title}
            fill
            className="object-cover"
            style={{ opacity: 0.35, filter: "saturate(0.7)" }}
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 60%, ${
                story === "heaven" ? "rgba(10,12,8,1)" : "rgba(12,6,4,1)"
              } 100%)`,
            }}
          />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 flex flex-col items-center text-center px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex items-center gap-3 mb-5"
          >
            <div style={{ width: "40px", height: "1px", background: `linear-gradient(to right, transparent, ${data.color1}0.5))` }} />
            <span
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.4em",
                color: `${data.color1}0.6)`,
              }}
            >
              {data.tagline}
            </span>
            <div style={{ width: "40px", height: "1px", background: `linear-gradient(to left, transparent, ${data.color2}0.5))` }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: isMobile ? "clamp(36px, 12vw, 52px)" : "clamp(52px, 7vw, 80px)",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#ffffff",
              textShadow: `0 0 60px ${data.color1}0.3)`,
            }}
          >
            {data.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.0 }}
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: isMobile ? "14px" : "18px",
              color: `${data.color1}0.7)`,
              marginTop: "12px",
              letterSpacing: "0.15em",
            }}
          >
            {data.subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
            style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: isMobile ? "13px" : "15px",
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.5)",
              maxWidth: "480px",
              marginTop: "20px",
            }}
          >
            {data.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="mt-10 flex gap-4"
          >
            <button
              className="cursor-pointer transition-all duration-300"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                padding: "14px 32px",
                color: "#ffffff",
                background: data.gradient,
                border: "none",
                borderRadius: "50px",
                boxShadow: `0 0 30px ${data.color1}0.2)`,
              }}
            >
              Begin Journey
            </button>
            <button
              onClick={() => router.push("/")}
              className="cursor-pointer transition-all duration-300"
              style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: "13px",
                padding: "14px 24px",
                color: "rgba(255,255,255,0.6)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "50px",
              }}
            >
              Back to Home
            </button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="absolute bottom-8 flex flex-col items-center gap-2"
          >
            <span style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "9px", letterSpacing: "0.3em", color: "rgba(255,255,255,0.2)" }}>
              SCROLL TO EXPLORE
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: "1px", height: "24px", background: `linear-gradient(to bottom, ${data.color1}0.4), transparent)` }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ====== OVERVIEW ====== */}
      <section
        className="relative flex flex-col items-center py-20 md:py-32 px-5 md:px-8"
        style={{ zIndex: 2 }}
      >
        <Section>
          <div className="text-center max-w-2xl">
            <span
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.4em",
                color: `${data.color1}0.4)`,
              }}
            >
              THE EXPERIENCE
            </span>
            <p
              className="mt-6"
              style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: isMobile ? "16px" : "20px",
                lineHeight: 1.9,
                color: "rgba(255,255,255,0.55)",
              }}
            >
              {data.longDescription}
            </p>
          </div>
        </Section>

        {/* Feature grid */}
        <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-4"} gap-4 md:gap-5 mt-16 max-w-[800px] w-full`}>
          {data.features.map((f, i) => (
            <Section key={f.label} delay={0.1 + i * 0.08}>
              <div
                className="group flex flex-col items-center text-center p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-default"
                style={{
                  background: "linear-gradient(160deg, rgba(12,10,24,0.6), rgba(8,6,18,0.35))",
                  border: `1px solid ${data.color1}0.08)`,
                  backdropFilter: "blur(14px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${data.color1}0.2)`;
                  e.currentTarget.style.boxShadow = `0 0 24px ${data.color1}0.08)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${data.color1}0.08)`;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span style={{ fontSize: "24px", marginBottom: "10px" }}>{f.icon}</span>
                <span
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#ffffff",
                    marginBottom: "4px",
                  }}
                >
                  {f.label}
                </span>
                <span
                  style={{
                    fontFamily: "'Exo 2', sans-serif",
                    fontSize: "10px",
                    color: `${data.color1}0.5)`,
                  }}
                >
                  {f.desc}
                </span>
              </div>
            </Section>
          ))}
        </div>
      </section>

      {/* ====== CHAPTERS ====== */}
      <section className="relative py-16 md:py-28 px-5 md:px-8" style={{ zIndex: 2 }}>
        <Section>
          <div className="text-center mb-12 md:mb-20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div style={{ width: "40px", height: "1px", background: `linear-gradient(to right, transparent, ${data.color1}0.3))` }} />
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "10px", letterSpacing: "0.4em", color: "rgba(255,255,255,0.35)" }}>
                STORY ARC
              </span>
              <div style={{ width: "40px", height: "1px", background: `linear-gradient(to left, transparent, ${data.color2}0.3))` }} />
            </div>
            <h2
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: isMobile ? "22px" : "32px",
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              Three{" "}
              <span style={{ background: data.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Chapters
              </span>
            </h2>
          </div>
        </Section>

        <div className="flex flex-col gap-6 md:gap-8 max-w-[700px] mx-auto" style={{ perspective: "800px" }}>
          {data.chapters.map((ch, i) => (
            <ChapterCard
              key={ch.num}
              chapter={ch}
              index={i}
              color1={data.color1}
              hex1={data.hex1}
            />
          ))}
        </div>

        {/* Connecting line between chapters */}
        <div
          className="absolute left-1/2 -translate-x-1/2 hidden md:block"
          style={{
            top: "200px",
            bottom: "100px",
            width: "1px",
            background: `linear-gradient(to bottom, transparent, ${data.color1}0.1), ${data.color1}0.1), transparent)`,
            zIndex: 0,
          }}
        />
      </section>

      {/* ====== IMMERSION STATS ====== */}
      <section className="relative py-16 md:py-24 px-5 md:px-8" style={{ zIndex: 2 }}>
        <Section>
          <div
            className="max-w-[900px] mx-auto p-8 md:p-12 rounded-3xl relative"
            style={{
              background: "linear-gradient(160deg, rgba(12,10,24,0.75), rgba(8,6,18,0.55))",
              border: `1px solid ${data.color1}0.1)`,
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0" style={{ width: "40px", height: "40px", borderTop: `1px solid ${data.color1}0.2)`, borderLeft: `1px solid ${data.color1}0.2)`, borderRadius: "20px 0 0 0" }} />
            <div className="absolute bottom-0 right-0" style={{ width: "40px", height: "40px", borderBottom: `1px solid ${data.color2}0.15)`, borderRight: `1px solid ${data.color2}0.15)`, borderRadius: "0 0 20px 0" }} />

            <div className="text-center mb-10">
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "10px", letterSpacing: "0.35em", color: "rgba(255,255,255,0.35)" }}>
                TECHNICAL SPECS
              </span>
            </div>

            <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-4"} gap-6`}>
              {[
                { label: "FRAMERATE", value: "120", unit: "FPS" },
                { label: "RESOLUTION", value: "4K+", unit: "PER EYE" },
                { label: "LATENCY", value: "<8", unit: "MS" },
                { label: "AUDIO", value: "360°", unit: "SPATIAL" },
              ].map((s, i) => (
                <Section key={s.label} delay={0.1 + i * 0.1}>
                  <div className="text-center">
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "8px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", marginBottom: "8px" }}>
                      {s.label}
                    </div>
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: isMobile ? "28px" : "36px", fontWeight: 800, background: data.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {s.value}
                    </div>
                    <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "9px", letterSpacing: "0.2em", color: `${data.color1}0.4)`, marginTop: "4px" }}>
                      {s.unit}
                    </div>
                  </div>
                </Section>
              ))}
            </div>
          </div>
        </Section>
      </section>

      {/* ====== FINAL CTA ====== */}
      <section
        className="relative flex flex-col items-center justify-center py-20 md:py-32 px-5"
        style={{ zIndex: 2, minHeight: "60vh" }}
      >
        <Section>
          <div className="text-center" style={{ pointerEvents: "auto" }}>
            <h2
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: isMobile ? "clamp(24px, 8vw, 36px)" : "clamp(32px, 4vw, 48px)",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.2,
                marginBottom: "16px",
              }}
            >
              Ready to{" "}
              <span style={{ background: data.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {story === "heaven" ? "Ascend" : "Descend"}
              </span>
              ?
            </h2>
            <p
              style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: "14px",
                color: "rgba(255,255,255,0.45)",
                maxWidth: "400px",
                margin: "0 auto 32px",
                lineHeight: 1.8,
              }}
            >
              {story === "heaven"
                ? "Put on your headset and rise beyond the clouds. Swarga awaits."
                : "Steel your nerves and descend into the abyss. Naraka awaits."}
            </p>
            <div className={`flex gap-4 justify-center ${isMobile ? "flex-col items-center" : ""}`}>
              <button
                className="cursor-pointer transition-all duration-300"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  padding: "16px 36px",
                  color: "#ffffff",
                  background: data.gradient,
                  border: "none",
                  borderRadius: "50px",
                  boxShadow: `0 0 30px ${data.color1}0.2)`,
                }}
              >
                Launch in VR
              </button>
              <button
                onClick={() => router.push(story === "heaven" ? "/story/hell" : "/story/heaven")}
                className="cursor-pointer transition-all duration-300"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: "13px",
                  padding: "16px 28px",
                  color: "rgba(255,255,255,0.6)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "50px",
                }}
              >
                Explore {story === "heaven" ? "Naraka" : "Swarga"} Instead
              </button>
            </div>
          </div>
        </Section>
      </section>
    </div>
  );
}
