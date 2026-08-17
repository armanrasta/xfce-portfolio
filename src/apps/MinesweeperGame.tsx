import { useCallback, useMemo, useState } from "react";
import "./MinesweeperGame.css";

const COLS = 9;
const ROWS = 9;
const MINES = 10;

type Cell = {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adj: number;
};

type Status = "ready" | "playing" | "won" | "lost";

function neighbors(x: number, y: number): [number, number][] {
  const out: [number, number][] = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS) out.push([nx, ny]);
    }
  }
  return out;
}

function emptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adj: 0,
    })),
  );
}

function plantMines(board: Cell[][], safeX: number, safeY: number): Cell[][] {
  const next = board.map((row) => row.map((c) => ({ ...c })));
  let placed = 0;
  while (placed < MINES) {
    const x = Math.floor(Math.random() * COLS);
    const y = Math.floor(Math.random() * ROWS);
    if ((x === safeX && y === safeY) || next[y][x].mine) continue;
    if (neighbors(safeX, safeY).some(([nx, ny]) => nx === x && ny === y)) continue;
    next[y][x].mine = true;
    placed += 1;
  }
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (next[y][x].mine) {
        next[y][x].adj = 0;
        continue;
      }
      next[y][x].adj = neighbors(x, y).filter(([nx, ny]) => next[ny][nx].mine).length;
    }
  }
  return next;
}

function floodReveal(board: Cell[][], x: number, y: number): Cell[][] {
  const next = board.map((row) => row.map((c) => ({ ...c })));
  const stack: [number, number][] = [[x, y]];
  while (stack.length) {
    const [cx, cy] = stack.pop()!;
    const cell = next[cy][cx];
    if (cell.revealed || cell.flagged) continue;
    cell.revealed = true;
    if (cell.mine || cell.adj > 0) continue;
    for (const [nx, ny] of neighbors(cx, cy)) {
      if (!next[ny][nx].revealed && !next[ny][nx].flagged) stack.push([nx, ny]);
    }
  }
  return next;
}

function checkWin(board: Cell[][]): boolean {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const c = board[y][x];
      if (!c.mine && !c.revealed) return false;
    }
  }
  return true;
}

export function MinesweeperGame() {
  const [board, setBoard] = useState<Cell[][]>(emptyBoard);
  const [status, setStatus] = useState<Status>("ready");
  const [planted, setPlanted] = useState(false);

  const flags = useMemo(
    () => board.flat().filter((c) => c.flagged).length,
    [board],
  );

  const reset = useCallback(() => {
    setBoard(emptyBoard());
    setStatus("ready");
    setPlanted(false);
  }, []);

  const reveal = (x: number, y: number) => {
    if (status === "won" || status === "lost") return;
    let next = board;
    let isPlanted = planted;
    if (!isPlanted) {
      next = plantMines(board, x, y);
      isPlanted = true;
      setPlanted(true);
      setStatus("playing");
    }
    const cell = next[y][x];
    if (cell.revealed || cell.flagged) return;
    if (cell.mine) {
      const blown = next.map((row) =>
        row.map((c) => (c.mine ? { ...c, revealed: true } : { ...c })),
      );
      blown[y][x] = { ...blown[y][x], revealed: true };
      setBoard(blown);
      setStatus("lost");
      return;
    }
    next = floodReveal(next, x, y);
    setBoard(next);
    if (checkWin(next)) setStatus("won");
  };

  const toggleFlag = (x: number, y: number) => {
    if (status === "won" || status === "lost") return;
    setBoard((prev) => {
      const cell = prev[y][x];
      if (cell.revealed) return prev;
      return prev.map((row, ry) =>
        row.map((c, rx) =>
          rx === x && ry === y ? { ...c, flagged: !c.flagged } : c,
        ),
      );
    });
    if (status === "ready") setStatus("playing");
  };

  return (
    <div className="mine-app" role="application" aria-label="Minesweeper">
      <div className="mine-toolbar">
        <span>
          Mines: <strong>{Math.max(0, MINES - flags)}</strong>
        </span>
        <span className="mine-face" aria-hidden>
          {status === "lost" ? "✗" : status === "won" ? "✓" : "☺"}
        </span>
        <button type="button" className="xfce-btn" onClick={reset}>
          New game
        </button>
      </div>
      <div
        className="mine-board"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
      >
        {board.map((row, y) =>
          row.map((cell, x) => {
            let cls = "mine-cell";
            if (cell.revealed) cls += " open";
            if (cell.revealed && cell.mine) cls += " boom";
            if (cell.flagged && !cell.revealed) cls += " flag";
            const label = cell.revealed
              ? cell.mine
                ? "✱"
                : cell.adj || ""
              : cell.flagged
                ? "⚑"
                : "";
            return (
              <button
                key={`${x}-${y}`}
                type="button"
                className={`${cls}${cell.revealed && cell.adj ? ` n${cell.adj}` : ""}`}
                onClick={() => reveal(x, y)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  toggleFlag(x, y);
                }}
                aria-label={
                  cell.revealed
                    ? cell.mine
                      ? "Mine"
                      : `${cell.adj} adjacent`
                    : cell.flagged
                      ? "Flagged"
                      : "Hidden"
                }
              >
                {label}
              </button>
            );
          }),
        )}
        {(status === "won" || status === "lost") && (
          <div className="mine-overlay">
            <p className="mine-overlay-title">
              {status === "won" ? "Cleared" : "Boom"}
            </p>
            <p className="mine-overlay-hint">New game to try again</p>
          </div>
        )}
      </div>
      <div className="mine-status">
        Left-click reveal · right-click flag · beginner 9×9
      </div>
    </div>
  );
}
