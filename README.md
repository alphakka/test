# CutBridge v0.5 — Booking-link, photo-first and privacy-first MVP

## What changed

- Repositioned as a **pre-visit photo delivery companion** — not a mandatory AI questionnaire.
- Three simple routes: desired photo / same as last time / consult on arrival.
- No account, phone number, name, or current face photo required.
- Entirely local photo handling. Image is recompressed via canvas to strip EXIF and constrain resolution; **no image fetch or API call**.
- User explicitly selects their share destination through the native share sheet (`navigator.share`). Desktop fallback: copy memo + download processed photo.
- Optional customer-supplied "avoid" chips feed the stylist note. No claims of machine vision or stylist interpretation.
- Staff-view demo shows **zero** received reservations, and a clearly labeled mocked-up dashboard; does not pretend any submission was received.
- Demo salon links `?salon=...&booking=TEST-...` are presentation-only, **not verified** or linked to Naver bookings.
- The old photo-AI endpoints have been disabled by default (410 Gone) to prevent unauthorized photo uploads.
- Separate `privacy.html` with precise statements about this preview, not a substitute for finalized commercial policy.

## Local preview

Open `index.html` in a current browser or serve the directory with `python -m http.server 8080`.

## Current limitations (important)

- This is **not yet a production booking integration**. The user's device shares a photo with an external app recipient that they themselves choose; salon receipt is not tracked.
- AI never analyses customer photos in v0.5. Image preview means the user-selected photo, **not a generated haircut**.
- No customer file is uploaded to CutBridge; therefore a stylist cannot open an auto-populated reservation list. The staff dashboard is illustrative only.
- Native mobile share availability varies; fallback requires the user to send the downloaded file manually.
- EXIF removal by canvas doesn't anonymize facial imagery or prevent downstream app copies.

## Production launch blockers

1. Verified shop onboarding, salon owner authentication and tenant separation.
2. One-time signed booking links/token exchange tied to a verified reservation; never use customer identifiers in query parameters.
3. Restricted upload endpoints, encrypted private object storage with short-lived signed URLs, logs without full images or PII, upload malware/image validation, no public file URLs.
4. Document lawful basis, privacy notices, separate sharing/AI purposes and applicable transfer provisions, provider DPA, data-subject rights and deletion audit.
5. Automatic expiration/deletion after appointment (short TTL) and prompt deletion on withdrawal; deletion of cached thumbnails and backup consideration.
6. Per-tenant authorization tests, least privilege, abuse/rate limits, size caps, cybersecurity review and legal counsel sign-off.
7. Explicitly verified Naver booking message link policy; no assumption of native embedding or automatic booking data sync.
8. AI API use only after a separate lawful review; default disabled.

## Legal references (Korea, effective Sept 11 2026)

PIPA arts. 3, 15, 17, 21, 29, 30 and 28-8. Details require legal review against the intended actual processor/controller relationship and vendors.