---
name: dalmec-duplicate-en
description: >-
  Duplicates a ready Italian DalMec HubSpot landing (theme dalmec / template
  promo) into an English page instance and AI-translates module field content.
  Use when the user says "duplica in EN", "usa dalmec-duplicate-en", or asks to
  clone the IT landing to English.
disable-model-invocation: true
---

# DalMec — Duplicate landing IT → EN

## Goal
Create an **English landing page instance** from a completed Italian page that
uses theme `dalmec` / template `promo`. Same modules; translated field values.
Do **not** invent HubL APIs. Do **not** upload theme code unless the user asks.

## Preconditions
- Italian landing exists and content is approved (not placeholder-only MVP).
- Portal known (default from PRD: Bizen Test, hub ID `2662982`).
- Theme path Design Manager: `dalmec/`; template: `promo`.

## Gate (mandatory)
1. Confirm portal name + hub ID.
2. Confirm IT page URL or page ID + desired EN slug (e.g. `/en/gold-10`).
3. Wait for **explicit OK** before any HubSpot write (create/update page).

## Workflow

### 1) Collect inputs
Ask in one batch if missing:
- IT landing URL or HubSpot page ID
- EN slug / path
- Form strategy: same form | separate EN form | leave unlinked
- Legal URLs: keep IT | EN URLs provided | placeholder `#`

### 2) Read IT content
Extract editable module/page fields from the IT instance (CMS API or Design
Manager / page editor export the user provides). Prefer structured field maps
over scraping HTML.

Cover at least these modules when present:
`lp-header`, `lp-hero`, `lp-key-numbers`, `lp-feature-rows`, `lp-functions-grid`,
`lp-product-closeup`, `lp-performance`, `lp-models`, `lp-sectors`,
`lp-contact-form`, `lp-footer`.

Skip: image binaries (reuse IT assets unless EN assets are provided), theme
style tokens, module structure / order.

### 3) Translate
- Target: **en-GB or en-US** — ask once if unclear; default **en-GB**.
- Tone: B2B technical product sheet (DalMec), not marketing fluff.
- Keep numbers, units, model codes (`PBCG106AC`, kg, °C, mm) unchanged.
- Do **not** treat IT claims as newly validated; translate wording only.
- CTA labels: natural EN equivalents (e.g. "Richiedi un preventivo" →
  "Request a quote").
- Anchors (`#contatti`, `#modelli`) stay unless EN page uses different IDs
  (default: keep).

### 4) Duplicate page
- Clone IT landing to a new page on the **same** template `promo` / theme `dalmec`.
- Set EN slug and page language/meta title/description in English.
- Apply translated field values to modules.
- Form: per step 1 strategy.
- If HubSpot API clone is unavailable, instruct the user to duplicate in UI,
  then apply EN field values to the new page (still after OK).

### 5) Deliver
Return:
- EN page URL (preview + public if known)
- Short list of fields translated
- Open items: form, privacy/cookie links, EN PDFs, hreflang (out of scope unless asked)

## Out of scope
- Visitor-facing "Duplicate in English" button on the live landing
- FR/DE (reuse this skill pattern later with target language param)
- Theme/module code changes
- Email templates
- Inventing technical specs not present in IT

## Trigger phrases (user)
- `usa dalmec-duplicate-en`
- `duplica in EN`
- `duplica la landing in inglese` + URL/ID

## Response language
Speak to the user in **Italian**. Keep HubSpot terms in English
(template, module, slug, portal).
