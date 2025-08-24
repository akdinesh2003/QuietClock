"use client";

import { Play, Pause, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

interface TimerControlsProps {
  isActive: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function TimerControls({
  isActive,
  onStart,
  onPause,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="flex items-center gap-4 mt-8">
      <Button
        variant="ghost"
        size="icon"
        className="h-14 w-14"
        onClick={onReset}
        aria-label="Reset Timer"
      >
        <RefreshCw className="h-6 w-6" />
      </Button>
      <Button
        size="lg"
        className="h-20 w-20 rounded-full text-2xl"
        onClick={isActive ? onPause : onStart}
        aria-label={isActive ? "Pause Timer" : "Start Timer"}
      >
        {isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
      </Button>
      <div className="w-14" />
    </div>
  );
}
