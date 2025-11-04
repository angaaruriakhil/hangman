import { useEffect, useCallback } from "react";
import { useHangman } from "../../hooks/useHangman";
import Header from "../Header/Header";
import WordDisplay from "../WordDisplay/WordDisplay";
import StatusBar from "../StatusBar/StatusBar";
import Keyboard from "../Keyboard/Keyboard";
import ResultBanner from "../ResultBanner/ResultBanner";
import s from "./Game.module.css";

export default function Game() {
  const {
    state,
    startGame,
    reset,
    handleGuess,
    revealed,
    wrongGuesses,
    rightGuesses,
  } = useHangman();

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (/^[a-z]$/i.test(e.key)) {
        handleGuess(e.key);
      } else if (e.key === "Enter") {
        if (state.status === "idle") startGame();
        if (state.status === "won" || state.status === "lost") reset();
      }
    },
    [handleGuess, reset, startGame, state.status]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <div className={s.game}>
      <Header
        status={state.status}
        lives={state.lives}
        maxLives={state.maxLives}
        onStart={(opts) => startGame(opts)}
        onReset={reset}
      />

      <WordDisplay status={state.status} letters={revealed} />

      <StatusBar
        status={state.status}
        lives={state.lives}
        maxLives={state.maxLives}
        wrongGuesses={wrongGuesses}
        rightGuesses={rightGuesses}
      />

      <Keyboard
        disabled={state.status !== "playing"}
        guesses={state.guesses}
        lastGuess={state.lastGuess}
        secretWord={state.secretWord}
        onGuess={handleGuess}
      />

      <ResultBanner
        status={state.status}
        secretWord={state.secretWord}
        onReset={reset}
      />
    </div>
  );
}
