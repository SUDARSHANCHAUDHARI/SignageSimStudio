# SignageSimStudio

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-blue)

2D digital signage environment simulator. Upload content, place it inside a room template, adjust viewing conditions, and generate an AI readability review before deployment.

## Table of Contents

- [What It Does](#what-it-does)
- [Features](#features)
- [Room Templates](#room-templates)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Production Checks](#production-checks)
- [Release Notes](#release-notes)
- [License](#license)
- [About](#about)

## What It Does

SignageSimStudio helps teams preview how signage content will look in real-world environments. It focuses on readability, display placement, viewing distance, and client sign-off before screens go live.

## Features

- Upload a menu board, promotion, wayfinding graphic, or other signage image.
- Place content on a wall inside one of 10 room templates.
- Adjust display size, orientation, and viewing distance.
- Drag the display position inside the scene.
- Generate a readability score, issues, and recommendations.
- Export the simulation as a PNG for review or client approval.

## Room Templates

| # | Template | Environment |
|---|---|---|
| 1 | Retail Store | High-street shop with warm lighting. |
| 2 | Restaurant Menu Board | Dark menu-board setting. |
| 3 | Office Lobby | Clean corporate reception. |
| 4 | Conference Booth | Exhibition booth setting. |
| 5 | Airport Gate | Terminal-style gate area. |
| 6 | Hospital Waiting Area | Clinical waiting-room environment. |
| 7 | School Hallway | Institutional corridor. |
| 8 | Gym Reception | Fitness reception area. |
| 9 | Hotel Lobby | Warm hospitality lobby. |
| 10 | Outdoor Storefront | Bright storefront preview. |

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript strict mode
- Tailwind CSS
- `html2canvas` for PNG export
- Anthropic SDK and OpenAI SDK
- No Playwright browser smoke-test dependency

## Setup

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. No `.env` is required — see Configuration below.

## Configuration

**AI is bring-your-own-key.** There is no server-side API key. Each visitor adds
their own Anthropic or OpenAI key in the app's Settings; it is stored only in
their browser and sent per request (`x-api-key` header), so hosting the app
publicly can never bill your account. Without a key the app returns a sample
review; add a key for live AI analysis.

## Deployment

Deployed on **Cloudflare Pages** as a static export + Pages Functions:

- Build command `npx next build`, output directory `out`.
- Compatibility flag `nodejs_compat` (for the AI SDKs).
- Live at `signagesimstudio.sudarshantechlabs.com`.

## Roadmap

| Phase | Status | Scope |
|---|---|---|
| Phase 1 | Ready | 2D simulator, 10 room templates, AI review, PNG export. |
| Phase 2 | Planned | Three.js 3D environments and lighting simulation. |
| Phase 3 | Planned | Multiple display placement and video content support. |
| Phase 4 | Planned | Team workspace, client reports, and billing. |

## Production Checks

```bash
pnpm type-check
pnpm build
```

## Release Notes

- Do not add Playwright browser smoke tests to this project.
- No API keys live in the repo or the server — the AI key is supplied per-user in the browser.

## License

MIT

---

## About

I'm Sudarshan Chaudhari, a Senior Quality Engineer, Test Automation specialist, and AI systems builder based in Bangkok, Thailand.

I have 13+ years of experience in software quality engineering, working across SaaS, fintech, gaming, web, mobile, cloud, and digital signage platforms. My background combines hands-on test automation with QA leadership, test strategy, CI/CD, release quality, production investigation, and cross-platform validation.

Alongside my professional QA career, I run [SudarshanTechLabs](https://sudarshantechlabs.com/), my independent engineering and product lab where I design, build, test, and ship software across Android, web, AI, cybersecurity, developer tooling, and cross-platform applications.

### What I work on

- ⚙️ **Quality Engineering & Test Automation** — Playwright, Selenium, Cypress, Appium, API testing, automation frameworks, end-to-end testing, CI/CD, release gates, GitHub Actions, risk-based testing, and production validation
- 🤖 **AI Systems & Automation** — AI agents, multi-agent orchestration, MCP servers, AI-assisted QA, prompt tooling, developer workflows, automation systems, and Claude Code plugins
- 📱 **Mobile & Cross-Platform Applications** — Android applications built with Kotlin and Jetpack Compose, Google Play releases, automated build and publishing pipelines, and cross-platform development spanning iOS, web, Windows, and macOS
- 🌐 **Web Applications & Platforms** — Full-stack applications using Next.js, TypeScript, Firebase, Cloudflare, REST APIs, and modern web infrastructure
- 🛠️ **Developer Tooling & CLI Engineering** — Rust, Python, TypeScript, CLI utilities, multi-repository tooling, build automation, release tooling, and engineering productivity systems
- 🛡️ **Cybersecurity & Observability** — Threat detection, log analysis, security auditing, vulnerability assessment, monitoring, and security-focused developer tools
- 📺 **Digital Signage & Device Platforms** — Content validation, playback testing, device compatibility, production investigation, monitoring, and QA across diverse hardware and operating-system environments

My work sits at the intersection of quality engineering, automation, AI, and software development. I approach products with a QA mindset from the beginning: understanding failure modes, designing for testability, automating repetitive work, and building release confidence into the engineering process.

Through SudarshanTechLabs, I also build products and tools from idea to production, covering architecture, development, testing, CI/CD, release automation, monitoring, and ongoing maintenance.

🌐 [sudarshantechlabs.com](https://sudarshantechlabs.com/) · 💼 [LinkedIn](https://linkedin.com/in/sudarshan-chaudhari) · 🐙 [GitHub](https://github.com/SUDARSHANCHAUDHARI) · ✉️ [sunny.sudarshan@gmail.com](mailto:sunny.sudarshan@gmail.com)
