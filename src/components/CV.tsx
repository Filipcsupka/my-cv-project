"use client";

import { useState } from "react";

/* ─── Data ───────────────────────────────────────────────── */
const SUMMARY =
  "Highly motivated DevOps and Site Reliability Engineer with a proven track record of managing and scaling cloud-native infrastructure. Expert in GitOps methodologies, CI/CD automation, Kubernetes orchestration, and building production-grade monitoring and observability stacks.";

const EXPERIENCE = [
  {
    role: "DevOps / SRE",
    company: "Aspecta",
    period: "Jul 2025 — Present",
    location: "Košice, SK",
    domain: "private-cloud",
    status: "Running",
    highlights: [
      "Maintain and operate Red Hat OpenShift HUB/SPOKE private cloud clusters, owning production stability through continuous monitoring, configuration management, and incident troubleshooting.",
      "Manage the full OpenShift operator lifecycle — planning and executing cluster and operator upgrades to the latest versions following Red Hat best practices, minimising downtime and upgrade risk.",
      "Led a lab POC for the production upgrade path: deployed and validated a full HUB/SPOKE cluster topology on the latest OpenShift version, de-risking the rollout and establishing a repeatable upgrade procedure.",
    ],
    tags: ["OpenShift", "ArgoCD", "Helm", "HUB/SPOKE", "Red Hat", "Private Cloud", "GitOps"],
  },
  {
    role: "DevOps / Kubernetes Engineer",
    company: "ProsoftKe",
    period: "Apr 2022 — Present",
    location: "Košice, SK",
    domain: "healthcare",
    status: "Running",
    highlights: [
      "Operate and maintain 7 AKS clusters and 1 Hetzner cluster hosting hospital management software across dev, test, prod, and customer-dedicated environments.",
      "Own the full delivery pipeline end-to-end: GitLab CI builds and validates container images, Kustomize manages per-environment overlays, ArgoCD drives GitOps deployments — giving every team a reproducible and auditable release process.",
      "Scaled a multi-tenant Hetzner cluster to 25 nodes and 2,000+ pods, where each Kubernetes namespace maps to one isolated hospital — enabling per-customer tenancy without the overhead of separate clusters.",
      "Manage the full configuration surface across environments: sealed secrets for sensitive data, Kustomize patches and configmaps for environment tuning, Helm chart upgrades, and resource quotas to prevent noisy-neighbour contention.",
      "Built and own the observability stack end-to-end (Prometheus, Grafana, Loki, Tempo, Alloy, Go tracing), cutting mean time to detect incidents and enabling distributed trace-level root-cause analysis.",
      "Primary escalation contact for developer issues: diagnose misconfigured services, broken inter-service connectivity, MongoDB and PostgreSQL data anomalies, stalled Kafka messages, and failed Kafka Connector pipelines.",
    ],
    tags: ["AKS", "Hetzner", "ArgoCD", "GitLab CI", "Kustomize", "Terraform", "Helm", "Sealed Secrets", "Prometheus", "Grafana", "Loki", "Tempo", "Alloy", "Kafka", "MongoDB", "PostgreSQL"],
  },
  {
    role: "DevOps Engineer",
    company: "Ness Digital Engineering",
    period: "Oct 2020 — Apr 2022",
    location: "Košice, SK",
    domain: "cloud-infra",
    status: "Completed",
    highlights: [
      "Progressed toward AWS Certified Solutions Architect – Associate certification.",
    ],
    tags: ["AWS"],
  },
  {
    role: "Head of Team / Admin",
    company: "Datagroup",
    period: "Jan 2018 — Oct 2020",
    location: "Košice, SK",
    domain: "groupware",
    status: "Completed",
    highlights: [
      "Led the Lotus Notes technology team, providing technical leadership and mentoring.",
      "Participated in the Groupware team, responsible for new technology rollouts.",
      "Managed documentation, vendor relationships, and customer migrations to Exchange and Teams.",
      "Fostered team growth, skill development, and consistently high-quality service delivery.",
    ],
    tags: ["Leadership", "Exchange", "Teams", "Migration"],
  },
  {
    role: "Head of Team / Admin",
    company: "Diebold Nixdorf",
    period: "Prior to Jan 2018",
    location: "Košice, SK",
    domain: "operations",
    status: "Completed",
    highlights: [
      "Monitored and improved performance and morale of the administration team.",
      "Managed a team of professionals ensuring service quality and customer satisfaction.",
      "Collaborated with department heads and customers on strategic initiatives.",
      "Organised company activities and events to promote a positive work environment.",
    ],
    tags: ["Operations", "Leadership", "Service Management"],
  },
];

