# Josh Talk AI · Rural Pulse

Field data capture, review and payout prototype for AI village-asset mapping.

**Open `index.html` in any browser.** Nothing is installed, nothing is fetched — the app
runs entirely offline (no CDN, no webfont, no network calls).

---

## Responsive behaviour

| Viewport | What you get |
| --- | --- |
| **Phone (≤ 899 px)** | Full-bleed native app — real top bar, scrolling content, bottom tab bar, raised capture button. Safe-area insets respected. |
| **Desktop (≥ 900 px)** | The same app rendered at **390 × 844** (iPhone 13/14 logical size), centred on a neutral canvas. |

**There is no fake device chrome.** The desktop preview has no mock status bar, no
dynamic island and no home indicator, so the pixels inside the frame are exactly
what a phone shows — the only difference is the rounded preview container around
them. Prototype controls sit outside the frame at the bottom-right.

---

## Files

```
index.html    markup + all screens
styles.css    design tokens, layout, device frame, components
app.js        state, routing, image pipeline, review workflow
photos.js     offline "photograph" renderer (canvas → JPEG data URLs)
dev/          test tooling (see below)
```

### `photos.js`

There are no stock photos and no logo placeholders. `photos.js` draws plausible
village-asset photographs to a canvas — sky gradient with sun bloom and clouds,
blurred distant ridge, varied tree line, textured ground, buildings/wells/roads/
poles per asset type, lens vignette, filmic grade and sensor grain — then encodes
them as JPEG data URLs. The same renderer produces the Do/Don't examples in the
photo guide (dark / blurred / cropped / people variants), so the guide and the
feed look like the same village.

---

## The screens

**Contributor** — Onboarding (language → OTP → profile → base station → rules &
consent) · Home · Capture · Location · Categories · Describe · Review · Done ·
History · Earnings · Settings · Help

**Review desk** — Settings → *Review Desk* (staff code `2468`, or the briefcase
button in the desktop rail). Inspect a photo with real per-photo checks, approve
and pay, flag for a supervisor, or reject with a mandatory reason and a note the
contributor can act on.

**Deep links** — `index.html#scr-earnings` opens straight to a screen.

---

## Guided tour

On first run the app walks the user through the five things that matter — take a
photo, your money, the mapping-health score, fixing rejections, offline mode —
with a spotlight on each one and a card explaining it. It is replayable any time
from the bell icon in the header or *Settings → See the feature tour*.

---

## Layout notes

- **Header** — Josh Talks logo mark + "Josh Talk AI", language pill, connection
  chip (tap to sync), notifications, avatar.
- **Footer** — `Home · History · Capture · Earnings · Settings`, with the camera
  raised above the other four as the primary action.
- **Every screen keeps 132 px of clearance below its last element**, so the
  footer can never cut off a button at the bottom of the scroll.
- The mapping-health gauge centres its score inside the ring; the settings list
  rows use a fixed icon column so every icon and label lines up.
- Icons are hand-drawn inline SVG, including the bank-with-plus badge on
  *Change UPI ID*, so nothing depends on an icon font or an image request.

---

## Prototype controls

| Where | Control |
| --- | --- |
| Top bar | language pill, connection chip (tap to sync), notifications, avatar |
| Desktop rail | dark theme, simulate offline, review desk, reset demo data |
| Settings | appearance, offline simulation, sync now, language, base station, privacy notice, reset |

---

## Behaviour that is real, not mocked

- **Offline queue** — submit with no signal and the photo is stored on the device
  as *Waiting to send*; it is invisible to the reviewer until it syncs. Turning
  the signal back on sends it automatically.
- **One source of truth for every number** — credited, in-review, queue depth,
  filter counts, the mapping-health gauge and the village goal are all derived
  from the records array. Nothing is hard-coded.
- **Real image pipeline** — the picked photo is resized and re-encoded on device;
  the file shows the actual before/after size, the real pixel dimensions and the
  real GPS found inside the file's EXIF. If there is no GPS, the app says so and
  offers the device GPS instead of inventing a location.
- **Real quality audit** — brightness, contrast and sharpness (Laplacian
  variance) are measured from the pixels, with a plain-language fix for each
  failure.
- **Real duplicate detection** — a 64-bit average hash per photo, compared with
  Hamming distance against everything already submitted from that village.
- **Real speech** — the "Bolkar suniye" button uses `speechSynthesis` in the
  selected language, and the description field uses the Web Speech API with the
  chosen language. If the device cannot do it, it says so.
- **Privacy flags** — people / private property / readable signboard are captured
  with the photo and surfaced to the reviewer.
- **Consent step** — the rules-and-consent screen states that photos and GPS
  coordinates may be published in an open dataset, and must be accepted before
  the first submission.

---

## Accessibility

- 14 px type floor, 46 px touch targets, 44 px icon buttons.
- Real form semantics: every input has a `<label>`, radio groups use native
  inputs, error states are announced.
- `prefers-reduced-motion` and `prefers-contrast` are respected.
- Zoom is not blocked (`user-scalable=no` removed).
- Status messages live in an `aria-live` region; icons are inline SVG with
  `aria-hidden`.
- Light and dark themes both meet WCAG AA for body text.

---

## Tests

```bash
node dev/check-ids.js        # every #id used in app.js exists in index.html
node dev/build-smoke.js --run   # 55-check integration test in headless Chromium
```

The smoke test drives the real UI in a headless browser: it submits a photo
while offline, proves the reviewer cannot see a queued photo, restores the
connection and proves the photo syncs into the queue, approves it and checks the
wallet moves from ₹180 to ₹190, then verifies duplicate detection, the rejection
reason shown to the contributor, UPI re-authentication and the accessibility
checks.

---

## Notes

- The header uses an inline SVG recreation of the Josh Talks mark (blue circle +
  orange mic badge) so it stays crisp at any size and needs no image request.
  The original `josh_talks_logo.png` is in this folder if you want to swap the
  real asset in.
- Data lives in `localStorage` under `ruralpulse.v1`. *Settings → Reset demo
  data* restores the seeded 24 records.
- Seeded photos are generated at first run, so the very first load takes a
  moment; after that they are cached.
