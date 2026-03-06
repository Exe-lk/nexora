"use client";

import { useRef, useEffect, useCallback } from "react";

/**
 * Draws a holographic wireframe VR headset on a 2D canvas
 * with mouse-driven parallax rotation and animated glow effects.
 */
export function VRHeadset3D({ mouseX = 0, mouseY = 0 }: { mouseX: number; mouseY: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const mouseRef = useRef({ x: mouseX, y: mouseY });

  useEffect(() => {
    mouseRef.current = { x: mouseX, y: mouseY };
  }, [mouseX, mouseY]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const startTime = performance.now();

    function render() {
      const t = (performance.now() - startTime) * 0.001;
      const mx = mouseRef.current.x; // -1 to 1
      const my = mouseRef.current.y;

      ctx!.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h) * 0.35;

      // Parallax rotation angles
      const rotY = mx * 0.35;
      const rotX = my * 0.2;

      // 3D projection helper
      function project(x: number, y: number, z: number): [number, number, number] {
        // Rotate around Y axis
        const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
        const rx = x * cosY - z * sinY;
        let rz = x * sinY + z * cosY;
        // Rotate around X axis
        const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
        const ry = y * cosX - rz * sinX;
        rz = y * sinX + rz * cosX;
        // Perspective
        const d = 4;
        const perspective = d / (d + rz + 2);
        return [cx + rx * scale * perspective, cy + ry * scale * perspective, perspective];
      }

      // Draw wireframe line with glow
      function drawLine(
        p1: [number, number, number],
        p2: [number, number, number],
        color: string,
        alpha: number,
        width: number = 1
      ) {
        const avgDepth = (p1[2] + p2[2]) / 2;
        ctx!.beginPath();
        ctx!.moveTo(p1[0], p1[1]);
        ctx!.lineTo(p2[0], p2[1]);
        ctx!.strokeStyle = color;
        ctx!.globalAlpha = alpha * avgDepth;
        ctx!.lineWidth = width * avgDepth;
        ctx!.stroke();
        ctx!.globalAlpha = 1;
      }

      // --- VR Headset geometry ---
      // Main body: rounded rectangle in 3D
      const bodyW = 1.4, bodyH = 0.7, bodyD = 0.65;
      const hw = bodyW / 2, hh = bodyH / 2, hd = bodyD / 2;

      // 8 corners of the headset body (with slight rounding effect via more points)
      const corners = {
        ftl: [-hw, -hh, -hd], ftr: [hw, -hh, -hd],
        fbl: [-hw, hh, -hd], fbr: [hw, hh, -hd],
        btl: [-hw, -hh, hd], btr: [hw, -hh, hd],
        bbl: [-hw, hh, hd], bbr: [hw, hh, hd],
      };

      // Project all corners
      const pc: Record<string, [number, number, number]> = {};
      for (const [k, v] of Object.entries(corners)) {
        pc[k] = project(v[0], v[1], v[2]);
      }

      // Draw body edges - front face
      const bodyColor = "rgba(120,180,255,";
      const bodyAlpha = 0.5 + 0.15 * Math.sin(t * 1.5);
      drawLine(pc.ftl, pc.ftr, `${bodyColor}0.7)`, bodyAlpha, 1.5);
      drawLine(pc.ftr, pc.fbr, `${bodyColor}0.7)`, bodyAlpha, 1.5);
      drawLine(pc.fbr, pc.fbl, `${bodyColor}0.7)`, bodyAlpha, 1.5);
      drawLine(pc.fbl, pc.ftl, `${bodyColor}0.7)`, bodyAlpha, 1.5);
      // Back face
      drawLine(pc.btl, pc.btr, `${bodyColor}0.4)`, bodyAlpha * 0.6, 1);
      drawLine(pc.btr, pc.bbr, `${bodyColor}0.4)`, bodyAlpha * 0.6, 1);
      drawLine(pc.bbr, pc.bbl, `${bodyColor}0.4)`, bodyAlpha * 0.6, 1);
      drawLine(pc.bbl, pc.btl, `${bodyColor}0.4)`, bodyAlpha * 0.6, 1);
      // Side edges
      drawLine(pc.ftl, pc.btl, `${bodyColor}0.5)`, bodyAlpha * 0.8, 1.2);
      drawLine(pc.ftr, pc.btr, `${bodyColor}0.5)`, bodyAlpha * 0.8, 1.2);
      drawLine(pc.fbl, pc.bbl, `${bodyColor}0.5)`, bodyAlpha * 0.8, 1.2);
      drawLine(pc.fbr, pc.bbr, `${bodyColor}0.5)`, bodyAlpha * 0.8, 1.2);

      // --- Lens visor area (front face detail) ---
      const lensR = 0.22;
      const lensSpacing = 0.38;
      const lensZ = -hd - 0.02;
      const lensY = 0.02;

      // Draw lens circles
      for (const side of [-1, 1]) {
        const lensX = side * lensSpacing;
        const segments = 24;
        const points: [number, number, number][] = [];
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const px = lensX + Math.cos(angle) * lensR;
          const py = lensY + Math.sin(angle) * lensR;
          points.push(project(px, py, lensZ));
        }

        // Glowing lens fill
        const cp = project(lensX, lensY, lensZ);
        const grad = ctx!.createRadialGradient(cp[0], cp[1], 0, cp[0], cp[1], lensR * scale * cp[2]);
        const pulse = 0.3 + 0.2 * Math.sin(t * 2 + side);
        grad.addColorStop(0, `rgba(200,130,255,${pulse * 0.4})`);
        grad.addColorStop(0.5, `rgba(120,180,255,${pulse * 0.2})`);
        grad.addColorStop(1, "rgba(120,180,255,0)");
        ctx!.beginPath();
        for (let i = 0; i < points.length; i++) {
          if (i === 0) ctx!.moveTo(points[i][0], points[i][1]);
          else ctx!.lineTo(points[i][0], points[i][1]);
        }
        ctx!.fillStyle = grad;
        ctx!.fill();

        // Lens border
        ctx!.beginPath();
        for (let i = 0; i < points.length; i++) {
          if (i === 0) ctx!.moveTo(points[i][0], points[i][1]);
          else ctx!.lineTo(points[i][0], points[i][1]);
        }
        ctx!.strokeStyle = `rgba(200,130,255,${0.5 + 0.2 * Math.sin(t * 2.5)})`;
        ctx!.lineWidth = 1.5 * cp[2];
        ctx!.stroke();

        // Inner ring
        const innerPoints: [number, number, number][] = [];
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const px = lensX + Math.cos(angle) * lensR * 0.6;
          const py = lensY + Math.sin(angle) * lensR * 0.6;
          innerPoints.push(project(px, py, lensZ));
        }
        ctx!.beginPath();
        for (let i = 0; i < innerPoints.length; i++) {
          if (i === 0) ctx!.moveTo(innerPoints[i][0], innerPoints[i][1]);
          else ctx!.lineTo(innerPoints[i][0], innerPoints[i][1]);
        }
        ctx!.strokeStyle = `rgba(230,80,160,${0.25 + 0.15 * Math.sin(t * 3)})`;
        ctx!.lineWidth = 0.8 * cp[2];
        ctx!.stroke();
      }

      // --- Nose bridge ---
      const bridgeL = project(-0.08, 0.1, lensZ);
      const bridgeR = project(0.08, 0.1, lensZ);
      drawLine(bridgeL, bridgeR, "rgba(200,130,255,0.3)", 0.6, 1);
      
      // Bridge arc
      const bridgeTop = project(0, -0.02, lensZ);
      ctx!.beginPath();
      ctx!.moveTo(bridgeL[0], bridgeL[1]);
      ctx!.quadraticCurveTo(bridgeTop[0], bridgeTop[1], bridgeR[0], bridgeR[1]);
      ctx!.strokeStyle = "rgba(200,130,255,0.35)";
      ctx!.lineWidth = 1;
      ctx!.stroke();

      // --- Head strap (curved lines going back) ---
      const strapColor = "rgba(120,180,255,0.2)";
      for (const side of [-1, 1]) {
        const strapPoints: [number, number, number][] = [];
        for (let i = 0; i <= 8; i++) {
          const t2 = i / 8;
          const sx = side * (hw + 0.05 + t2 * 0.15);
          const sy = -hh * 0.3 + Math.sin(t2 * Math.PI) * 0.08;
          const sz = -hd + t2 * (bodyD + 0.3);
          strapPoints.push(project(sx, sy, sz));
        }
        for (let i = 0; i < strapPoints.length - 1; i++) {
          drawLine(strapPoints[i], strapPoints[i + 1], strapColor, 0.7 - i * 0.06, 0.8);
        }
      }

      // --- Circuit-like detail lines on top ---
      const topDetails = [
        [[-0.3, -hh - 0.01, -0.1], [0.3, -hh - 0.01, -0.1]],
        [[-0.15, -hh - 0.01, 0.05], [0.15, -hh - 0.01, 0.05]],
        [[0, -hh - 0.01, -0.2], [0, -hh - 0.01, 0.1]],
      ];
      for (const [a, b] of topDetails) {
        const pa = project(a[0], a[1], a[2]);
        const pb = project(b[0], b[1], b[2]);
        drawLine(pa, pb, `rgba(200,130,255,${0.15 + 0.1 * Math.sin(t * 1.8)})`, 0.5, 0.6);
      }

      // --- Scanning beam effect ---
      const scanPhase = (t * 0.5) % 1;
      const scanY2 = -hh + scanPhase * bodyH;
      const scanL = project(-hw - 0.05, scanY2, lensZ);
      const scanR2 = project(hw + 0.05, scanY2, lensZ);
      ctx!.beginPath();
      ctx!.moveTo(scanL[0], scanL[1]);
      ctx!.lineTo(scanR2[0], scanR2[1]);
      ctx!.strokeStyle = `rgba(120,180,255,${0.15 * (1 - Math.abs(scanPhase - 0.5) * 2)})`;
      ctx!.lineWidth = 1;
      ctx!.stroke();

      // --- Floating data points around headset ---
      const dataPoints = 8;
      for (let i = 0; i < dataPoints; i++) {
        const angle = (i / dataPoints) * Math.PI * 2 + t * 0.3;
        const radius = 1.2 + 0.2 * Math.sin(t + i);
        const dx = Math.cos(angle) * radius;
        const dy = Math.sin(angle) * 0.4 + Math.sin(t * 0.7 + i * 0.8) * 0.15;
        const dz = Math.sin(angle) * radius * 0.3;
        const dp = project(dx, dy, dz);
        
        const dotAlpha = 0.3 + 0.2 * Math.sin(t * 2 + i * 1.2);
        ctx!.beginPath();
        ctx!.arc(dp[0], dp[1], 2 * dp[2], 0, Math.PI * 2);
        ctx!.fillStyle = i % 2 === 0 ? `rgba(120,180,255,${dotAlpha})` : `rgba(230,80,160,${dotAlpha})`;
        ctx!.fill();

        // Tiny connection line to headset
        const nearCorner = project(
          Math.sign(dx) * hw * 0.6,
          dy * 0.3,
          Math.sign(dz) * hd * 0.3
        );
        ctx!.beginPath();
        ctx!.moveTo(dp[0], dp[1]);
        ctx!.lineTo(nearCorner[0], nearCorner[1]);
        ctx!.strokeStyle = `rgba(200,130,255,${dotAlpha * 0.3})`;
        ctx!.lineWidth = 0.5;
        ctx!.stroke();
      }

      // --- Ambient glow behind headset ---
      const centerP = project(0, 0, 0);
      const ambientGrad = ctx!.createRadialGradient(centerP[0], centerP[1], 0, centerP[0], centerP[1], scale * 0.9);
      ambientGrad.addColorStop(0, `rgba(140,100,220,${0.06 + 0.03 * Math.sin(t)})`);
      ambientGrad.addColorStop(0.5, `rgba(120,180,255,${0.03 + 0.02 * Math.sin(t * 1.3)})`);
      ambientGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = ambientGrad;
      ctx!.fillRect(0, 0, w, h);

      animRef.current = requestAnimationFrame(render);
    }

    render();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    const cleanup = draw();
    return () => cleanup?.();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