const SKILLS = [
  { name: "Kubernetes",    level: 90, color: "#326CE5" },
  { name: "ArgoCD",        level: 88, color: "#EF7B4D" },
  { name: "Prometheus",    level: 85, color: "#E6522C" },
  { name: "Grafana",       level: 85, color: "#F46800" },
  { name: "Terraform",     level: 78, color: "#7B42BC" },
  { name: "Helm",          level: 88, color: "#0F1689" },
  { name: "Docker",        level: 90, color: "#2496ED" },
  { name: "Azure / AKS",   level: 82, color: "#0078D4" },
  { name: "AWS",           level: 70, color: "#FF9900" },
  { name: "OpenShift",     level: 75, color: "#EE0000" },
  { name: "Kafka",         level: 72, color: "#00ff88" },
  { name: "CI/CD",         level: 88, color: "#00d4ff" },
];

/* ─── YAML token helpers ─────────────────────────────────── */
const MONO: { fontFamily: string; fontSize: string; lineHeight: string } = {
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  fontSize: "12px",
  lineHeight: "1.8",
};

const T = {
  kw:   (s: string) => <span style={{ color: "#f92672", fontWeight: 600 }}>{s}</span>,
  key:  (s: string) => <span style={{ color: "var(--accent-cyan)" }}>{s}</span>,
  str:  (s: string) => <span style={{ color: "#e6db74" }}>{s}</span>,
  num:  (s: number) => <span style={{ color: "#ae81ff" }}>{s}</span>,
  run:  (s: string) => <span style={{ color: "var(--accent-green)" }}>{s}</span>,
  dim:  (s: string) => <span style={{ color: "rgba(255,255,255,0.28)" }}>{s}</span>,
  cmt:  (s: string) => <span style={{ color: "rgba(255,255,255,0.22)", fontStyle: "italic" }}># {s}</span>,
};

function L({ n = 0, children }: { n?: number; children: React.ReactNode }) {
  return (
    <div style={{ ...MONO, paddingLeft: `${n * 14}px`, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
      {children}
    </div>
  );
}
function Blank() { return <div style={{ height: "6px" }} />; }

/* ─── Experience card ────────────────────────────────────── */
function ExpEntry({
  job, open, onToggle,
}: {
  job: typeof EXPERIENCE[0];
  open: boolean;
  onToggle: () => void;
}) {
  const slug = job.company.toLowerCase().replace(/\s+/g, "-");
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: `1px solid ${open ? "var(--accent-cyan)" : "var(--border)"}`,
        borderLeft: `3px solid ${open ? "var(--accent-cyan)" : "var(--border-bright)"}`,
        borderRadius: "8px",
        overflow: "hidden",
        transition: "border-color 0.2s",
        boxShadow: open ? "0 0 20px rgba(0,212,255,0.06)" : "none",
      }}
    >
      {/* Header row */}
      <button
        onClick={onToggle}
        style={{
          width: "100%", background: "none", border: "none",
          cursor: "pointer", padding: "14px 18px", textAlign: "left",
        }}
      >
        <div style={{ ...MONO }}>
          {T.dim("- ")}{T.key("name")}{T.dim(": ")}{T.str(`"${slug}"`)}
          {"  "}
          <span style={{ color: "var(--accent-cyan)", opacity: 0.55, fontSize: "11px" }}>
            {open ? "▾" : "▸"}
          </span>
          {"  "}{T.cmt(`${job.role}  ·  ${job.period}`)}
        </div>
      </button>

      {/* Expanded YAML body */}
      {open && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "16px 18px",
            background: "rgba(0,0,0,0.18)",
          }}
        >
          <L>{T.key("role")}{T.dim(": ")}{T.str(`"${job.role}"`)}</L>
          <L>{T.key("period")}{T.dim(": ")}{T.str(`"${job.period}"`)}</L>
          <L>{T.key("location")}{T.dim(": ")}{T.str(`"${job.location}"`)}</L>
          <L>{T.key("domain")}{T.dim(": ")}{T.str(job.domain)}</L>
          <L>
            {T.key("status")}{T.dim(": ")}
            {job.status === "Running" ? T.run(job.status) : T.dim(job.status)}
          </L>
          <L>{T.key("highlights")}{T.dim(":")}</L>
          {job.highlights.map((h, j) => (
            <div key={j} style={{ display: "flex", paddingLeft: `${1 * 14}px` }}>
              <span style={{ ...MONO, color: "rgba(255,255,255,0.28)", flexShrink: 0 }}>{"- "}</span>
              <span style={{ ...MONO, color: "#e6db74" }}>{h}</span>
            </div>
          ))}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", ...MONO, marginTop: "6px" }}>
            {T.key("tags")}{T.dim(": [")}
            {job.tags.map((tag, j) => (
              <span key={j}>
                {T.str(`"${tag}"`)}{j < job.tags.length - 1 && T.dim(", ")}
              </span>
            ))}
            {T.dim("]")}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Skill entry in YAML ────────────────────────────────── */
