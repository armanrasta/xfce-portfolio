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
