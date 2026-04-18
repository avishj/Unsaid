# PLAN: Foundation (`chore/project-scaffolding`)

## Goal: The Watertight Monorepo Contract
This plan establishes a type-safe, alias-heavy monorepo that ensures Track A, B, and C can share code without build errors. We focus on structural integrity and communication protocols.

---

### Phase 1: Directory & Workspace Setup

#### Commit 1: `chore: init monorepo structure`
- **Action:** 
  - `mkdir -p frontend backend shared`
  - Create a root-level `package.json` to enable Bun Workspaces:
    ```json
    {
      "name": "unsaid-monorepo",
      "private": true,
      "workspaces": [
        "frontend",
        "backend",
        "shared"
      ],
      "scripts": {
        "dev:frontend": "cd frontend && bun run dev",
        "dev:backend": "cd backend && bun run index.ts",
        "install:all": "bun install"
      }
    }
    ```
- **Verify:** Run `ls -F` to confirm `frontend/`, `backend/`, and `shared/` exist. Run `bun install` and ensure it completes without workspace errors.
- **Context:** Allows for zero-copy dependency sharing and unified script execution.

#### Commit 2: `chore: root gitignore`
- **Action:** 
  - Create root `.gitignore`:
    ```text
    node_modules/
    .env
    .env.local
    dist/
    .astro/
    .DS_Store
    *.log
    frontend/dist/
    backend/node_modules/
    shared/node_modules/
    ```
- **Verify:** Run `git status` to ensure `node_modules` are not tracked.
- **Context:** Standard safety to prevent credential leaks and repo bloat.

---

### Phase 2: The Communication Contract (`/shared`)

#### Commit 3: `shared: app state enums`
- **Action:** Create `shared/types.ts`.
  - `export enum AppPhase { LANDING = 'LANDING', WAITING = 'WAITING', ACTIVE = 'ACTIVE', SYNTHESIS = 'SYNTHESIS', REVEAL = 'REVEAL', ERROR = 'ERROR' }`
  - `export enum ConnectionStatus { CONNECTING = 'CONNECTING', CONNECTED = 'CONNECTED', DISCONNECTED = 'DISCONNECTED', RECONNECTING = 'RECONNECTING' }`
- **Verify:** File exists and exports string-based enums for better logging visibility.
- **Context:** `AppPhase` is the "Master Switch" for the entire UI.

#### Commit 4: `shared: ws message schema`
- **Action:** 
  - Define `WSMessageType` enum:
    ```typescript
    export enum WSMessageType {
      CREATE_ROOM = 'CREATE_ROOM',
      JOIN_ROOM = 'JOIN_ROOM',
      ROOM_READY = 'ROOM_READY',
      STATUS_UPDATE = 'STATUS_UPDATE',
      SUBMIT_TRANSCRIPT = 'SUBMIT_TRANSCRIPT',
      REVEAL_STORY = 'REVEAL_STORY',
      ERROR = 'ERROR',
      HEARTBEAT = 'HEARTBEAT'
    }
    ```
  - Define generic `WSMessage<T>` interface.
- **Verify:** Ensure `HEARTBEAT` is included to keep connections alive on mobile.
- **Context:** Track C (Backend) and Track A (Frontend) MUST use these exact strings for routing logic.

#### Commit 5: `shared: payload interfaces`
- **Action:** 
  - `export interface StatusPayload { status: 'typing' | 'speaking' | 'idle'; userId: string; }`
  - `export interface StoryPayload { lines: string[]; sentiment: string; }`
  - `export interface RoomPayload { sessionId: string; userId: string; partnerJoined: boolean; }`
- **Verify:** Check that `StoryPayload` matches what the LLM in Track C will produce.
- **Context:** Type safety for the final "Revelation" payoff.

---

### Phase 3: Backend Foundation (`/backend`)

#### Commit 6: `backend: init & tsconfig`
- **Action:** 
  - `cd backend && bun init -y`
  - Update `tsconfig.json`:
    ```json
    {
      "compilerOptions": {
        "lib": ["ESNext"],
        "module": "esnext",
        "target": "esnext",
        "moduleResolution": "bundler",
        "moduleDetection": "force",
        "allowImportingTsExtensions": true,
        "noEmit": true,
        "composite": true,
        "strict": true,
        "downlevelIteration": true,
        "skipLibCheck": true,
        "baseUrl": ".",
        "paths": {
          "@shared/*": ["../shared/*"]
        }
      }
    }
    ```