function SkillEntry({ name, level, color }: { name: string; level: number; color: string }) {
  const filled = Math.round(level / 10);
  const bar = "█".repeat(filled) + "░".repeat(10 - filled);
  return (
    <>
      <L n={1}>{T.dim("- ")}{T.key("name")}{T.dim(": ")}{T.str(`"${name}"`)}</L>
      <L n={2}>{T.key("level")}{T.dim(": ")}{T.num(level)}</L>
      <L n={2}>
        {T.key("proficiency")}{T.dim(': "')}
        <span style={{ color, letterSpacing: "1px" }}>{bar}</span>
        {T.dim('"')}{"  "}{T.cmt(`${level}%`)}
      </L>
    </>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export default function CV() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* Title bar */}
      <div className="terminal-titlebar">
        <span className="terminal-dot" style={{ background: "#FF5F57" }} />
        <span className="terminal-dot" style={{ background: "#FFBD2E" }} />
        <span className="terminal-dot" style={{ background: "#28C840" }} />
        <span style={{ marginLeft: "12px", fontSize: "11px", color: "var(--text-dim)" }}>
          filip-csupka.yaml
        </span>
      </div>

      {/* YAML body */}
      <div style={{ padding: "20px 24px" }}>

        {/* Header */}
        <L>{T.kw("apiVersion")}{T.dim(": ")}{T.str("talent.io/v1alpha1")}</L>
        <L>{T.kw("kind")}{T.dim(": ")}{T.str("SeniorEngineer")}</L>
        <L>{T.key("metadata")}{T.dim(":")}</L>
        <L n={1}>{T.key("name")}{T.dim(": ")}{T.str("filip-csupka")}</L>
        <L n={1}>{T.key("namespace")}{T.dim(": ")}{T.str("cloud-native")}</L>
        <L n={1}>{T.key("labels")}{T.dim(":")}</L>
        <L n={2}>{T.key("role")}{T.dim(": ")}{T.str("devops-engineer")}</L>
        <L n={2}>{T.key("specialization")}{T.dim(": ")}{T.str("kubernetes-sre")}</L>
        <L n={2}>{T.key("location")}{T.dim(": ")}{T.str("kosice.sk")}</L>
        <L n={1}>{T.key("annotations")}{T.dim(":")}</L>
        <L n={2}>{T.key("cv.io/open-to-work")}{T.dim(': ')}{T.str('"true"')}</L>

        <Blank />

        {/* spec */}
        <L>{T.key("spec")}{T.dim(":")}</L>

        {/* summary */}
        <L n={1}>{T.key("summary")}{T.dim(": |")}</L>
        <div style={{ paddingLeft: `${2 * 14}px` }}>
          <div style={{ ...MONO, color: "#e6db74", maxWidth: "640px" }}>{SUMMARY}</div>
        </div>

        <Blank />

        {/* experience */}
        <L n={1}>{T.key("experience")}{T.dim(":")}</L>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
          {EXPERIENCE.map((job, i) => (
            <ExpEntry
              key={i}
              job={job}
              open={expanded === i}
              onToggle={() => setExpanded(expanded === i ? null : i)}
            />
          ))}
        </div>

        <Blank />

        {/* skills */}
        <L n={1}>{T.key("skills")}{T.dim(":")}</L>
        {SKILLS.map((s) => (
          <SkillEntry key={s.name} {...s} />
        ))}

        <Blank />

        {/* status */}
        <L>{T.key("status")}{T.dim(":")}</L>
        <L n={1}>{T.key("phase")}{T.dim(": ")}{T.run("Running")}</L>
        <L n={1}>{T.key("conditions")}{T.dim(":")}</L>
        <L n={1}>{T.dim("- ")}{T.key("type")}{T.dim(": ")}{T.str("Available")}</L>
        <L n={2}>{T.key("status")}{T.dim(": ")}{T.str('"True"')}</L>
        <L n={2}>{T.key("reason")}{T.dim(": ")}{T.str("SeekingNewChallenge")}</L>

      </div>
    </div>
  );
}
