# Company Research Tool

A monorepo project for gathering company information from the web and presenting it in a simple, searchable interface. The goal is to combine public company source data, web scraping, and AI-assisted extraction to build a useful research workflow without depending entirely on rigid page-specific scraping logic.

## Overview

The tool is designed to answer a practical problem: when a user searches for a company, the application should be able to:

- find likely company references or URLs from public sources
- collect web pages related to the company
- extract relevant business information from those pages
- normalize the results into a usable company profile
- present the output in a frontend dashboard

This project currently uses provider-based discovery and HTML extraction as a foundation, with a local AI model as the long-term strategy for flexible information extraction from varying website structures.

## Architecture

This repository is organized as a monorepo:

- **Backend** (`apps/backend`): NestJS API server responsible for orchestration, provider integrations, and company search logic.
- **Frontend** (`apps/frontend`): React + TypeScript + Vite application for the user-facing interface.
- **Root**: shared workspace configuration and task scripts for running the app in development.

### Backend responsibilities

The backend includes modules for:

- search orchestration
- provider integrations for sources such as Wikipedia and Clearbit
- HTML parsing utilities
- response formatting and normalization

### Frontend responsibilities

The frontend provides:

- a simple company search experience
- result cards and summaries
- a polished UI using Tailwind-based components and modern React patterns

## Tech Stack

- **Backend**: NestJS, TypeScript, Cheerio, Jest
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS
- **Package manager**: pnpm
- **Monorepo tooling**: pnpm workspaces

## Prerequisites

Before running the project, make sure you have:

- Node.js 24.x or higher
- pnpm 11.x or higher
- Docker Desktop or Docker Engine for local MongoDB
- a modern browser for the frontend

Optional for future AI-based scraping flows:

- a local LLM runtime or containerized model service
- Docker support for running a local inference environment

## Database

The backend now connects to a local MongoDB instance using Mongoose.

- Connection URI: `mongodb://localhost:27017/company-research`
- Database name: `company-research`
- Local container definition: the repo includes a MongoDB service in `docker-compose.yml`

If you want to start the database manually:

```bash
docker compose up -d
```

This starts the MongoDB container on port `27017` and keeps data in a Docker volume.

## Getting Started

### 1. Install dependencies

From the repository root:

```bash
pnpm install
```

### 2. Start the database

```bash
pnpm docker:up
```

This starts the MongoDB container used by the backend.

### 3. Start the backend

```bash
pnpm backend:dev
```

This runs the NestJS app in watch mode and connects to MongoDB at `mongodb://localhost:27017/company-research`.

### 4. Start the frontend

```bash
pnpm frontend:dev
```

This runs the Vite development server.

### 5. Run both together

```bash
pnpm dev
```

This starts MongoDB, the backend, and the frontend concurrently.

## Project Structure

```text
company-research-tool/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   ├── test/
│   │   ├── package.json
│   │   └── README.md
│   └── frontend/
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── vite.config.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
└── LICENSE
```

## How the App Works

The current approach follows a research pipeline:

1. A company name is entered by the user.
2. The backend tries to resolve likely company URLs using available providers.
3. Candidate pages are analyzed and normalized.
4. Web content is extracted from HTML files.
5. An AI-assisted layer can interpret the page content and structure beyond static selectors.
6. The final, cleaned information is returned to the frontend for display.

This is intentionally flexible because public websites do not share a uniform structure, and many company pages are designed for humans instead of machine-readable APIs.

## Current Challenges

The project addresses a few common issues in company research automation:

- search engine APIs are often limited or expensive in free tiers
- public providers can give company references or URL hints, but not always complete data
- scraping raw HTML is noisy and fragile across sites
- website structures vary widely, which makes rigid extraction brittle

To address these challenges, the project is exploring AI-assisted extraction from page content instead of relying only on page-specific parsing rules.

## Development History

This section summarizes how the project evolved, based on the commit history.

### Early foundation

- **Initial commit** — repository bootstrap.
- **Monorepo setup** — structured the repo with pnpm workspaces and created dummy backend (NestJS) and frontend (React + Vite) applications.
- **Dummy search endpoint** — first version of the `/search` endpoint returning a placeholder response so the API shape could be agreed on before real data existed.

### Provider-based discovery

- **Clearbit and Wikipedia providers** — added the first two providers to resolve company names into URLs and general company references.
- **Partial-failure bugfix** — a single failing provider previously broke the whole response; the resolve logic was extracted into a util (`resolve-provider-requests`) using `Promise.allSettled` so the API returns partial results with a `partialError` object instead of failing entirely.
- **LinkedIn provider** — added HTML parsing with Cheerio to scrape a company profile (website, industry, size, headquarters, founded, specialties, people) directly from LinkedIn pages without using any API.
- **Response formatter middleware** — an interceptor that normalizes the raw per-provider responses (Clearbit suggestions, Wikipedia summary, LinkedIn profile) into one unified company profile (name, website, other sites, age, description, extract, etc.) for the frontend.

### Frontend

- **GodUI dummy frontend** — imported the GodUI component set (magic input, magic button, pixel grid) and built a bare placeholder page.
- **Search bar UI** — replaced the placeholder with a Google-like search page using the magic input and magic buttons, with a result card rendering the formatted company profile.
- **Error handling and polish** — improved error states across the flow and fixed a Spinner class-name detail.

### The `ai-approach` branch (failing)

In parallel with the provider work, a separate branch experimented with using an AI for scraping instead of static HTML parsing:

- **OpenAI + LLMScraper integration** — wired OpenAI and LLMScraper into `SearchService` to scrape contact information from arbitrary company URLs, added a Playwright service to `docker-compose.yml` for browser automation, and installed the OpenAI/LLMScraper/Playwright dependencies.

This branch was ultimately **abandoned**: the AI-assisted scraping path proved too heavy and fragile for the current needs (containerized browser automation plus an LLM dependency for data that the providers already return more reliably). The project pivoted to the cleaner provider-based approach on `development`, and AI-assisted extraction was kept as a long-term roadmap item rather than a blocker for the current version.

## Roadmap and TODOs

- [x] Backend: Add a DB to store previous requests and avoid making all the process again **DONE**
- [ ] Backend: move service-level errors to a shared error handler middleware
- [ ] Backend: move provider URLs into a constants file or environment configuration
- [ ] DevOps(On-hold until AI were successfully added): add Docker setup for a local LLM instance to support scraping/extraction workflows
- [ ] All: Add a logger strategy to keep log files
- [ ] Frontend: Move hardcoded variables to a .env file
- [ ] All: Find a wayt to have only one .env for Frontend and Backend

## License

This project is licensed under the ISC license.
