export type TimerMode = "focus" | "shortBreak" | "longBreak";

export type Theme = "default" | "forest" | "ocean" | "dusk";

export type AmbientSound = "none" | "rain" | "forest" | "whitenoise";

export interface Session {
  id: number;
  date: string; // ISO string
  duration: number; // in minutes
  mode: TimerMode;
  focusRating?: number; // 1-5 scale
}

export interface Settings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  selectedTheme: Theme;
  ambientSound: AmbientSound;
  soundVolume: number;
}
