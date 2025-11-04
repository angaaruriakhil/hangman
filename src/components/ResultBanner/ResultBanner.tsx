import type { GameStatus } from "../../types";
import s from "./ResultBanner.module.css";

interface Props {
  status: GameStatus;
  secretWord: string;
  onReset: () => void;
}

export default function ResultBanner({ status, secretWord, onReset }: Props) {
  if (status !== "won" && status !== "lost") return null;
  return (
    <div
      className={`${s.result} ${status === "won" ? s.won : s.lost}`}
      role="status"
      aria-live="polite"
    >
      {status === "won" ? (
        <p>
          🎉 You won! The word was <strong>{secretWord}</strong>.
        </p>
      ) : (
        <p>
          😢 You lost. The word was <strong>{secretWord}</strong>.
        </p>
      )}
      <button className="btn" style={{ minWidth: 0 }} onClick={onReset}>
        Play again
      </button>
    </div>
  );
}
