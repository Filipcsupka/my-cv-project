"use client";

import { useState } from "react";

type Lang = "en" | "sk";

type Experience = {
  id: string;
  title: string;
  focus: string;
  summary: string;
  highlights: string[];
  tags: string[];
};

type SkillGroup = {
  name: string;
  note: string;
  tags: string[];
};

const CONTENT: Record<
  Lang,
  {
    file: string;
    summary: string;
    notes: string[];
    experience: Experience[];
    skills: SkillGroup[];
    languages: string[];
    labels: {
      available: string;
      summary: string;
      operatingNotes: string;
      experience: string;
      focus: string;
      highlights: string;
      tags: string;
      skillMatrix: string;
      languages: string;
      status: string;
      reason: string;
    };
  }
> = {
  en: {
    file: "filip-csupka.en.yaml",
    summary:
      "DevOps / SRE engineer focused on Kubernetes, OpenShift, GitOps and observability. I like platforms that are boring in production, fast for developers, and documented well enough that future-me does not need a detective board.",
    notes: [
      "I like learning. Most of the time I do not know exactly what I am doing at the start, and that is the point: map the unknown, test it, document it, automate it.",
      "Turns vague production pain into dashboards, runbooks, pipelines and fewer midnight surprises.",
      "Comfortable between developers, operations, management and the YAML stack that started the meeting.",
      "Strong preference for repeatable automation; manual clicks are acceptable only when they are in a museum.",
      "Since AI found me, I have become a workaholic who occasionally believes he can build everything alone. The clusters are still supervised by reality.",
    ],
    experience: [
      {
        id: "openshift-private-cloud",
        title: "Experience with private-cloud OpenShift operations",
        focus: "HUB/SPOKE clusters, upgrades, operators, production reliability",
        summary:
          "Keeping regulated OpenShift platforms healthy while planning upgrades like production is allergic to drama.",
        highlights: [
          "Operate HUB/SPOKE private-cloud clusters with attention to monitoring, configuration drift and incident response.",
          "Use custom Helm charts to manage most of the cluster core infrastructure and operators, because clicking through cluster setup is not a personality trait.",
          "Plan and validate OpenShift and operator lifecycle upgrades before production gets invited to the party.",
          "Maintain GitLab CI/CD delivery patterns and runner tags so the right pipeline lands on the right executor instead of choosing chaos.",
          "Built a lab topology to prove the upgrade path, rollback plan and operational checklist before touching live clusters.",
        ],
        tags: ["OpenShift", "Red Hat", "HUB/SPOKE", "Operators", "GitOps", "GitLab CI/CD", "Custom Helm Charts", "Runbooks"],
      },
      {
        id: "healthcare-platforms",
        title: "Experience with healthcare platform engineering",
        focus: "AKS, Hetzner, multi-tenant Kubernetes, GitOps delivery",
        summary:
          "Building and operating clusters for hospital software where every namespace wants privacy, uptime and a little emotional support.",
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
        title: "Experience with cloud infrastructure foundations",
        focus: "AWS fundamentals, infrastructure thinking, delivery discipline",
        summary:
          "Moved deeper into cloud architecture and learned that most outages are just undocumented assumptions wearing a hoodie.",
        highlights: [
          "Worked on AWS-oriented infrastructure topics and prepared toward Solutions Architect Associate level knowledge.",
          "Strengthened the habit of designing for repeatability, recovery and operational ownership instead of only getting things deployed once.",
        ],
        tags: ["AWS", "Cloud Architecture", "Operations", "Reliability"],
      },
      {
        id: "team-leadership",
        title: "Experience with technical leadership and migrations",
        focus: "team leadership, groupware migrations, customer coordination",
        summary:
          "Led admins, migrations and vendor conversations; translated business urgency into technical work without losing the plot.",
        highlights: [
          "Provided technical leadership, mentoring and delivery coordination for an administration team.",
          "Supported rollouts, migrations and documentation across collaboration platforms.",
          "Kept customers, vendors and internal teams aligned when timelines were optimistic and reality had comments.",
        ],
        tags: ["Leadership", "Migration", "Exchange", "Teams", "Documentation"],
      },
      {
        id: "enterprise-operations",
        title: "Experience with enterprise operations",
        focus: "service quality, people coordination, operational discipline",
        summary:
          "The earlier ops years: people, process, uptime and the discovery that clear communication fixes more tickets than heroic typing.",
        highlights: [
          "Coordinated administration work, team health and service quality for enterprise environments.",
          "Worked with department leads and customers on priorities, escalations and operational improvements.",
          "Built the practical foundation for later SRE work: measure, communicate, automate, repeat.",
        ],
        tags: ["Operations", "Service Management", "Leadership", "Customer Support"],
      },
    ],
    skills: [
      {
        name: "Orchestration",
        note: "Clusters, workloads, upgrades and the occasional pod that needs a calm conversation.",
        tags: ["Kubernetes", "OpenShift", "AKS", "Helm", "Kustomize", "Docker"],
      },
      {
        name: "GitOps & automation",
        note: "Deployments should be reviewable, repeatable and less dependent on someone remembering the magic command.",
        tags: ["ArgoCD", "GitLab CI", "GitHub Actions", "Terraform", "Sealed Secrets"],
      },
      {
        name: "Observability",
        note: "Dashboards that answer real questions; alerts that try not to ruin dinner.",
        tags: ["Prometheus", "Grafana", "Loki", "Tempo", "Alloy", "Tracing"],
      },
      {
        name: "Data & messaging",
        note: "Enough database and streaming knowledge to debug cross-service mysteries without blaming the network by default.",
        tags: ["Kafka", "MongoDB", "PostgreSQL", "Kafka Connect"],
      },
    ],
    languages: ["Slovak - native", "English - professional", "Czech - comfortably understood"],
    labels: {
      available: "true",
      summary: "summary",
      operatingNotes: "operating_notes",
      experience: "experience",
      focus: "focus",
      highlights: "highlights",
      tags: "tags",
      skillMatrix: "skill_matrix",
      languages: "languages",
      status: "status",
      reason: "reason",
    },
  },
  sk: {
    file: "filip-csupka.sk.yaml",
    summary:
      "DevOps / SRE inzinier zamerany na Kubernetes, OpenShift, GitOps a observabilitu. Mam rad platformy, ktore su v produkcii nudne, pre vyvojarov rychle a zdokumentovane tak, aby buduce ja nemuselo robit archeologiu.",
    notes: [
      "Rad sa ucim. Vacsinou na zaciatku presne neviem, co robim, a presne o to ide: zmapovat nezname, otestovat, zdokumentovat a zautomatizovat.",
      "Premienam nejasnu produkcnu bolest na dashboardy, runbooky, pipeline a menej nocnych prekvapeni.",
      "Viem sediet medzi vyvojom, prevadzkou, manazmentom a YAML subormi, ktore sa tvaria ako architektura.",
      "Preferujem opakovatelnu automatizaciu; rucne klikanie patri skor do muzea ako do deploy procesu.",
      "Odkedy si ma nasla AI, som workoholik, ktory si obcas mysli, ze sam postavi vsetko. Realita stale robi code review.",
    ],
    experience: [
      {
        id: "openshift-private-cloud",
        title: "Skusenost s prevadzkou private-cloud OpenShiftu",
        focus: "HUB/SPOKE clustre, upgrady, operatory, produkcna stabilita",
        summary:
          "Starostlivost o regulovane OpenShift platformy, kde upgrade planujem tak, aby produkcia nemala dovod dramatizovat.",
        highlights: [
          "Prevadzka HUB/SPOKE private-cloud clustrov so zameranim na monitoring, konfiguracny drift a riesenie incidentov.",
          "Pouzivanie custom Helm chartov na spravu vacsiny cluster core infrastruktury a operatorov, lebo klikat cluster setup nie je zivotny ciel.",
          "Planovanie a validacia OpenShift a operator upgrade cyklov pred tym, nez sa k slovu dostane produkcia.",
          "Sprava GitLab CI/CD delivery vzorov a runner tagov, aby pipeline trafila spravny executor a nie nahodny osud.",
          "Vytvorenie lab topologie pre overenie upgrade postupu, rollbacku a operacneho checklistu.",
        ],
        tags: ["OpenShift", "Red Hat", "HUB/SPOKE", "Operators", "GitOps", "GitLab CI/CD", "Custom Helm Charts", "Runbooks"],
      },
      {
        id: "healthcare-platforms",
        title: "Skusenost s platformami pre zdravotnicky softver",
        focus: "AKS, Hetzner, multi-tenant Kubernetes, GitOps delivery",
        summary:
          "Budovanie a prevadzka clustrov pre nemocnicny softver, kde kazdy namespace chce sukromie, dostupnost a obcas aj trochu podpory.",
        highlights: [
          "Prevadzka viacerych AKS clustrov a vacsej Hetzner Kubernetes platformy napriec dev, test, prod a customer-dedicated prostrediami.",
          "End-to-end GitOps delivery od buildu kontajnera po ArgoCD sync s Kustomize, Helm a sealed secrets.",
          "Skalovanie multi-tenant clustra na tisice podov s namespace izolaciou, kvotami a observabilitou, ktora odpoveda skor ako incident narastie.",
          "Diagnostika service connectivity, PostgreSQL, MongoDB, Kafka flow a tracing problemov napriec timami.",
        ],
        tags: ["AKS", "Hetzner", "ArgoCD", "GitLab CI", "Kustomize", "Helm", "Kafka", "PostgreSQL", "MongoDB", "Loki", "Tempo"],
      },
      {
        id: "cloud-foundations",
        title: "Skusenost s cloud infrastructure foundation",
        focus: "AWS zaklady, infrastruktura, delivery disciplina",
        summary:
          "Hlbsi presun do cloud architektury a zistenie, ze vacsina incidentov su len nezdokumentovane predpoklady v mikine.",
        highlights: [
          "Praca na AWS orientovanych infrastrukturnych temach a priprava na uroven Solutions Architect Associate znalosti.",
          "Posilnenie navrhu pre opakovatelnost, obnovu a operacne vlastnictvo, nie iba pre jednorazovy deploy.",
        ],
        tags: ["AWS", "Cloud Architecture", "Operations", "Reliability"],
      },
      {
        id: "team-leadership",
        title: "Skusenost s technickym leadershipom a migraciami",
        focus: "vedenie timu, groupware migracie, koordinacia so zakaznikom",
        summary:
          "Vedenie adminov, migracii a vendor rozhovorov; preklad biznis naliehavosti do technickej prace bez straty pointy.",
        highlights: [
          "Technicke vedenie, mentoring a delivery koordinacia administracneho timu.",
          "Podpora rolloutov, migracii a dokumentacie pre collaboration platformy.",
          "Zladenie zakaznikov, vendorov a internych timov, aj ked timeline bol optimisticky a realita mala pripomienky.",
        ],
        tags: ["Leadership", "Migration", "Exchange", "Teams", "Documentation"],
      },
      {
        id: "enterprise-operations",
        title: "Skusenost s enterprise prevadzkou",
        focus: "kvalita sluzieb, koordinacia ludi, operacna disciplina",
        summary:
          "Skorsie ops roky: ludia, proces, dostupnost a poznanie, ze jasna komunikacia vyriesi viac ticketov nez heroicke pisanie do terminalu.",
        highlights: [
          "Koordinacia administracnej prace, zdravia timu a kvality sluzieb v enterprise prostrediach.",
          "Spolupraca s veducimi oddeleni a zakaznikmi na prioritach, eskalaciach a zlepseniach prevadzky.",
          "Prakticky zaklad pre neskorsi SRE pristup: meraj, komunikuj, automatizuj, opakuj.",
        ],
        tags: ["Operations", "Service Management", "Leadership", "Customer Support"],
      },
    ],
    skills: [
      {
        name: "Orchestrace",
        note: "Clustre, workloady, upgrady a obcas pod, ktory potrebuje pokojny rozhovor.",
        tags: ["Kubernetes", "OpenShift", "AKS", "Helm", "Kustomize", "Docker"],
      },
      {
        name: "GitOps & automatizacia",
        note: "Deploy ma byt reviewovatelny, opakovatelny a menej zavisly od toho, kto si pamata magicky prikaz.",
        tags: ["ArgoCD", "GitLab CI", "GitHub Actions", "Terraform", "Sealed Secrets"],
      },
      {
        name: "Observabilita",
        note: "Dashboardy, ktore odpovedaju na realne otazky; alerty, ktore sa snazia nepokazit veceru.",
        tags: ["Prometheus", "Grafana", "Loki", "Tempo", "Alloy", "Tracing"],
      },
      {
        name: "Data & messaging",
        note: "Dostatok databazovej a streaming praxe na debug krizovych zahad bez automatickeho obvinenia siete.",
        tags: ["Kafka", "MongoDB", "PostgreSQL", "Kafka Connect"],
      },
    ],
    languages: ["Slovencina - native", "Anglictina - professional", "Cestina - bezpecne rozumiem"],
    labels: {
      available: "true",
      summary: "zhrnutie",
      operatingNotes: "prevadzkove_poznamky",
      experience: "skusenosti",
      focus: "zameranie",
      highlights: "vysledky",
      tags: "tagy",
      skillMatrix: "skill_matrix",
      languages: "jazyky",
      status: "status",
      reason: "dovod",
    },
  },
};

