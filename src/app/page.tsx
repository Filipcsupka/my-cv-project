"use client";

import { useState, useEffect, useRef } from "react";
import CV from "@/components/CV";
import BackgroundCanvas from "@/components/BackgroundCanvas";

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "dev";
type Lang = "en" | "sk";

/* ─── Typing rotator ─────────────────────────────────────── */
const ROLES: Record<Lang, string[]> = {
  en: [
    "DevOps Engineer",
    "SRE Specialist",
    "Kubernetes Architect",
    "GitOps Practitioner",
    "Platform Engineer",
    "OpenShift Expert",
  ],
  sk: [
    "DevOps Inzinier",
    "SRE Specialista",
    "Kubernetes Architekt",
    "GitOps Praktik",
    "Platform Engineer",
    "OpenShift Expert",
  ],
};

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

/* ─── Page copy ──────────────────────────────────────────── */
const COPY: Record<
  Lang,
  {
    nav: { label: string; href: string }[];
    statusLine: string;
    statusBadge: string;
    subtitle: string;
    ctaExperience: string;
    ctaGithub: string;
    stackCommand: string;
    stackTitle: string;
    stackDescription: string;
    experienceCommand: string;
    experienceTitle: string;
    aboutCommand: string;
    aboutTitle: string;
    aboutIntro: string;
    aboutItems: { key: string; val: string; color: string }[];
    contactCommand: string;
    contactTitle: string;
    contactRows: { key: string; val: string; href?: string }[];
    footerRunning: string;
  }
