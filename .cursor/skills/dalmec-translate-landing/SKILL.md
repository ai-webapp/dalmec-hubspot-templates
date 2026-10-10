---
name: dalmec-translate-landing
description: >-
  Translates an Italian DalMec HubSpot landing (template promo, theme dalmec or
  LPprodotto) into EN/FR/DE/ES using the universal hubspot-translate-landing
  process (mandatory field inventory). Use when the user says
  "usa dalmec-translate-landing", "traduci la landing", or asks to translate a
  DalMec product landing into other languages.
disable-model-invocation: true
---

# DalMec — Translate landing IT → EN / FR / DE / ES

## Process (mandatory)
Follow the universal skill **`hubspot-translate-landing`** (process **v1**)
end-to-end. Path if needed:
`~/.cursor/skills/hubspot-translate-landing/SKILL.md`.

Do **not** skip **Field inventory** (universal step 6). Module text not edited
in the page editor is **not** in the page JSON — HubSpot renders `fields.json`
defaults. Empty strings can still fall back to Italian defaults → inventory
action `must_set`.

Speak Italian to the user; HubSpot terms in English.

## Project adapter

### Themes / templates in scope
| Theme | Template filter (`templatePath`) | Content model |
|-------|----------------------------------|---------------|
| `dalmec` | ends with `templates/promo.html` (path contains `dalmec/`) | B — DnD + widgets header/footer |
| `LPprodotto` | ends with `templates/promo.html` (legacy path) | B — same module set |

### Local sources
- Theme root: `dalmec/` (or legacy `LPprodotto/`)
- Landing: `templates/promo.html`
- Modules: `dalmec/modules/lp-*.module/`
- Refs: `tasks/refs/dalmec-landing/`
- Optional reuse payloads: `en-page-payload.json`, `fr-page-payload.json` (still run inventory; payloads are helpers, not a skip pass)

### Tone
B2B technical product-sheet. No marketing fluff.  
Keep numbers, units, model codes (`PBCG106AC`, kg, °C, mm, GN 1/1) unchanged.

### DnD area name
Often `layoutSections.main_dnd` (confirm on draft). Rows may be objects keyed `"0"`
(not always `columns`), e.g. `rows[0]["0"].params`.

### Layout / widgets globals
Inventory **must** include:
- `widgets.lp_header` (or equivalent header instance on the page)
- `widgets.lp_footer`

Merge each with `lp-header` / `lp-footer` `fields.json` defaults.

### Module catalog (DnD order typical)
`lp-hero`, `lp-key-numbers`, `lp-feature-rows`, `lp-functions-grid`,
`lp-product-closeup`, `lp-performance`, `lp-models`, `lp-sectors`,
`lp-contact-form`, plus `lp-header`, `lp-footer`.

### Keep keys (extra)
Beyond the universal skip list: `icona`, `posizione_x`, `posizione_y`,
`anchor_id`, `tipo`, `codice`, `telefono`, `email`, `piva`.  
Keep anchors `#contatti`, `#modelli`.

### Special field rules
- `lp-models` downloads: if an item has `label` but no `download_label`, copy to
  `download_label` before translating.
- Contact form: keep `form_id`; translate only `form.message`.

### Known `theme_report` (report; fix theme only if user asks)
Hard-coded Italian that stays on every language until a theme change:
- «Specifiche tecniche», «Download», «↓ Scarica», «Richiedi» in `lp-models`
- Texts inside the generated PDF (`lp-models.module/module.js`)

### Verified reference (bizen-test `2662982`)
| Page | ID | Slug | Notes |
|------|-----|------|-------|
| IT source | `223495420425` | `dalmectest` | published |
| EN | `224044917304` | `eng` / `en-gb/eng` | published |
| FR | `224062610099` | `fr` | draft after skill test |

### Out of scope
- Aesse / MICS / `event-theme` → use `aesse-translate-landing` (same universal process)
- Form field labels inside HubSpot Forms
- Image or PDF asset replacement
