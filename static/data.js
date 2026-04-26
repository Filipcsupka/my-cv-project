// CV data extracted from the original repo
window.CV_DATA = {
  name: "FILIP CSUPKA",
  status: "talent.io/v1alpha1 · UniversalSoldier/filip-csupka",
  statusBadge: "Running",
  roles: [
    "DevOps Engineer",
    "SRE Specialist",
    "Kubernetes Architect",
    "GitOps Practitioner",
    "Platform Engineer",
    "OpenShift Expert",
  ],
  subtitle:
    "Building resilient Kubernetes platforms, GitOps delivery and observability while learning fast enough to look suspicious.",
  summary:
    "DevOps / SRE engineer focused on Kubernetes, OpenShift, GitOps and observability. I like platforms that are boring in production, fast for developers, and documented well enough that future-me does not need a detective board.",

  // STACK — built bottom-up: each layer reveals as you scroll, lower layers settle in,
  // upper layers stack on top. Layers are the actual abstraction order in a platform.
  stackLayers: [
    {
      key: "linux",
      tier: "L0",
      title: "Linux / Network / Security",
      blurb: "shell · networking · syscalls · firewalls · troubleshooting",
      color: "#FCC624",
      tools: ["systemd", "iptables", "tcpdump", "strace", "bash", "ssh"],
      magic: "ground truth — every layer above is just YAML over this",
    },
    {
      key: "metal",
      tier: "L1",
      title: "Compute / Cloud / VM",
      blurb: "Hetzner · AKS · AWS · HUB/SPOKE private cloud · bare metal",
      color: "#d50c2d",
      tools: ["Hetzner", "AKS", "AWS", "Bare-metal", "VMs"],
      magic: "physical and virtual nodes joined into one fleet",
    },
    {
      key: "containers",
      tier: "L2",
      title: "Docker / Containers",
      blurb: "images · registries · OCI runtimes · CRI",
      color: "#2496ED",
      tools: ["Docker", "containerd", "OCI", "GHCR"],
      magic: "ship the same artefact from laptop to production",
    },
    {
      key: "orchestration",
      tier: "L3",
      title: "Kubernetes / OpenShift",
      blurb: "schedulers · operators · lifecycle · multi-tenant clusters",
      color: "#326CE5",
      tools: ["Kubernetes", "OpenShift", "AKS", "k3s", "Operators"],
      magic: "self-healing workloads, declared not clicked",
    },
    {
      key: "packaging",
      tier: "L4",
      title: "Helm / Packaging",
      blurb: "charts · overlays · operators · sealed secrets",
      color: "#42e0ff",
      tools: ["Helm", "Kustomize", "Sealed Secrets", "OLM"],
      magic: "version-pinned, reviewable, repeatable installs",
    },
    {
      key: "iac",
      tier: "L5",
      title: "IaC / Terraform",
      blurb: "modules · state · idempotent provisioning",
      color: "#7B42BC",
      tools: ["Terraform", "Ansible", "Modules"],
      magic: "infrastructure as a pull request",
    },
    {
      key: "cicd",
      tier: "L6",
      title: "CI/CD Pipelines",
      blurb: "build → test → image → push → tag",
      color: "#e2eaf4",
      tools: ["GitHub Actions", "GitLab CI", "Runners"],
      magic: "every commit rides the same pipe",
    },
    {
      key: "gitops",
      tier: "L7",
      title: "GitOps / ArgoCD",
      blurb: "git as source of truth · drift detection · auto-sync",
      color: "#EF7B4D",
      tools: ["ArgoCD", "App-of-Apps", "Sync Waves"],
      magic: "the cluster reconciles itself toward main",
    },
    {
      key: "data",
      tier: "L8",
      title: "Data Services",
      blurb: "Kafka · PostgreSQL · MongoDB · connectors",
      color: "#5cffb1",
      tools: ["Kafka", "PostgreSQL", "MongoDB", "Kafka Connect"],
      magic: "events flow through services, debugged across teams",
    },
    {
      key: "observability",
      tier: "L9",
      title: "Observability",
      blurb: "metrics · logs · traces · alerts",
      color: "#F46800",
      tools: ["Prometheus", "Grafana", "Loki", "Tempo", "Alloy"],
      magic: "answers before incidents grow up",
    },
    {
      key: "ai",
      tier: "L10",
      title: "AI / DevEx",
      blurb: "Claude Code · Codex · MCP · agent skills",
      color: "#a78bfa",
      tools: ["Claude Code", "Codex", "MCP"],
      magic: "supervised by reality, no matter how loud the AI",
    },
  ],

  // EXPERIENCE TABLE
  experience: [
    {
      id: "openshift-private-cloud",
      title: "Private-cloud OpenShift operations",
      focus: "HUB/SPOKE clusters, upgrades, operators, production reliability",
      summary: "Keeping regulated OpenShift platforms healthy while planning upgrades like production is allergic to drama.",
      highlights: [
        "Operate HUB/SPOKE private-cloud clusters with attention to monitoring, configuration drift and incident response.",
        "Use custom Helm charts to manage most of the cluster core infrastructure and operators, because clicking through cluster setup is not a personality trait.",
        "Plan and validate OpenShift and operator lifecycle upgrades before production gets invited to the party.",
        "Maintain GitLab CI/CD delivery patterns and runner tags so the right pipeline lands on the right executor instead of choosing chaos.",
        "Built a lab topology to prove the upgrade path, rollback plan and operational checklist before touching live clusters.",
      ],
      tags: ["OpenShift", "Red Hat", "HUB/SPOKE", "Operators", "GitOps", "GitLab CI/CD", "Helm", "Runbooks"],
    },
    {
      id: "healthcare-platforms",
      title: "Healthcare platform engineering",
      focus: "AKS, Hetzner, multi-tenant Kubernetes, GitOps delivery",
      summary: "Building and operating clusters for hospital software where every namespace wants privacy, uptime and a little emotional support.",
      highlights: [
        "Operate multiple AKS clusters and a larger Hetzner Kubernetes platform across development, test, production and customer-dedicated environments.",
        "Own GitOps delivery from container build to ArgoCD sync, using Kustomize, Helm and sealed secrets to keep releases reproducible.",
        "Scaled a multi-tenant cluster to thousands of pods with namespace isolation, quotas and enough observability to answer questions before they become incidents.",
        "Debug service connectivity, PostgreSQL, MongoDB, Kafka flows and tracing issues across teams when the symptom says one thing and the root cause says another.",
      ],
      tags: ["AKS", "Hetzner", "ArgoCD", "GitLab CI", "Kustomize", "Helm", "Kafka", "PostgreSQL", "MongoDB", "Loki", "Tempo"],
    },
    {
      id: "cloud-foundations",
      title: "Cloud infrastructure foundations",
      focus: "AWS fundamentals, infrastructure thinking, delivery discipline",
      summary: "Moved deeper into cloud architecture and learned that most outages are just undocumented assumptions wearing a hoodie.",
      highlights: [
        "Worked on AWS-oriented infrastructure topics and prepared toward Solutions Architect Associate level knowledge.",
        "Strengthened the habit of designing for repeatability, recovery and operational ownership instead of only getting things deployed once.",
      ],
      tags: ["AWS", "Cloud Architecture", "Operations", "Reliability"],
    },
    {
      id: "team-leadership",
      title: "Technical leadership and migrations",
      focus: "team leadership, groupware migrations, customer coordination",
      summary: "Led admins, migrations and vendor conversations; translated business urgency into technical work without losing the plot.",
      highlights: [
        "Provided technical leadership, mentoring and delivery coordination for an administration team.",
        "Supported rollouts, migrations and documentation across collaboration platforms.",
        "Kept customers, vendors and internal teams aligned when timelines were optimistic and reality had comments.",
      ],
      tags: ["Leadership", "Migration", "Exchange", "Teams", "Documentation"],
    },
    {
      id: "enterprise-operations",
      title: "Enterprise operations",
      focus: "service quality, people coordination, operational discipline",
      summary: "The earlier ops years: people, process, uptime and the discovery that clear communication fixes more tickets than heroic typing.",
      highlights: [
        "Coordinated administration work, team health and service quality for enterprise environments.",
        "Worked with department leads and customers on priorities, escalations and operational improvements.",
        "Built the practical foundation for later SRE work: measure, communicate, automate, repeat.",
      ],
      tags: ["Operations", "Service Management", "Leadership", "Customer Support"],
    },
  ],

  // SKILL MATRIX TABLE
  skills: [
    { name: "Orchestration",      note: "Clusters, workloads, upgrades and the occasional pod that needs a calm conversation.", level: 0.92, tags: ["Kubernetes", "OpenShift", "AKS", "Helm", "Kustomize", "Docker"] },
    { name: "GitOps & automation", note: "Deployments should be reviewable, repeatable and less dependent on someone remembering the magic command.", level: 0.88, tags: ["ArgoCD", "GitLab CI", "GitHub Actions", "Terraform", "Sealed Secrets"] },
    { name: "Observability",      note: "Dashboards that answer real questions; alerts that try not to ruin dinner.", level: 0.84, tags: ["Prometheus", "Grafana", "Loki", "Tempo", "Alloy", "Tracing"] },
    { name: "Data & messaging",   note: "Enough database and streaming knowledge to debug cross-service mysteries without blaming the network.", level: 0.74, tags: ["Kafka", "MongoDB", "PostgreSQL", "Kafka Connect"] },
  ],

  languages: [
    { lang: "Slovak",  level: 1.0, note: "native" },
    { lang: "English", level: 0.85, note: "professional" },
    { lang: "Czech",   level: 0.78, note: "comfortably understood" },
  ],

  // ABOUT TABLE
  about: [
    { key: "Energy",   val: "Hybrid athlete, every-sport enjoyer, master of none, happily over-scheduled by choice.", color: "#5cffb1" },
    { key: "Home lab", val: "Hosts this web and my wife's web on Hetzner Kubernetes because a simple VPS would be suspiciously reasonable.", color: "#42e0ff" },
    { key: "Family",   val: "Free time belongs to my kid first. The cluster can wait; childhood does not have retry logic.", color: "#ffc64a" },
    { key: "AI mode",  val: "Since AI found me, I became a workaholic who occasionally thinks he can do everything alone. Then production politely disagrees.", color: "#ff5f80" },
    { key: "Typos",    val: "If you find a typo in the repo, it is probably already labeled with my name.", color: "#a78bfa" },
  ],

  notes: [
    "Map the unknown, test it, document it, automate it.",
    "Turn vague production pain into dashboards, runbooks, and pipelines.",
    "Sit between dev, ops, and management without losing the YAML.",
    "Repeatable automation > heroic typing.",
    "Clusters supervised by reality, no matter how loud the AI.",
  ],

  // CONTACT TABLE
  contact: [
    { key: "Location", val: "Kosice, Slovakia" },
    { key: "Role",     val: "DevOps / SRE / Kubernetes Engineer" },
    { key: "Mobile",   val: "0919 235 462", href: "tel:+421919235462" },
    { key: "Email",    val: "devopssro@gmail.com", href: "mailto:devopssro@gmail.com" },
    { key: "GitHub",   val: "github.com/Filipcsupka", href: "https://github.com/Filipcsupka" },
    { key: "LinkedIn", val: "linkedin.com/in/filip-csupka", href: "https://linkedin.com/in/filip-csupka-21a26713a" },
    { key: "Status",   val: "Open to remote / relocation" },
  ],

  sideProjects: [
    {
      name: "vevsdesign.sk",
      href: "https://vevsdesign.sk",
      tagline: "wife's design studio",
      blurb: "Hosted on my home Hetzner Kubernetes cluster, deployed via GitOps. Same pipeline as this CV.",
      color: "#a78bfa",
    },
    {
      name: "filip-cv",
      href: "https://github.com/Filipcsupka/cv-web",
      tagline: "this site",
      blurb: "React · Babel-standalone · Docker · nginx · K8s · Cloudflare Tunnel. No build step.",
      color: "#42e0ff",
    },
    {
      name: "home-lab",
      href: null,
      tagline: "personal cluster",
      blurb: "Hetzner Kubernetes running production-style: ArgoCD, sealed secrets, Prometheus, the whole stack on a budget.",
      color: "#5cffb1",
    },
  ],
};