> = {
  en: {
    nav: [
      { label: "status", href: "#hero" },
      { label: "stack", href: "#stack" },
      { label: "experience", href: "#experience" },
      { label: "about", href: "#about" },
      { label: "contact", href: "#contact" },
    ],
    statusLine: "talent.io/v1alpha1 · UniversalSoldier/filip-csupka",
    statusBadge: "status: Running",
    subtitle:
      "Building resilient Kubernetes platforms, GitOps delivery and observability while learning fast enough to look suspicious.",
    ctaExperience: "VIEW EXPERIENCE",
    ctaGithub: "GITHUB",
    stackCommand: "$ kubectl get experience.stack -o wide",
    stackTitle: "TECH STACK",
    stackDescription: "Short version: things I have used to build, run, debug and occasionally negotiate with platforms.",
    experienceCommand: "$ kubectl describe platform/filip-csupka",
    experienceTitle: "EXPERIENCE",
    aboutCommand: "$ kubectl get human filip-csupka -o wide",
    aboutTitle: "ABOUT ME",
    aboutIntro:
      "Hyperactive family-first human with too many hobbies, a home Kubernetes cluster, and a healthy belief that learning starts exactly where confidence ends.",
    aboutItems: [
      {
        key: "Energy",
        val: "Hybrid athlete, every-sport enjoyer, master of none, happily over-scheduled by choice.",
        color: "#5cffb1",
      },
      {
        key: "Home lab",
        val: "Hosts this web and my wife's web on Hetzner Kubernetes because a simple VPS would be suspiciously reasonable.",
        color: "#42e0ff",
      },
      {
        key: "Family",
        val: "Free time belongs to my kid first. The cluster can wait; childhood does not have retry logic.",
        color: "#ffc64a",
      },
      {
        key: "AI mode",
        val: "Since AI found me, I became a workaholic who occasionally thinks he can do everything alone. Then production politely disagrees.",
        color: "#ff5f80",
      },
      {
        key: "Typos",
        val: "If you find a typo in the repo, it is probably already labeled with my name.",
        color: "#a78bfa",
      },
    ],
    contactCommand: "$ kubectl exec -it filip-csupka -- contact",
    contactTitle: "CONTACT",
    contactRows: [
      { key: "Location", val: "Kosice, Slovakia" },
      { key: "Role", val: "DevOps / SRE / Kubernetes Engineer" },
      { key: "Mobile", val: "0919 235 462", href: "tel:+421919235462" },
      { key: "Email", val: "devopssro@gmail.com", href: "mailto:devopssro@gmail.com" },
      { key: "GitHub", val: "github.com/Filipcsupka", href: "https://github.com/Filipcsupka" },
      { key: "LinkedIn", val: "linkedin.com/in/filip-csupka-21a26713a", href: "https://linkedin.com/in/filip-csupka-21a26713a" },
      { key: "VevsDesign", val: "vevsdesign.sk", href: "https://vevsdesign.sk" },
      { key: "Available", val: "Open to remote / relocation opportunities" },
    ],
    footerRunning: "Running on",
  },
  sk: {
    nav: [
      { label: "status", href: "#hero" },
      { label: "stack", href: "#stack" },
      { label: "skusenosti", href: "#experience" },
      { label: "o mne", href: "#about" },
      { label: "kontakt", href: "#contact" },
    ],
    statusLine: "talent.io/v1alpha1 · UniversalSoldier/filip-csupka",
    statusBadge: "status: Bezi",
    subtitle:
      "Budujem odolne Kubernetes platformy, GitOps delivery a observabilitu a ucim sa tak rychlo, az to vyzera podozrivo.",
    ctaExperience: "ZOBRAZIT SKUSENOSTI",
    ctaGithub: "GITHUB",
    stackCommand: "$ kubectl get experience.stack -o wide",
    stackTitle: "TECH STACK",
    stackDescription: "Kratka verzia: veci, s ktorymi staviam, prevadzkujem, debugujem a obcas vyjednavam s platformami.",
    experienceCommand: "$ kubectl describe platform/filip-csupka",
    experienceTitle: "SKUSENOSTI",
    aboutCommand: "$ kubectl get human filip-csupka -o wide",
    aboutTitle: "O MNE",
    aboutIntro:
      "Hyperaktivny rodinny clovek s prilis vela hobby, domacim Kubernetes clustrom a zdravym presvedcenim, ze ucenie zacina presne tam, kde konci istota.",
    aboutItems: [
      {
        key: "Energia",
        val: "Hybrid athlete, skusam skoro kazdy sport, master of none, ale s radostou a bez mierneho pudu sebazachovy.",
        color: "#5cffb1",
      },
      {
        key: "Home lab",
        val: "Tento web aj web mojej zeny bezia na Hetzner Kubernetes, lebo jednoduchy VPS by bol podozrivo rozumny.",
        color: "#42e0ff",
      },
      {
        key: "Rodina",
        val: "Volny cas patri hlavne mojmu dietatu. Cluster pocka; detstvo nema retry button.",
        color: "#ffc64a",
      },
      {
        key: "AI mode",
        val: "Odkedy si ma nasla AI, som workoholik, ktory si obcas mysli, ze sam zvladne vsetko. Potom produkcia slusne nesuhlasi.",
        color: "#ff5f80",
      },
      {
        key: "Preklepy",
        val: "Ak najdes v repo preklep, pravdepodobne uz je oznaceny mojim menom.",
        color: "#a78bfa",
      },
    ],
    contactCommand: "$ kubectl exec -it filip-csupka -- kontakt",
    contactTitle: "KONTAKT",
    contactRows: [
      { key: "Lokalita", val: "Kosice, Slovensko" },
      { key: "Rola", val: "DevOps / SRE / Kubernetes Engineer" },
      { key: "Mobil", val: "0919 235 462", href: "tel:+421919235462" },
      { key: "Email", val: "devopssro@gmail.com", href: "mailto:devopssro@gmail.com" },
      { key: "GitHub", val: "github.com/Filipcsupka", href: "https://github.com/Filipcsupka" },
      { key: "LinkedIn", val: "linkedin.com/in/filip-csupka-21a26713a", href: "https://linkedin.com/in/filip-csupka-21a26713a" },
      { key: "VevsDesign", val: "vevsdesign.sk", href: "https://vevsdesign.sk" },
      { key: "Dostupnost", val: "Otvoreny remote / relocation prilezitostiam" },
    ],
    footerRunning: "Bezi na",
  },
};


