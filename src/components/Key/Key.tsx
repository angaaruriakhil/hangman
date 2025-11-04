import s from "./Key.module.css";

interface Props {
  letter: string;
  state: "idle" | "used" | "hit" | "miss";
  disabled?: boolean;
  onClick: () => void;
}

export default function Key({ letter, state, disabled, onClick }: Props) {
  const stateClass =
    state === "hit"
      ? s.hit
      : state === "miss"
      ? s.miss
      : state === "used"
      ? s.used
      : "";

  return (
    <button
      className={`${s.key} ${stateClass}`}
      aria-label={`Key ${letter}${state === "used" ? ", used" : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {letter}
    </button>
  );
}
