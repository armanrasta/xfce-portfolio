import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import "./PongGame.css";

const W = 480;
const H = 300;
const PADDLE_H = 56;
const PADDLE_W = 10;
const BALL = 8;
const SPEED = 3.2;
const AI_SPEED = 2.4;
const HS_KEY = "xfce-portfolio-pong-hs";

type Ball = { x: number; y: number; vx: number; vy: number };

function serve(toLeft: boolean): Ball {
  const angle = (Math.random() * 0.7 - 0.35) * Math.PI;
  const dir = toLeft ? -1 : 1;
  return {
    x: W / 2,
    y: H / 2,
    vx: Math.cos(angle) * SPEED * dir,
    vy: Math.sin(angle) * SPEED,
  };
}

export function PongGame() {
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem(HS_KEY) || 0);
    } catch {
      return 0;
    }
  });
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerY = useRef(H / 2 - PADDLE_H / 2);
  const aiY = useRef(H / 2 - PADDLE_H / 2);
  const ball = useRef<Ball>(serve(false));
  const keys = useRef({ up: false, down: false });
  const scoreRef = useRef(0);
  const runningRef = useRef(false);
  const raf = useRef(0);

  const persistBest = useCallback((n: number) => {
    setHighScore((hs) => {
      if (n <= hs) return hs;
      try {
        localStorage.setItem(HS_KEY, String(n));
      } catch {
        /* ignore */
      }
      return n;
    });
  }, []);

  const reset = useCallback(() => {
    playerY.current = H / 2 - PADDLE_H / 2;
    aiY.current = H / 2 - PADDLE_H / 2;
    ball.current = serve(false);
    scoreRef.current = 0;
    setScore(0);
    setOver(false);
    setRunning(true);
    runningRef.current = true;
    wrapRef.current?.focus();
  }, []);

  useEffect(() => {
    wrapRef.current?.focus();
  }, []);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tick = () => {
      if (runningRef.current) {
        if (keys.current.up) playerY.current = Math.max(0, playerY.current - 4.5);
        if (keys.current.down) {
          playerY.current = Math.min(H - PADDLE_H, playerY.current + 4.5);
        }

        const b = ball.current;
        const target = b.y - PADDLE_H / 2;
        if (aiY.current + PADDLE_H / 2 < b.y - 4) {
          aiY.current = Math.min(H - PADDLE_H, aiY.current + AI_SPEED);
        } else if (aiY.current + PADDLE_H / 2 > b.y + 4) {
          aiY.current = Math.max(0, aiY.current - AI_SPEED);
        } else {
          aiY.current += (target - aiY.current) * 0.04;
        }

        b.x += b.vx;
        b.y += b.vy;

        if (b.y <= 0 || b.y + BALL >= H) {
          b.vy *= -1;
          b.y = Math.max(0, Math.min(H - BALL, b.y));
        }

        if (
          b.vx < 0 &&
          b.x <= 18 + PADDLE_W &&
          b.x >= 18 &&
          b.y + BALL >= playerY.current &&
          b.y <= playerY.current + PADDLE_H
        ) {
          b.vx = Math.abs(b.vx) * 1.04;
          const hit = (b.y + BALL / 2 - (playerY.current + PADDLE_H / 2)) / (PADDLE_H / 2);
          b.vy = hit * SPEED;
          b.x = 18 + PADDLE_W;
          scoreRef.current += 1;
          setScore(scoreRef.current);
          persistBest(scoreRef.current);
        }

        if (
          b.vx > 0 &&
          b.x + BALL >= W - 18 - PADDLE_W &&
          b.x + BALL <= W - 18 &&
          b.y + BALL >= aiY.current &&
          b.y <= aiY.current + PADDLE_H
        ) {
          b.vx = -Math.abs(b.vx) * 1.03;
          const hit = (b.y + BALL / 2 - (aiY.current + PADDLE_H / 2)) / (PADDLE_H / 2);
          b.vy = hit * SPEED;
          b.x = W - 18 - PADDLE_W - BALL;
        }

        if (b.x + BALL < 0) {
          runningRef.current = false;
          setRunning(false);
          setOver(true);
        }
        if (b.x > W) {
          ball.current = serve(true);
        }
      }

      ctx.fillStyle = "#0d1218";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#7dffa0";
      ctx.fillRect(18, playerY.current, PADDLE_W, PADDLE_H);
      ctx.fillStyle = "#ff8a80";
      ctx.fillRect(W - 18 - PADDLE_W, aiY.current, PADDLE_W, PADDLE_H);
      ctx.fillStyle = "#fff";
      ctx.fillRect(ball.current.x, ball.current.y, BALL, BALL);

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [persistBest]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (over || !running) reset();
      return;
    }
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
      e.preventDefault();
      keys.current.up = true;
      if (!running && !over) {
        setRunning(true);
        runningRef.current = true;
      }
    }
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
      e.preventDefault();
      keys.current.down = true;
      if (!running && !over) {
        setRunning(true);
        runningRef.current = true;
      }
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.current.up = false;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.current.down = false;
  };

  return (
    <div
      className="pong-app"
      ref={wrapRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onMouseDown={() => wrapRef.current?.focus()}
      role="application"
      aria-label="Pong"
    >
      <div className="pong-toolbar">
        <span>
          Score: <strong>{score}</strong>
        </span>
        <span>
          Best: <strong>{highScore}</strong>
        </span>
        <button type="button" className="xfce-btn" onClick={reset}>
          {over ? "Play again" : running ? "Restart" : "Start"}
        </button>
      </div>
      <div className="pong-stage">
        <canvas ref={canvasRef} width={W} height={H} className="pong-canvas" />
        {(over || !running) && (
          <div className="pong-overlay">
            {over ? (
              <>
                <p className="pong-overlay-title">Game over</p>
                <p>Score {score}</p>
              </>
            ) : (
              <>
                <p className="pong-overlay-title">Pong</p>
                <p>↑ / ↓ or W / S</p>
              </>
            )}
            <p className="pong-overlay-hint">Press Space or Start</p>
          </div>
        )}
      </div>
      <div className="pong-status">You vs a mild AI — keep the ball in play</div>
    </div>
  );
}
