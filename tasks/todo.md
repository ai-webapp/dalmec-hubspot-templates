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

### STAND BY (EN landing) — sostituito da Opzione 2 sotto

### Fase B — Multilingua IT→EN (Opzione 2) su bizen-test `2662982`
**Obiettivo:** partendo dalla landing IT `dalmectest` (id `223495420425`), creare la variante inglese con traduzione AI alla pubblicazione (non JS in tempo reale).

#### Gate
- [ ] 🟢 Account CLI = bizen-test / 2662982
- [ ] 🟡 Conferma slug EN (proposta: `eng` o `en/dalmectest`)
- [ ] 🟡 Form: stesso IT | form EN dedicato | leave unlinked
- [ ] 🟡 Legal links: tieni IT | URL EN | `#`
- [ ] 🟡 Scope PAK: aggiungere write Content / landing pages (oggi solo `cms.pages.landing_pages.read`)
- [ ] 🛑 OK esplicito utente prima di qualsiasi write HubSpot

#### Implementazione
- [ ] 🟡 Verificare se sul portale è attiva la multi-language HubSpot (variante lingua) oppure usare pagina EN collegata (`language=en-gb` + `translatedFromId` se supportato)
- [ ] 🟢 Estrarre campi IT dalla pagina `223495420425` (+ default moduli se mancano override)
- [ ] 🔴 Tradurre en-GB (riuso mappa `tasks/refs/dalmec-landing/en-field-map.md` / payload)
- [ ] 🔴 Creare/aggiornare variante EN via API o UI+API patch
- [ ] 🟡 Applicare testi EN ai moduli DnD + header/footer se possibile via widgets
- [ ] 🟢 Meta title/description EN
- [ ] 🟢 Report URL preview/pubblico + open items (PDF label fisse, form, hreflang)

#### Theme (solo se necessario, dopo OK separato)
- [ ] 🟡 Rendere traducibili stringhe hard-coded (es. “Specifiche tecniche”, PDF labels) — fuori MVP B se non bloccante

#### Skill
- [x] 🟡 Nuova skill `dalmec-translate-landing` (scelta pagina + lingue EN/FR/DE/ES a scelta multipla)
- [x] 🟢 Test skill FR su bizen-test → pagina `224062610099` slug `/fr` (draft)
- [ ] 🟢 Decidere se eliminare la vecchia `dalmec-duplicate-en` (sostituita)

### Product close-up hover (desktop)
- [x] 🟡 Marker button + highlight lista bidirezionale (A+C)

### Mobile feature rows
- [x] 🟢 Mobile: sempre immagine → testo (CSS order)

### Models PDF — Opzione 1 (jsPDF come MICS)
- [x] 🟡 OK utente a implementare
- [x] 🟡 `module.html`: bottone + JSON HubL per `tipo=scarica`
- [x] 🔴 `module.js`: lazy-load jsPDF → PDF scheda tecnica
- [x] 🟢 `tipo=richiedi` resta link
- [x] 🟢 CSS bottone download
- [x] 🟢 Upload theme su bizen-test (module.js + css + html)
- [x] 🟢 Rinomina download: «Scheda tecnica neutra» → «Scheda tecnica»
- [x] 🟡 Foto prodotto condivisa nel PDF (campo `immagine_prodotto` + jsPDF)

### Fuori MVP (non ora)
- [ ] Email, logo file, foto finali, PDF ufficiali HubSpot (se diversi da generati)

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