/* ─── Hero stack tiles ───────────────────────────────────── */
const DEPLOY_STACK = [
  { label: "Orchestration", value: "K8s",       sub: "Red Hat OpenShift · AKS · k3s",          role: "workloads / operators", color: "#326CE5" },
  { label: "GitOps",        value: "ArgoCD",    sub: "sync · drift · app delivery",           role: "desired state",          color: "#EF7B4D" },
  { label: "IaC",           value: "Terraform", sub: "Ansible · modules · state",             role: "infra as code",          color: "#7B42BC" },
  { label: "CI/CD",         value: "Pipelines", sub: "GitHub Actions · GitLab CI",             role: "build / test / deploy",  color: "#e2eaf4" },
  { label: "Cloud",         value: "Hetzner",   sub: "AKS · AWS · public cloud",               role: "compute / network",      color: "#d50c2d" },
  { label: "Private Cloud", value: "Baremetal", sub: "OpenShift · HUB/SPOKE · core infra",     role: "cluster platforms",      color: "#ff5f80" },
  { label: "Containers",    value: "Docker",    sub: "images · registries · runtime basics",   role: "container build",        color: "#2496ED" },
  { label: "Observability", value: "Metrics",   sub: "Prometheus · Grafana · Loki · Tempo",    role: "logs / traces / alerts", color: "#F46800" },
  { label: "Data",          value: "Kafka",     sub: "PostgreSQL · MongoDB · connectors",      role: "streams / storage",      color: "#5cffb1" },
  { label: "Packaging",     value: "Helm",      sub: "charts · operators · Kustomize",         role: "platform packaging",     color: "#0F1689" },
  { label: "AI Tooling",    value: "Agents",    sub: "Claude Code · Codex · MCP · skills",     role: "agentic workflows",      color: "#a78bfa" },
  { label: "Linux",         value: "Linux",     sub: "shell · networking · troubleshooting",   role: "operating ground",       color: "#FCC624" },
];