const MONO: { fontFamily: string; fontSize: string; lineHeight: string } = {
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  fontSize: "12px",
  lineHeight: "1.8",
};

const T = {
  kw: (s: string) => <span style={{ color: "#ff5f8f", fontWeight: 600 }}>{s}</span>,
  key: (s: string) => <span style={{ color: "var(--accent-cyan)" }}>{s}</span>,
  str: (s: string) => <span style={{ color: "#f3e99a" }}>{s}</span>,
  run: (s: string) => <span style={{ color: "var(--accent-green)" }}>{s}</span>,
  dim: (s: string) => <span style={{ color: "rgba(226,234,244,0.34)" }}>{s}</span>,
  cmt: (s: string) => <span style={{ color: "rgba(226,234,244,0.26)", fontStyle: "italic" }}># {s}</span>,
};

function L({ n = 0, children }: { n?: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        ...MONO,
        paddingLeft: `${n * 14}px`,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {children}
    </div>
  );
}

function Blank() {
  return <div style={{ height: "8px" }} />;
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            border: "1px solid rgba(66, 190, 255, 0.25)",
            background: "rgba(66, 190, 255, 0.06)",
            borderRadius: "4px",
            color: "var(--accent-cyan)",
            fontSize: "11px",
            padding: "3px 8px",
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function ExpEntry({
  job,
  labels,
  open,
  onToggle,
}: {
  job: Experience;
  labels: (typeof CONTENT)["en"]["labels"];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(10,22,40,0.96), rgba(9,30,52,0.92))",
        border: `1px solid ${open ? "var(--accent-cyan)" : "rgba(66, 190, 255, 0.18)"}`,
        borderLeft: `3px solid ${open ? "var(--accent-green)" : "var(--border-bright)"}`,
        borderRadius: "8px",
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: open ? "0 0 26px rgba(0,212,255,0.09)" : "none",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "14px 18px",
          textAlign: "left",
        }}
      >
        <div style={{ ...MONO }}>
          {T.dim("- ")}
          {T.key("name")}
          {T.dim(": ")}
          {T.str(`"${job.id}"`)}
          {"  "}
          <span style={{ color: "var(--accent-cyan)", opacity: 0.7, fontSize: "11px" }}>
            {open ? "v" : ">"}
          </span>
          {"  "}
          {T.cmt(job.title)}
        </div>
      </button>

      {open && (
        <div
          style={{
            borderTop: "1px solid rgba(66, 190, 255, 0.16)",
            padding: "16px 18px 18px",
            background: "rgba(0,0,0,0.16)",
          }}
        >
          <L>
            {T.key("title")}
            {T.dim(": ")}
            {T.str(`"${job.title}"`)}
          </L>
          <L>
            {T.key(labels.focus)}
            {T.dim(": ")}
            {T.str(`"${job.focus}"`)}
          </L>
          <L>
            {T.key(labels.summary)}
            {T.dim(": |")}
          </L>
          <div style={{ paddingLeft: "28px", ...MONO, color: "#f3e99a", maxWidth: "780px" }}>
            {job.summary}
          </div>
          <L>
            {T.key(labels.highlights)}
            {T.dim(":")}
          </L>
          {job.highlights.map((h) => (
            <div key={h} style={{ display: "flex", paddingLeft: "14px" }}>
              <span style={{ ...MONO, color: "rgba(226,234,244,0.34)", flexShrink: 0 }}>- </span>
              <span style={{ ...MONO, color: "#f3e99a" }}>{h}</span>
            </div>
          ))}
          <L>
            {T.key(labels.tags)}
            {T.dim(":")}
          </L>
          <div style={{ paddingLeft: "14px" }}>
            <TagList tags={job.tags} />
          </div>
        </div>
      )}
    </div>
  );
}

