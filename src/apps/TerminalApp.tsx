import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { portfolio } from "../content/portfolio";
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

export function TerminalApp() {
  const [cwd, setCwd] = useState(`/home/${portfolio.username}`);
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: BANNER },
    { kind: "out", text: 'Type "help" for commands. Welcome aboard.' },
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
              "  help, clear, whoami, neofetch, about, experience, skills",
              "  projects, contact, github",
              "  ls [path], cd [path], cat <file>, pwd, date, echo <text>",
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
          const path = args[0]
            ? args[0].startsWith("/") || args[0].startsWith("~")
              ? args[0]
              : `${cwd}/${args[0]}`
            : cwd;
          const listing = listDir(path);
          if (!listing) next.push({ kind: "err", text: `ls: cannot access '${path}': No such file or directory` });
          else next.push({ kind: "out", text: listing.join("  ") || "(empty)" });
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
            text: `portfolio-sh: ${name}: command not found`,
          });
      }

      setLines((L) => [...L, ...next]);
    },
    [cwd, prompt],
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
