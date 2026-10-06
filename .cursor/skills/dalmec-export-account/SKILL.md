---
name: dalmec-export-account
description: >-
  Exports/uploads the local DalMec HubSpot theme (folder dalmec/) into a target
  HubSpot portal Design Manager path (e.g. LPprodotto/), without overlapping
  existing templates. Use when the user says "esporta template", "upload su
  account", "usa dalmec-export-account", or asks to copy the DalMec theme to
  another HubSpot portal.
disable-model-invocation: true
---

# DalMec — Export theme to HubSpot account

## Goal
Upload the local theme `dalmec/` to a **target HubSpot portal** into a
**dedicated Design Manager folder**, without overwriting unrelated themes.

Default destination folder name: `LPprodotto` (override if user chooses another).

Do **not** create landing pages unless the user explicitly asks after upload.

## Local source
- Theme root: `dalmec/`
- Template: `dalmec/templates/promo.html`
- Modules: `dalmec/modules/lp-*.module`
- CSS: `dalmec/css/main.css`

## Gate (mandatory)
1. Confirm **portal name + hub ID** (e.g. `bizen` / `2305573`).
2. Confirm **destination Design Manager path** (default `LPprodotto`).
3. Confirm upload is **create-new folder** (not overwrite another theme).
4. Wait for **explicit OK** before any HubSpot write (`hs cms upload`).

## Auth (CLI — new global config)
Prefer:
```bash
hs account auth --account=<HUB_ID> --name=<alias> --personal-access-key=<PAK>
```
Notes:
- `--account` must be a **number** (hub ID), not a string name.
- Do **not** use legacy `hs auth` if CLI says to use `hs account auth`.
- Prefer **not** setting `--default` unless the user asks (avoids wrong-portal uploads).
- Never ask the user to paste the PAK in chat. If they paste one, tell them to
  revoke/regenerate and use it only in the terminal.

### Required scopes (minimum)
- `cms.source_code.read`
- `cms.source_code.write`

Recommended if later creating/editing pages from Cursor:
- landing/site pages read/write / Content scopes as available on the PAK UI

### Verify auth before upload
```bash
hs account list
hs account info <HUB_ID>
```
Must show the target hub ID. If only the wrong portal appears, **STOP**.

## Workflow

### 1) Collect inputs (one batch)
- Target hub ID + account alias
- Destination folder (default `LPprodotto`)
- Theme label override? (default: `LPprodotto — Landing prodotto DalMec`)
- Create landing page after upload? yes/no (default **no**)

### 2) Inventory target portal
```bash
hs cms list / --account=<HUB_ID>
hs cms list <DEST> --account=<HUB_ID>
```
- If `<DEST>` already exists: STOP and ask (overwrite? rename?).
- If a folder named `dalmec` exists on target and user forbade overlap: do not
  upload into `dalmec/`; use `LPprodotto/` (or chosen name).

**Critical:** Confirm `hs account info <HUB_ID>` returns that same ID. Some CLI
invocations ignore invalid `--account` and fall back to default — never upload
until identity is proven.

### 3) Stage upload package
HubSpot CLI may ignore paths under `.cursor` / spaces — stage from `/tmp`:
```bash
rm -rf /tmp/LPprodotto-upload
cp -R "<REPO>/dalmec" /tmp/LPprodotto-upload
```
Update staged `theme.json` label (and optional template `label:` comment) to
match destination branding. Keep relative module paths (`../modules/...`).

### 4) Upload (only after OK)
```bash
hs cms upload /tmp/LPprodotto-upload <DEST> --account=<HUB_ID>
```
Upload **only** that destination. Do not sync other Design Manager folders.

### 5) Verify
```bash
hs cms list / --account=<HUB_ID>          # must show <DEST>
hs cms list <DEST> --account=<HUB_ID>     # css, modules, templates, theme.json
hs cms list <DEST>/templates --account=<HUB_ID>
hs cms list <DEST>/modules --account=<HUB_ID>
```
Expect template `promo.html` and all `lp-*.module` folders.

### 6) Deliver
Report in Italian:
- Portal hub ID + alias
- Design Manager path (`<DEST>/`)
- Template path (`<DEST>/templates/promo.html`)
- Theme previewer URL if shown by CLI
- Confirmation that other folders were not modified
- Next optional step: create a landing with that template (ask first)

## Safety rules
- Never upload to the wrong portal; re-check hub ID every run.
- Never delete remote folders.
- Never overwrite an existing destination without explicit user confirmation.
- Do not push git / commit unless asked.
- Speak to the user in **Italian**; keep HubSpot terms in English
  (theme, template, module, Design Manager, portal, slug).

## Trigger phrases (user)
- `usa dalmec-export-account`
- `esporta template su account`
- `carica DalMec su portale` + hub ID
- `upload LPprodotto`

## Out of scope
- Translating page content / EN duplicate (use `dalmec-duplicate-en`)
- Building new modules from scratch
- Email templates
- Migrating File Manager assets / forms between portals (warn if forms/images
  are portal-specific and may need re-linking)
