import type { GameStatus } from "../../types";
import s from "./StatusBar.module.css";

interface Props {
  status: GameStatus;
  lives: number;
  maxLives: number;
  wrongGuesses: string[];
  rightGuesses: string[];
}

export default function StatusBar({
  status,
  lives,
  maxLives,
  wrongGuesses,
  rightGuesses,
}: Props) {
  return (
    <div className={s.status}>
      <div className="status__item">
        Status: <strong>{status}</strong>
      </div>
      <div className="status__item">
        Lives: {lives}/{maxLives}
      </div>
      <div className="status__item">Hits: {rightGuesses.join(" ")}</div>
      <div className="status__item status__item--miss">
        Misses: {wrongGuesses.join(" ")}
      </div>
    </div>
  );
}
