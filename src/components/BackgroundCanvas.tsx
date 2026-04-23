"use client";

import { useEffect, useRef } from "react";

interface NeuralNode {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  label: string;
  color: string;
  phase: number;
  depth: number;
}

interface Signal {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: string;
}

interface Connection {
  fromNode: number;
  toNode: number;
  strength: number;
  bend: number;
}

interface Fragment {
  text: string;
  x: number;
  y: number;
  opacity: number;
  speed: number;
  drift: number;
}

const LABELS = [
  "pod",
  "svc",
  "api",
  "argo",
  "helm",
  "gitops",
  "model",
  "agent",
  "gpu",
  "vector",
  "cloud",
  "trace",
  "prom",
  "loki",
  "k8s",
  "node",
  "deploy",
  "ai",
];

const COLORS = [
  "rgba(66,224,255,",
  "rgba(92,255,177,",
  "rgba(112,156,255,",
  "rgba(255,198,74,",
  "rgba(255,95,128,",
];

const FRAGMENTS = [
  "kubectl get pods",
  "argocd app sync",
  "helm upgrade --install",
  "vector search: warm",
  "model context: loaded",
  "trace_id: coffee-required",
  "cluster: healthy",
  "agent loop: curious",
  "cloud nodes: ready",
  "prometheus: watching",
  "k8s neural mesh",
  "STATUS: Learning",
];

