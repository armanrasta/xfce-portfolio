# Debian XFCE Portfolio

Interactive portfolio that boots into a simulated **Debian XFCE** desktop.

## Run

```bash
npm install
npm run dev
```

## Flow

1. **Boot** → short “starting session” → **desktop** (no login on first load)
2. **Log Out** (Applications menu) → greeter → log back in
3. **Reboot** replays the boot sequence

## Desktop

- Top panel with Debian menu, app launchers, task buttons, tray, clock
- Desktop icons (single-click to open)
- Apps: About, Projects, Contact, Terminal, File Manager

## Customize

Edit [`src/content/portfolio.ts`](src/content/portfolio.ts).

## Deploy

- **Custom domain:** https://armanrostami.ir
- **Project URL (fallback):** https://armanrasta.github.io/xfce-portfolio/

Push to `master` and the Deploy workflow publishes `dist`.

This repo owns **armanrostami.ir**. Your separate user site (`armanrasta.github.io` repo) stays at https://armanrasta.github.io/ — do not point the domain’s `www` CNAME at `armanrasta.github.io` or GitHub will serve the wrong site.

**Cloudflare DNS** for `armanrostami.ir`:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

**AAAA records** (IPv6), same name:

| Type | Name | Value |
| --- | --- | --- |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8000::154 |
| AAAA | @ | 2606:50c0:8000::155 |
| AAAA | @ | 2606:50c0:8000::156 |

**www:**

| Type | Name | Value |
| --- | --- | --- |
| CNAME | www | armanrostami.ir |

Remove any existing A/AAAA/CNAME on `@` that point elsewhere. Keep GitHub records on **DNS only** (grey cloud). HTTPS is enabled after GitHub verifies the domain.
