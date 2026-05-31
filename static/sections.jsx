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

  let activeIdx = 0;
  layers.forEach((_, i) => {
    const lp = startP + i * step;
    if (Math.max(0, Math.min(1, (p - lp) * 12)) > 0.45) activeIdx = i;
  });

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
              <LayerLog key={layer.key} layer={layer} idx={i} reveal={reveal} settled={settled} t={t} active={i === activeIdx} />
            );
          })}
        </div>

        <div style={isMobile
          ? { height: "min(460px, 78vw)", marginTop: 8 }
          : { position: "sticky", top: 80, height: "min(660px, 82vh)" }
        }>
          <StackTower layers={layers} progress={p} startP={startP} step={step} activeIdx={activeIdx} isMobile={isMobile} />
        </div>
      </div>
    </section>
  );
}

function LayerLog({ layer, idx, reveal, settled, t, active }) {
  const [hover, setHover] = useS(false);
  const live = (Math.sin(t * 1.6 + idx * 0.7) + 1) / 2;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        opacity: active ? 1 : 0.25 + reveal * 0.75,
        transform: `translateX(${(1 - reveal) * -28}px) scale(${active ? 1.015 : 1})`,
        transition: "opacity 0.25s, transform 0.25s, box-shadow 0.25s, background 0.25s",
        padding: "14px 16px 14px 22px",
        background: active
          ? `linear-gradient(90deg, ${layer.color}22, ${layer.color}06 55%, transparent)`
          : settled > 0.5
          ? `linear-gradient(90deg, ${layer.color}14, transparent 60%)`
          : "transparent",
        borderRadius: 8,
        boxShadow: active ? `inset 3px 0 0 ${layer.color}, 0 0 26px ${layer.color}1f` : "none",
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

/* ─── STACK TOWER — the platform these layers build, in faux-3D ───── */
function StackTower({ layers, progress, startP, step, activeIdx, isMobile }) {
  const t = useTick();
  const bob = Math.sin(t * 0.7) * (isMobile ? 3 : 6);

  const n = layers.length;
  const gap = isMobile ? 28 : 38;
  const plateW = isMobile ? 150 : 230;
  const plateH = isMobile ? 92 : 132;
  const baseScale = isMobile ? 0.8 : 1;

  const settledArr = layers.map((_, i) => {
    const lp = startP + i * step;
    return Math.max(0, Math.min(1, (progress - lp - 0.04) * 14));
  });
  const deployed = settledArr.filter((s) => s > 0.5).length;
  const active = layers[activeIdx] || layers[0];

  return (
    <div style={{
      width: "100%", height: "100%", position: "relative",
      borderRadius: 14, overflow: "hidden",
      border: "1px solid rgba(66,224,255,0.16)",
      background: "radial-gradient(120% 90% at 50% 16%, rgba(12,39,67,0.55), rgba(2,11,22,0.97))",
      boxShadow: "inset 0 0 90px rgba(66,224,255,0.05)",
    }}>
      {/* status bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 6,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 14px",
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
        color: "#5f7f9e", letterSpacing: "0.06em",
        background: "linear-gradient(180deg, rgba(2,11,22,0.92), transparent)",
        pointerEvents: "none",
      }}>
        <span>⸬ platform.stack</span>
        <span style={{ color: "#5cffb1" }}>{deployed}/{n} layers ▲</span>
      </div>

      {/* iso stage */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden",
        perspective: 1400, perspectiveOrigin: "50% 40%",
      }}>
        {/* grid floor */}
        <div style={{
          position: "absolute", left: "50%", top: "64%",
          width: 540, height: 540, marginLeft: -270, marginTop: -270,
          transform: `rotateX(60deg) rotateZ(-42deg) scale(${baseScale})`,
          backgroundImage:
            "linear-gradient(rgba(66,224,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(66,224,255,0.09) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.45,
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 28%, transparent 70%)",
          maskImage: "radial-gradient(circle at 50% 50%, #000 28%, transparent 70%)",
        }} />

        {/* tower */}
        <div style={{
          position: "absolute", left: "50%", top: "57%",
          transformStyle: "preserve-3d",
          transform: `translate(-50%,-50%) scale(${baseScale}) rotateX(60deg) rotateZ(-42deg) translateZ(${bob}px)`,
        }}>
          {layers.map((layer, i) => {
            const lp = startP + i * step;
            const reveal = Math.max(0, Math.min(1, (progress - lp) * 12));
            const settled = settledArr[i];
            if (reveal < 0.02) return null;
            const isActive = i === activeIdx;
            const z = i * gap + (isActive ? 15 : 0) + (1 - reveal) * 90;
            const pulse = (Math.sin(t * 1.6 + i * 0.5) + 1) / 2;
            const hot = Math.floor(pulse * layer.tools.length);

            return (
              <div key={layer.key} style={{
                position: "absolute",
                width: plateW, height: plateH,
                left: -plateW / 2, top: -plateH / 2,
                transform: `translateZ(${z}px)`,
                transformStyle: "preserve-3d",
                opacity: reveal,
                transition: "opacity 0.25s",
              }}>
                {/* slab face */}
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 18,
                  background: `linear-gradient(135deg, ${layer.color}28, ${layer.color}0a 55%, ${layer.color}16)`,
                  border: `1px solid ${layer.color}${isActive ? "" : "66"}`,
                  boxShadow: isActive
                    ? `0 0 38px ${layer.color}88, inset 0 0 34px ${layer.color}26`
                    : `0 0 16px ${layer.color}30, inset 0 0 22px ${layer.color}12`,
                  backdropFilter: "blur(3px)",
                }} />
                {/* top sheen */}
                <div style={{
                  position: "absolute", left: 0, right: 0, top: 0, height: "44%",
                  borderRadius: "18px 18px 60% 60%",
                  background: `linear-gradient(180deg, ${layer.color}22, transparent)`,
                  pointerEvents: "none",
                }} />
                {/* tier code */}
                <div style={{
                  position: "absolute", left: 16, top: 11,
                  fontFamily: "'Orbitron', monospace", fontWeight: 800,
                  fontSize: plateW > 180 ? 17 : 13,
                  color: layer.color, letterSpacing: "0.12em",
                  textShadow: `0 0 12px ${layer.color}`,
                }}>{layer.tier}</div>
                {/* svc count */}
                <div style={{
                  position: "absolute", right: 14, top: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9.5, color: layer.color, opacity: 0.75,
                }}>{layer.tools.length}×svc</div>
                {/* tool dots */}
                <div style={{
                  position: "absolute", left: 16, right: 14, bottom: 27,
                  display: "flex", gap: 7, flexWrap: "wrap",
                }}>
                  {layer.tools.map((tool, k) => (
                    <span key={tool} style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: layer.color,
                      opacity: settled > 0.5 ? (k === hot ? 1 : 0.4) : 0.18,
                      boxShadow: k === hot ? `0 0 ${4 + pulse * 6}px ${layer.color}` : "none",
                      transition: "opacity 0.2s",
                    }} />
                  ))}
                </div>
                {/* title */}
                <div style={{
                  position: "absolute", left: 16, right: 14, bottom: 9,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: plateW > 180 ? 10.5 : 8.5,
                  color: "#cfe7ff", opacity: 0.7,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{layer.title}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* active-layer HUD */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 6,
        padding: "12px 16px 14px",
        background: "linear-gradient(0deg, rgba(2,11,22,0.97), rgba(2,11,22,0.6) 70%, transparent)",
        borderTop: `1px solid ${active.color}33`,
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
          <span style={{
            width: 9, height: 9, borderRadius: "50%", background: active.color,
            boxShadow: `0 0 10px ${active.color}`,
          }} />
          <span style={{ color: active.color, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em" }}>
            {active.tier}
          </span>
          <span style={{ color: "#edf7ff", fontSize: 13, fontFamily: "'Orbitron', monospace", fontWeight: 700, letterSpacing: "0.03em" }}>
            {active.title}
          </span>
          <span style={{ marginLeft: "auto", color: "#5f7f9e", fontSize: 10 }}>
            {String(activeIdx + 1).padStart(2, "0")}/{String(n).padStart(2, "0")}
          </span>
        </div>
        <div style={{ color: "#5f7f9e", fontSize: 10.5, lineHeight: 1.5, fontStyle: "italic" }}>
          ⸬ {active.magic}
        </div>
        <div style={{ marginTop: 10, height: 3, borderRadius: 2, background: "rgba(66,224,255,0.08)", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${((activeIdx + 1) / n) * 100}%`,
            background: `linear-gradient(90deg, ${active.color}, ${active.color}88)`,
            boxShadow: `0 0 8px ${active.color}`,
            transition: "width 0.3s",
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
