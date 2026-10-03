# DalMec landing prodotto — Template HubSpot (post-PRD)

## 🎯 Obiettivo
Implementare MVP da `tasks/PRD-dalmec-landing.md`: theme `dalmec/`, template `promo` con `{% dnd_area %}`, moduli `lp-*`, form HubSpot (pattern MICS), stile theme da GOLD 10.

## 📋 Task List

### Gate
- [x] 🟢 PRD OK (utente: «parti pure»)
- [x] 🟢 Account gate upload — **OK** bizen-test / 2662982

### Setup
- [x] 🟡 Scaffold theme locale `dalmec/` (`theme.json`, `fields.json` stile, CSS token)
- [x] 🟢 Refs in `tasks/refs/dalmec-landing/`

### Fase A — Landing
- [x] 🟡 Moduli `lp-header` + `lp-footer` (fuori dnd)
- [x] 🔴 Moduli DnD: hero, key-numbers, feature-rows, functions-grid, product-closeup, performance, models, sectors, contact-form
- [x] 🔴 Template `promo.html` con `dnd_area` + default modules
- [x] 🟢 CSS landing (token + componenti + `.hs-form`)
- [x] 🟡 Upload `dalmec` → Design Manager (2662982) — da `/tmp` (fix path `.cursor` + validazione fields/meta)

### Fuori MVP (non ora)
- [ ] Email, istanze IT/EN, logo file, foto finali

## 🎓 Nuovi Concetti
- [ ] HubSpot module (`fields.json` + `module.html` + `meta.json`)
- [ ] `{% dnd_area %}` / Content Remix
- [ ] Form field HubSpot (`type: form` + `{% form %}`)

## ⚠️ Potenziali Problemi
- Non toccare path `micsaemme/` sul portale
- 11 moduli = effort alto; MVP = struttura + placeholder
- Form HTML del ref va sostituito dal form field

## 📚 Risorse
- PRD: `tasks/PRD-dalmec-landing.md`
- Refs: `tasks/refs/dalmec-landing/`
- Pattern form: Aesse `micsaemme/modules/event_form/`
