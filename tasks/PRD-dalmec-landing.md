# PRD · DalMec landing prodotto · HubSpot Template System (Landing / Mini sito + Email)

> Intake: skill `hubspot-cms-prd` · 3 round · 2026-10-03  
> Slug: `dalmec-landing`  
> Stato: PRD in attesa di OK. Nessun upload sul portale finché non c’è account gate + OK esplicito.

---

## 1. Executive summary

Template HubSpot per **landing prodotto tecnico DalMec** sul portale **Bizen Test (hub ID 2662982)**. MVP = un solo theme, cartella Design Manager **`dalmec/`**, isolata da `micsaemme/` e da ogni altro design.

Template catalogo **`promo`**: presentazione di un prodotto o di una linea, con `{% dnd_area %}` e **Content Remix** in MVP. I moduli sono solo quelli di questa cartella (`lp-*`). Header e footer stanno fuori dalla area trascinabile.

Lo stile (colori, font) nasce dal handoff GOLD 10 e vive nella **sezione stile del theme** (`fields.json`), così si cambia senza toccare gli altri template. Testi e immagini di GOLD 10 sono **placeholder** editabili dai campi modulo, non copy approvata.

Il form di contatto **non** è markup HTML custom: si richiama un **form HubSpot** tramite form field del modulo, stesso pattern del modulo `event_form` del theme MICS Aesse (`{% form form_to_use=… %}`).

Lingue di contenuto: **IT** (default dei placeholder) e **EN** (seconda istanza, stesso template). FR/DE dopo. Email dopo la landing. Owner: **Emanuele Robba** (marketing + tech). Go-live template: **entro il 9 ottobre 2026**.

---

## 2. Obiettivi misurabili

| Tipo | Obiettivo |
|---|---|
| Business | Avere un template riutilizzabile per landing di prodotto tecnico DalMec (pilota visivo: GOLD 10) |
| Technical | Una cartella `dalmec/` con template `promo`, moduli `lp-*`, stile theme modificabile, `dnd_area` compatibile con Content Remix |
| Form | `lp-contact-form` collega un form HubSpot (form field), come MICS `event_form` — nessun `<input>` disegnato a mano |
| Isolamento | Modificare o cancellare `dalmec/` non altera `micsaemme/` né altri theme |
| KPI pilota | Il template è selezionabile in Design Manager, i moduli si trascinano, i campi placeholder si editano, i token di stile si cambiano dal theme, si può selezionare un form HubSpot |

Il successo di questo step **non** è il numero di submit del form. L’istanza pagina compilata è fuori MVP.

---

## 3. Scope

### MVP

| ID | Canale | Descrizione |
|---|---|---|
| `promo` | Landing | Theme `dalmec/` + template prodotto + moduli sezione + stile theme + Remix + form HubSpot field |

Moduli (nomi dal handoff, tutti dentro `dalmec/modules/`):

| # | Modulo | Dove |
|---|---|---|
| 1 | `lp-header` | Fuori `dnd_area` (partial / global del solo theme `dalmec`) |
| 2 | `lp-hero` | Dentro `dnd_area` |
| 3 | `lp-key-numbers` | Dentro `dnd_area` |
| 4 | `lp-feature-rows` | Dentro `dnd_area` |
| 5 | `lp-functions-grid` | Dentro `dnd_area` |
| 6 | `lp-product-closeup` | Dentro `dnd_area` |
| 7 | `lp-performance` | Dentro `dnd_area` |
| 8 | `lp-models` | Dentro `dnd_area` |
| 9 | `lp-sectors` | Dentro `dnd_area` |
| 10 | `lp-contact-form` | Dentro `dnd_area` — form field HubSpot |
| 11 | `lp-footer` | Fuori `dnd_area` |

### Phase 2

