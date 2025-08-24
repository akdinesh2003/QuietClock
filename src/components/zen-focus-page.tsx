"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
import type { Settings, Session, TimerMode, AmbientSound } from "@/types";
import { AmbientSoundPlayer } from "./ambient-sound-player";

const DEFAULT_SETTINGS: Settings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  selectedTheme: "default",
  ambientSound: "none",
  soundVolume: 0.5,
};

export function ZenFocusPage() {
  const [settings, setSettings] = useLocalStorage<Settings>("zenfocus-settings", DEFAULT_SETTINGS);
  const [sessions, setSessions] = useLocalStorage<Session[]>("zenfocus-sessions", []);
  
  const [mode, setMode] = useState<TimerMode>("focus");
  const [isActive, setIsActive] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);
  const notificationAudioRef = useRef<HTMLAudioElement | null>(null);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

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
    if (typeof window !== 'undefined') {
        notificationAudioRef.current = new Audio('/notification.mp3');
    }
  }, []);

  useEffect(() => {
    setSecondsLeft(durationInMinutes * 60);
  }, [durationInMinutes, settings]);
  
  useEffect(() => {
    if (secondsLeft === 0) {
      handleSessionEnd();
      notificationAudioRef.current?.play().catch(e => console.error("Error playing sound:", e));
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

  useEffect(() => {
    if (ambientAudioRef.current) {
        if (isActive && settings.ambientSound !== 'none') {
            ambientAudioRef.current.play().catch(e => console.error("Error playing ambient sound:", e));
        } else {
            ambientAudioRef.current.pause();
        }
    }
  }, [isActive, settings.ambientSound]);

  useEffect(() => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = settings.soundVolume;
    }
  }, [settings.soundVolume]);

  const handleSoundChange = (sound: AmbientSound) => {
    handleSettingsChange({ ambientSound: sound });
    if (ambientAudioRef.current) {
        if (sound === 'none') {
            ambientAudioRef.current.pause();
        } else {
            const newAudio = new Audio(`/${sound}.mp3`);
            newAudio.loop = true;
            newAudio.volume = settings.soundVolume;
            ambientAudioRef.current = newAudio;
            if(isActive) {
                ambientAudioRef.current.play().catch(e => console.error("Error playing ambient sound:", e));
            }
        }
    } else if (sound !== 'none') {
        const newAudio = new Audio(`/${sound}.mp3`);
        newAudio.loop = true;
        newAudio.volume = settings.soundVolume;
        ambientAudioRef.current = newAudio;
        if(isActive) {
            ambientAudioRef.current.play().catch(e => console.error("Error playing ambient sound:", e));
        }
    }
  };
  
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
    document.title = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")} - ${mode.charAt(0).toUpperCase() + mode.slice(1)} | QuietClock`;
  }, [settings.selectedTheme, secondsLeft, mode]);

  return (
    <>
      <Header
        settings={settings}
        onSettingsChange={handleSettingsChange}
        sessions={sessions}
      />
      <div className="flex-grow flex flex-col items-center justify-center">
        <Card className="w-full max-w-2xl border-none bg-transparent">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-2xl font-medium tracking-wide text-foreground/90">
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
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full flex items-center justify-center bg-background/80 backdrop-blur-sm">
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
      </div>
       <div className="w-full max-w-lg flex flex-col items-center pb-8 px-4">
        <QuoteDisplay />
        <AmbientSoundPlayer 
          settings={settings} 
          onSettingsChange={handleSettingsChange}
          onSoundChange={handleSoundChange}
        />
      </div>
    </>
  );
}
