# dalmec — Landing prodotto HubSpot

Theme isolato per landing prodotto DalMec (template `promo`, moduli `lp-*`).

- PRD: `../tasks/PRD-dalmec-landing.md`
- Refs: `../tasks/refs/dalmec-landing/`
- Upload path Design Manager: `dalmec` (non toccare `micsaemme`)
- Form: campo HubSpot form in `lp-contact-form` (pattern MICS)

## Upload (solo dopo account gate)

Importante: upload da path sotto `.cursor` può dare SUCCESS falso. Copiare in `/tmp` e caricare da lì.

```bash
rm -rf /tmp/dalmec && cp -R dalmec /tmp/dalmec
hs cms upload /tmp/dalmec dalmec --account=bizen-test
```

Moduli devono usare suffisso `.module`. In `meta.json` usare `host_template_types: ["PAGE"]` (non `LANDING_PAGE`).
