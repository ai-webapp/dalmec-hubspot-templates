---
name: dalmec-translate-landing
description: >-
  Translates an Italian DalMec HubSpot landing (template promo, theme dalmec or
  LPprodotto) into one or more languages (EN, FR, DE, ES): lists the portal
  pages, lets the user pick the source page and the target languages via
  multiple choice, AI-translates module fields and writes one page per language.
  Use when the user says "usa dalmec-translate-landing", "traduci la landing",
  or asks to translate a DalMec landing into other languages.
disable-model-invocation: true
---

# DalMec — Translate landing IT → EN / FR / DE / ES

## Goal
Starting from a published Italian landing, create or update one landing per
target language on the same template. The agent translates the text itself;
no runtime JavaScript, no external translation service.

Speak to the user in **Italian**; keep HubSpot terms in English.

## Language map

| Choice | Code | Default slug |
|--------|------|--------------|
| ENG | `en-gb` | `eng` |
| FR | `fr` | `fr` |
| DE | `de` | `de` |
| ES | `es` | `es` |

## Gate (mandatory)
1. Confirm portal (name + hub ID). Check with `hs account list`; switch with
   `hs account use <alias>` only after the user confirms.
2. Ask one question at a time (AskQuestion if available; otherwise numbered
   chat options). Do not batch unrelated choices.
3. Wait for **explicit OK** / **scrivi ora** before any HubSpot write.
4. Never ask for tokens in chat. Never print token contents.

## Workflow

### 1) Pick the source page
```bash
hs api '/cms/v3/pages/landing-pages?limit=100' -a <HUB_ID> --json
```
Keep pages whose `templatePath` ends with `templates/promo.html`. Show them
as `name — /slug` (single choice). Prefer the Italian published page as source.

### 2) Pick target languages
Multi-select: ENG, FR, DE, ES (one or more).

### 3) Per-language options (ask once, apply to all unless the user differs)
- Slug: default from the map; offer "default" vs "custom".
- Form: same IT form (default) | leave unlinked.
- Legal links (privacy/cookie): keep IT (default) | provide URLs | `#`.
- After writing: leave as draft (default) | publish.

### 4) Write access
Reading works with the CLI key. Writing pages needs the `content` scope
(Private App token).

Give the user this **single** paste command (they replace only the placeholder):
```bash
printf '%s' 'INCOLLA_QUI_IL_TOKEN' > /tmp/hs_service_token && chmod 600 /tmp/hs_service_token && [ -s /tmp/hs_service_token ] && echo OK || echo Manca
```

Verify with:
```bash
[ -s /tmp/hs_service_token ] && echo "OK" || echo "Manca"
```

If the shell shows `quote>` / `cmdand quote>`, tell them to press **Ctrl+C** and
retry the command on one line.

Check only that the file exists and is non-empty. Never print it.
Delete it at the end of the run (`rm -f /tmp/hs_service_token`), also on error.

### 5) Read the source content
Fetch the draft: `GET /cms/v3/pages/landing-pages/<IT_ID>/draft`.

Critical: module text not edited in the page editor is **not** stored in the
page JSON (the module renders its defaults). For each DnD row in
`layoutSections.main_dnd.rows`, build the full params as:
`defaults from dalmec/modules/<module>.module/fields.json` + `page params`
(page params win). Do the same for `widgets.lp_header` / `widgets.lp_footer`.

**Row shape (promo template):** rows are objects keyed `"0"` (not always
`columns`), e.g. `rows[0]["0"].params`.

Modules: `lp-hero`, `lp-key-numbers`, `lp-feature-rows`, `lp-functions-grid`,
`lp-product-closeup`, `lp-performance`, `lp-models`, `lp-sectors`,
`lp-contact-form`, `lp-header`, `lp-footer`.

**Reuse refs when present** (same product landing):
- `tasks/refs/dalmec-landing/en-page-payload.json` — full merged EN payload
- `tasks/refs/dalmec-landing/fr-page-payload.json` — full merged FR payload

