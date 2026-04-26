/* global React, ReactDOM */
const { useState, useEffect, useRef, useMemo, useLayoutEffect, useCallback } = React;
const D = window.CV_DATA;

function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(typeof window !== "undefined" ? window.innerWidth < breakpoint : false);
  useEffect(() => {
    const on = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, [breakpoint]);
  return mobile;
}

/* ─── Scroll progress hook ──────────────────────────────────── */
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setY(window.scrollY);
        raf = 0;
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return y;
}

function useElementProgress(ref) {
  // returns 0..1 progress through the element relative to viewport
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height + vh;
      const passed = vh - r.top;
      const np = Math.max(0, Math.min(1, passed / total));
      setP(np);
    };
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        measure();
        raf = 0;
      });
    };
    measure();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [ref]);
  return p;
}

function useMouse() {
  const [m, setM] = useState({ x: 0.5, y: 0.5 });
  useEffect(() => {
    const on = (e) => setM({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener("pointermove", on);
    return () => window.removeEventListener("pointermove", on);
  }, []);
  return m;
}

function useTick() {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const loop = (now) => {
      setT((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return t;
}

/* ─── Typing rotator ──────────────────────────────────────────── */
function useTyping(words, speed = 70, pause = 1600) {
  const [s, setS] = useState("");
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = words[i];
    const t = setTimeout(() => {
      if (!del) {
        if (j < word.length) { setS(word.slice(0, j + 1)); setJ(j + 1); }
        else { setTimeout(() => setDel(true), pause); }
      } else {
        if (j > 0) { setS(word.slice(0, j - 1)); setJ(j - 1); }
        else { setDel(false); setI((i + 1) % words.length); }
      }
    }, del ? speed / 2 : speed);
    return () => clearTimeout(t);
  }, [i, j, del, words, speed, pause]);
  return s;
}

/* ─── Background: scrolling YAML manifest streams + matrix-like infra glyphs ─── */
function ClusterBackground() {
  const canvasRef = useRef(null);
  const stateRef = useRef({ scrollY: 0, t: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0, H = 0;

    const GLYPHS = [
      "apiVersion: v1", "kind: Pod", "kind: Deployment", "kind: Service",
      "metadata:", "spec:", "replicas: 3", "image: nginx:alpine",
      "selector:", "matchLabels:", "containers:", "ports:",
      "namespace: prod", "ConfigMap", "Secret", "Ingress",
      "ArgoCD/sync", "Helm/install", "Terraform/apply", "kubectl get pods",
      "⸬ READY", "✓ RUNNING", "● HEALTHY", "● scrape",
      "metrics_total{}", "log_stream", "trace_id=", "kafka.topic",
      "0xCAFEB0BA", "[INFO]", "[OK]", "v1.28.4",
      "── control-plane", "── worker-03", "│", "└─",
      "PV-bound", "PVC-pending", "CSI-driver", "etcd",
    ];

    const cols = [];
    const setupColumns = () => {
      cols.length = 0;
      const colW = 140;
      const n = Math.ceil(W / colW) + 2;
      for (let i = 0; i < n; i++) {
        const items = [];
        const itemCount = 14;
        for (let j = 0; j < itemCount; j++) {
          items.push({
            text: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
            highlight: Math.random() < 0.18,
          });
        }
        cols.push({
          x: i * colW + 20,
          baseSpeed: 14 + Math.random() * 22,
          phase: Math.random() * 1000,
          items,
          width: colW,
        });
      }
    };

    const resize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setupColumns();
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const draw = () => {
      const s = stateRef.current;
      const time = s.t;
      const sY = s.scrollY;

      ctx.fillStyle = "#03101f";
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "rgba(66,224,255,0.02)";
      for (let y = 0; y < H; y += 4) {
        ctx.fillRect(0, y, W, 1);
      }

      const grd = ctx.createLinearGradient(0, H * 0.55, 0, H);
      grd.addColorStop(0, "rgba(66,224,255,0)");
      grd.addColorStop(1, "rgba(66,224,255,0.05)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, H * 0.55, W, H * 0.45);

      ctx.font = "11px 'JetBrains Mono', monospace";
      const speedBoost = 1 + Math.min(2.5, sY * 0.0008);

      cols.forEach((col) => {
        const lineH = 26;
        const totalH = col.items.length * lineH;
        const offset = ((time * col.baseSpeed * speedBoost + col.phase) % totalH);

        for (let j = 0; j < col.items.length; j++) {
          const itemY = (j * lineH - offset + totalH * 2) % totalH - lineH;
          const yOnScreen = itemY;
          if (yOnScreen < -20 || yOnScreen > H + 20) continue;

          const distFromLead = Math.abs(yOnScreen - H * 0.5);
          const fade = Math.max(0.05, 0.4 - distFromLead / H);
          const item = col.items[j];

          if (item.highlight) {
            ctx.fillStyle = `rgba(66,224,255,${fade * 1.4})`;
          } else {
            ctx.fillStyle = `rgba(92,255,177,${fade * 0.55})`;
          }
          ctx.fillText(item.text, col.x, yOnScreen);
        }

        const headY = ((time * col.baseSpeed * speedBoost * 0.5 + col.phase) % H);
        ctx.fillStyle = "rgba(66,224,255,0.7)";
        ctx.fillRect(col.x - 2, headY, 2, 12);
      });

      ctx.save();
      ctx.translate(-(sY * 0.06) % 60, -(sY * 0.06) % 60);
      ctx.strokeStyle = "rgba(66,224,255,0.03)";
      ctx.lineWidth = 1;
      for (let x = -60; x < W + 60; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, -60); ctx.lineTo(x, H + 60); ctx.stroke();
      }
      for (let y = -60; y < H + 60; y += 60) {
        ctx.beginPath(); ctx.moveTo(-60, y); ctx.lineTo(W + 60, y); ctx.stroke();
      }
      ctx.restore();

      const topG = ctx.createLinearGradient(0, 0, 0, 200);
      topG.addColorStop(0, "rgba(3,16,31,0.95)");
      topG.addColorStop(1, "rgba(3,16,31,0)");
      ctx.fillStyle = topG;
      ctx.fillRect(0, 0, W, 200);

      const botG = ctx.createLinearGradient(0, H - 240, 0, H);
      botG.addColorStop(0, "rgba(3,16,31,0)");
      botG.addColorStop(1, "rgba(3,16,31,0.9)");
      ctx.fillStyle = botG;
      ctx.fillRect(0, H - 240, W, 240);

      raf = requestAnimationFrame(draw);
    };

    const onScroll = () => { stateRef.current.scrollY = window.scrollY; };
    const tickT = () => { stateRef.current.t = performance.now() / 1000; requestAnimationFrame(tickT); };
    tickT();
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{
    position: "fixed", inset: 0, zIndex: 0, opacity: 0.55, pointerEvents: "none",
  }} />;
}

/* ─── Hero ──────────────────────────────────────────────────── */
function Hero() {
  const role = useTyping(D.roles);
  const sy = useScrollY();
  const heroRef = useRef(null);
  const t = useTick();
  const isMobile = useIsMobile();

  const tx = (sy * -0.05);
  const ty = (sy * 0.18);
  const op = Math.max(0, 1 - sy / 600);

  return (
    <section id="hero" ref={heroRef} style={{
      position: "relative", minHeight: "100vh", zIndex: 2,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: isMobile ? "100px 16px 60px" : "120px 24px 80px", textAlign: "center",
      transform: `translateY(${ty}px)`, opacity: op,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, marginBottom: 24,
        fontSize: 11, color: "#5f7f9e", letterSpacing: "0.04em",
        flexWrap: "wrap", justifyContent: "center",
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
          background: "#5cffb1",
          boxShadow: `0 0 ${8 + Math.sin(t * 4) * 4}px #5cffb1`,
        }} />
        {!isMobile && <span>{D.status}</span>}
        <span style={{
          background: "rgba(92,255,177,0.08)", border: "1px solid rgba(92,255,177,0.3)",
          borderRadius: 3, padding: "2px 8px", color: "#5cffb1",
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          status: {D.statusBadge}
        </span>
      </div>

      <h1 style={{
        fontFamily: "'Orbitron', monospace",
        fontSize: "clamp(2.6rem, 8vw, 6.2rem)",
        fontWeight: 900, letterSpacing: "0.06em", lineHeight: 1, margin: 0,
        background: "linear-gradient(135deg, #edf7ff 0%, #42e0ff 50%, #5cffb1 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        transform: `translateX(${tx}px)`,
        textShadow: "0 0 40px rgba(66,224,255,0.3)",
      }}>
        FILIP CSUPKA
      </h1>

      <div style={{ position: "relative", marginTop: 12, marginBottom: 20 }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "clamp(1rem, 2.4vw, 1.5rem)",
          color: "#42e0ff", minHeight: "1.4em",
        }}>
          ⸬ {role}<span style={{
            display: "inline-block", width: 10, height: "1em",
            background: "#42e0ff", marginLeft: 4, verticalAlign: "-2px",
            opacity: Math.sin(t * 6) > 0 ? 1 : 0,
          }} />
        </div>
      </div>

      <p style={{
        maxWidth: 620, color: "#a8bfd6", fontSize: 14, lineHeight: 1.7,
        marginBottom: 32, fontFamily: "'JetBrains Mono', monospace",
      }}>
        {D.subtitle}
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <a href="#experience" style={ctaPrimary}>VIEW EXPERIENCE</a>
        <a href="https://github.com/Filipcsupka" target="_blank" rel="noopener noreferrer" style={ctaGhost}>
          GITHUB →
        </a>
      </div>

      <div style={{
        position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#5f7f9e",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      }}>
        <span style={{ letterSpacing: "0.2em" }}>SCROLL TO DEPLOY</span>
        <div style={{
          width: 1, height: 36, background: "linear-gradient(to bottom, #42e0ff, transparent)",
          transform: `scaleY(${0.5 + (Math.sin(t * 2) + 1) / 2 * 0.8})`,
          transformOrigin: "top",
        }} />
      </div>
    </section>
  );
}

const ctaPrimary = {
  padding: "12px 28px", borderRadius: 6, fontSize: 12, fontWeight: 700,
  textDecoration: "none", background: "#42e0ff", color: "#03101f",
  letterSpacing: "0.1em", fontFamily: "'JetBrains Mono', monospace",
  border: "1px solid #42e0ff",
  boxShadow: "0 0 22px rgba(66,224,255,0.35), inset 0 0 12px rgba(255,255,255,0.15)",
};
const ctaGhost = {
  padding: "12px 28px", borderRadius: 6, fontSize: 12, fontWeight: 700,
  textDecoration: "none", background: "transparent", color: "#42e0ff",
  letterSpacing: "0.1em", fontFamily: "'JetBrains Mono', monospace",
  border: "1px solid rgba(66,224,255,0.5)",
};

/* ─── Section header ──────────────────────────────────────────── */
function SectionHead({ cmd, title, idx, total }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#5f7f9e",
        letterSpacing: "0.08em", marginBottom: 10,
        overflow: "hidden",
      }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: 8 }}>{cmd}</span>
        <span style={{ flexShrink: 0 }}>[{idx}/{total}]</span>
      </div>
      <h2 style={{
        fontFamily: "'Orbitron', monospace", fontSize: "clamp(1.5rem, 3.2vw, 2.4rem)",
        fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
        color: "#edf7ff", margin: 0,
      }}>
        <span style={{ color: "#42e0ff" }}>./</span>{title}
      </h2>
      <div style={{
        height: 2, marginTop: 10,
        background: "linear-gradient(90deg, #42e0ff, transparent)", maxWidth: 200,
      }} />
    </div>
  );
}

Object.assign(window, { ClusterBackground, Hero, SectionHead, useScrollY, useElementProgress, useMouse, useTick, useIsMobile });
