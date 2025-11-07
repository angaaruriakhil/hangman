import { useState } from "react";
import type { GameStatus } from "../../types";
import s from "./Header.module.css";

interface Props {
  status: GameStatus;
  lives: number;
  maxLives: number;
  onStart: (opts?: { maxLives?: number; wordLength?: number }) => void;
  onReset: () => void;
}

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));

export default function Header({
  status,
  lives,
  maxLives,
  onStart,
  onReset,
}: Props) {
  const [livesInput, setLivesInput] = useState<number>(5);
  const [lengthInput, setLengthInput] = useState<number | "">(5);

  const disabled = status !== "idle";

  return (
    <header className={s.header}>
      <h1 className={s.title}>Hangman</h1>

      <div className={s.toolbar} aria-label="Game options">
        <label className={s.field} aria-disabled={disabled}>
          <span className={s.label}>Lives</span>
          <input
            className={s.input}
            type="number"
            min={1}
            max={10}
            value={livesInput}
            disabled={disabled}
            onChange={(e) =>
              setLivesInput(clamp(Number(e.target.value || 1), 1, 10))
            }
          />
        </label>

        <span className={s.divider} aria-hidden="true" />

        <label className={`${s.field} ${s.fieldWord}`} aria-disabled={disabled}>
          <span className={s.label}>Length</span>
          <input
            className={s.input}
            type="number"
            min={3}
            max={10}
            value={lengthInput}
            disabled={disabled}
            placeholder="any"
            onChange={(e) => {
              const v = e.target.value;
              setLengthInput(v === "" ? "" : clamp(Number(v), 3, 10));
            }}
          />
        </label>

        <span className={s.divider} aria-hidden="true" />

        {status === "idle" ? (
          <button
            className={`${s.action} btn btn-primary`}
            onClick={() =>
              onStart({
                maxLives: clamp(livesInput ?? 5, 1, 10),
                wordLength:
                  typeof lengthInput === "number"
                    ? clamp(lengthInput, 3, 10)
                    : undefined,
              })
            }
          >
            Start
          </button>
        ) : (
          <button className={`${s.action} btn`} onClick={onReset}>
            Reset
          </button>
        )}

        <span className={s.spacer} />

        <div className={s.dots} aria-label={`Lives: ${lives} of ${maxLives}`}>
          {Array.from({ length: maxLives }, (_, i) => (
            <span
              key={i}
              className={`${s.life} ${i < lives ? s.lifeFull : ""}`}
            />
          ))}
        </div>
      </div>
    </header>
  );
}
