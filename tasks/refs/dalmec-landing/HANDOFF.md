# Handoff – Landing GOLD 10 (Dalmec) → Template HubSpot a moduli

Obiettivo: trasformare `index.html` in un **template HubSpot (CMS, drag & drop)** composto da **moduli custom**. Il design è definito: replicare fedelmente layout, spaziature, font e colori. I contenuti di esempio (GOLD 10) diventano i **default** dei campi modulo.

Struttura file consigliata:
```
dalmec-landing/
  templates/landing-prodotto.html      # template con dnd_area
  css/landing.css                      # token + classi (estrarre gli stili inline)
  modules/lp-*.module/                 # un modulo per sezione (vedi §2)
```

---

## 1. Font e colori

### Font
- **Famiglia unica:** DM Sans (Google Fonts), pesi 400 / 500 / 600 / 700.
- Embed: `https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap`
- Fallback: `system-ui, sans-serif`.

| Ruolo | Size | Peso | Line-height | Note |
|---|---|---|---|---|
| H1 hero (nome prodotto) | clamp(44px, 6vw, 76px) | 700 | 0.98 | letter-spacing −0.02em, colore blu |
| H1 sottotitolo (formato) | 0.52em dell'H1 | 700 | 1.1 | colore navy |
| H2 sezione | clamp(32px, 4vw, 48px) | 700 | 1.1 | letter-spacing −0.01em |
| H3 feature | 32px | 700 | 1.15 | |
| H3 card funzione | 20px | 700 | — | |
| Eyebrow / kicker | 13px | 600 | — | MAIUSCOLO, letter-spacing 0.16em, blu |
| Lead hero | 20px | 400 | 1.5 | |
| Body | 17px | 400 | 1.6 | |
| Body small / liste | 15px | 400 | 1.55 | |
| Numero chiave | 56px (unità 24px) | 700 | 1 | |
| Valore prestazione | 36px | 700 | — | |
| Indice feature (01–04) | 72px | 700 | 1 | colore #e3e8ed |
| Bottone | 16px (header 14px) | 600 | — | |

### Colori
| Token | Hex | Uso |
|---|---|---|
| `--navy` | `#04192c` | Header top-border, sezioni scure (numeri, prestazioni, form), accordion chiuso, hover bottoni |
| `--blue` | `#2f8fc8` | Accento primario: CTA, eyebrow, H1, icone, accordion aperto |
| `--blue-light` | `#6cb8e4` | Accento su fondo navy (unità, eyebrow) |
| `--ink` | `#0b1f33` | Testo principale |
| `--text` | `#33475a` | Paragrafi |
| `--muted` | `#4a5b6c` | Testo secondario, label |
| `--bg-soft` | `#eef2f5` | Sezioni alternate (funzioni, settori), pannello accordion |
| `--bg-footer` | `#e4e9ee` | Footer |
| `--line` | `#d5dde5` | Divisori, bordi griglia |
| Testo su navy | `#c9d6e2` / `#9fb3c6` | Paragrafi / label su fondo scuro |
| Settori (solo bordo card) | `#c7a6d2` gelateria · `#dd4a3a` panificazione · `#e9b97a` pasticceria · `#1f6b52` ristorazione | |

### Regole di layout
- Container: `max-width: 1240px; padding: 0 24px; margin: 0 auto`.
- Padding verticale sezioni: **112px** (hero 72/80px, footer 64/32px).
- Angoli **vivi** (radius 0) ovunque, tranne i marker numerati della sezione "Da vicino" (cerchi).
- Griglie responsive con `repeat(auto-fit, minmax(min(100%, Xpx), 1fr))` → nessun media query necessario; mantenere questo comportamento.
- Bottoni: primario = fondo blu, testo bianco; secondario = bordo 1.5px navy. Hover di entrambi → fondo navy, testo bianco. Nessun radius.
- Focus input: outline 2px blu.
- Ritmo di sfondo: bianco → navy → bianco → soft → bianco → navy → bianco → soft → navy → footer.

