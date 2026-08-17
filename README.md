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

The site is published with GitHub Pages to **https://armanrostami.ir**.

Point the domain at GitHub. At your registrar, set:

**A records** for `@` / `armanrostami.ir`:

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

**www** (optional):

| Type | Name | Value |
| --- | --- | --- |
| CNAME | www | armanrasta.github.io |

Remove any existing A/AAAA/CNAME on `@` that point elsewhere. DNS can take a few minutes to a few hours. After GitHub verifies the domain, HTTPS is turned on automatically.
