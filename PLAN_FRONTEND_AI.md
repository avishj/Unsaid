# PLAN: The Listener (`feat/frontend-ai-audio`)

## Goal: High-Fidelity Private Listening
Implement local speech-to-text (Whisper) and the unburdening UI using Transformers.js. Privacy is absolute; audio never leaves the browser.

---

### Phase 1: The AI Worker (Local Engine)

#### Commit 1: `ai: install transformers.js`
- **What:** `bun add @xenova/transformers`.
- **Verify:** Confirm dependency is listed in `frontend/package.json`.
- **Context:** Zero-latency, on-device transcription engine.

#### Commit 2: `ai: whisper worker init`
- **What:** Create `src/workers/whisper.worker.ts`. 
- **Action:** Define the `onmessage` handler. Import `pipeline` from the ESM bundle.
- **Verify:** A simple `postMessage` from main thread returns a confirmation log.
- **Context:** Decouples heavy AI compute from the UI thread (Track A).

#### Commit 3: `ai: load tiny.en model`
- **What:** Worker initialization.
- **Action:** 
  ```typescript
  const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
  ```
- **Verify:** Console log: "Whisper Pipeline Ready".
- **Context:** `tiny.en` is ~40MB—fast enough for a hackathon.

#### Commit 4: `ai: download progress emitter`
- **What:** Progress tracking.
- **Action:** Use the `progress_callback` in the pipeline to emit `{ status: 'progress', percentage }`.
- **Verify:** Progress bar in the `WaitingView` UI fills up.
- **Context:** User feedback during the 5-10 second model download.

#### Commit 5: `ai: useWhisper hook logic`
- **What:** Create `src/hooks/useWhisper.ts`. 
- **Action:** Use a `Ref` to store the worker instance. Expose `isReady`, `isRecording`, and `transcript`.
- **Verify:** `isReady` becomes true only after the worker signals readiness.
- **Context:** The main reactive bridge for the active phase.

---

### Phase 2: Audio Capture & Signal Chains

#### Commit 6: `ai: media recorder setup`
- **What:** Microphone API.
- **Action:** Use `navigator.mediaDevices.getUserMedia({ audio: true })`. 
- **Verify:** Mic permission prompt appears on entering `AppPhase.ACTIVE`.
- **Context:** Essential security/permission step.

#### Commit 7: `ai: audio resampler logic`
- **What:** Format audio for Whisper.
- **Action:** 
  - Convert `AudioBuffer` to `Float32Array`.
  - Resample to `16000 Hz`.
- **Verify:** Log the array size and first 5 values (should be between -1 and 1).
- **Context:** Whisper *only* accepts 16kHz float32. Failure here = 0% accuracy.

#### Commit 8: `ai: live transcription flow`
- **What:** Chunked processing.
- **Action:** Send 2000ms audio chunks to the worker. Append results to the local state.
- **Verify:** Words appear in the text area as you speak.
- **Context:** Creates the feeling of being "heard" in real-time.

#### Commit 9: `ai: transcript buffer sync`
- **What:** Update the global store.
- **Action:** On every new transcribed segment, update `useSessionStore.getState().setTranscript(...)`.
- **Verify:** Typing or speaking both populate the same store variable.
- **Context:** Unified data source for the final submission.

#### Commit 10: `ai: rms visualizer hook`
- **What:** Volume sensing.
- **Action:** Create `useAudioVisualizer`. Calculate Root Mean Square (RMS) of the incoming audio stream.
- **Verify:** A number (0 to 1) updates rapidly as you make noise.
- **Context:** Track A uses this to make the Three.js orb pulse with the user's voice.

---

### Phase 3: Presence & Empathy

#### Commit 11: `ai: silence detection heuristic`
- **What:** Detect pauses.
- **Action:** Reset a 4-second `setTimeout` on every transcription message. If it fires, trigger `onSilence`.
- **Verify:** Stop talking; event fires 4 seconds later.
- **Context:** The "Listener" knows when to gently nudge.

#### Commit 12: `ai: zen prompts dataset`
- **What:** Create `src/utils/zenPrompts.ts`. 
- **Action:** List: ["Take a breath.", "I hear you.", "Is there more?", "What are you feeling right now?"].
- **Verify:** Array of strings ready. No advice, only presence.
- **Context:** High-signal, low-ego AI persona.

#### Commit 13: `ai: empathetic prompt component`
- **What:** Create `EmpatheticPrompts.tsx`.
- **Action:** Subtle floating text. GSAP `y: -20, opacity: 0` entrance. 
- **Verify:** Prompt appears and fades away after 5 seconds.
- **Context:** Non-intrusive emotional support.

#### Commit 14: `ai: voice status ws sync`
- **What:** Presence broadcasting.
- **Action:** If `isRecording`, emit `STATUS_UPDATE` via WS with `status: 'speaking'`.
- **Verify:** Partner's screen shows a pulse indicator.
- **Context:** Closing the loop on shared presence.

#### Commit 15: `ai: text fallback mode`
- **What:** Hybrid input.
- **Action:** A simple "Or type instead" button that hides the mic and shows a textarea.
- **Verify:** preserves the existing voice-transcribed text.
- **Context:** Essential for users who find speaking too intense or have hardware issues.

---

### Phase 4: Finalization & Performance

#### Commit 16: `ai: indexeddb caching`
- **What:** Model persistence.
- **Action:** Ensure the worker options use the default `Cache` storage for models.
- **Verify:** Refresh the page; "Model Ready" happens in <500ms.
- **Context:** Production-grade UX.

#### Commit 17: `ai: error handling (permissions)`
- **What:** Fallback logic.
- **Action:** If `getUserMedia` fails, toast an error and auto-switch to `TextFallback`.
- **Verify:** Deny mic; UI handles it gracefully.
- **Context:** Resilience.

#### Commit 18: `ai: finish button sequence`
- **What:** Submission.
- **Action:** "I've said it all" button. Stop mic. Call `SUBMIT_TRANSCRIPT` on the WS client.
- **Verify:** Store enters `AppPhase.SYNTHESIS`.
- **Context:** The transition to waiting for the partner.

#### Commit 19: `ai: audio worklet throttle`
- **What:** CPU optimization.
- **Action:** Only process VAD/RMS every 100ms.
- **Verify:** No UI jank during heavy speech.
- **Context:** Maintains 60FPS visuals (Track A).

#### Commit 20: `ai: final verification`
- **What:** Full unburdening test.
- **Verify:** Speak for 30 seconds; see accurate text and RMS pulses.
- **Context:** Ready for Phase 3 integration.
