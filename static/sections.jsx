/* global React */
const { useState: useS, useEffect: useE, useRef: useR, useMemo: useM } = React;
const D2 = window.CV_DATA;

/* ─── STACK SECTION — literally builds the stack as you scroll ──────── */
function StackSection() {
  const ref = useR(null);
  const p = useElementProgress(ref);
  const t = useTick();
  const isMobile = useIsMobile();
  const layers = D2.stackLayers;

  const startP = 0.05;
  const step = 0.052;

  const innerRef = useR(null);

  return (
    <section id="stack" ref={ref} style={{
      position: "relative", zIndex: 2,
      maxWidth: 1280, margin: "0 auto", padding: "60px 16px 100px",
    }}>
      <SectionHead cmd="$ helm install platform . --create-namespace --wait" title="BUILDING THE STACK" idx="01" total="06" />

      <div style={{
        color: "#a8bfd6", fontSize: 13, lineHeight: 1.7, maxWidth: 720,
        marginBottom: 28, fontFamily: "'JetBrains Mono', monospace",
      }}>
        <span style={{ color: "#5f7f9e" }}># scroll to deploy each layer.</span><br/>
        Eleven abstraction layers, bottom-up. Same way I build platforms in production: start with the metal, end with the agents, leave nothing manual in between.
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) minmax(360px, 580px)",
        gap: 36, alignItems: "start",
      }}>
        <div ref={innerRef} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {layers.map((layer, i) => {
            const localP = startP + i * step;
            const reveal = Math.max(0, Math.min(1, (p - localP) * 12));
            const settled = Math.max(0, Math.min(1, (p - localP - 0.04) * 14));
            return (
              <LayerLog key={layer.key} layer={layer} idx={i} reveal={reveal} settled={settled} t={t} />
            );
          })}
        </div>

        <div style={isMobile
          ? { height: "min(420px, 70vw)", marginTop: 8 }
          : { position: "sticky", top: 80, height: "min(640px, 80vh)" }
        }>
          <DeployLog layers={layers} progress={p} startP={startP} step={step} t={t} />
        </div>
      </div>
    </section>
  );
}

function LayerLog({ layer, idx, reveal, settled, t }) {
  const [hover, setHover] = useS(false);
  const live = (Math.sin(t * 1.6 + idx * 0.7) + 1) / 2;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        opacity: 0.25 + reveal * 0.75,
        transform: `translateX(${(1 - reveal) * -28}px)`,
        transition: "opacity 0.2s",
        padding: "14px 16px 14px 22px",
        background: settled > 0.5
          ? `linear-gradient(90deg, ${layer.color}14, transparent 60%)`
          : "transparent",
        borderRadius: 8,
      }}
    >
      <div style={{
        position: "absolute", left: 6, top: 18,
        width: 2, height: settled > 0.3 ? "calc(100% - 18px)" : 0,
        background: layer.color,
        opacity: 0.6, transition: "height 0.4s ease",
        boxShadow: `0 0 6px ${layer.color}`,
      }} />
      <div style={{
        position: "absolute", left: 0, top: 14,
        width: 14, height: 14, borderRadius: "50%",
        background: settled > 0.5 ? layer.color : "#03101f",
        border: `2px solid ${layer.color}`,
        boxShadow: settled > 0.5
          ? `0 0 ${8 + live * 10}px ${layer.color}`
          : `0 0 4px ${layer.color}88`,
        transition: "background 0.4s",
      }} />

      <div style={{
        display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap",
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <span style={{
          fontSize: 10, color: layer.color, letterSpacing: "0.16em",
          fontWeight: 700,
        }}>{layer.tier}</span>
        <span style={{ color: "#5f7f9e", fontSize: 11 }}>
          {settled > 0.6 ? "✓ deployed" : reveal > 0.3 ? "⸬ deploying…" : "○ pending"}
        </span>
      </div>

      <div style={{
        color: "#edf7ff", fontSize: 17, fontWeight: 700, marginTop: 4,
        fontFamily: "'Orbitron', monospace", letterSpacing: "0.02em",
      }}>
        {layer.title}
      </div>
      <div style={{
        color: "#a8bfd6", fontSize: 12, marginTop: 4,
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        {layer.blurb}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
        {layer.tools.map((tool, k) => (
          <span key={tool} style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10.5, padding: "2px 8px",
            borderRadius: 3, border: `1px solid ${layer.color}55`,
            background: `${layer.color}12`,
            color: layer.color,
            opacity: Math.min(1, reveal * 1.5 - k * 0.05),
            transform: `translateY(${(1 - reveal) * 6}px)`,
            transition: `all 0.3s ${k * 0.04}s`,
          }}>{tool}</span>
        ))}
      </div>

      <div style={{
        marginTop: 10, fontSize: 11.5, color: "#5f7f9e",
        fontFamily: "'JetBrains Mono', monospace",
        fontStyle: "italic",
        opacity: settled,
      }}>
        ⸬ {layer.magic}
      </div>
    </div>
  );
}

