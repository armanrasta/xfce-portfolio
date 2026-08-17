import { portfolio } from "../content/portfolio";

export type FsNode =
  | { type: "dir"; name: string; children: FsNode[] }
  | { type: "file"; name: string; content: string; openApp?: "about" | "projects" | "contact" };

export const homeFs: FsNode = {
  type: "dir",
  name: portfolio.username,
  children: [
    {
      type: "dir",
      name: "Desktop",
      children: [
        { type: "file", name: "About.desktop", content: "Open About app", openApp: "about" },
        { type: "file", name: "Projects.desktop", content: "Open Projects app", openApp: "projects" },
        { type: "file", name: "Terminal.desktop", content: "Open Terminal" },
      ],
    },
    {
      type: "dir",
      name: "Documents",
      children: [
        {
          type: "file" as const,
          name: "Resume.txt",
          content: [
            `${portfolio.name}`,
            portfolio.title,
            "",
            portfolio.about,
            "",
            "Experience:",
            ...portfolio.experience.flatMap((j) => [
              `${j.role} · ${j.company} (${j.period})`,
              ...j.highlights.map((h) => `  - ${h}`),
              "",
            ]),
          ].join("\n"),
          openApp: "about" as const,
        },
        {
          type: "file",
          name: "Contact.md",
          content: [
            `# Contact`,
            ``,
            `- Email: ${portfolio.contact.email}`,
            `- Phone: ${portfolio.contact.phone}`,
            `- Location: ${portfolio.contact.location}`,
            `- GitHub: ${portfolio.contact.github}`,
            `- LinkedIn: ${portfolio.contact.linkedin}`,
          ].join("\n"),
          openApp: "contact",
        },
        {
          type: "dir",
          name: "Projects",
          children: portfolio.projects.map((p) => ({
            type: "file" as const,
            name: `${p.id}.md`,
            content: `# ${p.name}\n\n${p.summary}\n\nTags: ${p.tags.join(", ")}\n`,
            openApp: "projects" as const,
          })),
        },
      ],
    },
    {
      type: "dir",
      name: "Downloads",
      children: [
        {
          type: "file",
          name: "readme.txt",
          content: "Open Firefox, Snake, and other desktop apps from here.",
        },
      ],
    },
  ],
};

export function resolvePath(path: string): FsNode | null {
  const parts = path
    .replace(/^~/, `/home/${portfolio.username}`)
    .replace(/\/+/g, "/")
    .split("/")
    .filter(Boolean);

  if (parts[0] !== "home" || parts[1] !== portfolio.username) {
    if (path === "~" || path === `/home/${portfolio.username}`) return homeFs;
    return null;
  }

  let node: FsNode = homeFs;
  for (const part of parts.slice(2)) {
    if (node.type !== "dir") return null;
    const next = node.children.find((c) => c.name === part);
    if (!next) return null;
    node = next;
  }
  return node;
}

export function listDir(path: string): string[] | null {
  const node = resolvePath(path);
  if (!node || node.type !== "dir") return null;
  return node.children.map((c) =>
    c.type === "dir" ? `${c.name}/` : c.name,
  );
}