You may deep-copy a complete payload and re-translate, or merge IT draft +
module defaults then translate. Prefer a complete merged payload over a
sparse page draft.

### 6) Translate (agent does it, per language)
Translate only human-readable string values. Never change these keys:
`path`, `src`, `href`, `url`, `form_id`, `type`, `width`, `height`, `color`,
`icona`, `posizione_x`, `posizione_y`, `css`, `child_css`, `css_class`,
`schema_version`, `smart_type`, `smart_objects`, `wrap_field_tag`, `id`,
`anchor_id`, `tipo`, `module_id`, `codice`, `telefono`, `email`, `piva`.

Rules:
- B2B technical product-sheet tone, no marketing fluff.
- Keep numbers, units, model codes (`PBCG106AC`, kg, °C, mm, GN 1/1) unchanged.
- Keep HTML tags (`<p>`, `<br>`) and anchors (`#contatti`, `#modelli`).
- Leave untouched any string that is already in the target language.
- `lp-models` downloads: if an item has `label` but no `download_label`,
  copy it to `download_label` before translating.
- Contact form: keep `form_id`; translate only `form.message`.
- Also translate `htmlTitle` and `metaDescription`; set `language` to the code.
- Scan the payload for leftover source-language CTAs before asking to write.

Show a short preview per language (hero title + CTA, contact title, header CTA)
and ask: **scrivi ora** | modifica | annulla.

### 7) Create or update the target page
For each language, look for an existing landing with the target slug.
- **Exists:** `PATCH /cms/v3/pages/landing-pages/<ID>/draft` with
  `name`, `htmlTitle`, `metaDescription`, `language`, `slug`,
  `layoutSections`, `widgets`.
- **Missing:** try `POST /cms/v3/pages/landing-pages/multi-language/create-language-variation`
  with `{ "id": "<IT_ID>", "language": "<code>" }` (linked variant, automatic
  hreflang).

  **Known failure:** if the primary page has no `language` set, HubSpot returns
  `400 Primary … does not have language set`. Fall back to clone:

  `POST /cms/v3/pages/landing-pages/clone` with
  `{ "id": "<IT_ID>", "cloneName": "<name> (<LANG>)" }`, then `PATCH` the draft
  with the target **slug**, language, and translated fields.

  After clone, HubSpot may assign a temporary slug (e.g. `dalmectest-0`) and
  the `url` field may still show that path until publish — trust the patched
  `slug` from the PATCH response.
- Publish only if chosen: `POST /cms/v3/pages/landing-pages/<ID>/draft/push-live`.

Use `curl` with `Authorization: Bearer $(cat /tmp/hs_service_token)` and
`--data-binary @/tmp/<file>.json`. Stop on the first error and report it.

### 8) Verify and report
- Re-read each page via API (`htmlTitle`, `language`, `slug`, hero CTA).
- If published, fetch the public URL with `?hsCacheBuster=<timestamp>` and
  check that key IT strings are gone.
- Report per language: page ID, slug, URL, draft/published, open items.
- Delete `/tmp/hs_service_token`.

## Verified reference (bizen-test `2662982`)
| Page | ID | Slug | Notes |
|------|-----|------|-------|
| IT source | `223495420425` | `dalmectest` | published |
| EN | `224044917304` | `eng` | published |
| FR | `224062610099` | `fr` | draft after skill test |

## Known open items (report, do not fix unless asked)
Some labels are hard-coded in the theme and stay Italian on every language:
"Specifiche tecniche", "Download", "↓ Scarica", "Richiedi" in `lp-models`, and
the texts inside the generated PDF (`lp-models.module/module.js`). Fixing them
is a separate theme change.

## Out of scope
- Theme/module code changes
- Translating the HubSpot form fields (form is shared; user changes it)
- Image or PDF asset replacement