- **Verify:** `import { AppPhase } from '@shared/types'` resolves in `index.ts`.
- **Context:** Enables Track C to use the Shared Contract without relative path hell.

#### Commit 7: `backend: core deps`
- **Action:** `bun add ws @types/ws openai nanoid dotenv zod`.
- **Verify:** Confirm `package.json` dependencies.
- **Context:** `zod` is used for runtime validation of the `WSMessage` envelope to prevent backend crashes from malformed frontend packets.

---

### Phase 4: Frontend Foundation (`/frontend`)

#### Commit 8: `frontend: init astro minimal`
- **Action:** `npm create astro@latest ./frontend -- --template minimal --install --no-git --typescript strict`.
- **Verify:** `cd frontend && bun run dev` starts the server.
- **Context:** High-performance framework choice.

#### Commit 9: `frontend: integrations & aliases`
- **Action:** 
  - `npx astro add react tailwind --yes`
  - Update `tsconfig.json` paths:
    ```json
    {
      "extends": "astro/tsconfigs/strict",
      "compilerOptions": {
        "baseUrl": ".",
        "paths": {
          "@shared/*": ["../shared/*"],
          "@components/*": ["./src/components/*"],
          "@hooks/*": ["./src/hooks/*"],
          "@store/*": ["./src/store/*"]
        }
      }
    }
    ```
- **Verify:** Restart Astro dev server; no alias errors.
- **Context:** Clean imports are vital for parallel work between UI and AI agents.

#### Commit 10: `frontend: global style system`
- **Action:** 
  - Create `src/styles/globals.css`.
  - `tailwind.config.mjs` setup:
    ```javascript
    export default {
      content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
      theme: {
        extend: {
          colors: {
            background: '#050505',
            foreground: '#fafafa',
            accent: '#3b82f6',
            glass: 'rgba(255, 255, 255, 0.03)'
          },
          fontFamily: {
            serif: ['Georgia', 'serif'],
            sans: ['Inter', 'sans-serif']
          }
        }
      }
    };
    ```
- **Verify:** Test a `bg-background text-foreground` div in `index.astro`.
- **Context:** Enforces the "Zen" aesthetic across all UI tracks.

#### Commit 11: `frontend: session store (Zustand)`
- **Action:** 
  - `bun add zustand`
  - Create `src/store/useSessionStore.ts`:
    ```typescript
    interface SessionState {
      phase: AppPhase;
      sessionId: string | null;
      userId: string | null;
      transcript: string;
      partnerStatus: 'typing' | 'speaking' | 'idle';
      story: string[] | null;
      setPhase: (phase: AppPhase) => void;
      // ... actions
    }
    ```
- **Verify:** Inspect the store in a component to see default values.
- **Context:** The central brain. Every track (A and B) will mutate this store.

#### Commit 12: `frontend: ws client logic`
- **Action:** 
  - Create `src/hooks/useWebSocket.ts`. 
  - Logic: `new WebSocket(import.meta.env.PUBLIC_WS_URL)`.
  - Handle `onMessage`: Switch-case to update `useSessionStore` (e.g., `ROOM_READY` -> `setPhase(AppPhase.ACTIVE)`).
- **Verify:** Console log "WS Connection Established" on page load.
- **Context:** The pipe through which all synchronization flows.

---

### Phase 2: Routing & Environment (Crucial Fixes)

#### Commit 13: `frontend: dynamic room routing`
- **Action:** 
  - Create `src/pages/[sessionId].astro`. 
  - Layout: `MainLayout`. Inside a `useEffect`, extract the `sessionId` from the URL and call the `JOIN_ROOM` WS action.
- **Verify:** Navigating to `localhost:4321/ABCDEF` attempts to join a room with that ID.
- **Context:** Fixes the hole: User B needs to be able to "land" directly into a session.

#### Commit 14: `chore: root env & examples`
- **Action:** 
  - Create `.env.example` at root.
  - `PUBLIC_WS_URL=ws://localhost:3000`
  - `LITELLM_API_KEY=your_key_here`
  - `OPENAI_API_BASE=http://localhost:4000/v1` (LiteLLM Proxy)
- **Verify:** File exists.
- **Context:** Setup guide for other agents.

#### Commit 15: `verify: final monorepo check`
- **Action:** 
  - Run `bun run dev:frontend` and `bun run dev:backend`.
- **Verify:** No type errors across boundaries. Both servers alive.
- **Context:** Final green light for Track A, B, and C.
