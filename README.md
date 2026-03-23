# Forgeops Dashboard

A local **Next.js** UI for **[Forgeops](https://github.com/valle-tech/forgeops)**: browse services scaffolded with the CLI, create new ones with the same options as **`forgeops create service`**, and open per-service views for logs, metrics, tests, CI, and configuration. Everything runs on your machine and uses the same **`~/.forgeops/registry.json`** and **`~/.forgeops/config.json`** as the CLI.

**Repository:** [github.com/valle-tech/forgeops-dashboard](https://github.com/valle-tech/forgeops-dashboard)

![Forgeops Dashboard screenshot](https://github.com/user-attachments/assets/4b05a033-8d29-46d2-8f2b-c04a1bd6eea1)

## Features

- **Home** — counts for registered services, recent services, and an activity feed driven by local Forgeops actions.
- **Services** — list and drill into each service: status, template, port, repo link, and shortcuts to operations.
- **Create service** — form that maps to **`forgeops create service`** (templates, DB, messaging, CI, infra, auth, GraphQL, OAuth, Redis, OpenTelemetry, etc.).
- **Templates** — browse built-in template metadata aligned with the CLI.
- **Settings** — edit **`~/.forgeops/config.json`** (e.g. default template, default port, services output path) in sync with **`forgeops config`**.
- **System tools** — quick links and helpers for local workflows (see in-app copy).

There is no hosted Forgeops “cloud” account: the dashboard is a **local control plane** that invokes the **Forgeops CLI** and reads your filesystem-backed registry.

## Requirements

- **Node.js 18+** (match the Forgeops CLI engines).
- **[Forgeops CLI](https://www.npmjs.com/package/forgeops)** installed globally (`npm install -g forgeops`) **or** available on disk so the dashboard can run **`bin/forgeops.js`** (see configuration below).
- **Docker** / **Compose** are only needed when you run or build the services you create — not strictly required just to run the dashboard.

## Install and run

```bash
git clone https://github.com/valle-tech/forgeops-dashboard.git
cd forgeops-dashboard
npm install
npm run dev
```

Open the app at **http://localhost:3000** (default Next.js dev server).

Production build:

```bash
npm run build
npm start
```

## Configure the CLI path

The dashboard runs Forgeops via Node by spawning **`bin/forgeops.js`** inside a package root.

- **Default:** if you clone this repo **next to** the **`forgeops`** CLI repo (`forgeops-dashboard` and `forgeops/cli` as siblings), **`../cli`** is used automatically.
- **Override:** set **`FORGEOPS_CLI_ROOT`** to the absolute path of the **CLI package root** (the folder that contains **`bin/forgeops.js`**).

Example:

```bash
export FORGEOPS_CLI_ROOT="$HOME/src/forgeops/cli"
npm run dev
```

If the CLI is missing or misconfigured, server actions that call Forgeops will error with a clear message pointing at **`FORGEOPS_CLI_ROOT`**.

## Where services are created

New projects are written where the CLI would write them:

- **`FORGEOPS_SERVICES_OUTPUT`** — absolute parent directory for **`{name}-service`** folders, or  
- **`dashboard.servicesOutputPath`** in **`~/.forgeops/config.json`**, or  
- A sensible default derived from the dashboard working directory (see **`lib/paths.ts`** / **Settings** in the UI).

Keep this path consistent with where you run **`forgeops create service`** from the terminal so the registry and UI stay aligned.

## Relationship to the CLI

| Concern | CLI | Dashboard |
|--------|-----|-----------|
| Scaffold services | `forgeops create service` | **Create service** form (same flags under the hood) |
| Registry | `~/.forgeops/registry.json` | Same file |
| User config | `~/.forgeops/config.json`, `forgeops config` | **Settings** page |
| CI / automation | Shell scripts, `forgeops` in pipelines | Use **`forgeops`** directly |

For full command reference and flags, see the **[Forgeops CLI README](https://github.com/valle-tech/forgeops/blob/main/cli/README.md)** (npm package **`forgeops`**).

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Next.js development server |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm run lint` | ESLint |

