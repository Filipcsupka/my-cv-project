"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  label: string;
  color: string;
  pulse: number;
  pulseSpeed: number;
}

interface Packet {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: string;
}

const K8S_LABELS = [
  "pod", "node", "svc", "deploy", "rs",
  "ns", "pvc", "cm", "ingress", "sa",
  "hpa", "crd", "job", "ds", "sts",
];

const COLORS = [
  "rgba(0,212,255,",   // cyan
  "rgba(0,255,136,",   // green
  "rgba(100,160,255,", // blue
  "rgba(255,184,0,",   // amber (rare)
];

function pickColor() {
  const r = Math.random();
  if (r < 0.5)  return COLORS[0];
  if (r < 0.8)  return COLORS[1];
  if (r < 0.97) return COLORS[2];
  return COLORS[3];
}

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const _ctx = canvas.getContext("2d");
    if (!_ctx) return;
    const ctx: CanvasRenderingContext2D = _ctx;

    let animId: number;
    let W = 0, H = 0;
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    const MAX_DIST = 220;
    const NODE_COUNT = Math.min(28, Math.floor(window.innerWidth / 60));

    /* ── resize ─────────────────────────────────────────── */
    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    /* ── init nodes ─────────────────────────────────────── */
    function initNodes() {
      nodes = Array.from({ length: NODE_COUNT }, (_, i) => {
        const color = pickColor();
        return {
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: 3 + Math.random() * 3,
          label: K8S_LABELS[i % K8S_LABELS.length],
          color,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.02,
        };
      });
    }
    initNodes();

    /* ── spawn packets ──────────────────────────────────── */
    function maybeSpawnPacket() {
      if (packets.length >= 18) return;
      if (Math.random() > 0.04) return;
      const from = Math.floor(Math.random() * nodes.length);
      let to = Math.floor(Math.random() * nodes.length);
      while (to === from) to = Math.floor(Math.random() * nodes.length);
      packets.push({
        fromNode: from,
        toNode: to,
        progress: 0,
        speed: 0.004 + Math.random() * 0.006,
        color: nodes[from].color,
      });
    }

    /* ── floating YAML fragments ────────────────────────── */
    const FRAGMENTS = [
      "apiVersion: apps/v1",
      "kind: Deployment",
      "replicas: 3",
      "image: nginx:alpine",
      "kubectl get pods",
      "helm upgrade --install",
      "argocd app sync",
      "terraform apply",
      "kubectl rollout status",
      "prometheus_http_requests_total",
      "NAMESPACE: production",
      "strategy: RollingUpdate",
      "livenessProbe:",
      "kubectl top nodes",
      "STATUS: Running",
    ];

    interface Fragment {
      text: string;
      x: number;
      y: number;
      opacity: number;
      speed: number;
      fadeDir: number;
    }

    const fragments: Fragment[] = FRAGMENTS.map((text) => ({
      text,
      x: Math.random() * (W - 300) + 50,
      y: Math.random() * H,
      opacity: Math.random() * 0.12,
      speed: 0.0003 + Math.random() * 0.0004,
      fadeDir: Math.random() > 0.5 ? 1 : -1,
    }));

    /* ── draw ───────────────────────────────────────────── */
    function draw(t: number) {
      ctx.clearRect(0, 0, W, H);

      /* floating YAML text */
      ctx.font = '11px "JetBrains Mono", monospace';
      fragments.forEach((f) => {
        f.opacity += f.speed * f.fadeDir;
        if (f.opacity > 0.13) { f.opacity = 0.13; f.fadeDir = -1; }
        if (f.opacity < 0)    { f.opacity = 0;    f.fadeDir =  1;
          f.x = Math.random() * (W - 300) + 50;
          f.y = Math.random() * H;
        }
        ctx.fillStyle = `rgba(0,212,255,${f.opacity})`;
        ctx.fillText(f.text, f.x, f.y);
      });

      /* edges */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > MAX_DIST) continue;
          const alpha = (1 - dist / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      /* packets flowing along edges */
      packets = packets.filter((p) => {
        p.progress += p.speed;
        if (p.progress >= 1) return false;
        const a = nodes[p.fromNode], b = nodes[p.toNode];
        const x = a.x + (b.x - a.x) * p.progress;
        const y = a.y + (b.y - a.y) * p.progress;

        /* trail */
        const trailLen = 0.06;
        const trailStart = Math.max(0, p.progress - trailLen);
        const tx = a.x + (b.x - a.x) * trailStart;
        const ty = a.y + (b.y - a.y) * trailStart;
        const grad = ctx.createLinearGradient(tx, ty, x, y);
        grad.addColorStop(0, p.color + "0)");
        grad.addColorStop(1, p.color + "0.9)");
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();

        /* dot */
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color + "1)";
        ctx.fill();
        return true;
      });

      /* nodes */
      nodes.forEach((n) => {
        n.pulse += n.pulseSpeed;
        const pulseFactor = 0.5 + 0.5 * Math.sin(n.pulse);

        /* outer glow ring */
        const glowR = n.radius + 8 + pulseFactor * 6;
        const glow = ctx.createRadialGradient(n.x, n.y, n.radius, n.x, n.y, glowR);
        glow.addColorStop(0, n.color + "0.15)");
        glow.addColorStop(1, n.color + "0)");
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        /* core */
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color + `${0.5 + pulseFactor * 0.5})`;
        ctx.fill();

        /* label */
        ctx.fillStyle = n.color + `${0.35 + pulseFactor * 0.25})`;
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(n.label, n.x + n.radius + 4, n.y + 3);

        /* move */
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -40)   n.x = W + 40;
        if (n.x > W + 40) n.x = -40;
        if (n.y < -40)   n.y = H + 40;
        if (n.y > H + 40) n.y = -40;
      });

      /* hex grid overlay — very subtle */
      const hex = (x: number, y: number, size: number, alpha: number) => {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const px = x + size * Math.cos(angle);
          const py = y + size * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      };

      const hexSize = 48;
      const hexW = hexSize * 2;
      const hexH = Math.sqrt(3) * hexSize;
      const tOff = (t * 0.00006) % 1;
      for (let col = -1; col < W / hexW + 1; col++) {
        for (let row = -1; row < H / hexH + 1; row++) {
          const x = col * hexW * 0.75 + (row % 2 === 0 ? 0 : hexW * 0.375);
          const y = row * hexH * 0.5 + tOff * hexH;
          const distToCenter = Math.sqrt(
            Math.pow((x - W / 2) / W, 2) + Math.pow((y - H / 2) / H, 2)
          );
          const alpha = Math.max(0, 0.06 - distToCenter * 0.08);
          if (alpha > 0.005) hex(x, y, hexSize, alpha);
        }
      }

      maybeSpawnPacket();
      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
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
        opacity: 0.85,
      }}
    />
  );
}
