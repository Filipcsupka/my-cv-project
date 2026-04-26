/* global React, ReactDOM */
const Root = () => {
  const sy = useScrollY();
  const t = useTick();
  const [navOpen, setNavOpen] = React.useState(false);

  const [active, setActive] = React.useState("hero");
  React.useEffect(() => {
    const ids = ["hero", "stack", "experience", "about", "contact"];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id);
      }),
      { threshold: 0.25 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const docH = typeof document !== "undefined" ? document.documentElement.scrollHeight - window.innerHeight : 1;
  const scrollPct = Math.max(0, Math.min(1, sy / Math.max(1, docH)));

  const navItems = [
    { id: "hero", label: "status" },
    { id: "stack", label: "stack" },
    { id: "experience", label: "experience" },
    { id: "about", label: "about" },
    { id: "contact", label: "contact" },
  ];

  return (
    <div style={{
      background: "#03101f", color: "#edf7ff", minHeight: "100vh",
      fontFamily: "'JetBrains Mono', monospace", position: "relative",
    }}>
      <ClusterBackground />

      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 2,
        zIndex: 100, background: "rgba(66,224,255,0.08)",
      }}>
        <div style={{
          height: "100%", width: `${scrollPct * 100}%`,
          background: "linear-gradient(90deg, #42e0ff, #5cffb1)",
          boxShadow: "0 0 12px #42e0ff",
          transition: "width 0.05s linear",
        }} />
      </div>

      <nav style={{
        position: "fixed", top: 2, left: 0, right: 0, zIndex: 50,
        padding: "10px 22px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 14,
        background: sy > 40 ? "rgba(2,8,16,0.92)" : "transparent",
        backdropFilter: sy > 40 ? "blur(12px)" : "none",
        borderBottom: sy > 40 ? "1px solid #24577e" : "1px solid transparent",
        transition: "all 0.3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <span style={{
            color: "#5cffb1",
            opacity: 0.6 + (Math.sin(t * 4) + 1) / 2 * 0.4,
          }}>●</span>
          <span style={{ color: "#42e0ff", fontWeight: 700 }}>filip</span>
          <span style={{ color: "#5f7f9e" }}>@</span>
          <span style={{ color: "#a8bfd6" }}>sre-cluster</span>
          <span style={{ color: "#42e0ff" }}>:~$</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {navItems.map((n) => (
            <a key={n.id} href={`#${n.id}`} style={{
              padding: "5px 12px", borderRadius: 4, fontSize: 11,
              letterSpacing: "0.06em", textDecoration: "none",
              color: active === n.id ? "#42e0ff" : "#5f7f9e",
              background: active === n.id ? "rgba(66,224,255,0.1)" : "transparent",
              border: active === n.id ? "1px solid rgba(66,224,255,0.3)" : "1px solid transparent",
              fontFamily: "'JetBrains Mono', monospace",
              transition: "all 0.2s",
            }}>
              {n.label}
            </a>
          ))}
        </div>
      </nav>

      <div style={{
        position: "fixed", right: 18, top: "50%", transform: "translateY(-50%)",
        zIndex: 40, display: "flex", flexDirection: "column", gap: 8,
      }}>
        {navItems.map((n) => (
          <a key={n.id} href={`#${n.id}`} style={{
            display: "block", width: 28, height: 28,
            borderRadius: "50%",
            border: `1px solid ${active === n.id ? "#42e0ff" : "rgba(66,224,255,0.18)"}`,
            background: active === n.id ? "rgba(66,224,255,0.18)" : "rgba(7,27,49,0.5)",
            position: "relative",
            transition: "all 0.2s",
          }} title={n.label}>
            <span style={{
              position: "absolute", inset: 8, borderRadius: "50%",
              background: active === n.id ? "#42e0ff" : "rgba(66,224,255,0.3)",
              boxShadow: active === n.id ? "0 0 10px #42e0ff" : "none",
            }} />
          </a>
        ))}
      </div>

      <Hero />
      <StackSection />
      <ExperienceSection />
      <AboutSection />
      <ContactSection />

      <footer style={{
        position: "relative", zIndex: 2,
        borderTop: "1px solid #24577e", padding: 24, textAlign: "center",
        fontSize: 11, color: "#5f7f9e",
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        © 2026 Filip Csupka · Running on <span style={{ color: "#42e0ff" }}>Kubernetes</span> · <span style={{ color: "#5cffb1" }}>● healthy</span>
      </footer>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
