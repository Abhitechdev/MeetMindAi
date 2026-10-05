# Hyperframes Composition Brief: MeetMind AI

## Objective
Create a short, polished, shareable launch/product demo video for MeetMind AI.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 20 seconds

## Source Material
- Project root: `D:\MeetingMindAI`
- Primary files read: `frontend/app/page.tsx`, `frontend/app/components/hero-section.tsx`, `frontend/app/components/interactive-sample-viewer.tsx`, `frontend/app/globals.css`
- Product name: MeetMind AI 2.0
- Tagline / strongest claim: "Transform Meetings Into Actionable Intelligence"
- Key UI or visual moment to recreate:
  - Frosted glass file drop zone with `Q3-Product-Sync.m4a`
  - GPU Whisper processing status bar
  - Structured output viewer: Executive Summary, Key Decisions, and Action Items cards
- Copy that must appear verbatim:
  - "Transform Meetings Into Actionable Intelligence"
  - "No awkward bots in your calls"
  - "GPU Whisper transcription"
  - "Executive Summary", "Key Decisions", "Action Items"
  - "Try it Free → meetmindai.com"

## Creative Direction
- Tone preset: polished
- Creative direction: sleek, futuristic, high-clarity Silicon Valley AI product demo
- Interpretation: Restrained, confident typography, smooth ease-out transitions, luminous dark mode styling.
- Angle: Emphasize the speed and privacy: no bots joining calls, drag & drop audio, instant executive intelligence.
- Hook: 0.0s - 4.5s: Aurora glow, pill badge, bold headline slam.
- Outro: 15.5s - 20.0s: Gradient logo with glowing CTA button.

## Visual Identity
- Background: `#0A0A0A`
- Surface: `#111111`
- Accent Purple: `#6E79D6`
- Accent Blue: `#4078F2`
- Text: `#EDEDED`
- Muted: `#888888`
- Success: `#10B981`
- Display font: Inter, system-ui, sans-serif
- Body font: Inter, system-ui, sans-serif

## Storyboard
1. Scene 1 (0.0s - 4.5s): Hook & Headline ("Transform Meetings Into Actionable Intelligence")
2. Scene 2 (4.5s - 9.0s): File Upload & GPU Whisper Processing (`Q3-Product-Sync.m4a`)
3. Scene 3 (9.0s - 15.5s): Structured AI Intelligence (Executive Summary, 3 Decisions, 3 Action Items)
4. Scene 4 (15.5s - 20.0s): Brand Outro & CTA ("Try it Free → meetmindai.com")

## Audio
- Audio role: warm modern tech bed with crisp UI accents
- Music: `assets/music/track.mp3`
- Music treatment: Starts at 0s at 0.7 volume, fades out from 18s to 20s.
- Music cue guidance:
  - 1.60s (strong beat): Headline lock
  - 5.00s: Drop click
  - 5.80s (strong beat): Processing progress start
  - 8.50s: Success bell chime
  - 11.0s, 11.6s, 12.2s: Key decisions reveal
  - 12.65s (strong beat), 13.2s, 13.7s: Action items reveal
  - 17.91s (strong beat): Outro logo & bell
- Audio-coupled moments:
  - 1.60s: Soft impact reveal (`assets/sfx/reveal.ogg`)
  - 5.00s: Drop click (`assets/sfx/click.ogg`)
  - 8.50s: Success chime (`assets/sfx/bell.ogg`)
  - 11.0s - 13.7s: Pops on card arrivals (`assets/sfx/pop.ogg`)
  - 17.91s: Outro bell (`assets/sfx/bell.ogg`)
- SFX files: all copied into `assets/sfx/`

## Hyperframes Requirements
- Single paused root timeline: `window.__timelines["main"] = tl;`
- Timed elements have `data-start`, `data-duration`, and `.clip` where appropriate.
- Total duration: 20 seconds (`data-duration="20"`).
- Contrast check compliant (ensure high contrast on all text elements).
