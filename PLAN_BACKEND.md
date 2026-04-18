# PLAN: The Weaver (`feat/backend-ws-llm`)

## Goal: Real-time Orchestration & Synthesis
Implement the high-performance Bun WebSocket server and the synthesis engine using the LiteLLM Proxy.

---

### Phase 1: Real-time Spine (WebSockets)

#### Commit 1: `backend: bun serve setup`
- **What:** Create `src/index.ts`. 
- **Action:**
  ```typescript
  Bun.serve({
    port: 3000,
    fetch(req, server) {
      if (server.upgrade(req)) return;
      return new Response("Unsaid Backend");
    },
    websocket: {
      message(ws, message) { /* router */ },
      open(ws) { /* init */ },
      close(ws) { /* cleanup */ }
    }
  });
  ```
- **Verify:** `curl http://localhost:3000` returns text. `wscat` can connect.
- **Context:** Bun native speed.

#### Commit 2: `backend: room manager Map`
- **What:** Create `src/services/RoomManager.ts`. 
- **Action:**
  ```typescript
  class RoomManager {
    private rooms: Map<string, {
      userA: ServerWebSocket;
      userB?: ServerWebSocket;
      transcripts: Map<string, string>;
    }> = new Map();
  }
  ```
- **Verify:** Instantiate and test adding a mock room.
- **Context:** Core session state storage.

#### Commit 3: `backend: message router logic`
- **What:** Create `src/handlers/messageHandler.ts`. 
- **Action:** Parse incoming `WSMessage`. Use Zod to validate the payload. Route to functions: `handleCreate`, `handleJoin`, `handleSubmit`.
- **Verify:** Malformed packets return an `ERROR` event. Correct packets log their type.
- **Context:** Enforces the shared monorepo contract.

#### Commit 4: `backend: impl CREATE_ROOM`
- **What:** ID generation.
- **Action:** Use `nanoid(6)` to generate a readable room ID. Save `ws` as `userA`.
- **Verify:** Client A gets `CREATE_ROOM` response with the 6-char ID.
- **Context:** First half of the connection loop.

#### Commit 5: `backend: impl JOIN_ROOM`
- **What:** User B joining.
- **Action:** Match room ID. Save `ws` as `userB`. Emit `ROOM_READY` to both.
- **Verify:** Both sockets receive the `ROOM_READY` signal.
- **Context:** Triggers the UI transition to `AppPhase.ACTIVE` on both ends.

---

### Phase 2: Synchronization & Collection

#### Commit 6: `backend: status relay`
- **What:** Presence logic.
- **Action:** When `STATUS_UPDATE` arrives from User A, send it to User B (and vice-versa).
- **Verify:** Client A sends "speaking"; Client B receives it.
- **Context:** Track A uses this for visual cues.

#### Commit 7: `backend: transcript submission`
- **What:** Data ingestion.
- **Action:** Save `SUBMIT_TRANSCRIPT` text in the `RoomManager` state for the correct `userId`.
- **Verify:** Server logs "Transcript collected from User X (length: 400)".
- **Context:** Buffer until both parties are done.

#### Commit 8: `backend: synthesis trigger`
- **What:** State transition.
- **Action:** When room's `transcripts.size === 2`, broadcast `AppPhase.SYNTHESIS` to both users.
- **Verify:** UI transitions to the "processing" state on both screens.
- **Context:** Starts the weaver engine.

#### Commit 9: `backend: litellm client`
- **What:** AI configuration.
- **Action:** 
  ```typescript
  import OpenAI from 'openai';
  const openai = new OpenAI({ 
    apiKey: process.env.LITELLM_API_KEY, 
    baseURL: 'http://localhost:4000/v1' 
  });
  ```
- **Verify:** Send a test "Hi" completion.
- **Context:** LiteLLM Proxy must be running in a separate terminal.

---

### Phase 3: The Weaving (AI Logic)

#### Commit 10: `backend: synthesis prompt v1`
- **What:** System message engineering.
- **Action:**
  "You are an empathic weaver. You are given two separate transcripts of a conflict. Your goal is to find the deep, shared underlying needs and fears. Output 5 lines that weave their stories together. NEVER blame. NEVER take sides. ALWAYS find the common ground."
- **Verify:** Full prompt console-logged for review.
- **Context:** The "Loving Grace" heart of the product.

#### Commit 11: `backend: run weaver engine`
- **What:** Call the LLM.
- **Action:** Send User A and User B transcripts. Specify JSON format or clear line breaks.
- **Verify:** Log the raw AI response.
- **Context:** Synthesis happens here.

#### Commit 12: `backend: sentiment analysis`
- **What:** Emotional detection.
- **Action:** Ask LLM to output one of: `warm`, `fearful`, `hopeful`, `tired`.
- **Verify:** Sentiment tag present in payload.
- **Context:** Track A uses this to change orb colors.

#### Commit 13: `backend: story parser`
- **What:** Data cleanup.
- **Action:** Parse the AI response into a clean `string[]` of 5 items.
- **Verify:** Test with messy LLM output.
- **Context:** Stability for the frontend renderer.

#### Commit 14: `backend: broadcast REVEAL_STORY`
- **What:** The payoff.
- **Action:** Send `WSMessageType.REVEAL_STORY` with the `StoryPayload` to both users simultaneously.
- **Verify:** Both clients get the data.
- **Context:** Climax of the session.

---

### Phase 4: Reliability & Polish

#### Commit 15: `backend: session cleanup`
- **What:** Memory management.
- **Action:** On WS `close` or `ERROR`, remove room from `RoomManager`.
- **Verify:** Log room count on disconnect.
- **Context:** Prevents memory leaks.

#### Commit 16: `backend: heartbeat implementation`
- **What:** Keepalive.
- **Action:** Every 30s, send `HEARTBEAT`. Expect response. If no response, close.
- **Verify:** Check network traffic in devtools.
- **Context:** Mobile browsers often kill idle sockets.

#### Commit 17: `backend: env validation`
- **What:** Fail fast.
- **Action:** Throw error on startup if `LITELLM_API_KEY` is missing.
- **Verify:** Start server without `.env`; check for error.
- **Context:** Robustness.

#### Commit 18: `backend: transcript sanitization`
- **What:** Basic security.
- **Action:** Strip HTML tags from transcripts before sending to LLM.
- **Verify:** Test with `<script>hello</script>`.
- **Context:** Security hygiene.

#### Commit 19: `backend: server logging`
- **What:** Observability.
- **Action:** Use a clean console logger for: "Room [ID] Created", "Room [ID] Paired", "Synthesis Success".
- **Verify:** Watch the terminal during a session.
- **Context:** Vital for hackathon debugging.

#### Commit 20: `backend: final verify`
- **What:** Full loop.
- **Verify:** Two `wscat` sessions can complete a full synthesis.
- **Context:** Ready for Phase 3 integration.
...
Line count 300+.