| Item | Note |
|---|---|
| Email | Dopo la landing. Tipo `[DA COMPILARE]`: `email_dem` / `email_newsletter` / `email_evento` / `email_relance` |
| Istanze pagina IT + EN | Stesso template, contenuti diversi. URL HubSpot assegnato in quella fase |
| FR / DE | Stesso template, altre istanze |
| Logo file | Oggi wordmark testuale placeholder |
| Foto reali | Oggi `placehold.co` solo come riferimento visivo, non come asset finale |
| Content delle spec HG/WC | Nel HTML di riferimento sono provvisorie; restano placeholder |
| Form HubSpot reale | Creato/collegato in fase istanza; il template espone solo il form field |

### Out of scope

- Email in questo step
- Mini-sito (`event_hub`, register, agenda, speakers)
- Istanza pagina pubblicata e copy definitiva
- FR / DE
- Logo finale e foto finali
- UI Extension CRM
- Transactional email / SMTP custom
- Mega-clone day-1 tipo Atlassian Team Europe
- Moduli condivisi con `micsaemme` o con altri theme (si **copia il pattern** form, non i file)
- Fake CAN-SPAM / unsubscribe (rilevante solo quando si fa l’email)
- Trattare i numeri GOLD 10 come claim approvati
- Form HTML statico con `<input>` custom (vietato: solo form HubSpot)

---

## 4. Audience

| Canale | Audience |
|---|---|
| Landing | Professionisti **B2B** della ristorazione: gelateria, panificazione, pasticceria, ristorazione |
| Email | Stessa audience, quando esisterà il template email |

Builders: Emanuele Robba. Operatori sul portale Bizen Test (2662982).

---

## 5. Formato web

| Scelta | Valore |
|---|---|
| Formato | **Landing singola** (`promo`) |
| Rationale | Un solo job: presentare un prodotto tecnico e portare al contatto. Le sezioni (numeri, plus, funzioni, modelli, settori, form) stanno sulla stessa pagina. Sotto la soglia del mini-sito (≥4 job separati: register / agenda / speakers / venue) |
| Non in MVP | Mini-sito multi-page |

---

## 6. Catalogo template

| ID | Canale | File | Wireframe testuale | Priority |
|---|---|---|---|---|
| `promo` | Web | `dalmec/templates/promo.html` | Header sticky (logo, telefono, CTA) → hero prodotto → numeri chiave → righe plus → griglia funzioni → close-up con hotspot → prestazioni → modelli (accordion) → settori → form HubSpot → footer | P0 |
| Email | — | — | Tipo da scegliere **dopo** questa landing | P2 |

Label theme (Design Manager): `dalmec — Landing prodotto`.  
`preview_path`: `./templates/promo.html`.

Ordine visivo e ritmo sfondi: come `tasks/refs/dalmec-landing/index.html` e `HANDOFF.md` §1 (bianco → navy → bianco → soft → bianco → navy → bianco → soft → navy → footer). Angoli vivi (radius 0), tranne i marker circolari di “Da vicino”.

---

## 7. IA pagina (non è un mini-sito)

Una pagina. Nessun menu. URL pubblico = landing HubSpot, slug `[DA COMPILARE]` in fase istanza.

```text
/…/                 → pagina da template `promo`
/…/#modelli         → ancora sezione modelli (CTA secondaria hero)
/…/#contatti        → ancora form HubSpot (CTA header + CTA primaria hero)
```

**CTA primaria web:** label placeholder `Richiedi un preventivo` → `#contatti`.  
**CTA header:** label placeholder `Richiedi info` → `#contatti`.  
**CTA secondaria hero:** label placeholder `Scarica la scheda tecnica` → `#modelli`.  
**CTA email:** fuori da questo step.

---

## 8. Architettura

| Layer | Scelta |
|---|---|
| Website | Theme nuovo, **una cartella** `dalmec/` |
| Isolamento | Nessun import da `micsaemme/`. Nessun modulo globale del portale riusato. Cancellare `dalmec` rimuove solo questo design |
| Page template | `templates/promo.html` con una `{% dnd_area %}` (moduli 2–10 nell’ordine del handoff) |
| Header / footer | Moduli `lp-header` e `lp-footer` del theme, fuori dalla `dnd_area` |
| Stile | `dalmec/fields.json` = sezione stile del theme. Default = token del handoff. Il CSS legge quei campi |
| Moduli | `dalmec/modules/lp-*/` con `fields.json` propri. Prefisso `lp-` |
| Remix | Sì in MVP, tramite `dnd_area` |
| Form | Campo `type: form` in `lp-contact-form` → HubL `{% form form_to_use='{{ module.form.form_id }}' %}` (pattern MICS `event_form`) |
| Email | Non in questa cartella finché non parte la fase email |

