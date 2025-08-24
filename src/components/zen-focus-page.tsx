"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { TimerDisplay } from "./timer-display";
import { TimerControls } from "./timer-controls";
import { QuoteDisplay } from "./quote-display";
import type { Settings, Session, TimerMode, AmbientSound } from "@/types";
import { AmbientSoundPlayer } from "./ambient-sound-player";
import { SettingsDialog } from "./settings-dialog";
import { ThemeSelector } from "./theme-selector";
import { FullscreenButton } from "./fullscreen-button";
import { AnalyticsSheet } from "./analytics-sheet";
import { RefreshCw, History } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

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
  const [showHistory, setShowHistory] = useState(false);
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
  const circleCircumference = 2 * Math.PI * 140; 

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
    setIsActive(false);
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
    const audio = ambientAudioRef.current;
    if (audio) {
      if (isActive && settings.ambientSound !== 'none') {
        // Check if audio is paused before playing to avoid interruption errors
        if (audio.paused) {
          audio.play().catch(error => {
              // AbortError is expected if another action interrupts playback, so we can ignore it.
              if (error.name !== 'AbortError') {
                  console.error("Error playing ambient sound:", error);
              }
          });
        }
      } else {
        audio.pause();
      }
    }
  }, [isActive, settings.ambientSound]);


  useEffect(() => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = settings.soundVolume;
    }
  }, [settings.soundVolume]);

  const handleSoundChange = (sound: AmbientSound) => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
      ambientAudioRef.current.src = "";
    }
    
    handleSettingsChange({ ambientSound: sound });

    if (sound !== 'none') {
      const newAudio = new Audio(`/${sound}.mp3`);
      newAudio.loop = true;
      newAudio.volume = settings.soundVolume;
      ambientAudioRef.current = newAudio;
      if (isActive) {
        newAudio.play().catch(e => console.error("Error playing ambient sound:", e));
      }
    } else {
       ambientAudioRef.current = null;
    }
  };
  
  const resetTimer = useCallback(() => {
    setIsActive(false);
    setSecondsLeft(durationInMinutes * 60);
  }, [durationInMinutes]);

  const handleSettingsChange = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
     if (!isActive) {
        if (mode === 'focus' && newSettings.focusDuration && newSettings.focusDuration !== settings.focusDuration) {
            setSecondsLeft(newSettings.focusDuration * 60);
        } else if (mode === 'shortBreak' && newSettings.shortBreakDuration && newSettings.shortBreakDuration !== settings.shortBreakDuration) {
            setSecondsLeft(newSettings.shortBreakDuration * 60);
        } else if (mode === 'longBreak' && newSettings.longBreakDuration && newSettings.longBreakDuration !== settings.longBreakDuration) {
            setSecondsLeft(newSettings.longBreakDuration * 60);
        }
    }
  };
  
  useEffect(() => {
    document.body.setAttribute('data-theme', settings.selectedTheme);
    document.title = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")} - ${mode.charAt(0).toUpperCase() + mode.slice(1)} | QuietClock`;
  }, [settings.selectedTheme, secondsLeft, mode]);

  return (
    <div className="flex h-screen w-full">
      <main className="flex-1 flex flex-col items-center justify-center p-4 transition-all duration-300 ease-in-out" style={{ marginRight: showHistory ? '320px' : '0' }}>
          <div className="text-center mb-6">
              <h1 className="text-2xl font-medium tracking-wide text-foreground/90">
                {mode === "focus"
                  ? "Stay Focused"
                  : mode === "shortBreak"
                  ? "Take a Short Break"
                  : "Take a Long Break"}
              </h1>
              <p className="text-muted-foreground">
                 {mode === 'focus' ? `Cycle ${completedCycles + 1} of ${settings.longBreakInterval}` : 'Time to recharge!'}
              </p>
          </div>

          <div className="relative w-80 h-80 sm:w-96 sm:h-96">
            <svg className="absolute inset-0" viewBox="0 0 320 320">
                <circle
                    className="text-primary/10"
                    stroke="currentColor"
                    strokeWidth="15"
                    fill="transparent"
                    r="140"
                    cx="160"
                    cy="160"
                />
                <circle
                    className="text-primary transition-all duration-1000 ease-linear"
                    stroke="currentColor"
                    strokeWidth="15"
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={circleCircumference - (progress / 100) * circleCircumference}
                    strokeLinecap="round"
                    fill="transparent"
                    r="140"
                    cx="160"
                    cy="160"
                    transform="rotate(-90 160 160)"
                />
            </svg>
            <div className="w-full h-full rounded-full flex flex-col items-center justify-center bg-background/30 backdrop-blur-sm">
                <TimerDisplay seconds={secondsLeft} />
                 <div className="absolute" style={{ bottom: 'calc(50% - 9rem)' }}>
                     <TimerControls
                        isActive={isActive}
                        onStart={() => setIsActive(true)}
                        onPause={() => setIsActive(false)}
                    />
                </div>
            </div>
          </div>
        
          <div className="mt-8 w-full max-w-md flex flex-col items-center">
            <QuoteDisplay />
          </div>

          <div className="absolute bottom-6 w-full max-w-sm">
              <div className="w-full mx-auto p-2.5 rounded-full bg-card/20 backdrop-blur-sm border border-border/20 flex items-center justify-between">
                <AmbientSoundPlayer 
                  settings={settings} 
                  onSettingsChange={handleSettingsChange}
                  onSoundChange={handleSoundChange}
                />
                 <div className="flex items-center gap-1">
                     <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <Button variant="ghost" size="icon" onClick={resetTimer}>
                              <RefreshCw className="h-5 w-5" />
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reset Timer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <ThemeSelector selectedTheme={settings.selectedTheme} onThemeChange={(theme) => handleSettingsChange({ selectedTheme: theme })}/>
                    <SettingsDialog settings={settings} onSettingsChange={handleSettingsChange} />
                    <FullscreenButton />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <Button variant="ghost" size="icon" onClick={() => setShowHistory(s => !s)}>
                              <History className="h-5 w-5" />
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Toggle History</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                 </div>
              </div>
          </div>
      </main>

      <aside className={`fixed top-0 right-0 h-full w-80 bg-card/20 backdrop-blur-lg border-l border-border/20 shadow-2xl transition-transform duration-300 ease-in-out ${showHistory ? 'translate-x-0' : 'translate-x-full'}`}>
        <AnalyticsSheet sessions={sessions} />
      </aside>
    </div>
  );
}