/* ─── Component ──────────────────────────────────────────── */
export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const copy = COPY[lang];
  const role = useTypingEffect(ROLES[lang]);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("lang") === "sk") setLang("sk");
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    const url = new URL(window.location.href);
    if (lang === "sk") url.searchParams.set("lang", "sk");
    else url.searchParams.delete("lang");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, [lang]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* active nav section */
  useEffect(() => {
    const sections = ["hero", "stack", "experience", "about", "contact"];
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



      {/* ── Sticky nav ────────────────────────────────────── */}
      <nav
        className="site-nav"
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
          gap: "16px",
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
          className="nav-prompt"
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

        <div className="nav-actions" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {/* Nav links */}
          <div className="nav-links" style={{ display: "flex", gap: "4px" }}>
            {copy.nav.map((n) => (
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
          <div
            aria-label="Language selector"
            style={{
              display: "flex",
              border: "1px solid rgba(0,212,255,0.24)",
              borderRadius: "5px",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {(["en", "sk"] as Lang[]).map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                style={{
                  border: "none",
                  padding: "4px 8px",
                  minWidth: "34px",
                  cursor: "pointer",
                  background: lang === code ? "var(--accent-cyan)" : "rgba(2,8,16,0.62)",
                  color: lang === code ? "var(--bg-primary)" : "var(--text-secondary)",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {code}
              </button>
            ))}
          </div>
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
        {/* Status line */}
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
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "var(--accent-green)",
              boxShadow: "0 0 6px var(--accent-green)",
              flexShrink: 0,
            }}
          />
          <span>{copy.statusLine}</span>
          <span
            style={{
              background: "rgba(0,255,136,0.08)",
              border: "1px solid rgba(0,255,136,0.2)",
              borderRadius: "3px",
              padding: "1px 6px",
              color: "var(--accent-green)",
            }}
          >
            {copy.statusBadge}
          </span>
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
          {copy.subtitle}
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
            {copy.ctaExperience}
          </a>
          <a
            href="https://github.com/Filipcsupka"
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
            {copy.ctaGithub}
          </a>
        </div>

        {/* Hero stack tiles */}
        <div
          id="stack"
          className="fade-up delay-500"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "10px",
            marginTop: "56px",
            width: "100%",
            maxWidth: "1100px",
            scrollMarginTop: "90px",
          }}
        >
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "left",
              marginBottom: "6px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-dim)",
                letterSpacing: "0.08em",
                marginBottom: "6px",
              }}
            >
              {copy.stackCommand}
            </div>
            <div
              className="section-title"
              style={{
                fontSize: "clamp(1.1rem, 2.3vw, 1.6rem)",
                color: "var(--text-primary)",
                marginBottom: "6px",
              }}
            >
              <span style={{ color: "var(--accent-cyan)" }}>./</span>{copy.stackTitle}
            </div>
            <p style={{ color: "var(--text-dim)", fontSize: "12px", lineHeight: 1.6 }}>
              {copy.stackDescription}
            </p>
          </div>
          {DEPLOY_STACK.map((t) => {
            return (
              <div
                key={t.label}
                style={{
                  background: "rgba(7, 27, 49, 0.58)",
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${t.color}2e`,
                  borderTop: `2px solid ${t.color}`,
                  borderRadius: "8px",
                  padding: "14px 14px 13px",
                  textAlign: "left",
                  minHeight: "132px",
                  boxShadow: "0 14px 34px rgba(0, 0, 0, 0.18)",
                }}
              >
                <div style={{
                  fontSize: "10px",
                  color: "var(--text-dim)",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}>
                  {t.label}
                </div>
                <div style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: t.color,
                  fontFamily: "'Orbitron', monospace",
                  lineHeight: 1,
                  marginBottom: "8px",
                  letterSpacing: "0.03em",
                  wordBreak: "break-all",
                }}>
                  {t.value}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "10px", lineHeight: 1.45 }}>
                  {t.sub}
                </div>
                <div style={{
                  fontSize: "10px",
                  color: t.color,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  opacity: 0.7,
                }}>
                  <span style={{
                    width: "5px", height: "5px", borderRadius: "50%",
                    background: t.color, display: "inline-block", flexShrink: 0,
                  }} />
                  {t.role}
                </div>
              </div>
            );
          })}
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
            {copy.experienceCommand}
          </div>
          <h2
            className="section-title"
            style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "var(--text-primary)" }}
          >
            <span style={{ color: "var(--accent-cyan)" }}>./</span>{copy.experienceTitle}
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
        <CV lang={lang} />
      </section>

      {/* ════════════════════════════════════════════════════
          ABOUT
      ════════════════════════════════════════════════════ */}
      <section
        id="about"
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
              {copy.aboutCommand}
            </div>
            <h2
              className="section-title"
              style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "var(--text-primary)" }}
            >
              <span style={{ color: "var(--accent-cyan)" }}>./</span>{copy.aboutTitle}
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

          <div className="terminal-chrome">
            <div className="terminal-titlebar">
              <span className="terminal-dot" style={{ background: "#FF5F57" }} />
              <span className="terminal-dot" style={{ background: "#FFBD2E" }} />
              <span className="terminal-dot" style={{ background: "#28C840" }} />
              <span style={{ marginLeft: "12px", fontSize: "11px", color: "var(--text-dim)" }}>
                filip-human.yaml
              </span>
            </div>
            <div
              style={{
                background: "var(--bg-surface)",
                padding: "28px 32px",
              }}
            >
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  lineHeight: 1.8,
                  maxWidth: "820px",
                  marginBottom: "22px",
                }}
              >
                {copy.aboutIntro}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "12px",
                }}
              >
                {copy.aboutItems.map((item) => (
                  <div
                    key={item.key}
                    style={{
                      border: `1px solid ${item.color}33`,
                      borderTop: `2px solid ${item.color}`,
                      borderRadius: "8px",
                      padding: "16px",
                      background: "rgba(4, 18, 34, 0.62)",
                    }}
                  >
                    <div
                      style={{
                        color: item.color,
                        fontSize: "12px",
                        fontWeight: 700,
                        marginBottom: "8px",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {item.key}
                    </div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: 1.7 }}>
                      {item.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
            {copy.contactCommand}
          </div>
          <h2
            className="section-title"
            style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "var(--text-primary)" }}
          >
            <span style={{ color: "var(--accent-cyan)" }}>./</span>{copy.contactTitle}
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
            {copy.contactRows.map(({ key, val, href }) => (
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
            © 2026 Filip Csupka
          </span>
          <span style={{ color: "var(--border)" }}>|</span>
          <span>
            {copy.footerRunning}{" "}
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
