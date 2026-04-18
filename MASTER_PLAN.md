# MASTER PLAN - Unsaid (45-min Hackathon)

## 1. Vision & Orchestration
"Unsaid" is a digital sanctuary designed to dismantle human defensiveness through the "Machines of Loving Grace" philosophy. It is not an arbiter; it is a mirror that filters out the ego to reveal shared humanity. 

The project is architected for **maximum parallel velocity**. Each agent operates on a dedicated branch with a laser-focused objective. The `/shared` layer acts as the binding contract.

### Core Architecture
- **Sanctuary (Frontend):** A high-fidelity, meditative space. Built with Astro for performance, React for complex states, Three.js for generative calming visuals, and GSAP for cinematic choreography.
- **Listener (Local AI):** Uses `@xenova/transformers` (Whisper) for zero-latency, private voice-to-text. Local heuristics detect pauses to trigger "Active Listening" prompts.
- **Weaver (Backend/Sync):** A Bun-powered WebSocket orchestrator that pairs two users into a "Session". It pipes their unburdened transcripts through a **LiteLLM Proxy** (running Claude 3.5 Sonnet) to synthesize the "Common Ground".
- **Reveal (Shared Truth):** A synchronized, story-like animation that unfolds simultaneously on both screens, revealing the underlying fears and needs without ever exposing the raw text of the conflict.

---

## 2. Execution Timeline (The 45-min Blitz)

### Phase 1: Foundation (5 mins) - `chore/project-scaffolding`
- Initialize the monorepo: `/frontend`, `/backend`, `/shared`.
- Define the absolute source of truth in `shared/types.ts`.
- **Primary Contract:** All agents MUST adhere to the WebSocket message schema defined here.

### Phase 2: Parallel Tracks (25 mins) - 3 Concurrent Agents
- **Track A: The Sanctuary (UI/UX)** - `feat/frontend-ui-core`
  - Focus: 3D breathing background, State Machine, Cinematic Transitions.
- **Track B: The Listener (Local AI)** - `feat/frontend-ai-audio`
  - Focus: Local Whisper integration, Audio visualizers, Empathetic prompting logic.
- **Track C: The Weaver (Backend/Sync)** - `feat/backend-ws-llm`
  - Focus: WebSocket Room logic, LiteLLM Proxy integration, Synthesis Prompting.

### Phase 3: Integration & Convergence (15 mins) - `feat/integration`
- Connect Frontend hooks to real Backend WebSockets.
- Pipe Whisper transcripts into the Backend Synthesis queue.
- Final CSS/VFX polish and Ambient Audio layering.

---

## 3. Communication Protocol (`/shared/types.ts`)
The entire system relies on these core events:
- `SESSION_CREATED`: User A gets a shareable link.
- `USER_JOINED`: User B arrives; both transition to "Active" state.
- `USER_STATUS`: Syncing whether the other person is "typing", "speaking", or "done".
- `SUBMIT_TRANSCRIPT`: Sending the local unburdened text to the weaver.
- `REVEAL_SYNTHESIS`: The backend sends the "Common Ground" story to both.

## 4. Operational Safety
- **No Overwrites:** Do not touch code in other directories (`/frontend` vs `/backend`).
- **Mock First:** Frontend agents MUST implement a mock WebSocket hook to develop the UI flow independently.
- **Verify Often:** Every 3-5 commits must be verified with a local run.