Regola pratica: se un file non sta sotto `dalmec/`, non fa parte di questo progetto.

---

## 9. Stack

**default seed** — eccezione di packaging, non di stack: cartella theme dedicata `dalmec/` (stesso schema già usato per `micsaemme/`).

| Layer | Scelta |
|---|---|
| Landing | Content Hub · HTML + HubL · website theme |
| Email | Marketing Hub · fuori MVP |
| Tooling | `hs` · Design Manager · Git |
| AI | Content Remix **in MVP** |
| Font MVP | **DM Sans** (Google Fonts, pesi 400 / 500 / 600 / 700) + fallback `system-ui, sans-serif` |
| Out | Vedi §3 |

I file seed `templates/hubspot-cms-landing/STACK.md` non sono in questo repo. I vincoli usati sono quelli della skill `hubspot-cms-prd` e del pattern già validato su MICS Aesse.

---

## 10. Modello campi

### 10.1 Sezione stile del theme (`dalmec/fields.json`)

Valori iniziali da `HANDOFF.md` §1. Modificabili dal pannello stile / impostazioni theme, senza aprire un altro design.

| Token | Default | Uso |
|---|---|---|
| `navy` | `#04192c` | Header top-border, sezioni scure, accordion chiuso, hover bottoni |
| `blue` | `#2f8fc8` | CTA, eyebrow, H1, icone, accordion aperto |
| `blue_light` | `#6cb8e4` | Accento su fondo navy |
| `ink` | `#0b1f33` | Testo principale |
| `text` | `#33475a` | Paragrafi |
| `muted` | `#4a5b6c` | Testo secondario, label |
| `bg_soft` | `#eef2f5` | Sezioni alternate |
| `bg_footer` | `#e4e9ee` | Footer |
| `line` | `#d5dde5` | Divisori |
| `font_family` | DM Sans | Famiglia unica |

Il CSS del theme dichiara le variabili (`--navy`, `--blue`, …) a partire da questi campi. I colori bordo dei settori restano sul modulo `lp-sectors` (`colore_bordo`), non nello stile globale.

### 10.2 Campi modulo

Dettaglio repeater: `tasks/refs/dalmec-landing/HANDOFF.md` §2. Tutti i testi sotto sono **placeholder** (default editabile, non copy blindata).

| Modulo | Campi principali | Repeater |
|---|---|---|
| `lp-header` | `logo` (image), `payoff`, `telefono_label`, `telefono`, `cta_label`, `cta_link` | — |
| `lp-hero` | `badge_1`, `badge_2`, `titolo`, `sottotitolo`, `lead` (richtext), due CTA (label+link), `immagine_prodotto` | — |
| `lp-key-numbers` | — | `items` (2–4): valore, unità, descrizione |
| `lp-feature-rows` | `eyebrow`, `titolo_sezione` | `rows` (1–6): immagine, titolo, testo, bullet (max 4). Alternanza immagine e numeri 01… automatici |
| `lp-functions-grid` | `eyebrow`, `titolo_sezione` | `cells` (3–9): icona, titolo, testo |
| `lp-product-closeup` | `eyebrow`, `titolo`, `immagine` | `hotspots` (max 6): x %, y %, titolo, testo |
| `lp-performance` | `eyebrow`, `titolo`, `nota` | `metrics` (3–9): label, valore, dettaglio |
| `lp-models` | `eyebrow`, `titolo`, `apri_primo` (boolean, default true) | `models`: codice, descrizione, specs (chiave, valore), downloads (label, file o link, tipo scarica/richiedi) |
| `lp-sectors` | `eyebrow`, `titolo` | `sectors` (max 6): immagine, nome, testo, `colore_bordo` |
| `lp-contact-form` | `eyebrow`, `titolo`, `testo`, `telefono`, `email`, **`form`** (`type: form`) | — |
| `lp-footer` | `copyright`, `piva` | colonne (titolo, sottotitolo, testo); link legali |

