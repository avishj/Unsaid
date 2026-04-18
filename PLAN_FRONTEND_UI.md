# PLAN: The Sanctuary (`feat/frontend-ui-core`)

## Goal: Cinematic Zen State Machine
This plan covers the visual atmosphere, the Three.js breathing background, and the GSAP orchestration of all user phases. No generic components. High-end aesthetic only.

---

### Phase 1: The Emotional Visuals (Three.js)

#### Commit 1: `ui: setup r3f scene`
- **What:** Create `src/components/canvas/Scene.tsx`. 
- **Action:**
  ```tsx
  <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
    <color attach="background" args={['#050505']} />
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} />
    <Suspense fallback={null}>
      <BreathingOrb />
    </Suspense>
  </Canvas>
  ```
- **Verify:** Black screen with light active (placeholder cube visible).
- **Context:** The constant background. It must be decoupled from the HTML to avoid jank.

#### Commit 2: `ui: impl breathing orb`
- **What:** Create `BreathingOrb.tsx`. 
- **Action:** Use `IcosahedronGeometry(2, 64)`. Apply a `MeshDistortMaterial`.
- **Verify:** A sphere appears with slight wobbling.
- **Context:** The machine as a living, breathing entity.

#### Commit 3: `ui: noise-driven distortion`
- **What:** Refine the material.
- **Action:** 
  ```tsx
  <MeshDistortMaterial
    color="#1a1a1a"
    roughness={0.1}
    metalness={0.8}
    distort={0.4}
    speed={2}
  />
  ```
  Use `useFrame` to subtly shift the `distort` value based on `Math.sin(state.clock.elapsedTime)`.
- **Verify:** The orb should look organic and constantly shifting.
- **Context:** Visualizing the core belief/fear that is shifting.

#### Commit 4: `ui: bloom post-processing`
- **What:** Add `EffectComposer`.
- **Action:** Use `Bloom` with `intensity={1.5}` and `luminanceThreshold={0.1}`. Add `Noise` at `0.05` opacity.
- **Verify:** The orb has a heavenly glow; filmic grain covers the screen.
- **Context:** Elevates the UI from "web app" to "experience".

#### Commit 5: `ui: orb responsiveness`
- **What:** Responsive camera.
- **Action:** Update `fov` based on viewport width (`window.innerWidth < 768 ? 60 : 45`).
- **Verify:** Orb remains a comfortable size on both desktop and mobile.
- **Context:** Critical for mobile venters.

---

### Phase 2: State Orchestration (Zustand & GSAP)

#### Commit 6: `ui: phase router component`
- **What:** Create `src/components/PhaseRouter.tsx`. 
- **Action:** Use a `switch(phase)` to render `Landing`, `Waiting`, `Active`, `Synthesis`, or `Reveal`.
- **Verify:** Manually toggling the store phase swaps the rendered component.
- **Context:** The spine of the application.

#### Commit 7: `ui: gsap crossfade transitions`
- **What:** Create a `FadeWrapper.tsx` component.
- **Action:** Use `useLayoutEffect` and GSAP to `fade out` the old view and `fade in` the new one on phase change.
- **Verify:** Transitions between phases take 1 second and look smooth.
- **Context:** Avoids jarring UI jumps; maintains the zen mood.

#### Commit 8: `ui: landing view layout`
- **What:** Create `LandingView.tsx`.
- **Action:** 
  - Typography: `tracking-widest font-serif font-extralight text-4xl`.
  - Button: Transparent with a 1px border, blur background.
- **Verify:** High-end, boutique feel.
- **Context:** First interaction sets the emotional bar.

#### Commit 9: `ui: landing entrance animation`
- **What:** GSAP sequence.
- **Action:** `gsap.from('.headline', { opacity: 0, y: 50, duration: 2, ease: 'expo.out' })`.
- **Verify:** Text drifts gracefully from the bottom on page load.
- **Context:** Sets a slow, deliberate pace.

#### Commit 10: `ui: waiting view ui`
- **What:** Create `WaitingView.tsx`.
- **Action:** Glassmorphism card for the link. "Waiting for someone to join..." text with a slow opacity pulse.
- **Verify:** Link is copyable. UI feels patient.
- **Context:** Phase 2.

---

### Phase 3: Active Presence

#### Commit 11: `ui: spatial transition`
- **What:** Transition logic.
- **Action:** On `WAITING -> ACTIVE`, use GSAP to move the Three.js orb from the center to the top-right corner.
- **Verify:** Visual space opens up for the text area.
- **Context:** Choreographing user attention.

#### Commit 12: `ui: active view interface`
- **What:** Create `ActiveView.tsx`.
- **Action:** Large text area. No borders. Placeholder: "Say what you never could."
- **Verify:** Layout is clean. Typing feels "infinite".
- **Context:** The unburdening phase.

#### Commit 13: `ui: partner status cue`
- **What:** Soft pulse indicator.
- **Action:** A small, blurred circle in the corner that pulses when `partnerStatus === 'speaking'`.
- **Verify:** Real-time feedback from the store.
- **Context:** Shared digital presence.

#### Commit 14: `ui: synthesis phase visuals`
- **What:** Create `SynthesisView.tsx`.
- **Action:** Orb returns to center, distortion increases to `0.8`, color shifts to a warmer gray.
- **Verify:** Sense of "processing" or "churning".
- **Context:** Meditative transition.

---

### Phase 4: The Revelation (Payoff)

#### Commit 15: `ui: reveal view layout`
- **What:** Create `RevealView.tsx`. 
- **Action:** Centers a single line of text at a time.
- **Verify:** Clean typography. No clutter.
- **Context:** The shared truth.

#### Commit 16: `ui: cinematic reveal timing`
- **What:** GSAP Stagger.
- **Action:** 
  ```typescript
  gsap.to('.story-line', { 
    opacity: 1, 
    stagger: 4, // 4 seconds per line
    onStart: () => playSoftChime() 
  });
  ```
- **Verify:** Users are forced to read at a contemplative pace.
- **Context:** Maximum emotional impact.

#### Commit 17: `ui: orb color payoff`
- **What:** Final transition.
- **Action:** Transition orb color from gray to a soft gold over 10 seconds.
- **Verify:** Subtle but profound color shift.
- **Context:** Symbolizes resolution and light.

#### Commit 18: `ui: procedural zen audio`
- **What:** Simple HTML5 Audio.
- **Action:** Fade in a 2-minute ambient loop on the first user click.
- **Verify:** Music is present but non-intrusive.
- **Context:** Audio completes the "digital sanctuary".

#### Commit 19: `ui: global cursor touch`
- **What:** Custom SVG cursor.
- **Action:** A small dot that becomes a ring when hovering links.
- **Verify:** High-end boutique feel.
- **Context:** Final 1% polish.

#### Commit 20: `ui: final audit & cleanup`
- **What:** Pass on all margins/paddings.
- **Verify:** Perfect centering across all device sizes.
- **Context:** Ready for integration.
