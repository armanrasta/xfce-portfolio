import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import "../apps/apps.css";
import "./SnakeGame.css";

const COLS = 20;
const ROWS = 16;
const TICK_MS = 110;
const HS_KEY = "xfce-portfolio-snake-hs";

type Pt = { x: number; y: number };
type Dir = "up" | "down" | "left" | "right";

const OPPOSITE: Record<Dir, Dir> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

function randomFood(snake: Pt[]): Pt {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  let p: Pt;
  do {
    p = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (occupied.has(`${p.x},${p.y}`));
  return p;
}

function initialSnake(): Pt[] {
  return [
    { x: 8, y: 8 },
    { x: 7, y: 8 },
    { x: 6, y: 8 },
  ];
}

export function SnakeGame() {
  const [snake, setSnake] = useState<Pt[]>(initialSnake);
  const [food, setFood] = useState<Pt>(() => randomFood(initialSnake()));
  const [dir, setDir] = useState<Dir>("right");
  const [pendingDir, setPendingDir] = useState<Dir>("right");
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem(HS_KEY) || 0);
    } catch {
      return 0;
    }
  });
  const wrapRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<Dir>("right");
  const dirRef = useRef<Dir>("right");

  useEffect(() => {
    pendingRef.current = pendingDir;
  }, [pendingDir]);
  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);

  const reset = useCallback(() => {
    const s = initialSnake();
    setSnake(s);
    setFood(randomFood(s));
    setDir("right");
    setPendingDir("right");
    pendingRef.current = "right";
    dirRef.current = "right";
    setScore(0);
    setGameOver(false);
    setRunning(true);
  }, []);

  useEffect(() => {
    wrapRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!running || gameOver) return;
    const id = window.setInterval(() => {
      const nextDir =
        pendingRef.current !== OPPOSITE[dirRef.current]
          ? pendingRef.current
          : dirRef.current;
      dirRef.current = nextDir;
      setDir(nextDir);

      setSnake((prev) => {
        const head = prev[0];
        const nxt: Pt = {
          x: head.x + (nextDir === "left" ? -1 : nextDir === "right" ? 1 : 0),
          y: head.y + (nextDir === "up" ? -1 : nextDir === "down" ? 1 : 0),
        };

        if (nxt.x < 0 || nxt.x >= COLS || nxt.y < 0 || nxt.y >= ROWS) {
          setGameOver(true);
          setRunning(false);
          return prev;
        }
        if (prev.some((p) => p.x === nxt.x && p.y === nxt.y)) {
          setGameOver(true);
          setRunning(false);
          return prev;
        }

        const ate = nxt.x === food.x && nxt.y === food.y;
        const body = [nxt, ...prev];
        if (!ate) body.pop();
        else {
          setScore((sc) => {
            const n = sc + 10;
            setHighScore((hs) => {
              if (n > hs) {
                try {
                  localStorage.setItem(HS_KEY, String(n));
                } catch {
                  /* ignore */
                }
                return n;
              }
              return hs;
            });
            return n;
          });
          setFood(randomFood(body));
        }
        return body;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [running, gameOver, food]);

  const onKeyDown = (e: KeyboardEvent) => {
    const map: Record<string, Dir> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      s: "down",
      a: "left",
      d: "right",
      W: "up",
      S: "down",
      A: "left",
      D: "right",
    };
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (gameOver || !running) reset();
      return;
    }
    const d = map[e.key];
    if (!d) return;
    e.preventDefault();
    if (!running && !gameOver) setRunning(true);
    if (d !== OPPOSITE[dirRef.current]) {
      setPendingDir(d);
      pendingRef.current = d;
    }
  };

  const cells = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const i = snake.findIndex((p) => p.x === x && p.y === y);
      const isFood = food.x === x && food.y === y;
      let cls = "snake-cell";
      if (i === 0) cls += " snake-head";
      else if (i > 0) cls += " snake-body";
      if (isFood) cls += " snake-food";
      cells.push(<div key={`${x}-${y}`} className={cls} />);
    }
  }

  return (
    <div
      className="snake-app"
      ref={wrapRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseDown={() => wrapRef.current?.focus()}
      role="application"
      aria-label="Snake game"
    >
      <div className="snake-toolbar">
        <span>
          Score: <strong>{score}</strong>
        </span>
        <span>
          Best: <strong>{highScore}</strong>
        </span>
        <button type="button" className="xfce-btn" onClick={reset}>
          {gameOver ? "Play again" : running ? "Restart" : "Start"}
        </button>
      </div>
      <div
        className="snake-board"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
      >
        {cells}
        {(gameOver || !running) && (
          <div className="snake-overlay">
            {gameOver ? (
              <>
                <p className="snake-overlay-title">Game over</p>
                <p>Score {score}</p>
              </>
            ) : (
              <>
                <p className="snake-overlay-title">Snake</p>
                <p>Arrow keys or WASD</p>
              </>
            )}
            <p className="snake-overlay-hint">Press Space or Start</p>
          </div>
        )}
      </div>
      <div className="snake-status">
        Classic snake — eat the red dots, don’t hit the walls (or yourself)
      </div>
    </div>
  );
}