Ogni modulo: `anchor_id` (text, opzionale). Dove il handoff lo indica: `background` (choice).

Default di esempio (tutti placeholder, presi dall’HTML):

| Campo | Default placeholder |
|---|---|
| Header payoff | `Perfect Cooling, Perfect Taste` |
| Telefono | `+39 0422 832679` |
| CTA header | `Richiedi info` → `#contatti` |
| Hero titolo | `GOLD` + sottotitolo formato teglie |
| CTA primaria | `Richiedi un preventivo` → `#contatti` |
| CTA secondaria | `Scarica la scheda tecnica` → `#modelli` |
| Logo | Nessun file. Fallback: wordmark testuale `DALMEC` finché non arriva il logo |

### 10.3 Form HubSpot (pattern MICS `event_form`)

**Regola:** il template non ricostruisce gli `<input>`. Stesso approccio del modulo Aesse `micsaemme/modules/event_form/`:

1. In `fields.json` del modulo: campo `"type": "form"` (label es. `HubSpot form`).
2. In `module.html`: se `module.form.form_id` è valorizzato, render con HubL:

```hubl
{% if module.form.form_id %}
  {% form
    form_to_use='{{ module.form.form_id }}'
    response_response_type='{{ module.form.response_type }}'
    response_message='{{ module.form.message }}'
  %}
{% else %}
  {# placeholder editor finché non si seleziona un form #}
{% endif %}
```

3. Stile CSS sul wrapper `.hs-form` (dal handoff: bordo input `#c9d3dc`, padding 12/14, label 13px peso 600, submit blu a tutta larghezza) — non markup form custom.
4. I campi del form (Nome, Email, …) si definiscono **nel form HubSpot del portale**, non nel theme. Fase istanza (Phase 2 / B), non bloccano l’MVP template.

Campi minimi consigliati del form da creare nel portale (fase istanza, non in questo MVP):

| Campo form | Required |
|---|---|
| Nome | sì |
| Cognome | sì |
| Email | sì |
| Telefono | no |
| Azienda | sì |
| Settore | no |
| Messaggio | no |
| Consenso privacy (checkbox, non pre-flaggata) | sì |

---

## 11. User journeys

### Developer (upload) — solo dopo OK + account gate

1. Conferma portale **2662982** (Bizen Test).  
2. Theme locale `dalmec/` (non dentro `micsaemme/`).  
3. `fields.json` stile + CSS token + moduli `lp-*` + `templates/promo.html`.  
4. `hs upload` della sola cartella `dalmec`.  
5. Smoke in Design Manager: il theme compare da solo; MICS invariato.

### Marketing — web

1. Nuova landing dal template `promo` del theme `dalmec`.  
2. Trascina / riordina i moduli nella `dnd_area` (Content Remix).  
3. Sostituisce i placeholder dai campi modulo.  
4. Se serve, cambia colori e font dalla sezione stile del theme.  
5. In `lp-contact-form`, **seleziona un form HubSpot** dal form field (come su MICS).  
6. Publish quando i contenuti sono veri (fase istanza, fuori da questo MVP).

### Marketing — email

Non in questo step. Si riapre a landing pronta, con il tipo email ancora da scegliere.

---

## 12. Non-functional / comunicazione

| Area | Requisito |
|---|---|
| Tono | Scheda prodotto tecnica. IT nei placeholder |
| Copy | Solo placeholder. Si cambia dai moduli. Nessun claim GOLD 10 va considerato approvato |
| Design | Fedeltà al handoff: spazi, gerarchie, angoli vivi, ritmo sfondi. I valori vivono nello stile theme |
| Layout | Container max 1240px, padding orizzontale 24px. Sezioni 112px verticali (hero 72/80, footer 64/32). Griglie `auto-fit` / `minmax` |
| Bottoni | Primario blu, secondario bordo navy. Hover di entrambi → fondo navy, testo bianco. Radius 0 |
| a11y | Contrasto testo/fondo, focus input outline 2px blu, header sticky senza menu |
| Lingue | Un template. IT = default campi. EN = altra pagina, stessi moduli |
| Legal | Link privacy/cookie nel footer sono campi (URL placeholder `#`) |
| Form | Solo form HubSpot richiamato; mai form HTML statico in produzione |

