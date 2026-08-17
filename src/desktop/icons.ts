import type { AppId } from "../session/SessionContext";

export type IconDef = {
  id: AppId;
  label: string;
  category: string;
  description: string;
};

export const DESKTOP_ICONS: IconDef[] = [
  {
    id: "about",
    label: "About",
    category: "Accessories",
    description: "Who I am — Mousepad",
  },
  {
    id: "projects",
    label: "Projects",
    category: "Development",
    description: "Selected work and experiments",
  },
  {
    id: "contact",
    label: "Contact",
    category: "Internet",
    description: "Email and social links",
  },
  {
    id: "firefox",
    label: "Firefox",
    category: "Internet",
    description: "Web browser — GitHub pinned",
  },
  {
    id: "terminal",
    label: "Terminal",
    category: "System",
    description: "xfce4-terminal",
  },
  {
    id: "files",
    label: "Home",
    category: "System",
    description: "File Manager",
  },
  {
    id: "snake",
    label: "Snake",
    category: "Games",
    description: "Classic snake — arrow keys / WASD",
  },
  {
    id: "minesweeper",
    label: "Mines",
    category: "Games",
    description: "Minesweeper — left reveal, right flag",
  },
  {
    id: "pong",
    label: "Pong",
    category: "Games",
    description: "Pong — ↑/↓ or W/S",
  },
];

export const MENU_APPS: IconDef[] = [
  ...DESKTOP_ICONS,
  {
    id: "showcase",
    label: "Showcase",
    category: "Development",
    description: "NeoSafe + OpenCV",
  },
  {
    id: "xeyes",
    label: "XEyes",
    category: "Accessories",
    description: "They follow the pointer",
  },
  {
    id: "settings",
    label: "Settings",
    category: "Settings",
    description: "Appearance and session",
  },
];
