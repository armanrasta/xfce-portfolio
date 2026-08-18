import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { portfolio } from "../content/portfolio";
import { useSession, type AppId } from "../session/SessionContext";
import { listDir, resolvePath } from "./filesystem";
import { fetchGithubRepos } from "./github";
import "./TerminalApp.css";

type Line = { kind: "in" | "out" | "err"; text: string };

const BANNER = `
     _    ____  __  __    _    _   _
    / \\  |  _ \\|  \\/  |  / \\  | \\ | |
   / _ \\ | |_) | |\\/| | / _ \\ |  \\| |
  / ___ \\|  _ <| |  | |/ ___ \\| |\\  |
 /_/   \\_\\_| \\_\\_|  |_/_/   \\_\\_| \\_|
          XFCE Portfolio Shell
`.trim();

const FORTUNES = [
  "75% faster incident response. 100% slower at leaving vim.",
  "I don't always write C++, but when I do it's for OpenCV.",
  "There is no production. Only staging that got promoted.",
  "Distributed systems: the art of failing in several places at once.",
  "sudo apt install job  —  E: Unable to locate package.",
  "Load average is fine. The operator is not.",
  "This portfolio is a website pretending to be Debian. The resume is real.",
  "NeoSafe watches cameras. XEyes watches you. Both are on the menu.",
];

const OPEN_ALIASES: Record<string, AppId> = {
  about: "about",
  mousepad: "about",
  resume: "about",
  projects: "projects",
  work: "projects",
  contact: "contact",
  blog: "blog",
  midori: "blog",
  terminal: "terminal",
  files: "files",
  thunar: "files",
  home: "files",
  snake: "snake",
  minesweeper: "minesweeper",
  mines: "minesweeper",
  mine: "minesweeper",
  pong: "pong",
  firefox: "firefox",
  settings: "settings",
  showcase: "showcase",
  neosafe: "showcase",
  xeyes: "xeyes",
  eyes: "xeyes",
};

const SL = `
      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   H\\________/ |   |        =|___ ___|
   /     |  |   H  |  |     |   |         ||_| |_||
  |      |  |   H  |__--------------------| [___] |
  | ________|___H__/__|_____/[][]~\\_______|       |
  |/ |   |-----------I_____I [][] []  D   |=======|__
__/ =| o |=-O=====O=====O=====O_/      \\_/
`.trim();

function neofetch(): string {
  return [
    `           .--.          ${portfolio.username}@${portfolio.hostname}`,
    `       _.-'    '-.       -----------`,
    `     .'   Debian  '.     OS: Debian GNU/Linux (Web)`,
    `    /   XFCE Port.  \\    Host: Vite + React`,
    `   ;                 ;   Shell: portfolio-sh`,
    `   |      .--.       |   DE: XFCE (simulated)`,
    `   ;     /    \\      ;   WM: xfwm4-ish`,
    `    \\   |  ()  |    /    Theme: Greybird`,
    `     '._ \\    / _.'     Terminal: xfce4-terminal`,
    `                        Role: ${portfolio.title.split("|")[0].trim()}`,
    `                        Contact: ${portfolio.contact.email}`,
  ].join("\n");
}

function cowsay(text: string): string {
  const max = 42;
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > max && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  const width = Math.max(...lines.map((l) => l.length), 1);
  const top = ` ${"_".repeat(width + 2)}`;
  const bot = ` ${"-".repeat(width + 2)}`;
  const body =
    lines.length === 1
      ? `< ${lines[0].padEnd(width)} >`
      : lines
          .map((l, i) => {
            const left = i === 0 ? "/" : i === lines.length - 1 ? "\\" : "|";
            const right = i === 0 ? "\\" : i === lines.length - 1 ? "/" : "|";
            return `${left} ${l.padEnd(width)} ${right}`;
          })
          .join("\n");
  return [
    top,
    body,
    bot,
    "        \\   ^__^",
    "         \\  (oo)\\_______",
    "            (__)\\       )\\/\\",
    "                ||----w |",
    "                ||     ||",
  ].join("\n");
}

function htop(): string {
  const now = new Date().toTimeString().slice(0, 8);
  return [
    `  ${portfolio.hostname} - ${now} up 1:33,  1 user`,
    "  Tasks: 7 total; Load average: 0.12 0.08 0.04",
    "    PID USER       CPU%  MEM%  COMMAND",
    "    1 root        0.0   0.1  systemd (browser)",
    "  142 armanrasta  4.2   1.8  xfce4-panel",
    "  201 armanrasta 12.0   6.4  neosafe --ppe",
    "  278 armanrasta  8.1   3.3  opencv ColorHashTSDF",
    "  330 armanrasta  1.1   0.9  firefox github.com/armanrasta",
    "  401 armanrasta  0.4   0.2  xeyes --watch-recruiter",
    "  512 armanrasta  0.0   0.1  sleep infinity",
  ].join("\n");
}

