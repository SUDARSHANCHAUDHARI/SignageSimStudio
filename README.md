# SignageSimStudio

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-blue)

2D digital signage environment simulator. Upload content, place it inside a room template, adjust viewing conditions, and generate an AI readability review before deployment.

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
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

## Environment Variables

```env
AI_PROVIDER=claude
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

The app works without an AI key by returning a sample review. Add a provider key for live AI analysis.

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
- Do not commit `.env`, `.env.local`, exported client simulations, or generated screenshots.
- Keep AI provider keys in the deployment environment.

## Author

Built by [Sudarshan Chaudhari](https://github.com/SUDARSHANCHAUDHARI) for **SudarshanTechLabs**.

## License

MIT