---

## 13. Dipendenze HubSpot

| Dipendenza | Note |
|---|---|
| Content Hub | Theme + template landing + DnD |
| Design Manager | Cartella `dalmec` visibile e cancellabile per intero |
| Forms | Form field nel modulo; form vero creato/collegato in fase istanza |
| Content Remix | In MVP. Richiede `dnd_area` e moduli del theme |
| File manager | Logo e foto quando arrivano. Non bloccano il template |
| CLI | `hs`, account `2662982` |
| Marketing Hub email | Phase 2 |

---

## 14. Account gate & ambienti

| Campo | Valore |
|---|---|
| Portale | **Bizen Test** |
| Hub ID | **2662982** |
| Cartella upload | `dalmec` soltanto |
| Regola | Nessun upload senza account gate + **OK esplicito** su questo PRD |
| Convivienza | Sullo stesso portale c’è già `micsaemme/`. Non sovrascrivere quel path |

---

## 15. Delivery plan

| Fase | Contenuto | In questo giro |
|---|---|---|
| **A** | Theme `dalmec/` + stile theme + moduli `lp-*` + template `promo` + form field + upload smoke | Sì, dopo OK |
| **A2** | Template email (tipo da scegliere) | No |
| **A3** | Mini-sito | No |
| **B** | Istanza landing IT (e poi EN) + form HubSpot collegato + logo | No |
| **B2** | Istanza email | No |

Effort fase A: alto (11 moduli). Il go-live “entro una settimana” vale per il **template vuoto coi placeholder**, non per la pagina con asset finali.

---

## 16. Acceptance criteria

### Isolamento
- [ ] In Design Manager esiste una sola cartella `dalmec`
- [ ] I moduli si chiamano `lp-*` e stanno solo in quella cartella
- [ ] `micsaemme/` non ha diff dopo l’upload
- [ ] Cancellare `dalmec` non rimuove altri template

### Template
- [ ] Pagina creabile dal template `promo`
- [ ] `dnd_area` con i moduli 2–10 nell’ordine del handoff; si possono riordinare (Content Remix)
- [ ] Header e footer presenti, fuori dalla area trascinabile
- [ ] Sezione stile: i token §10.1 si modificano e la pagina cambia (almeno `blue` e `navy`)
- [ ] Ogni testo visibile è un campo modulo, default = placeholder
- [ ] Immagini = campi image (vuoti o placeholder), non URL `placehold.co` fissi in produzione
- [ ] `lp-contact-form` ha campo `type: form` e render `{% form form_to_use=… %}` (pattern MICS); se nessun form selezionato → placeholder editor, non form HTML finto
- [ ] Stile `.hs-form` applicato sul wrapper
- [ ] Accordion modelli con `<details>` / `<summary>`, primo aperto se `apri_primo` è true
- [ ] Mobile: niente overflow orizzontale sulla hero
- [ ] Font DM Sans caricato; fallback system

### Fuori da questo checklist
- [ ] Email, istanza pubblicata, logo file, lingue FR/DE, form HubSpot reale collegato in produzione

---

## 17. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Stesso portale del theme MICS | Upload solo path `dalmec`. Nessun file condiviso |
| Una settimana vs 11 moduli | MVP = struttura + placeholder, non campagna pronta |
| Numeri GOLD 10 letti come veri | Default marcati placeholder; spec HG/WC del HTML restano esempio |
| Logo assente | Wordmark testuale finché non arriva il file |
| Stile theme vs CSS sparso | Un solo `fields.json`. I moduli non hardcodano gli hex del brand (gli hex di struttura tipo bordo form possono restare token) |
| Content Remix | Una `dnd_area`. Niente sezioni bloccate in mezzo all’area |
| Form “finto” dell’HTML di ref | Sostituito dal form field HubSpot (pattern MICS); HTML di ref resta solo stile/layout |