export function TerminalApp() {
  const { openApp } = useSession();
  const [cwd, setCwd] = useState(`/home/${portfolio.username}`);
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: BANNER },
    { kind: "out", text: 'Type "help" or "fortune". Welcome aboard.' },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const prompt = `${portfolio.username}@${portfolio.hostname}:${cwd.replace(`/home/${portfolio.username}`, "~")}$`;

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      const next: Line[] = [{ kind: "in", text: `${prompt} ${cmd}` }];
      if (!cmd) {
        setLines((L) => [...L, ...next]);
        return;
      }

      setHistory((h) => [...h, cmd]);
      setHistIdx(-1);

      const [name, ...args] = cmd.split(/\s+/);
      const arg = args.join(" ");

      switch (name) {
        case "help":
          next.push({
            kind: "out",
            text: [
              "Available commands:",
              "  help, clear, whoami, neofetch, fortune, cowsay, sl",
              "  about, experience, skills, projects, contact, github",
              "  ls [-a] [path], cd [path], cat <file>, pwd, date, echo",
              "  htop, ps, open <app>, xdg-open <app>",
              "  sudo, apt, vim, rm, ssh, ping",
            ].join("\n"),
          });
          break;
        case "clear":
          setLines([]);
          return;
        case "whoami":
          next.push({ kind: "out", text: portfolio.username });
          break;
        case "pwd":
          next.push({ kind: "out", text: cwd });
          break;
        case "date":
          next.push({ kind: "out", text: new Date().toString() });
          break;
        case "echo":
          next.push({ kind: "out", text: arg });
          break;
        case "neofetch":
        case "fetch":
          next.push({ kind: "out", text: neofetch() });
          break;
        case "fortune":
          next.push({
            kind: "out",
            text: FORTUNES[Math.floor(Math.random() * FORTUNES.length)],
          });
          break;
        case "cowsay":
          next.push({
            kind: "out",
            text: cowsay(
              arg ||
                `${portfolio.showcase.metric}. Hire ${portfolio.name.split(" ")[0]}.`,
            ),
          });
          break;
        case "sl":
          next.push({ kind: "out", text: SL });
          break;
        case "htop":
        case "ps":
          next.push({ kind: "out", text: htop() });
          break;
        case "sudo":
          next.push({
            kind: "err",
            text: `${portfolio.username} is not in the sudoers file. This incident will be reported to /dev/null.`,
          });
          break;
        case "apt":
        case "apt-get":
          next.push({
            kind: "err",
            text:
              args[0] === "install" && args[1] === "job"
                ? "E: Unable to locate package job. Try: open contact"
                : "E: Could not open lock file /var/lib/dpkg/lock-frontend — this is a browser, not root.",
          });
          break;
        case "vim":
        case "vi":
        case "nvim":
          next.push({
            kind: "out",
            text: [
              "~",
              "~  VIM - Vi IMproved  (web edition)",
              "~  you are already looking at windows",
              "~  Mousepad is in Applications → About",
              "~  :q will not save you",
            ].join("\n"),
          });
          break;
        case ":q":
        case ":q!":
        case ":wq":
          next.push({
            kind: "err",
            text: "E37: No write since last change. You remain in the portfolio.",
          });
          break;
        case "rm": {
          const targets = args.filter((a) => !a.startsWith("-"));
          const flags = args.filter((a) => a.startsWith("-")).join("");
          const rf = flags.includes("r") && flags.includes("f");
          const nuke = targets.some((t) => t === "/" || t === "/*" || t === "~" || t === "~/*");
          if (rf && nuke) {
            next.push({
              kind: "err",
              text: "rm: refusing to remove the portfolio. Recruiters are watching.",
            });
          } else {
            next.push({
              kind: "err",
              text: `rm: cannot remove '${targets[0] ?? "."}': Read-only file system (on purpose)`,
            });
          }
          break;
        }
        case "ssh":
          next.push({
            kind: "err",
            text: `ssh: connect to host ${args[0] || "debian"} port 22: Connection refused (this is a website)`,
          });
          break;
        case "ping": {
          const host = args[0] || "debian.local";
          next.push({
            kind: "out",
            text: [
              `PING ${host} (127.0.0.1): 56 data bytes`,
              `64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.12 ms`,
              `64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.08 ms`,
              `--- ${host} ping statistics ---`,
              "2 packets transmitted, 2 imaginary packets received",
            ].join("\n"),
          });
          break;
        }
        case "open":
        case "xdg-open": {
          const key = (args[0] || "").toLowerCase().replace(/\.(desktop|txt)$/, "");
          const id = OPEN_ALIASES[key];
          if (!id) {
            next.push({
              kind: "err",
              text: `xdg-open: ${args[0] || "(none)"}: not a known app. Try: ${Object.keys(OPEN_ALIASES).slice(0, 8).join(", ")}`,
            });
          } else {
            openApp(id);
            next.push({ kind: "out", text: `Opening ${id}…` });
          }
          break;
        }
        case "about":
          next.push({ kind: "out", text: portfolio.about });
          break;
        case "experience":
          next.push({
            kind: "out",
            text: portfolio.experience
              .map(
                (j) =>
                  `${j.role} · ${j.company} (${j.period})\n${j.highlights.map((h) => `  - ${h}`).join("\n")}`,
              )
              .join("\n\n"),
          });
          break;
        case "skills":
          next.push({
            kind: "out",
            text: portfolio.skillGroups
              .map((g) => `${g.label}: ${g.items.join(", ")}`)
              .join("\n"),
          });
          break;
        case "projects":
          next.push({
            kind: "out",
            text: portfolio.projects
              .map((p, i) => `${i + 1}. ${p.name} — ${p.summary}`)
              .join("\n"),
          });
          break;
        case "contact":
          next.push({
            kind: "out",
            text: Object.entries(portfolio.contact)
              .map(([k, v]) => `${k}: ${v}`)
              .join("\n"),
          });
          break;
        case "github":
          next.push({ kind: "out", text: "Fetching github.com/armanrasta …" });
          setLines((L) => [...L, ...next]);
          void fetchGithubRepos()
            .then((repos) => {
              const text = repos
                .map(
                  (r) =>
                    `${r.name}  ★${r.stargazers_count}${r.language ? `  (${r.language})` : ""}\n  ${r.html_url}`,
                )
                .join("\n");
              setLines((L) => [
                ...L,
                { kind: "out", text: text || "(no public repos)" },
              ]);
            })
            .catch((e: Error) => {
              setLines((L) => [...L, { kind: "err", text: e.message }]);
            });
          return;
        case "ls": {
          const flags = args.filter((a) => a.startsWith("-"));
          const pathArg = args.find((a) => !a.startsWith("-"));
          const all = flags.some((f) => f.includes("a"));
          const path = pathArg
            ? pathArg.startsWith("/") || pathArg.startsWith("~")
              ? pathArg
              : `${cwd}/${pathArg}`
            : cwd;
          const listing = listDir(path, all);
          if (!listing) {
            next.push({
              kind: "err",
              text: `ls: cannot access '${path}': No such file or directory`,
            });
          } else {
            next.push({ kind: "out", text: listing.join("  ") || "(empty)" });
          }
          break;
        }
        case "cd": {
          const target = !args[0] || args[0] === "~"
            ? `/home/${portfolio.username}`
            : args[0] === ".."
              ? cwd.split("/").slice(0, -1).join("/") || "/"
              : args[0].startsWith("/") || args[0].startsWith("~")
                ? args[0].replace(/^~/, `/home/${portfolio.username}`)
                : `${cwd}/${args[0]}`;
          const normalized = target.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
          const node = resolvePath(normalized);
          if (!node || node.type !== "dir") {
            next.push({ kind: "err", text: `cd: ${args[0] ?? "~"}: No such directory` });
          } else {
            setCwd(normalized);
          }
          break;
        }
        case "cat": {
          if (!args[0]) {
            next.push({ kind: "err", text: "cat: missing file operand" });
            break;
          }
          const path = args[0].startsWith("/") || args[0].startsWith("~")
            ? args[0].replace(/^~/, `/home/${portfolio.username}`)
            : `${cwd}/${args[0]}`;
          const node = resolvePath(path);
          if (!node || node.type !== "file") {
            next.push({ kind: "err", text: `cat: ${args[0]}: No such file` });
          } else {
            next.push({ kind: "out", text: node.content });
          }
          break;
        }
        default:
          next.push({
            kind: "err",
            text: `portfolio-sh: ${name}: command not found\nDid you mean help?`,
          });
      }

      setLines((L) => [...L, ...next]);
    },
    [cwd, openApp, prompt],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(input);
    setInput("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const idx = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setInput(history[idx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx < 0) return;
      const idx = histIdx + 1;
      if (idx >= history.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(idx);
        setInput(history[idx] ?? "");
      }
    }
  };

  return (
    <div
      className="terminal"
      onClick={() => inputRef.current?.focus()}
      role="application"
      aria-label="Terminal"
    >
      <div className="terminal-scroll">
        {lines.map((line, i) => (
          <pre
            key={i}
            className={`term-line term-${line.kind}`}
          >
            {line.text}
          </pre>
        ))}
        <form className="term-input-row" onSubmit={onSubmit}>
          <span className="term-prompt">{prompt}</span>
          <input
            ref={inputRef}
            className="term-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            aria-label="Command"
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