---

## 2. Moduli HubSpot

Ogni sezione in `index.html` ha l'attributo `data-hs-module="…"` = nome modulo. Le immagini hanno `data-hs-field="image:…"`. Tutti i moduli: campo opzionale `anchor_id` (text) e, dove indicato, `background` (choice).

| # | Modulo | Campi | Repeater |
|---|---|---|---|
| 1 | `lp-header` | logo (image), payoff (text), telefono_label, telefono (text), cta_label, cta_link (link) | — |
| 2 | `lp-hero` | badge_1, badge_2 (text), titolo (text), sottotitolo (text), lead (richtext), cta_primaria (label+link), cta_secondaria (label+link), immagine_prodotto (image, PNG scontornato) | — |
| 3 | `lp-key-numbers` | — | **items** (min 2, max 4): valore (text), unità (text), descrizione (text, consente `<br>`) |
| 4 | `lp-feature-rows` | eyebrow, titolo_sezione | **rows** (min 1, max 6): immagine, titolo, testo (richtext), **bullet** (repeater text, max 4). Layout alternato automatico (immagine sx/dx su riga pari/dispari) e numerazione 01, 02… automatica da `loop.index` |
| 5 | `lp-functions-grid` | eyebrow, titolo_sezione | **cells** (3–9): icona (icon field, set Lucide/FA), titolo, testo |
| 6 | `lp-product-closeup` | eyebrow, titolo, immagine | **hotspots** (max 6): posizione_x %, posizione_y % (number), titolo, testo. Numero marker = indice |
| 7 | `lp-performance` | eyebrow, titolo, nota (text) | **metrics** (3–9): label, valore, dettaglio |
| 8 | `lp-models` | eyebrow, titolo, apri_primo (boolean, default true) | **models**: codice, descrizione, **specs** (repeater: chiave, valore), **downloads** (repeater: label, file (file field) o link, tipo choice: scarica/richiedi) |
| 9 | `lp-sectors` | eyebrow, titolo | **sectors** (max 6): immagine, nome, testo, colore_bordo (color) |
| 10 | `lp-contact-form` | eyebrow, titolo, testo, telefono, email, **form** (form field HubSpot) | — |
| 11 | `lp-footer` | colonne (repeater: titolo, sottotitolo, testo richtext), copyright, piva, **link legali** (repeater link) | — |

Note di implementazione:
- **Accordion modelli:** in `index.html` è realizzato con `<details>/<summary>` (nessun JS). Mantenerlo; il primo è `open` se `apri_primo` è vero.
- **Form:** il markup in `lp-contact-form` è solo riferimento visivo. Sostituirlo con `{% form form_to_use="{{ module.form.form_id }}" %}` e applicare lo stile (input bordo `#c9d3dc`, padding 12/14, label 13px 600, submit blu a tutta larghezza) via CSS sul wrapper `.hs-form`.
- **Header:** sticky, senza menu di navigazione (landing chiusa). La CTA punta ad `#contatti`.
- **Icone:** in `index.html` sono SVG inline in stile Lucide (stroke 1.6, colore blu, 36px).
- **Stili:** gli stili sono inline nell'HTML di riferimento; estrarli in classi in `css/landing.css` usando i token di §1. Hover/focus sono già nelle classi `.hv-navy` / `.fc-blue`.
- Il template deve contenere una `{% dnd_area %}` con i moduli 2–10 nell'ordine sopra; header e footer come moduli globali o partial.

---

## 3. Codice
- `index.html` (in questa cartella): HTML statico completo e autonomo, riferimento pixel-perfect del design. Le immagini sono placeholder `placehold.co`; il loro `alt` descrive la foto prevista.
- Contenuti: dati reali GOLD 10 (PBCG106AC). Le specifiche dei modelli HG e WC sono provvisorie (copiate da AC) e vanno verificate.
