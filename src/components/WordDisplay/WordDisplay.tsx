import type { GameStatus } from "../../types";
import s from "./WordDisplay.module.css";

interface Cell {
  char: string;
  isLetter: boolean;
  isRevealed: boolean;
}

interface Props {
  status: GameStatus;
  letters: Cell[];
}

export default function WordDisplay({ status, letters }: Props) {
  if (status === "idle")
    return (
      <div className={`${s.word} ${s.hidden}`}>
        Select number of lives and length of the word to generate, then press
        Start.
      </div>
    );

  return (
    <div className={s.word} role="list" aria-label="Secret word">
      {letters.map((l, i) => (
        <span
          role="listitem"
          aria-label={l.isLetter ? (l.isRevealed ? l.char : "blank") : l.char}
          key={i}
          className={`${s.box} ${l.isLetter ? "" : s.sep} ${
            l.isRevealed ? s.show : s.hide
          }`}
        >
          {l.isLetter ? (l.isRevealed ? l.char : "") : l.char}
        </span>
      ))}
    </div>
  );
}
