# SignageSimStudio

A 2D digital signage environment simulator. Upload your content, choose a room template, drag the display into position, adjust viewing distance, and get an AI readability review — all before you deploy a single screen.

## What it does

- Upload a content image (menu board, promotional graphic, wayfinding, etc.)
- Place it on a wall inside one of 10 distinct room environments
- Adjust display size (32"–86"), orientation (landscape/portrait), and viewing distance (1–10m)
- Drag the display to any position on the wall
- Request an AI readability review — returns a 0-100 score, issues, and recommendations
- Export the simulation as a PNG for client sign-off

## Room Templates

| # | Template | Environment |
|---|----------|-------------|
| 1 | Retail Store | High-street shop, warm amber tones |
| 2 | Restaurant Menu Board | Dark kitchen aesthetic |
| 3 | Office Lobby | Clean corporate reception |
| 4 | Conference Booth | Dark exhibition hall |
| 5 | Airport Gate | Terminal slate/blue-grey |
| 6 | Hospital Waiting Area | Clinical white and green |
| 7 | School Hallway | Institutional warm yellow |
| 8 | Gym Reception | Energetic dark with orange accent |
| 9 | Hotel Lobby | Elegant warm amber |
| 10 | Outdoor Storefront | Bright exterior daylight |

## Setup

```bash
git clone https://github.com/SUDARSHANCHAUDHARI/SignageSimStudio.git
cd SignageSimStudio
pnpm install
cp .env.example .env.local
# Add your API key — see Environment Variables below
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

```env
AI_PROVIDER=claude          # 'claude' or 'openai'
ANTHROPIC_API_KEY=...       # Required if AI_PROVIDER=claude
OPENAI_API_KEY=...          # Required if AI_PROVIDER=openai
```

The app works without any AI key — you get a sample review. Add a key for live AI analysis.

## Tech Stack

- **Next.js 15** (App Router, Turbopack)
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS** — all room environments are CSS-only, no images required
- **@anthropic-ai/sdk** — Claude Sonnet 4.6 for AI review
- **openai** — GPT-4o alternative
- **html2canvas** — PNG export of the simulation canvas

## Phase Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | Done | 2D simulator, 10 CSS room templates, AI review, PNG export |
| Phase 2 | Planned | Three.js 3D environments, realistic lighting simulation |
| Phase 3 | Planned | Multiple display placement, video content support |
| Phase 4 | Planned | Team workspace, client reports, billing |

## Production Checks

```bash
pnpm type-check
pnpm build
```

## Release Notes

- Do not add Playwright browser smoke tests to this project.
- Do not commit `.env`, `.env.local`, exported client simulations, or generated screenshots.
- Keep API keys only in the deployment provider environment.

## License

MIT
