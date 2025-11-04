import Key from "../Key/Key";
import s from "./Keyboard.module.css";

const ROWS = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  "ZXCVBNM".split(""),
];

interface Props {
  disabled?: boolean;
  guesses: Set<string>;
  lastGuess?: { letter: string; hit: boolean } | null;
  secretWord: string;
  onGuess: (letter: string) => void;
}

export default function Keyboard({
  disabled,
  guesses,
  lastGuess,
  secretWord,
  onGuess,
}: Props) {
  return (
    <div
      className={`${s.keyboard} ${disabled ? s.disabled : ""}`}
      aria-disabled={!!disabled}
    >
      {ROWS.map((row, i) => (
        <div className={s.row} key={i}>
          {row.map((letter) => (
            <Key
              key={letter}
              letter={letter}
              state={
                guesses.has(letter)
                  ? secretWord.includes(letter)
                    ? "hit"
                    : "miss"
                  : "idle"
              }
              onClick={() => onGuess(letter)}
              disabled={disabled || guesses.has(letter)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