/* ─── DEPLOY LOG — terminal panel showing per-layer helm output ───── */
const DEPLOY_CMDS = [
  { cmd: "helm install linux-base ./charts/linux", ns: "platform-system" },
  { cmd: "helm install compute ./charts/metal", ns: "platform-system" },
  { cmd: "helm install container-runtime ./charts/docker", ns: "platform-system" },
  { cmd: "helm install k8s-control-plane ./charts/orchestration", ns: "kube-system" },
  { cmd: "helm install helm-operator ./charts/packaging", ns: "platform-system" },
  { cmd: "terraform apply ./infra/iac", ns: null },
  { cmd: "helm install ci-runners ./charts/pipelines", ns: "ci-system" },
  { cmd: "helm install argocd ./charts/gitops", ns: "argocd" },
  { cmd: "helm install kafka-stack ./charts/data", ns: "data-platform" },
  { cmd: "helm install kube-prometheus-stack ./charts/observability", ns: "monitoring" },
  { cmd: "helm install ai-agents ./charts/ai", ns: "ai-platform" },
];

function DeployLog({ layers, progress, startP, step, t }) {
  const logRef = useR(null);
  const deployedCount = layers.filter((_, i) => {
    const localP = startP + i * step;
    return Math.max(0, Math.min(1, (progress - localP - 0.04) * 14)) > 0.6;
  }).length;

  const blink = Math.floor(t * 2) % 2 === 0;

  useE(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [deployedCount]);

  return (
    <div style={{
      width: "100%", height: "100%",
      position: "relative",
      borderRadius: 10,
      border: "1px solid #1e4a6e",
      background: "#020d1a",
      overflow: "hidden",
      fontFamily: "'JetBrains Mono', monospace",
      display: "flex", flexDirection: "column",
    }}>
      {/* title bar */}
      <div style={{
        padding: "8px 14px",
        borderBottom: "1px solid #1e4a6e",
        background: "#041525",
        display: "flex", alignItems: "center", gap: 10,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f57","#febc2e","#28c840"].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.85 }} />
          ))}
        </div>
        <span style={{ fontSize: 11, color: "#5f7f9e", letterSpacing: "0.08em", marginLeft: 4 }}>
          platform-deploy — zsh
        </span>
        <span style={{ marginLeft: "auto", fontSize: 10, color: "#5cffb1" }}>
          {deployedCount}/{layers.length} layers ✓
        </span>
      </div>

      {/* log body */}
      <div ref={logRef} style={{
        flex: 1, overflowY: "auto", padding: "12px 16px",
        display: "flex", flexDirection: "column", gap: 0,
        scrollbarWidth: "none",
      }}>
        {layers.map((layer, i) => {
          const localP = startP + i * step;
          const reveal = Math.max(0, Math.min(1, (progress - localP) * 12));
          const settled = Math.max(0, Math.min(1, (progress - localP - 0.04) * 14));
          if (reveal < 0.05) return null;
          const cmd = DEPLOY_CMDS[i] || { cmd: `helm install ${layer.key}`, ns: "platform" };
          const deploying = reveal > 0.1 && settled < 0.6;
          const done = settled >= 0.6;
          const duration = (1.1 + i * 0.37).toFixed(1);
          return (
            <div key={layer.key} style={{
              marginBottom: 14,
              opacity: 0.4 + reveal * 0.6,
              transform: `translateX(${(1 - reveal) * -10}px)`,
              transition: "opacity 0.2s, transform 0.2s",
            }}>
              {/* namespace line */}
              {cmd.ns && (
                <div style={{ fontSize: 10, color: "#2a6a9e", marginBottom: 2 }}>
                  {`[ns: ${cmd.ns}]`}
                </div>
              )}
              {/* command */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 6, flexWrap: "wrap" }}>
                <span style={{ color: "#5cffb1", fontSize: 11, flexShrink: 0 }}>$</span>
                <span style={{ color: "#c8e6ff", fontSize: 11, wordBreak: "break-all" }}>{cmd.cmd}</span>
              </div>
              {/* output lines */}
              {reveal > 0.3 && (
                <div style={{ marginTop: 4, paddingLeft: 14, display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ fontSize: 10, color: "#3a7a9e" }}>
                    {`Installing ${layer.title}...`}
                  </div>
                  <div style={{ fontSize: 10, color: "#3a7a9e" }}>
                    {`  tools: ${layer.tools.join(", ")}`}
                  </div>
                  {done ? (
                    <div style={{ fontSize: 11, color: layer.color, marginTop: 2, display: "flex", gap: 8, alignItems: "center" }}>
                      <span>✓</span>
                      <span style={{ fontWeight: 700 }}>{`${layer.key} deployed`}</span>
                      <span style={{ color: "#3a7a9e", fontSize: 10 }}>{`[${duration}s]`}</span>
                    </div>
                  ) : deploying ? (
                    <div style={{ fontSize: 10, color: "#ffc64a", marginTop: 2 }}>
                      {`⸬ deploying${".".repeat(1 + (Math.floor(t * 3) % 3))}`}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}

        {/* blinking cursor */}
        <div style={{
          fontSize: 12, color: "#5cffb1",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span>$</span>
          <span style={{
            display: "inline-block", width: 8, height: 14,
            background: blink ? "#5cffb1" : "transparent",
            verticalAlign: "middle",
          }} />
        </div>
      </div>
    </div>
  );
}

/* ─── EXPERIENCE ──────────────────────────────────────────────── */
function ExperienceSection() {
  const ref = useR(null);
  const p = useElementProgress(ref);
  const [open, setOpen] = useS(0);
  const isMobile = useIsMobile();

  return (
    <section id="experience" ref={ref} style={sectionStyle}>
      <SectionHead cmd="$ kubectl describe deployment/filip-csupka --show-history" title="EXPERIENCE" idx="02" total="06" />

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "32px 1fr" : "60px 1fr", gap: isMobile ? 12 : 24 }}>
        <div style={{ position: "relative" }}>
          <div style={{
            position: "absolute", left: 28, top: 0, bottom: 0, width: 2,
            background: "linear-gradient(to bottom, #42e0ff, #5cffb1, #ffc64a, #ff5f80, #a78bfa)",
            opacity: 0.3,
          }} />
          <div style={{
            position: "absolute", left: 28, top: 0, width: 2,
            height: `${Math.min(1, p * 1.2) * 100}%`,
            background: "linear-gradient(to bottom, #42e0ff, #5cffb1)",
            boxShadow: "0 0 14px #42e0ff",
            transition: "height 0.1s linear",
          }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {D2.experience.map((job, i) => (
            <ExpRow key={job.id} job={job} idx={i} progress={p} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} total={D2.experience.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExpRow({ job, idx, progress, open, onToggle, total }) {
  const reveal = Math.max(0, Math.min(1, (progress - 0.05) * 4 - idx * 0.15));
  const t = useTick();
  const palette = ["#42e0ff", "#5cffb1", "#ffc64a", "#ff5f80", "#a78bfa"];
  const color = palette[idx % palette.length];

  return (
    <div style={{
      position: "relative",
      transform: `translateX(${(1 - reveal) * 40}px)`,
      opacity: reveal,
      transition: "opacity 0.2s",
    }}>
      <div style={{
        position: "absolute", left: -32, top: 18,
        width: 14, height: 14, borderRadius: "50%",
        background: "#03101f", border: `2px solid ${color}`,
        boxShadow: `0 0 ${open ? 18 : 8}px ${color}`,
        zIndex: 2,
      }}>
        <div style={{
          position: "absolute", inset: 2,
          borderRadius: "50%",
          background: color,
          opacity: 0.5 + (Math.sin(t * 3 + idx) + 1) / 2 * 0.5,
        }} />
      </div>

      <div style={{
        background: open
          ? `linear-gradient(135deg, rgba(7,27,49,0.95), rgba(12,39,67,0.95))`
          : "rgba(7,27,49,0.7)",
        border: `1px solid ${open ? color : "rgba(66,224,255,0.2)"}`,
        borderLeft: `4px solid ${color}`,
        borderRadius: 8, overflow: "hidden",
        boxShadow: open ? `0 12px 30px rgba(0,0,0,0.4), 0 0 30px ${color}26` : "none",
        transition: "all 0.3s",
      }}>
        <button onClick={onToggle} style={{
          display: "block", width: "100%", textAlign: "left",
          padding: "16px 20px",
          background: "transparent", border: "none", cursor: "pointer",
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ color: "#5f7f9e", fontSize: 11 }}>
              {String(total - idx).padStart(2, "0")}
            </span>
            <span style={{ color: color, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              ● job/{job.id}
            </span>
            <span style={{ marginLeft: "auto", color: "#5cffb1", fontSize: 11 }}>
              status: <strong>Running</strong>
            </span>
            <span style={{ color: "#5f7f9e", fontSize: 11 }}>{open ? "▾" : "▸"}</span>
          </div>
          <div style={{
            color: "#edf7ff", fontSize: 17, fontWeight: 700, marginTop: 8,
            fontFamily: "'Orbitron', monospace", letterSpacing: "0.02em",
          }}>{job.title}</div>
          <div style={{ color: "#a8bfd6", fontSize: 12, marginTop: 4 }}>
            <span style={{ color: "#5f7f9e" }}>focus:</span> {job.focus}
          </div>
        </button>

        <div style={{
          maxHeight: open ? 1200 : 0,
          overflow: "hidden",
          transition: "max-height 0.5s ease",
        }}>
          <div style={{ padding: "0 20px 20px", borderTop: `1px dashed ${color}40` }}>
            <div style={{
              padding: "16px 0 12px",
              color: "#f3e99a", fontSize: 13, lineHeight: 1.7,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              <span style={{ color: "#5f7f9e" }}># summary</span><br/>
              {job.summary}
            </div>

            <div style={{
              fontSize: 11, color: "#5f7f9e", letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: 8, marginTop: 8,
            }}>⸬ highlights ({job.highlights.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {job.highlights.map((h, k) => (
                <HighlightLog key={k} text={h} idx={k} color={color} active={open} />
              ))}
            </div>

            <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {job.tags.map((tag) => <Tag key={tag} text={tag} color={color} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HighlightLog({ text, idx, color, active }) {
  const t = useTick();
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "70px 16px 1fr",
      gap: 10, alignItems: "baseline",
      fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5,
      transform: active ? "translateX(0)" : "translateX(-8px)",
      opacity: active ? 1 : 0,
      transition: `all 0.4s ease ${idx * 0.06}s`,
    }}>
      <span style={{ color: "#5f7f9e", fontSize: 10 }}>
        {new Date(Date.now() - idx * 60000).toTimeString().slice(0, 8)}
      </span>
      <span style={{ color, opacity: 0.6 + (Math.sin(t * 2 + idx) + 1) / 2 * 0.4 }}>⸬</span>
      <span style={{ color: "#a8bfd6", lineHeight: 1.6 }}>{text}</span>
    </div>
  );
}

function Tag({ text, color }) {
  const [hover, setHover] = useS(false);
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        padding: "3px 9px", borderRadius: 4,
        border: `1px solid ${color}55`,
        background: hover ? `${color}22` : `${color}10`,
        color, transition: "all 0.2s",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hover ? `0 4px 12px ${color}33` : "none",
        cursor: "default",
      }}
    >{text}</span>
  );
}

/* ─── ABOUT ME ──────────────────────────────────────────────── */
function AboutSection() {
  const ref = useR(null);
  const p = useElementProgress(ref);
  const t = useTick();

  return (
    <section id="about" ref={ref} style={sectionStyle}>
      <SectionHead cmd="$ kubectl describe human/filip-csupka -o yaml" title="ABOUT ME" idx="03" total="06" />

      <div style={{
        color: "#a8bfd6", fontSize: 13, lineHeight: 1.7, maxWidth: 760,
        marginBottom: 24, fontFamily: "'JetBrains Mono', monospace",
      }}>
        Hyperactive family-first human with too many hobbies, a home Kubernetes cluster, and a healthy belief that learning starts exactly where confidence ends.
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
        gap: 16,
      }}>
        {D2.about.map((a, i) => (
          <AboutCard key={a.key} item={a} idx={i} progress={p} t={t} />
        ))}
      </div>

      <NotesCard progress={p} t={t} />
      <LangRibbon progress={p} t={t} />
    </section>
  );
}

function AboutCard({ item, idx, progress, t }) {
  const reveal = Math.max(0, Math.min(1, (progress - 0.05) * 5 - idx * 0.1));
  const drift = Math.sin(t * 0.7 + idx * 1.2) * 3;
  const [hover, setHover] = useS(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: `1px solid ${item.color}40`,
        borderRadius: 10, padding: 18,
        background: hover
          ? `linear-gradient(135deg, ${item.color}15, rgba(7,27,49,0.9))`
          : "rgba(7,27,49,0.7)",
        backdropFilter: "blur(6px)",
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 30 + (hover ? -4 : drift)}px)`,
        transition: "background 0.3s, box-shadow 0.3s",
        boxShadow: hover ? `0 14px 30px ${item.color}33` : "0 6px 16px rgba(0,0,0,0.22)",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${item.color}, transparent)`,
      }} />
      <div style={{
        display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: "50%",
          background: item.color,
          boxShadow: `0 0 ${6 + (Math.sin(t * 2 + idx) + 1) / 2 * 8}px ${item.color}`,
        }} />
        <span style={{
          color: item.color, fontSize: 11, letterSpacing: "0.12em",
          textTransform: "uppercase", fontWeight: 700,
        }}>{item.key}</span>
      </div>
      <div style={{
        color: "#a8bfd6", fontSize: 13, lineHeight: 1.7,
        fontFamily: "'JetBrains Mono', monospace",
      }}>{item.val}</div>
    </div>
  );
}

function NotesCard({ progress, t }) {
  const reveal = Math.max(0, Math.min(1, (progress - 0.2) * 5));
  const [active, setActive] = useS(0);

  useE(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % D2.notes.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      marginTop: 18,
      border: "1px solid rgba(66,224,255,0.3)",
      borderRadius: 10, padding: 20,
      background: "linear-gradient(135deg, rgba(7,27,49,0.85), rgba(12,39,67,0.7))",
      backdropFilter: "blur(8px)",
      opacity: reveal,
      boxShadow: "0 14px 30px rgba(0,0,0,0.3)",
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        color: "#5f7f9e", letterSpacing: "0.1em", marginBottom: 12,
      }}># operating_notes <span style={{ color: "#5cffb1" }}>⸬ tick {Math.floor(t)}</span></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {D2.notes.map((note, i) => {
          const isActive = i === active;
          return (
            <div key={note} style={{
              display: "grid", gridTemplateColumns: "32px 1fr",
              gap: 12, alignItems: "baseline",
              fontFamily: "'JetBrains Mono', monospace",
              padding: "8px 12px", borderRadius: 6,
              background: isActive ? "rgba(66,224,255,0.08)" : "transparent",
              transition: "all 0.4s",
              borderLeft: isActive ? "2px solid #42e0ff" : "2px solid transparent",
            }}>
              <span style={{ color: isActive ? "#42e0ff" : "#5f7f9e", fontSize: 11 }}>
                [{String(i).padStart(2, "0")}]
              </span>
              <span style={{
                color: isActive ? "#edf7ff" : "#a8bfd6", fontSize: 13,
                lineHeight: 1.6, transition: "color 0.4s",
              }}>{note}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LangRibbon({ progress, t }) {
  const reveal = Math.max(0, Math.min(1, (progress - 0.35) * 4));
  return (
    <div style={{
      marginTop: 18, opacity: reveal,
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12,
    }}>
      {D2.languages.map((l, i) => {
        const colors = ["#42e0ff", "#5cffb1", "#ffc64a"];
        const c = colors[i];
        const lvl = l.level * Math.min(1, reveal * 1.5);
        return (
          <div key={l.lang} style={{
            border: `1px solid ${c}33`, borderRadius: 8, padding: 12,
            background: "rgba(7,27,49,0.6)",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: "#edf7ff", fontWeight: 600 }}>{l.lang}</span>
              <span style={{ color: c }}>{l.note}</span>
            </div>
            <div style={{
              marginTop: 8, height: 5, borderRadius: 3,
              background: "rgba(66,224,255,0.06)", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", width: `${lvl * 100}%`,
                background: `linear-gradient(90deg, ${c}, ${c}88)`,
                boxShadow: `0 0 8px ${c}`,
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── CONTACT ──────────────────────────────────────────────────── */
function ContactSection() {
  const ref = useR(null);
  const p = useElementProgress(ref);
  const t = useTick();

  return (
    <section id="contact" ref={ref} style={sectionStyle}>
      <SectionHead cmd="$ kubectl exec -it filip-csupka -- /bin/contact" title="CONTACT" idx="04" total="06" />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 28, maxWidth: 760, margin: "0 auto" }}>
        <div style={{
          border: "1px solid #24577e", borderRadius: 10, overflow: "hidden",
          background: "rgba(3,16,31,0.92)", backdropFilter: "blur(8px)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.5), 0 0 60px rgba(66,224,255,0.08)",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "10px 14px", borderBottom: "1px solid #24577e",
            background: "#0c2743",
          }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
            <span style={{
              marginLeft: 14, fontSize: 11, color: "#5f7f9e",
              fontFamily: "'JetBrains Mono', monospace",
            }}>filip@sre-cluster:~$ contact --human</span>
          </div>
          <div style={{ padding: 26, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
            <div style={{ color: "#5cffb1", marginBottom: 14 }}>
              <span style={{ color: "#42e0ff" }}>filip@sre-cluster</span>
              <span style={{ color: "#5f7f9e" }}>:</span>
              <span style={{ color: "#a78bfa" }}>~</span>
              <span style={{ color: "#5f7f9e" }}>$</span> echo "$CONTACT_INFO"
            </div>
            {D2.contact.map((c, i) => (
              <ContactRow key={c.key} c={c} idx={i} progress={p} />
            ))}
            <div style={{ marginTop: 22, color: "#5cffb1" }}>
              <span style={{ color: "#42e0ff" }}>filip@sre-cluster</span>
              <span style={{ color: "#5f7f9e" }}>:</span>
              <span style={{ color: "#a78bfa" }}>~</span>
              <span style={{ color: "#5f7f9e" }}>$ </span>
              <span style={{ color: "#a8bfd6" }}>_</span>
              <span style={{
                display: "inline-block", width: 8, height: "1em",
                background: "#42e0ff", marginLeft: 2, verticalAlign: "-2px",
                opacity: Math.sin(t * 6) > 0 ? 1 : 0,
              }} />
            </div>
          </div>
        </div>

        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: "#5f7f9e", letterSpacing: "0.1em", marginBottom: 12,
          }}>$ ls ~/projects/</div>
          <h3 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "1.4rem", letterSpacing: "0.08em",
            color: "#edf7ff", margin: "0 0 16px",
          }}>
            <span style={{ color: "#42e0ff" }}>./</span>SIDE PROJECTS
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
            gap: 12,
          }}>
            {D2.sideProjects.map((sp, i) => (
              <SideProjectCard key={sp.name} sp={sp} idx={i} progress={p} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ c, idx, progress }) {
  const reveal = Math.max(0, Math.min(1, (progress - 0.1) * 4 - idx * 0.08));
  const isMobile = useIsMobile();
  const Wrap = c.href ? "a" : "div";
  const linkProps = c.href
    ? {
        href: c.href,
        target: c.href.startsWith("/") ? undefined : "_blank",
        rel: c.href.startsWith("/") ? undefined : "noopener noreferrer",
        download: c.download,
        style: {
          color: "#5cffb1",
          textDecoration: "none",
          borderBottom: "1px dashed rgba(92,255,177,0.3)",
          fontSize: isMobile ? 11 : 13,
          wordBreak: "break-all",
        },
      }
    : {
        style: { color: "#a8bfd6", fontSize: isMobile ? 11 : 13 },
      };
  return (
    <div style={{
      display: "grid", gridTemplateColumns: isMobile ? "90px 12px 1fr" : "120px 16px 1fr",
      gap: isMobile ? 6 : 12, padding: "6px 0",
      opacity: reveal, transform: `translateX(${(1 - reveal) * -24}px)`,
      transition: "opacity 0.2s, transform 0.2s",
    }}>
      <span style={{ color: "#42e0ff", fontSize: isMobile ? 11 : 13 }}>{c.key}</span>
      <span style={{ color: "#5f7f9e" }}>:</span>
      {React.createElement(
        Wrap,
        linkProps,
        c.val
      )}
    </div>
  );
}

function SideProjectCard({ sp, idx, progress, t }) {
  const reveal = Math.max(0, Math.min(1, (progress - 0.25) * 5 - idx * 0.12));
  const [hover, setHover] = useS(false);
  const Wrap = sp.href ? "a" : "div";
  const live = (Math.sin(t * 1.4 + idx * 0.7) + 1) / 2;

  return React.createElement(
    Wrap,
    {
      ...(sp.href ? { href: sp.href, target: "_blank", rel: "noopener noreferrer" } : {}),
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: "block",
        textDecoration: "none",
        border: `1px solid ${sp.color}40`,
        borderRadius: 10, padding: 16,
        background: hover
          ? `linear-gradient(135deg, ${sp.color}18, rgba(7,27,49,0.9))`
          : "rgba(7,27,49,0.7)",
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 24 + (hover ? -3 : 0)}px)`,
        transition: "all 0.3s",
        boxShadow: hover ? `0 12px 24px ${sp.color}33` : "0 6px 14px rgba(0,0,0,0.22)",
        position: "relative", overflow: "hidden",
        cursor: sp.href ? "pointer" : "default",
      },
    },
    React.createElement("div", {
      style: { position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${sp.color}, transparent)` }
    }),
    React.createElement("div", {
      style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }
    },
      React.createElement("span", { style: {
        width: 8, height: 8, borderRadius: "50%",
        background: sp.color,
        boxShadow: `0 0 ${4 + live * 8}px ${sp.color}`,
      }}),
      React.createElement("span", {
        style: { color: sp.color, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }
      }, sp.tagline)
    ),
    React.createElement("div", {
      style: { color: "#edf7ff", fontFamily: "'Orbitron', monospace", fontSize: 14, fontWeight: 700, marginBottom: 6, letterSpacing: "0.02em" }
    }, sp.name + (sp.href ? "  →" : "")),
    React.createElement("div", {
      style: { color: "#a8bfd6", fontSize: 12, lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace" }
    }, sp.blurb)
  );
}

const sectionStyle = {
  position: "relative", zIndex: 2,
  padding: "60px 16px",
  maxWidth: 1180, margin: "0 auto",
};

Object.assign(window, { StackSection, ExperienceSection, AboutSection, ContactSection });
