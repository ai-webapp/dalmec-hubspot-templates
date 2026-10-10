---
name: hubspot-translate-landing
description: >-
  Universal HubSpot landing translation process (IT → EN/FR/DE/ES): portal gate,
  mandatory field inventory (page params + module defaults + layout globals +
  hardcoded theme strings), AI translate, draft/publish write. Use for any
  HubSpot CMS landing when the user asks to translate a landing, or when a
  project skill (aesse-translate-landing, dalmec-translate-landing) defers to
  this process. Keep project adapters in the project skill.
disable-model-invocation: true
---

# HubSpot — Translate landing (universal process)

**Process version:** `v1` — keep Aesse, Dalmec, and future project skills aligned
with this file. Project skills only add an **adapter** (theme paths, filters,
tone, module IDs). They must not invent a shorter workflow that skips inventory.

Speak to the user in **Italian**; keep HubSpot terms in English.

## Language map

| Choice | Code | Default slug |
|--------|------|--------------|
| ENG | `en-gb` | `eng` |
| FR | `fr` | `fr` |
| DE | `de` | `de` |
| ES | `es` | `es` |

## Gate (mandatory)
1. Confirm portal (name + hub ID). `hs account list`; `hs account use` only after OK.
2. Ask one question at a time (AskQuestion if available; else numbered options).
3. Wait for **explicit OK** / **scrivi ora** before any HubSpot write.
4. Never ask for tokens in chat. Never print token contents.

## Workflow (do not skip or reorder)

### 1) Load project adapter
If invoked via a project skill, read its **Project adapter** section first
(theme root, template filter, module list, tone, refs path).  
If invoked alone, ask: theme folder + template path pattern + content model hint.

### 2) Pick the source page
```bash
hs api '/cms/v3/pages/landing-pages?limit=100' -a <HUB_ID> --json
```
Filter with the adapter’s `templatePath` rules. Show `name — /slug` (single choice).
Prefer the Italian published (or main) page as source.

### 3) Pick target languages
Multi-select: ENG, FR, DE, ES (one or more).

### 4) Per-language options (ask once, apply to all unless the user differs)
- Slug: default from the map; offer "default" vs "custom".
- Form: same IT form (default) | leave unlinked.
- Legal / privacy URL: keep IT (default) | provide URLs | `#`.
- After writing: leave as draft (default) | publish.

### 5) Write access
Reading works with the CLI key. Writing pages needs Private App scope `content`.

Paste command (user replaces only the placeholder):
```bash
printf '%s' 'INCOLLA_QUI_IL_TOKEN' > /tmp/hs_service_token && chmod 600 /tmp/hs_service_token && [ -s /tmp/hs_service_token ] && echo OK || echo Manca
```

Verify: `[ -s /tmp/hs_service_token ] && echo "OK" || echo "Manca"`.  
If the shell shows `quote>` / `cmdand quote>`, tell them **Ctrl+C** and retry on one line.  
Never print the token. Delete `/tmp/hs_service_token` at end of run (also on error).

### 6) Field inventory — MANDATORY screening (before any translation)

**Goal:** map every human-readable string the visitor can see, including text that
is **not** stored on the page because HubSpot falls back to module / template defaults.

#### 6.1 Fetch source
`GET /cms/v3/pages/landing-pages/<IT_ID>/draft`  
Save under the adapter refs path when useful (e.g. `it-draft.json`).

#### 6.2 Detect content model (can be hybrid)
| Model | Where text lives | Typical templates |
|-------|------------------|-------------------|
| A — In-page HubL | `{% text %}` / `{% rich_text %}` / `{% form %}` on the page + template `value=` / `html=` defaults | `micsaemme/.../evento.html` |
| B — DnD modules | `layoutSections.*.rows` → `custom_widget.params` + each module’s `fields.json` defaults | `dalmec/.../promo.html`, `event-theme/.../landing-evento*.html` |
| C — Layout globals | Named modules in the layout (`{% module "site_header" %}`, footer, sticky CTA) → page `widgets.<name>.body` or theme defaults | `event-theme` `layouts/base.html` |

Record which of A/B/C apply. Do not assume only DnD or only in-page fields.

#### 6.3 Discover module / field sources
1. **DnD:** walk every `custom_widget` in `layoutSections` (any `dnd_area` / `main_dnd` name; rows may be keyed `"0"`).
2. **Globals:** read the page template + `layouts/base.html` (fetch theme from Design Manager if not local) for `{% module "…" %}`. Those names are `widgets` keys.
3. **In-page HubL:** parse template for `{% text "name" … value="…" %}` / rich_text / form response messages.
4. **Theme files:** for each module used, load `modules/<id>.module/fields.json` (local or `hs cms fetch`).

#### 6.4 Build the inventory rows
For every candidate string, one row:

