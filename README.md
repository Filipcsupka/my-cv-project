# filip-cv

Personal CV/portfolio site for Filip Csupka — DevOps / SRE / Kubernetes Engineer.

Built with Next.js 15 static export, served by nginx alpine inside a Docker container. Deployed on a Hetzner K8s cluster via Cloudflare Tunnel. Live cluster metrics are pulled at deploy time by a K8s init container and served as `/status.json`.

---

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | Next.js 15, React 19, Tailwind CSS v4, TypeScript |
| Fonts | Orbitron (display), JetBrains Mono (mono) |
| Build output | Static export (`out/`) |
| Server | nginx 1.27 alpine |
| Container | Docker multi-stage build |
| CI/CD | GitHub Actions → GHCR |
| Deployment | Kubernetes (Hetzner) + Cloudflare Tunnel |

---

## Local development

```bash
npm install
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

---

## Docker

**Build:**

```bash
docker build --build-arg APP_VERSION=1.0.0 -t filip-cv:1.0.0 .
```

**Run:**

```bash
docker compose up
# → http://localhost:8080
```

**Version** is injected at build time via `--build-arg APP_VERSION=x.x.x` and baked into the static HTML as `NEXT_PUBLIC_APP_VERSION`. CI passes the git tag automatically.

---

## CI/CD

GitHub Actions workflow at `.github/workflows/build.yml`:

| Trigger | Action |
| --- | --- |
| Push to `main` | Lint → build → push `latest` to GHCR, auto-bump patch tag |
| Push tag `v*.*.*` | Lint → build → push versioned tags to GHCR |
| Pull request | Lint → build only (no push) |

Image is published to `ghcr.io/filipcsupka/filip-cv`.

**First-time setup** — add write permission for GHCR in your repo settings:
`Settings → Actions → General → Workflow permissions → Read and write`

---

## Live cluster metrics

When deployed on K8s, an init container queries the cluster API before nginx starts and writes `/status.json` into the nginx html root. The frontend fetches it on load and displays real node/pod/namespace counts.

Requires the RBAC manifests from the `../infra` repo to be applied first:

```bash
kubectl apply -f infra/k8s/rbac.yaml
```

On localhost the metrics section shows `—` with a `deploy to K8s for live metrics` hint.

---

## Project structure

```text
my-cv-project/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main page — hero, stack, experience, contact
│   │   ├── layout.tsx            # Fonts, metadata
│   │   └── globals.css           # Design tokens, animations
│   └── components/
│       ├── CV.tsx                # Experience timeline, skill bars
│       └── BackgroundCanvas.tsx  # Animated K8s topology canvas
├── nginx/
│   └── nginx.conf                # gzip, cache headers, Cloudflare real IP, /healthz
├── Dockerfile                    # Multi-stage: node:20-alpine → nginx:1.27-alpine
├── docker-compose.yml            # Local container testing
└── .github/
    └── workflows/
        └── build.yml             # CI: lint → build → push to GHCR
```

Infrastructure (K8s manifests, Cloudflare tunnel) lives in the separate `../infra` repo.

---

## Infra repo

K8s deployment, RBAC, and Cloudflare Tunnel config are managed separately in `../infra`. Will be migrated to GitOps (ArgoCD) + Terraform for full declarative cluster provisioning.
