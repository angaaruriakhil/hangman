import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  GameStatus,
  HangmanOptions,
  HangmanState,
  StartOptions,
} from "../types";

const DEFAULT_MAX_LIVES = 6;
const ENV_API = import.meta.env.VITE_WORD_API as string | undefined;
const BASE_API = ENV_API || "https://random-word-api.herokuapp.com/word";

function normalizeWord(w: string) {
  return w.trim().toUpperCase();
}

async function fetchRandomWord(
  length?: number,
  base = BASE_API
): Promise<string> {
  // Build URL with ?number=1 and optional &length=
  const url = new URL(base);
  url.searchParams.set("number", "1");
  if (length && Number.isFinite(length)) {
    url.searchParams.set("length", String(length));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Word API error: ${res.status}`);
  const data = await res.json();
  if (typeof data === "string") return normalizeWord(data);
  if (Array.isArray(data)) return normalizeWord(String(data[0] || ""));
  if (typeof (data as any)?.word === "string")
    return normalizeWord((data as any).word);
  throw new Error("Unrecognized word API response");
}

export function useHangman(opts?: HangmanOptions) {
  const initialMax = opts?.maxLives ?? DEFAULT_MAX_LIVES;

  const [state, setState] = useState<HangmanState>({
    status: "idle",
    secretWord: "",
    guesses: new Set(),
    lives: initialMax,
    maxLives: initialMax,
    wordLength: undefined,
    lastGuess: null,
  });

  // Keep maxLives in sync if prop changes while idle
  useEffect(() => {
    if (state.status === "idle") {
      setState((s) => ({
        ...s,
        maxLives: opts?.maxLives ?? DEFAULT_MAX_LIVES,
        lives: opts?.maxLives ?? DEFAULT_MAX_LIVES,
      }));
    }
  }, [opts?.maxLives]);

  const startGame = useCallback(
    async (startOpts?: StartOptions) => {
      const nextMaxLives = startOpts?.maxLives ?? state.maxLives;
      const nextWordLen = startOpts?.wordLength ?? state.wordLength;

      // move to playing; reset guesses and set chosen config
      setState((s) => ({
        ...s,
        status: "playing",
        guesses: new Set(),
        maxLives: nextMaxLives,
        lives: nextMaxLives,
        wordLength: nextWordLen,
        lastGuess: null,
        secretWord: "", // will set after fetch
      }));

      try {
        const word = await fetchRandomWord(nextWordLen);
        setState((s) => ({ ...s, secretWord: word }));
      } catch (e) {
        console.error(e);
        setState((s) => ({ ...s, secretWord: "REACT" }));
      }
    },
    [state.maxLives, state.wordLength]
  );

  const reset = useCallback(() => {
    setState((s) => ({
      ...s,
      status: "idle",
      secretWord: "",
      guesses: new Set(),
      lives: s.maxLives,
      lastGuess: null,
    }));
  }, []);

  const handleGuess = useCallback((raw: string) => {
    const letter = raw.toUpperCase();
    setState((prev) => {
      if (prev.status !== "playing") return prev;
      if (!/^[A-Z]$/.test(letter)) return prev;
      if (prev.guesses.has(letter)) return prev;

      const guesses = new Set(prev.guesses);
      guesses.add(letter);

      const hit = prev.secretWord.includes(letter);
      const wrongCount = Array.from(guesses).filter(
        (g) => !prev.secretWord.includes(g)
      ).length;
      const lives = Math.max(prev.maxLives - wrongCount, 0);

      const allRevealed = prev.secretWord
        .split("")
        .filter((ch) => /[A-Z]/.test(ch))
        .every((ch) => guesses.has(ch));

      let status: GameStatus = prev.status;
      if (allRevealed) status = "won";
      else if (lives <= 0) status = "lost";

      return { ...prev, guesses, lives, status, lastGuess: { letter, hit } };
    });
  }, []);

  const letters = useMemo(() => state.secretWord.split(""), [state.secretWord]);
  const revealed = useMemo(
    () =>
      letters.map((ch) => ({
        char: ch,
        isLetter: /[A-Z]/.test(ch),
        isRevealed: /[A-Z]/.test(ch)
          ? state.guesses.has(ch) ||
            (state.status !== "playing" && state.status !== "idle")
          : true,
      })),
    [letters, state.guesses, state.status]
  );

  const wrongGuesses = useMemo(
    () =>
      Array.from(state.guesses).filter((g) => !state.secretWord.includes(g)),
    [state.guesses, state.secretWord]
  );
  const rightGuesses = useMemo(
    () => Array.from(state.guesses).filter((g) => state.secretWord.includes(g)),
    [state.guesses, state.secretWord]
  );

  return {
    state,
    startGame,
    reset,
    handleGuess,
    letters,
    revealed,
    wrongGuesses,
    rightGuesses,
  };
}