| Column | Meaning |
|--------|---------|
| `surface` | `dnd` \| `widget` \| `hubl` \| `theme_hardcoded` |
| `module` | Module label / path / HubL group |
| `path` | Dotted path (e.g. `params.intestazione.titolo`, `widgets.site_footer.body.descrizione`) |
| `source` | `page` (explicit on draft) \| `default` (from fields.json / HubL value=) \| `hardcoded` (literal in `.html`/`.js`) |
| `value_it` | Current Italian (or source) text |
| `action` | `translate` \| `must_set` \| `keep` \| `theme_report` |

**Rules for `action`:**
- Human-readable text on page → `translate`.
- Field **missing or empty** on page but `fields.json` / HubL default is non-empty Italian → `must_set` (you **must** write an explicit translated value on the target page; otherwise the EN page still shows IT defaults).
- URLs, ids, colors, numbers-only, form_id, anchors kept as anchors → `keep`.
- Literal UI chrome in module/template HubL/JS with **no field** (e.g. `Modera:`, skip link) → `theme_report` (list in open items; do not pretend the page PATCH fixes it unless the user asks for a theme change).

Skip keys (never treat as copy):  
`path`, `src`, `href`, `url`, `form_id`, `type`, `width`, `height`, `color`, `css`, `child_css`, `css_class`, `schema_version`, `smart_type`, `smart_objects`, `wrap_field_tag`, `id`, `module_id`, and adapter-specific keep keys (phones, codes, etc.).

#### 6.5 Merge algorithm (DnD / widgets)
```
effective_params = deep_merge(fields.json defaults, page params)
# page params win when present and non-empty
# empty string "" on page may still fall back to default in HubSpot — treat "" as must_set if default is IT copy
```
Same for `widgets.<instance>.body` vs module defaults.

#### 6.6 Inventory gate (show the user)
Before translating, report briefly:
- Content model(s) detected
- Counts: `translate` / `must_set` / `theme_report`
- Top `must_set` examples (module + path)
- `theme_report` list (hardcoded)

Then continue to translation of **all** `translate` + `must_set` rows.  
Do **not** skip `must_set` even if the preview “looks” translated.

Save inventory JSON under adapter refs when useful: `field-inventory-<lang>.json`.

### 7) Translate (agent, per language)
- Translate every inventory row with `action` in (`translate`, `must_set`).
- Tone: from project adapter.
- Keep HTML tags and in-page anchors; localize visible date words when appropriate.
- Leave strings already in the target language.
- Forms: keep `form_id`; translate success / response message only (unless adapter says otherwise).
- Set `htmlTitle`, `metaDescription`, `language`.
- Re-scan payload against inventory: any IT value still on a `translate`/`must_set` path → fix before asking to write.

Show a short preview (hero title + primary CTA + one global if any + form/contact title)  
and ask: **scrivi ora** | modifica | annulla.

### 8) Create or update the target page
For each language, find landing with target slug.
- **Exists:** `PATCH .../landing-pages/<ID>/draft` with `name`, `htmlTitle`, `metaDescription`, `language`, `slug`, and all surfaces used (`layoutSections` and/or `widgets` and/or in-page fields).
- **Missing:** try `POST .../multi-language/create-language-variation`  
  `{ "id": "<IT_ID>", "language": "<code>" }`.

  **Known failure:** `400 Primary … does not have language set` → clone:  
  `POST .../clone` `{ "id": "<IT_ID>", "cloneName": "<name> (<LANG>)" }` then PATCH slug + language + fields.

  Trust patched `slug` (public `url` may lag until publish).
- Publish only if chosen: `POST .../draft/push-live`.

Write with `curl` + `Authorization: Bearer $(cat /tmp/hs_service_token)` and  
`--data-binary @/tmp/<file>.json`. Prefer curl for large bodies (`hs api --data` is a JSON **string**, not `@file`).  
Stop on first error.

### 9) Verify and report
- Re-read draft/live via API.
- Spot-check inventory paths that were `must_set` and global `widgets`.
- Confirm `theme_report` items are listed as open (unless a theme fix was requested and done).
- Report per language: page ID, slug, URL, draft/published, open items.
- `rm -f /tmp/hs_service_token`.

## Out of scope (unless user explicitly asks)
- Unrelated theme refactors
- Translating HubSpot form field labels (shared form)
- Image / file asset replacement
- Email templates (unless adapter includes them)

## Alignment rule for project skills
Project skills (`aesse-translate-landing`, `dalmec-translate-landing`, future):
1. Point to this process (`hubspot-translate-landing` v1).
2. Keep only a **Project adapter** (paths, filters, tone, module catalog, known hardcoded list).
3. Must include step **6 Field inventory** — never jump from “read draft” to “translate sparse params only”.
