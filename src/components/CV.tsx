"use client";

import { useState } from "react";

/* ─── Data ───────────────────────────────────────────────── */
const SUMMARY =
  "Highly motivated DevOps and Site Reliability Engineer with a proven track record of managing and scaling cloud-native infrastructure. Expert in GitOps methodologies, CI/CD automation, Kubernetes orchestration, and building production-grade monitoring and observability stacks.";

const EXPERIENCE = [
  {
    role: "DevOps / Kubernetes Engineer",
    company: "ProsoftKe",
    period: "Apr 2022 — Jun 2022",
    location: "Košice, SK",
    namespace: "production",
    status: "Completed",
    replicas: "100+ services",
    highlights: [
      "Engineered and managed CI/CD pipelines for fast, reliable deployments to Azure Kubernetes Service (AKS).",
      "Oversaw 100+ microservices across 6 environments and clusters, managing configurations via GitOps with ArgoCD.",
      "Implemented and maintained full observability stack: Prometheus, Grafana, Alertmanager via official Helm charts.",
      "Conducted deep-dive troubleshooting across distributed systems involving Kafka, MongoDB, and PostgreSQL.",
    ],
    tags: ["AKS", "ArgoCD", "Helm", "Prometheus", "Grafana", "Kafka", "MongoDB", "PostgreSQL"],
  },
  {
    role: "DevOps Engineer",
    company: "Ness Digital Engineering",
    period: "Oct 2020 — Apr 2022",
    location: "Košice, SK",
    namespace: "cloud-infra",
    status: "Completed",
    replicas: "AWS infra",
    highlights: [
      "Designed and maintained AWS cloud infrastructure for enterprise clients.",
      "Built and optimised CI/CD pipeline automation using industry best practices.",
      "Progressed toward AWS Certified Solutions Architect – Associate certification.",
      "Collaborated with engineering teams on cloud-native migration projects.",
    ],
    tags: ["AWS", "CI/CD", "Terraform", "Linux"],
  },
  {
    role: "Head of Team / Admin",
    company: "Datagroup",
    period: "Jan 2018 — Oct 2020",
    location: "Košice, SK",
    namespace: "groupware",
    status: "Completed",
    replicas: "Team lead",
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
    namespace: "operations",
    status: "Completed",
    replicas: "Team lead",
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

/* ─── Sub-components ─────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      style={{
        fontSize: "10px",
        padding: "2px 8px",
        borderRadius: "3px",
        background: "rgba(0,255,136,0.1)",
        border: "1px solid rgba(0,255,136,0.25)",
        color: "var(--accent-green)",
        letterSpacing: "0.04em",
        fontWeight: 500,
      }}
    >
      ● {status}
    </span>
  );
}

function SkillBar({ name, level, color }: { name: string; level: number; color: string }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
          fontSize: "12px",
        }}
      >
        <span style={{ color: "var(--text-secondary)" }}>{name}</span>
        <span style={{ color: "var(--text-dim)", fontSize: "11px" }}>{level}%</span>
      </div>
      <div
        style={{
          height: "3px",
          background: "var(--border)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${level}%`,
            background: `linear-gradient(90deg, ${color}, ${color}aa)`,
            borderRadius: "2px",
            boxShadow: `0 0 8px ${color}66`,
            transition: "width 1s ease",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export default function CV() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

      {/* Summary pod */}
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderLeft: "3px solid var(--accent-cyan)",
          borderRadius: "8px",
          padding: "20px 24px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            color: "var(--text-dim)",
            marginBottom: "10px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          pod/filip-csupka — describe — Professional Summary
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: 1.8 }}>
          {SUMMARY}
        </p>
      </div>

      {/* Experience timeline */}
      <div>
        <div
          style={{
            fontSize: "11px",
            color: "var(--text-dim)",
            marginBottom: "16px",
            letterSpacing: "0.06em",
          }}
        >
          NAME {"   "} COMPANY {"   "} NAMESPACE {"   "} STATUS {"   "} PERIOD
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {EXPERIENCE.map((job, i) => (
            <div
              key={i}
              style={{
                background: "var(--bg-surface)",
                border: `1px solid ${expanded === i ? "var(--accent-cyan)" : "var(--border)"}`,
                borderLeft: `3px solid ${expanded === i ? "var(--accent-cyan)" : "var(--border-bright)"}`,
                borderRadius: "8px",
                overflow: "hidden",
                transition: "border-color 0.2s",
                boxShadow: expanded === i ? "0 0 20px rgba(0,212,255,0.06)" : "none",
              }}
            >
              {/* Header row — kubectl get pods style */}
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: "16px 20px",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px 24px",
                    alignItems: "center",
                    fontSize: "13px",
                  }}
                >
                  <span
                    style={{
                      color: "var(--accent-cyan)",
                      fontWeight: 600,
                      minWidth: "220px",
                    }}
                  >
                    {job.role}
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>{job.company}</span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--text-dim)",
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                      borderRadius: "3px",
                      padding: "1px 8px",
                    }}
                  >
                    {job.namespace}
                  </span>
                  <StatusBadge status={job.status} />
                  <span style={{ fontSize: "11px", color: "var(--text-dim)" }}>
                    {job.period}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--text-dim)" }}>
                    📍 {job.location}
                  </span>
                </div>

                <span
                  style={{
                    color: "var(--text-dim)",
                    fontSize: "14px",
                    transition: "transform 0.2s",
                    transform: expanded === i ? "rotate(90deg)" : "rotate(0deg)",
                    display: "inline-block",
                  }}
                >
                  ▶
                </span>
              </button>

              {/* Expanded details */}
              {expanded === i && (
                <div
                  style={{
                    borderTop: "1px solid var(--border)",
                    padding: "20px 24px",
                    background: "rgba(0,0,0,0.2)",
                  }}
                >
                  {/* Spec / highlights */}
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-dim)",
                      marginBottom: "12px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Spec.containers[0].responsibilities:
                  </div>
                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      marginBottom: "20px",
                    }}
                  >
                    {job.highlights.map((h, j) => (
                      <li
                        key={j}
                        style={{
                          display: "flex",
                          gap: "10px",
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                          lineHeight: 1.6,
                        }}
                      >
                        <span style={{ color: "var(--accent-cyan)", flexShrink: 0 }}>
                          —
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>

                  {/* Tags */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                    }}
                  >
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "11px",
                          padding: "2px 8px",
                          borderRadius: "3px",
                          background: "rgba(0,212,255,0.06)",
                          border: "1px solid rgba(0,212,255,0.15)",
                          color: "var(--accent-cyan)",
                          letterSpacing: "0.03em",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Skills proficiency */}
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <div className="terminal-titlebar">
          <span className="terminal-dot" style={{ background: "#FF5F57" }} />
          <span className="terminal-dot" style={{ background: "#FFBD2E" }} />
          <span className="terminal-dot" style={{ background: "#28C840" }} />
          <span
            style={{ marginLeft: "12px", fontSize: "11px", color: "var(--text-dim)" }}
          >
            kubectl top pod/filip-csupka — skill utilisation
          </span>
        </div>
        <div
          style={{
            padding: "24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "0 32px",
          }}
        >
          {SKILLS.map((s) => (
            <SkillBar key={s.name} {...s} />
          ))}
        </div>
      </div>
    </div>
  );
}
