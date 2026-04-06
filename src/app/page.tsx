"use client";

import { useState, useEffect, useRef } from "react";
import CV from "@/components/CV";
import BackgroundCanvas from "@/components/BackgroundCanvas";

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "dev";

/* ─── Typing rotator ─────────────────────────────────────── */
const ROLES = [
  "DevOps Engineer",
  "SRE Specialist",
  "Kubernetes Architect",
  "GitOps Practitioner",
  "Platform Engineer",
  "OpenShift Expert",
];

function useTypingEffect(words: string[], speed = 90, pause = 2200) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (waiting) return;
    const word = words[wordIdx];
    const delay = deleting ? speed / 2 : speed;

    const t = setTimeout(() => {
      if (!deleting) {
        if (charIdx < word.length) {
          setDisplay(word.slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
        } else {
          setWaiting(true);
          setTimeout(() => {
            setWaiting(false);
            setDeleting(true);
          }, pause);
        }
      } else {
        if (charIdx > 0) {
          setDisplay(word.slice(0, charIdx - 1));
          setCharIdx((c) => c - 1);
        } else {
          setDeleting(false);
          setWordIdx((i) => (i + 1) % words.length);
        }
      }
    }, delay);

    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx, waiting, words, speed, pause]);

  return display;
}

/* ─── Stack data ─────────────────────────────────────────── */
const STACK = [
  { name: "Kubernetes",  abbr: "K8s",     color: "#326CE5", cat: "Orchestration" },
  { name: "OpenShift",   abbr: "OCP",     color: "#EE0000", cat: "Orchestration" },
  { name: "ArgoCD",      abbr: "Argo",    color: "#EF7B4D", cat: "GitOps" },
  { name: "GitOps",      abbr: "GitOps",  color: "#00d4ff", cat: "GitOps" },
  { name: "Terraform",   abbr: "TF",      color: "#7B42BC", cat: "IaC" },
  { name: "Helm",        abbr: "Helm",    color: "#0F1689", cat: "Packaging" },
  { name: "Prometheus",  abbr: "Prom",    color: "#E6522C", cat: "Observability" },
  { name: "Grafana",     abbr: "Graf",    color: "#F46800", cat: "Observability" },
  { name: "Alertmanager",abbr: "AM",      color: "#E6522C", cat: "Observability" },
  { name: "Docker",      abbr: "Docker",  color: "#2496ED", cat: "Containers" },
  { name: "Azure AKS",   abbr: "AKS",     color: "#0078D4", cat: "Cloud" },
  { name: "AWS",         abbr: "AWS",     color: "#FF9900", cat: "Cloud" },
  { name: "Kafka",       abbr: "Kafka",   color: "#00ff88", cat: "Streaming" },
  { name: "MongoDB",     abbr: "Mongo",   color: "#47A248", cat: "Database" },
  { name: "PostgreSQL",  abbr: "PG",      color: "#336791", cat: "Database" },
  { name: "AI Agents",   abbr: "AI",      color: "#00ff88", cat: "AI/ML" },
  { name: "CI/CD",       abbr: "CI/CD",   color: "#00d4ff", cat: "Automation" },
  { name: "Linux",       abbr: "Linux",   color: "#FCC624", cat: "OS" },
];

/* ─── Nav links ──────────────────────────────────────────── */
const NAV = [
  { label: "status",     href: "#hero" },
  { label: "stack",      href: "#stack" },
  { label: "experience", href: "#experience" },
  { label: "contact",    href: "#contact" },
];

/* ─── Cluster status (fetched from /status.json on K8s) ─── */
interface ClusterStatus {
  nodes: number;
  readyNodes: number;
  pods: number;
  runningPods: number;
  namespaces: number;
  deployments: number;
  k8sVersion: string;
  timestamp: string;
  live: boolean;
}

const FALLBACK_STATUS: ClusterStatus = {
  nodes: 0, readyNodes: 0, pods: 0, runningPods: 0,
  namespaces: 0, deployments: 0, k8sVersion: "—",
  timestamp: "", live: false,
};