function pickColor(i: number) {
  return COLORS[i % COLORS.length];
}

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (canvasElement === null) return;
    const context = canvasElement.getContext("2d");
    if (context === null) return;
    const ctx: CanvasRenderingContext2D = context;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes: NeuralNode[] = [];
    let connections: Connection[] = [];
    let signals: Signal[] = [];
    let fragments: Fragment[] = [];
    let currentScrollY = window.scrollY;
    let lastScrollY = currentScrollY;
    let lastFrameAt = 0;
    let scrollBoost = 0;
    let paused = document.hidden;
    const maxDistance = 260;
    const targetFrameMs = 1000 / 36;

    function resize() {
      const canvas = canvasRef.current;
      if (canvas === null) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, width < 760 ? 1 : 1.35);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initScene();
    }

    function brainPoint(i: number, count: number) {
      const side = i % 2 === 0 ? -1 : 1;
      const groupIndex = Math.floor(i / 2);
      const angle = (groupIndex / Math.ceil(count / 2)) * Math.PI * 2;
      const lobeX = width * (side < 0 ? 0.42 : 0.58);
      const lobeY = height * 0.42;
      const rx = width * (0.17 + Math.random() * 0.06);
      const ry = height * (0.22 + Math.random() * 0.08);
      const wobble = Math.sin(angle * 3) * 28;
      return {
        x: lobeX + Math.cos(angle) * rx * (0.55 + Math.random() * 0.45) + wobble * side,
        y: lobeY + Math.sin(angle) * ry * (0.55 + Math.random() * 0.45) + Math.cos(angle * 2) * 18,
      };
    }

    function initScene() {
      const nodeCount = Math.min(54, Math.max(width < 760 ? 24 : 32, Math.floor(width / 42)));
      nodes = Array.from({ length: nodeCount }, (_, i) => {
        const p = brainPoint(i, nodeCount);
        const depth = 0.55 + Math.random() * 0.75;
        return {
          x: p.x,
          y: p.y,
          baseX: p.x,
          baseY: p.y,
          vx: (Math.random() - 0.5) * 0.16,
          vy: (Math.random() - 0.5) * 0.16,
          radius: (1.8 + Math.random() * 2.7) * depth,
          label: LABELS[i % LABELS.length],
          color: pickColor(i),
          phase: Math.random() * Math.PI * 2,
          depth,
        };
      });

      buildConnections();

      fragments = FRAGMENTS.map((text, i) => ({
        text,
        x: 40 + Math.random() * Math.max(240, width - 320),
        y: 70 + ((i * 71) % Math.max(120, height - 140)),
        opacity: 0.025 + Math.random() * 0.08,
        speed: 0.18 + Math.random() * 0.32,
        drift: Math.random() * Math.PI * 2,
      }));
      signals = [];
    }

    function buildConnections() {
      const candidates: Connection[] = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.baseX - b.baseX;
          const dy = a.baseY - b.baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > maxDistance) continue;
          candidates.push({
            fromNode: i,
            toNode: j,
            strength: 1 - dist / maxDistance,
            bend: (Math.random() - 0.5) * 18,
          });
        }
      }

      connections = candidates
        .sort((a, b) => b.strength - a.strength)
        .slice(0, width < 760 ? 80 : 150);
    }

    function onScroll() {
      const nextY = window.scrollY;
      currentScrollY = nextY;
      scrollBoost = Math.min(1.8, scrollBoost + Math.abs(nextY - lastScrollY) * 0.0035);
      lastScrollY = nextY;
    }

    function onVisibilityChange() {
      paused = document.hidden;
      if (!paused) {
        lastFrameAt = 0;
        animId = requestAnimationFrame(draw);
      }
    }

    function spawnSignal() {
      const limit = 22 + Math.floor(scrollBoost * 14);
      if (signals.length >= limit) return;
      if (Math.random() > 0.055 + scrollBoost * 0.055) return;
      if (connections.length === 0) return;

      const connection = connections[Math.floor(Math.random() * connections.length)];

      signals.push({
        fromNode: connection.fromNode,
        toNode: connection.toNode,
        progress: 0,
        speed: 0.004 + Math.random() * 0.006 + scrollBoost * 0.004,
        color: nodes[connection.fromNode].color,
      });
    }

    function drawBrainGlow(t: number) {
      const pulse = 0.5 + Math.sin(t * 0.0012) * 0.5;
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.42,
        Math.min(width, height) * 0.05,
        width * 0.5,
        height * 0.42,
        Math.min(width, height) * (0.43 + pulse * 0.04)
      );
      grad.addColorStop(0, `rgba(66,224,255,${0.05 + scrollBoost * 0.018})`);
      grad.addColorStop(0.5, "rgba(92,255,177,0.028)");
      grad.addColorStop(1, "rgba(3,16,31,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    function drawK8sSigil(t: number) {
      const radius = Math.min(width, height) * 0.115;
      const alpha = 0.045 + scrollBoost * 0.018;
      ctx.save();
      ctx.translate(width * 0.5, height * 0.43 + Math.sin(t * 0.001) * 5);
      ctx.rotate(t * 0.00008 + scrollBoost * 0.08);
      ctx.strokeStyle = `rgba(66,224,255,${alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 7; i++) {
        const angle = (Math.PI * 2 * i) / 7;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * radius * 0.28, Math.sin(angle) * radius * 0.28);
        ctx.lineTo(Math.cos(angle) * radius * 0.9, Math.sin(angle) * radius * 0.9);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawFragments(t: number) {
      ctx.font = '10px "JetBrains Mono", monospace';
      fragments.forEach((f, i) => {
        const parallax = (currentScrollY * (0.018 + (i % 4) * 0.004)) % (height + 120);
        const y = (f.y + Math.sin(t * 0.0004 + f.drift) * 16 - parallax + height + 60) % (height + 120) - 50;
        const x = f.x + Math.sin(t * 0.00025 + f.drift) * 18;
        ctx.fillStyle = `rgba(66,224,255,${f.opacity + scrollBoost * 0.025})`;
        ctx.fillText(f.text, x, y);
      });
    }

    function drawConnections() {
      connections.forEach((connection) => {
        const a = nodes[connection.fromNode];
        const b = nodes[connection.toNode];
        const alpha = connection.strength * (0.18 + scrollBoost * 0.07);
        const midX = (a.x + b.x) / 2 + Math.sin((a.phase + b.phase) * 0.5) * connection.bend;
        const midY = (a.y + b.y) / 2 + Math.cos((a.phase + b.phase) * 0.5) * connection.bend;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(66,224,255,${alpha})`;
        ctx.lineWidth = 0.62 + scrollBoost * 0.16;
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(midX, midY, b.x, b.y);
        ctx.stroke();
      });
    }

    function drawSignals() {
      signals = signals.filter((signal) => {
        signal.progress += signal.speed * (1 + scrollBoost * 1.8);
        if (signal.progress >= 1) return false;
        const a = nodes[signal.fromNode];
        const b = nodes[signal.toNode];
        const p = signal.progress;
        const x = a.x + (b.x - a.x) * p;
        const y = a.y + (b.y - a.y) * p;
        const trailP = Math.max(0, p - 0.075);
        const tx = a.x + (b.x - a.x) * trailP;
        const ty = a.y + (b.y - a.y) * trailP;
        const grad = ctx.createLinearGradient(tx, ty, x, y);
        grad.addColorStop(0, signal.color + "0)");
        grad.addColorStop(1, signal.color + "0.96)");
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4 + scrollBoost * 0.65;
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, 2.1 + scrollBoost * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = signal.color + "1)";
        ctx.fill();
        return true;
      });
    }

    function drawNodes(t: number) {
      nodes.forEach((node, i) => {
        node.phase += 0.012 + scrollBoost * 0.02;
        const orbit = 8 + node.depth * 8 + scrollBoost * 12;
        const scrollParallax = currentScrollY * 0.018 * node.depth;
        node.x += (node.baseX + Math.sin(t * 0.00032 + node.phase) * orbit - node.x) * 0.025 + node.vx;
        node.y += (node.baseY + Math.cos(t * 0.00027 + node.phase) * orbit - scrollParallax - node.y) * 0.025 + node.vy;

        if (node.x < -60) node.x = width + 60;
        if (node.x > width + 60) node.x = -60;
        if (node.y < -80) node.y = height + 80;
        if (node.y > height + 80) node.y = -80;

        const pulse = 0.5 + Math.sin(node.phase) * 0.5;
        const glowRadius = node.radius + 12 + pulse * 7 + scrollBoost * 5;
        const glow = ctx.createRadialGradient(node.x, node.y, node.radius, node.x, node.y, glowRadius);
        glow.addColorStop(0, node.color + `${0.2 + scrollBoost * 0.08})`);
        glow.addColorStop(1, node.color + "0)");
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + pulse * 1.1, 0, Math.PI * 2);
        ctx.fillStyle = node.color + `${0.7 + pulse * 0.3})`;
        ctx.fill();

        if (i % 3 === 0) {
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillStyle = node.color + `${0.34 + pulse * 0.24 + scrollBoost * 0.06})`;
          ctx.fillText(node.label, node.x + node.radius + 5, node.y + 3);
        }
      });
    }

    function draw(t: number) {
      if (paused) return;
      if (t - lastFrameAt < targetFrameMs) {
        animId = requestAnimationFrame(draw);
        return;
      }
      lastFrameAt = t;
      ctx.clearRect(0, 0, width, height);
      drawBrainGlow(t);
      drawK8sSigil(t);
      drawFragments(t);
      drawConnections();
      drawSignals();
      drawNodes(t);
      spawnSignal();
      scrollBoost *= 0.92;
      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.95,
      }}
    />
  );
}