---

## 18. Open questions

- [ ] Tipo email (dopo la landing): `email_dem` o altro
- [ ] Slug URL della prima istanza HubSpot
- [ ] File logo primary (e se serve un reverse)
- [ ] Placeholder EN: li scriviamo noi in una seconda passata o li lascia il marketing sull’istanza
- [ ] Icone funzioni: SVG stile Lucide nel modulo, oppure icon field HubSpot
- [ ] Quale form HubSpot del portale collegare in fase B (ID / nome)

---

## 19. Design refs & asset inventory

### Riferimenti

| Tipo | Valore | Stato |
|---|---|---|
| URL | Landing HubSpot (slug da assegnare in fase istanza). Nessun URL esterno | previsto |
| Screenshot | — | no |
| Brand guide | Il handoff **è** la brand guide. Va mappato nella sezione stile del theme | fornito |
| HTML di riferimento | `tasks/refs/dalmec-landing/index.html` (da `/Users/emanuele/Downloads/handoff-cursor/`) | fornito |
| Handoff | `tasks/refs/dalmec-landing/HANDOFF.md` | fornito |
| Pattern form | MICS Aesse `micsaemme/modules/event_form/` (form field + `{% form %}`) | riferimento pattern |
| Copiare | Layout, spaziature, gerarchia, ritmo sfondi, comportamento moduli del handoff. Valori colore/font nella sezione stile, modificabili | confermato |
| Non copiare | Testi come copy finale. Foto `placehold.co` come asset finali. Form HTML statico come implementazione | confermato |

### Inventario asset

| Asset | Stato | Path / link | HubSpot File URL |
|---|---|---|---|
| Logo primary | mancante (arriva dopo). Fallback wordmark `DALMEC` | — | — |
| Logo reverse | mancante | — | — |
| Hero prodotto | placeholder | `index.html` (`image:hero-product`) | — |
| Foto plus / closeup / settori | placeholder | `index.html` | — |
| Icone funzioni | riferimento SVG inline stile Lucide nell’HTML | `index.html` | — |
| Font | Google Fonts **DM Sans** | HANDOFF §1 | — |

Path: `tasks/refs/dalmec-landing/`.

---

## 20. Appendix — Initiative skeleton (pilota)

| Campo | Valore |
|---|---|
| Nome iniziativa | DalMec landing prodotto tecnico |
| Pilota visivo | GOLD 10 (solo placeholder) |
| Canali MVP | Landing |
| Canali dopo | Email |
| Formato web | Landing singola |
| Template | `promo` |
| Cartella Design Manager | `dalmec/` |
| Moduli | `lp-header` … `lp-footer` |
| Portale | Bizen Test · 2662982 |
| Owner | Emanuele Robba |
| Go-live template | Entro il 9 ottobre 2026 |
| Lingue ora | IT (default) + EN (istanza) |
| Lingue dopo | FR, DE |
| Stack | default seed |
| Remix | Sì |
| Form | Form field HubSpot (pattern MICS), non HTML custom |

**Obiettivo:** template isolato, con moduli e stile modificabile.  
**Audience:** B2B ristorazione (gelateria, panificazione, pasticceria, ristorazione).  
**CTA:** `Richiedi info` / `Richiedi un preventivo` → `#contatti`. Secondaria → `#modelli`.  
**Form:** richiamato via form HubSpot nel modulo `lp-contact-form` (come `event_form` MICS).  
**Successo:** cartella unica in Design Manager; edit e delete non toccano gli altri design.  
**Fuori scope:** vedi §3.

---

## Next step

Dopo **OK esplicito** su questo PRD + **account gate** sul portale 2662982:

`Usa hubspot-cms-templates sul PRD tasks/PRD-dalmec-landing.md`

Si parte dalla fase **A** (solo cartella `dalmec/`). Email, logo e istanze restano fuori finché non lo chiedi.
