"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Header } from "./header";
import { TimerDisplay } from "./timer-display";
import { TimerControls } from "./timer-controls";
import { QuoteDisplay } from "./quote-display";
import type { Settings, Session, TimerMode } from "@/types";

const DEFAULT_SETTINGS: Settings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  selectedTheme: "default",
};

export function ZenFocusPage() {
  const [settings, setSettings] = useLocalStorage<Settings>("zenfocus-settings", DEFAULT_SETTINGS);
  const [sessions, setSessions] = useLocalStorage<Session[]>("zenfocus-sessions", []);
  
  const [mode, setMode] = useState<TimerMode>("focus");
  const [isActive, setIsActive] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);

  const durationInMinutes = useMemo(() => {
    switch (mode) {
      case "focus":
        return settings.focusDuration;
      case "shortBreak":
        return settings.shortBreakDuration;
      case "longBreak":
        return settings.longBreakDuration;
      default:
        return settings.focusDuration;
    }
  }, [mode, settings]);
  
  const durationInSeconds = durationInMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(durationInSeconds);

  const progress = (durationInSeconds - secondsLeft) / durationInSeconds * 100;

  const handleSessionEnd = useCallback(() => {
    const newSession: Session = {
      id: Date.now(),
      date: new Date().toISOString(),
      duration: durationInMinutes,
      mode,
    };
    setSessions(prev => [...prev, newSession]);

    if (mode === "focus") {
      const newCompletedCycles = completedCycles + 1;
      setCompletedCycles(newCompletedCycles);
      if (newCompletedCycles % settings.longBreakInterval === 0) {
        setMode("longBreak");
      } else {
        setMode("shortBreak");
      }
    } else {
      setMode("focus");
    }
    setIsActive(false);
  }, [mode, durationInMinutes, setSessions, completedCycles, settings.longBreakInterval]);

  useEffect(() => {
    setSecondsLeft(durationInMinutes * 60);
  }, [durationInMinutes, settings]);
  
  useEffect(() => {
    if (secondsLeft === 0) {
      handleSessionEnd();
      new Audio('/notification.mp3').play().catch(e => console.error("Error playing sound:", e));
    }
  }, [secondsLeft, handleSessionEnd]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (!isActive && secondsLeft !== 0) {
      interval && clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);
  
  const resetTimer = useCallback(() => {
    setIsActive(false);
    setSecondsLeft(durationInMinutes * 60);
  }, [durationInMinutes]);

  const handleSettingsChange = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    if(mode === 'focus' && newSettings.focusDuration) {
       setSecondsLeft(newSettings.focusDuration * 60);
    } else if (mode === 'shortBreak' && newSettings.shortBreakDuration) {
        setSecondsLeft(newSettings.shortBreakDuration * 60);
    } else if (mode === 'longBreak' && newSettings.longBreakDuration) {
        setSecondsLeft(newSettings.longBreakDuration * 60);
    }
    setIsActive(false);
  };
  
  useEffect(() => {
    document.body.setAttribute('data-theme', settings.selectedTheme);
    document.title = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")} - ${mode.charAt(0).toUpperCase() + mode.slice(1)} | ZenFocus`;
  }, [settings.selectedTheme, secondsLeft, mode]);

  return (
    <>
      <Header
        settings={settings}
        onSettingsChange={handleSettingsChange}
        sessions={sessions}
      />
      <Card className="w-full max-w-2xl border-none sm:border-solid bg-transparent sm:bg-card sm:shadow-lg">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-2xl font-medium tracking-wide">
            {mode === "focus"
              ? "Stay Focused"
              : mode === "shortBreak"
              ? "Take a Short Break"
              : "Take a Long Break"}
          </CardTitle>
          <CardDescription>
             {mode === 'focus' ? `Cycle ${completedCycles + 1} of ${settings.longBreakInterval}` : 'Time to recharge!'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 sm:p-10">
          <div className="relative">
            <Progress value={progress} className="absolute w-full h-full rounded-full" />
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full flex items-center justify-center bg-card">
              <TimerDisplay seconds={secondsLeft} />
            </div>
          </div>
          <TimerControls
            isActive={isActive}
            onStart={() => setIsActive(true)}
            onPause={() => setIsActive(false)}
            onReset={resetTimer}
          />
        </CardContent>
      </Card>
      <QuoteDisplay />
    </>
  );
}
