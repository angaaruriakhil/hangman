export type GameStatus = "idle" | "playing" | "won" | "lost";

export interface HangmanOptions {
  maxLives?: number;
  wordApi?: string;
}

export interface StartOptions {
  maxLives?: number; // override default just for this round
  wordLength?: number; // use API ?length=
}

export interface HangmanState {
  status: GameStatus;
  secretWord: string;
  guesses: Set<string>;
  lives: number;
  maxLives: number;
  wordLength?: number;
  lastGuess?: { letter: string; hit: boolean } | null;
}