/* ─── Component ──────────────────────────────────────────── */
export default function Home() {
  const role = useTypingEffect(ROLES);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [clusterStatus, setClusterStatus] = useState<ClusterStatus>(FALLBACK_STATUS);
  const heroRef = useRef<HTMLDivElement>(null);

  /* fetch live cluster status written by init container */
  useEffect(() => {
    fetch("/status.json")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setClusterStatus(data); })
      .catch(() => {}); // silently fall back to static values
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* active nav section */
  useEffect(() => {
    const sections = ["hero", "stack", "experience", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        minHeight: "100vh",
        fontFamily: "var(--font-jetbrains), monospace",
      }}
    >
      {/* ── Animated K8s topology background ──────���──────── */}
      <BackgroundCanvas />

      {/* ── Version badge ─────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          top: "12px",
          right: "16px",
          zIndex: 100,
          background: "rgba(0,212,255,0.08)",
          border: "1px solid rgba(0,212,255,0.25)",
          borderRadius: "4px",
          padding: "2px 10px",
          fontSize: "11px",
          color: "var(--accent-cyan)",
          fontFamily: "var(--font-jetbrains), monospace",
          letterSpacing: "0.05em",
        }}
      >
        v{APP_VERSION}
      </div>

      {/* ── Sticky nav ────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "0 24px",
          height: "52px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled
            ? "rgba(2,8,16,0.92)"
            : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled
            ? "1px solid var(--border)"
            : "1px solid transparent",
          transition: "all 0.3s ease",
        }}
      >
        {/* Logo / prompt */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
          }}
        >
          <span style={{ color: "var(--accent-green)" }}>●</span>
          <span style={{ color: "var(--accent-cyan)", fontWeight: 600 }}>
            filip
          </span>
          <span style={{ color: "var(--text-dim)" }}>@</span>
          <span style={{ color: "var(--text-secondary)" }}>sre-cluster</span>
          <span style={{ color: "var(--accent-cyan)" }}>:~$</span>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", gap: "4px" }}>
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              style={{
                padding: "4px 12px",
                borderRadius: "4px",
                fontSize: "12px",
                letterSpacing: "0.04em",
                textDecoration: "none",
                color:
                  activeSection === n.href.replace("#", "")
                    ? "var(--accent-cyan)"
                    : "var(--text-dim)",
                background:
                  activeSection === n.href.replace("#", "")
                    ? "rgba(0,212,255,0.08)"
                    : "transparent",
                border:
                  activeSection === n.href.replace("#", "")
                    ? "1px solid rgba(0,212,255,0.2)"
                    : "1px solid transparent",
                transition: "all 0.2s",
              }}
            >
              {n.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════ */}
      <section
        id="hero"
        ref={heroRef}
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "80px 24px 60px",
          textAlign: "center",
        }}
      >
        {/* Cluster status line */}
        <div
          className="fade-in"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "32px",
            fontSize: "12px",
            color: "var(--text-dim)",
            fontFamily: "var(--font-jetbrains), monospace",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: clusterStatus.live ? "var(--accent-green)" : "var(--text-dim)",
              boxShadow: clusterStatus.live ? "0 0 6px var(--accent-green)" : "none",
              flexShrink: 0,
            }}
          />
          {clusterStatus.live ? (
            <>
              <span>
                kubectl get nodes —{" "}
                <span style={{ color: "var(--text-secondary)" }}>
                  {clusterStatus.readyNodes}/{clusterStatus.nodes} Ready
                </span>
              </span>
              <span
                style={{
                  background: "rgba(0,255,136,0.1)",
                  border: "1px solid rgba(0,255,136,0.2)",
                  borderRadius: "3px",
                  padding: "1px 6px",
                  color: "var(--accent-green)",
                }}
              >
                {clusterStatus.k8sVersion} · {clusterStatus.runningPods} pods running
              </span>
            </>
          ) : (
            <>
              <span>kubectl get nodes — local environment</span>
              <span
                style={{
                  background: "rgba(0,212,255,0.08)",
                  border: "1px solid rgba(0,212,255,0.2)",
                  borderRadius: "3px",
                  padding: "1px 6px",
                  color: "var(--accent-cyan)",
                }}
              >
                deploy to K8s for live metrics
              </span>
            </>
          )}
        </div>

        {/* Name */}
        <h1
          className="fade-up"
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(2.4rem, 7vw, 5.5rem)",
            fontWeight: 800,
            letterSpacing: "0.05em",
            lineHeight: 1.05,
            marginBottom: "16px",
            background:
              "linear-gradient(135deg, #e2eaf4 0%, #00d4ff 50%, #00ff88 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          FILIP CSUPKA
        </h1>

        {/* Typing role */}
        <div
          className="fade-up delay-200"
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
            color: "var(--accent-cyan)",
            marginBottom: "12px",
            minHeight: "2em",
            fontWeight: 500,
          }}
        >
          <span className="cursor">{role}</span>
        </div>

        {/* Subtitle */}
        <p
          className="fade-up delay-300"
          style={{
            maxWidth: "560px",
            color: "var(--text-secondary)",
            fontSize: "14px",
            lineHeight: 1.7,
            marginBottom: "40px",
          }}
        >
          Building resilient cloud-native infrastructure at scale.
          Kubernetes, GitOps, observability — production-grade, every time.
        </p>

        {/* CTA buttons */}
        <div
          className="fade-up delay-400"
          style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}
        >
          <a
            href="#experience"
            style={{
              padding: "10px 24px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
              background: "var(--accent-cyan)",
              color: "var(--bg-primary)",
              letterSpacing: "0.05em",
              transition: "all 0.2s",
            }}
          >
            VIEW EXPERIENCE
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "10px 24px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
              background: "transparent",
              color: "var(--accent-cyan)",
              border: "1px solid var(--accent-cyan)",
              letterSpacing: "0.05em",
              transition: "all 0.2s",
            }}
          >
            GITHUB ↗
          </a>
        </div>

        {/* Live cluster metric cards */}
        <div
          className="fade-up delay-500"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))",
            gap: "12px",
            marginTop: "64px",
            width: "100%",
            maxWidth: "860px",
          }}
        >
          {[
            {
              label: "Nodes",
              value: clusterStatus.live ? String(clusterStatus.readyNodes) : "—",
              sub: clusterStatus.live ? `${clusterStatus.nodes} total` : "awaiting cluster",
              ok: clusterStatus.live && clusterStatus.readyNodes === clusterStatus.nodes,
              status: clusterStatus.live ? `${clusterStatus.readyNodes}/${clusterStatus.nodes} Ready` : "No live data",
            },
            {
              label: "Pods Running",
              value: clusterStatus.live ? String(clusterStatus.runningPods) : "—",
              sub: clusterStatus.live ? `${clusterStatus.pods} total` : "awaiting cluster",
              ok: clusterStatus.live && clusterStatus.runningPods > 0,
              status: clusterStatus.live ? "Running" : "No live data",
            },
            {
              label: "Namespaces",
              value: clusterStatus.live ? String(clusterStatus.namespaces) : "—",
              sub: clusterStatus.live ? "active" : "awaiting cluster",
              ok: clusterStatus.live,
              status: clusterStatus.live ? "Active" : "No live data",
            },
            {
              label: "Deployments",
              value: clusterStatus.live ? String(clusterStatus.deployments) : "—",
              sub: clusterStatus.live ? "all namespaces" : "awaiting cluster",
              ok: clusterStatus.live,
              status: clusterStatus.live ? "Deployed" : "No live data",
            },
            {
              label: "K8s Version",
              value: clusterStatus.live ? clusterStatus.k8sVersion.replace("v", "") : "—",
              sub: clusterStatus.live ? "cluster" : "awaiting cluster",
              ok: clusterStatus.live,
              status: clusterStatus.live ? "Live" : "No live data",
            },
          ].map((m) => (
            <div
              key={m.label}
              className={m.ok ? "glow-green" : "glow-cyan"}
              style={{
                background: "var(--bg-surface)",
                border: `1px solid ${m.ok ? "rgba(0,255,136,0.2)" : "var(--border)"}`,
                borderRadius: "8px",
                padding: "16px 18px",
                textAlign: "left",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* live badge */}
              {clusterStatus.live && (
                <span
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    fontSize: "9px",
                    color: "var(--accent-green)",
                    background: "rgba(0,255,136,0.08)",
                    border: "1px solid rgba(0,255,136,0.2)",
                    borderRadius: "3px",
                    padding: "1px 5px",
                    letterSpacing: "0.05em",
                  }}
                >
                  LIVE
                </span>
              )}
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--text-dim)",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  fontSize: m.value.length > 6 ? "18px" : "26px",
                  fontWeight: 700,
                  color: m.ok ? "var(--accent-green)" : "var(--accent-cyan)",
                  fontFamily: "'Orbitron', monospace",
                  lineHeight: 1,
                  marginBottom: "4px",
                  wordBreak: "break-all",
                }}
              >
                {m.value}
              </div>
              <div style={{ fontSize: "10px", color: "var(--text-dim)" }}>{m.sub}</div>
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "10px",
                  color: m.ok ? "var(--accent-green)" : "var(--text-dim)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: m.ok ? "var(--accent-green)" : "var(--text-dim)",
                    display: "inline-block",
                  }}
                />
                {m.status}
              </div>
            </div>
          ))}
        </div>

        {/* Data freshness */}
        {clusterStatus.live && clusterStatus.timestamp && (
          <div
            className="fade-in delay-600"
            style={{
              marginTop: "12px",
              fontSize: "10px",
              color: "var(--text-dim)",
            }}
          >
            last synced:{" "}
            <span style={{ color: "var(--accent-green)" }}>
              {new Date(clusterStatus.timestamp).toUTCString()}
            </span>
            {" "}· refreshed on pod start
          </div>
        )}

        {/* Scroll indicator */}
        <div
          className="float"
          style={{
            position: "absolute",
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "var(--text-dim)",
            fontSize: "12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>scroll</span>
          <span style={{ fontSize: "18px" }}>↓</span>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          STACK
      ════════════════════════════════════════════════════ */}
      <section
        id="stack"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "80px 24px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Section header */}
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              fontSize: "12px",
              color: "var(--text-dim)",
              marginBottom: "8px",
              letterSpacing: "0.08em",
            }}
          >
            $ helm list --all-namespaces
          </div>
          <h2
            className="section-title"
            style={{
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              color: "var(--text-primary)",
              marginBottom: "8px",
            }}
          >
            <span style={{ color: "var(--accent-cyan)" }}>./</span>TECH STACK
          </h2>
          <div
            style={{
              width: "48px",
              height: "2px",
              background:
                "linear-gradient(90deg, var(--accent-cyan), transparent)",
              marginBottom: "8px",
            }}
          />
          <p style={{ color: "var(--text-dim)", fontSize: "13px" }}>
            Production-grade toolchain — battle-tested at scale
          </p>
        </div>

        {/* Terminal chrome wrapper */}
        <div className="terminal-chrome">
          <div className="terminal-titlebar">
            <span className="terminal-dot" style={{ background: "#FF5F57" }} />
            <span className="terminal-dot" style={{ background: "#FFBD2E" }} />
            <span className="terminal-dot" style={{ background: "#28C840" }} />
            <span
              style={{
                marginLeft: "12px",
                fontSize: "11px",
                color: "var(--text-dim)",
              }}
            >
              helm status — 18 releases deployed
            </span>
          </div>

          <div
            style={{
              padding: "24px",
              background: "var(--bg-surface)",
            }}
          >
            {/* Category groupings */}
            {[
              "Orchestration",
              "GitOps",
              "Observability",
              "IaC",
              "Containers",
              "Cloud",
              "Streaming",
              "Database",
              "Automation",
              "AI/ML",
              "OS",
              "Packaging",
            ].map((cat) => {
              const items = STACK.filter((s) => s.cat === cat);
              if (!items.length) return null;
              return (
                <div
                  key={cat}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    marginBottom: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--text-dim)",
                      minWidth: "110px",
                      paddingTop: "6px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {cat.toLowerCase()}:
                  </span>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    {items.map((s) => (
                      <span
                        key={s.name}
                        className="skill-badge"
                        style={{
                          padding: "4px 12px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: 500,
                          color: s.color,
                          borderColor: `${s.color}33`,
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          cursor: "default",
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: s.color,
                            flexShrink: 0,
                          }}
                        />
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Kubectl-style output footer */}
            <div
              style={{
                marginTop: "20px",
                paddingTop: "16px",
                borderTop: "1px solid var(--border)",
                fontSize: "11px",
                color: "var(--text-dim)",
                display: "flex",
                gap: "24px",
                flexWrap: "wrap",
              }}
            >
              <span>
                NAME: <span style={{ color: "var(--accent-cyan)" }}>filip-csupka</span>
              </span>
              <span>
                NAMESPACE: <span style={{ color: "var(--accent-green)" }}>production</span>
              </span>
              <span>
                STATUS: <span style={{ color: "var(--accent-green)" }}>deployed</span>
              </span>
              <span>
                REVISION: <span style={{ color: "var(--accent-amber)" }}>v{APP_VERSION}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          EXPERIENCE / CV
      ════════════════════════════════════════════════════ */}
      <section
        id="experience"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "80px 24px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              fontSize: "12px",
              color: "var(--text-dim)",
              marginBottom: "8px",
              letterSpacing: "0.08em",
            }}
          >
            $ kubectl describe pod/filip-csupka
          </div>
          <h2
            className="section-title"
            style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "var(--text-primary)" }}
          >
            <span style={{ color: "var(--accent-cyan)" }}>./</span>EXPERIENCE
          </h2>
          <div
            style={{
              width: "48px",
              height: "2px",
              background: "linear-gradient(90deg, var(--accent-cyan), transparent)",
              marginTop: "8px",
            }}
          />
        </div>
        <CV />
      </section>

      {/* ════════════════════════════════════════════════════
          CONTACT
      ════════════════════════════════════════════════════ */}
      <section
        id="contact"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "80px 24px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              fontSize: "12px",
              color: "var(--text-dim)",
              marginBottom: "8px",
              letterSpacing: "0.08em",
            }}
          >
            $ kubectl exec -it filip-csupka -- bash
          </div>
          <h2
            className="section-title"
            style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "var(--text-primary)" }}
          >
            <span style={{ color: "var(--accent-cyan)" }}>./</span>CONTACT
          </h2>
          <div
            style={{
              width: "48px",
              height: "2px",
              background: "linear-gradient(90deg, var(--accent-cyan), transparent)",
              marginTop: "8px",
            }}
          />
        </div>

        <div className="terminal-chrome" style={{ maxWidth: "600px" }}>
          <div className="terminal-titlebar">
            <span className="terminal-dot" style={{ background: "#FF5F57" }} />
            <span className="terminal-dot" style={{ background: "#FFBD2E" }} />
            <span className="terminal-dot" style={{ background: "#28C840" }} />
            <span
              style={{ marginLeft: "12px", fontSize: "11px", color: "var(--text-dim)" }}
            >
              filip@sre-cluster:~$
            </span>
          </div>
          <div
            style={{
              background: "var(--bg-surface)",
              padding: "28px 32px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {[
              { key: "Location",  val: "Košice, Slovakia" },
              { key: "Role",      val: "DevOps / SRE / Kubernetes Engineer" },
              { key: "GitHub",    val: "github.com/filipcsupka", href: "#" },
              { key: "Email",     val: "tradeopsllc@gmail.com", href: "mailto:tradeopsllc@gmail.com" },
              { key: "Available", val: "Open to remote / relocation opportunities" },
            ].map(({ key, val, href }) => (
              <div
                key={key}
                style={{ display: "flex", gap: "16px", fontSize: "13px", flexWrap: "wrap" }}
              >
                <span
                  style={{
                    color: "var(--accent-cyan)",
                    minWidth: "80px",
                    flexShrink: 0,
                  }}
                >
                  {key}:
                </span>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--accent-green)",
                      textDecoration: "none",
                    }}
                  >
                    {val}
                  </a>
                ) : (
                  <span style={{ color: "var(--text-secondary)" }}>{val}</span>
                )}
              </div>
            ))}

            {/* Prompt */}
            <div
              style={{
                marginTop: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
              }}
            >
              <span style={{ color: "var(--accent-green)" }}>filip@sre-cluster:~$</span>
              <span className="cursor" style={{ color: "var(--text-secondary)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer
        style={{
          position: "relative",
          zIndex: 1,
          borderTop: "1px solid var(--border)",
          padding: "24px",
          textAlign: "center",
          fontSize: "12px",
          color: "var(--text-dim)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap" }}>
          <span>
            © 2025 Filip Csupka
          </span>
          <span style={{ color: "var(--border)" }}>|</span>
          <span>
            Running on{" "}
            <span style={{ color: "var(--accent-cyan)" }}>Kubernetes</span>
          </span>
          <span style={{ color: "var(--border)" }}>|</span>
          <span>
            <span style={{ color: "var(--accent-green)" }}>●</span>{" "}
            v{APP_VERSION}
          </span>
        </div>
      </footer>
    </div>
  );
}