function SkillGroupView({ group }: { group: SkillGroup }) {
  return (
    <div
      style={{
        border: "1px solid rgba(66, 190, 255, 0.18)",
        background: "rgba(4, 18, 34, 0.68)",
        borderRadius: "8px",
        padding: "14px",
      }}
    >
      <div style={{ color: "var(--accent-green)", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
        {group.name}
      </div>
      <div style={{ ...MONO, color: "var(--text-secondary)", marginBottom: "10px" }}>{group.note}</div>
      <TagList tags={group.tags} />
    </div>
  );
}

export default function CV({ lang = "en" }: { lang?: Lang }) {
  const copy = CONTENT[lang];
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
      <div className="terminal-titlebar">
        <span className="terminal-dot" style={{ background: "#FF5F57" }} />
        <span className="terminal-dot" style={{ background: "#FFBD2E" }} />
        <span className="terminal-dot" style={{ background: "#28C840" }} />
        <span style={{ marginLeft: "12px", fontSize: "11px", color: "var(--text-dim)" }}>
          {copy.file}
        </span>
      </div>

      <div style={{ padding: "20px 24px" }}>
        <L>
          {T.kw("apiVersion")}
          {T.dim(": ")}
          {T.str("talent.io/v1alpha1")}
        </L>
        <L>
          {T.kw("kind")}
          {T.dim(": ")}
          {T.str("UniversalSoldier")}
        </L>
        <L>
          {T.key("metadata")}
          {T.dim(":")}
        </L>
        <L n={1}>
          {T.key("name")}
          {T.dim(": ")}
          {T.str("filip-csupka")}
        </L>
        <L n={1}>
          {T.key("namespace")}
          {T.dim(": ")}
          {T.str("cloud-native")}
        </L>
        <L n={1}>
          {T.key("labels")}
          {T.dim(":")}
        </L>
        <L n={2}>
          {T.key("role")}
          {T.dim(": ")}
          {T.str("devops-sre-kubernetes")}
        </L>
        <L n={2}>
          {T.key("style")}
          {T.dim(": ")}
          {T.str("serious-platforms-playful-copy")}
        </L>
        <L n={1}>
          {T.key("annotations")}
          {T.dim(":")}
        </L>
        <L n={2}>
          {T.key("cv.io/open-to-work")}
          {T.dim(": ")}
          {T.str(`"${copy.labels.available}"`)}
        </L>

        <Blank />

        <L>
          {T.key("spec")}
          {T.dim(":")}
        </L>
        <L n={1}>
          {T.key(copy.labels.summary)}
          {T.dim(": |")}
        </L>
        <div style={{ paddingLeft: "28px" }}>
          <div style={{ ...MONO, color: "#f3e99a", maxWidth: "780px" }}>{copy.summary}</div>
        </div>

        <Blank />

        <L n={1}>
          {T.key(copy.labels.operatingNotes)}
          {T.dim(":")}
        </L>
        {copy.notes.map((note) => (
          <div key={note} style={{ display: "flex", paddingLeft: "28px" }}>
            <span style={{ ...MONO, color: "rgba(226,234,244,0.34)", flexShrink: 0 }}>- </span>
            <span style={{ ...MONO, color: "#f3e99a" }}>{note}</span>
          </div>
        ))}

        <Blank />

        <L n={1}>
          {T.key(copy.labels.experience)}
          {T.dim(":")}
        </L>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
          {copy.experience.map((job, i) => (
            <ExpEntry
              key={job.id}
              job={job}
              labels={copy.labels}
              open={expanded === i}
              onToggle={() => setExpanded(expanded === i ? null : i)}
            />
          ))}
        </div>

        <Blank />

        <L n={1}>
          {T.key(copy.labels.skillMatrix)}
          {T.dim(":")}
        </L>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "10px",
            marginTop: "8px",
            paddingLeft: "14px",
          }}
        >
          {copy.skills.map((group) => (
            <SkillGroupView key={group.name} group={group} />
          ))}
        </div>

        <Blank />

        <L n={1}>
          {T.key(copy.labels.languages)}
          {T.dim(":")}
        </L>
        {copy.languages.map((language) => (
          <L key={language} n={2}>
            {T.dim("- ")}
            {T.str(`"${language}"`)}
          </L>
        ))}

        <Blank />

        <L>
          {T.key(copy.labels.status)}
          {T.dim(":")}
        </L>
        <L n={1}>
          {T.key("phase")}
          {T.dim(": ")}
          {T.run("Running")}
        </L>
        <L n={1}>
          {T.key(copy.labels.reason)}
          {T.dim(": ")}
          {T.str("ReadyForUsefulWork")}
        </L>
      </div>
    </div>
  );
}
