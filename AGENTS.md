# AGENTS.md - Global Context & Rules of Engagement

## Ground Rules - MUST FOLLOW

1. MUST ALWAYS USE RELEVANT SKILLS!
2. MUST NEVER ASSUME, try and find context always!
3. MUST ALWAYS READ @MASTER_PLAN.md before reading your BRANCH SPECIFIC FILE.

## Project: Unsaid

**Core Concept:** A safe, digital space for two people in conflict to express their feelings (via voice/text) separately. An empathetic AI listens, asks gentle, human-like questions to dig deeper, and then a backend AI synthesizes their shared underlying fears/needs without ever showing the raw text.
**Vibe:** Chill, zen, minimalist, smooth. No corny melodrama.

## The Stack

- **Frontend:** Astro (Framework), React (UI Components), Tailwind CSS (Styling), GSAP (Animations), Three.js (3D breathing background), Transformers.js (Local Whisper for Speech-to-Text).
- **Backend:** Bun (Runtime), WebSockets (Real-time sync), LiteLLM / standard OpenAI SDK (for LLM routing).
- **Language:** TypeScript across the board.

## Monorepo Structure

To prevent agent conflicts, the project is strictly divided:
```text
/
├── frontend/       # Astro + React + Threejs + GSAP + Transformers.js
├── backend/        # Bun + WebSockets + LiteLLM logic
├── shared/         # Shared TypeScript types/interfaces (contracts)
```

## Agent Directives & Constraints

1. **Scope Isolation:** NEVER modify files outside your assigned domain. If you are the Backend Agent, do not touch `/frontend`. If you are the Frontend Agent, do not touch `/backend`.
2. **Shared Contracts:** The `/shared` directory contains the source of truth for WebSocket payloads and data structures. Agree on these first or respect the existing types.
3. **Mocking Before Integration:** Frontend agents should mock WebSocket responses and AI text to build the UI continuously. Do not wait for the backend to be finished to build the state machine.
4. **Vibe Check (Frontend):**
   - Animations must be smooth (GSAP).
   - UI must be clean and not generic (use Tailwind creatively, subtle borders, nice typography).
   - AI prompts must be chill (e.g., "i hear you. what's the underlying feeling there?", "take your time.").
   - Synthesis reveal must be grounded (e.g., "so, here's what's actually going on...", "you both just want to feel valued.").
5. **Robustness:** Handlers must catch errors gracefully. If local Whisper fails, fallback to text input seamlessly.

## Workflow & Git Conventions

- **Branch Naming:** `feat/<domain>-<short-desc>` (e.g., `feat/backend-ws-setup`, `feat/frontend-whisper-local`).
- **Commits:** Conventional Commits required.
  - `feat: add local whisper transcription`
  - `fix: resolve websocket disconnect state`
  - `chore: setup astro project`
- **Verification:** Every branch must contain instructions on how to verify the work locally before merging. Do not assume your code works; test it using `bun run dev` or equivalent.
