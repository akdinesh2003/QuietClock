"use client";

import { Play, Pause } from "lucide-react";
import { Button } from "./ui/button";

interface TimerControlsProps {
  isActive: boolean;
  onStart: () => void;
  onPause: () => void;
}

export function TimerControls({
  isActive,
  onStart,
  onPause,
}: TimerControlsProps) {
  return (
    <Button
      size="lg"
      variant="ghost"
      className="h-24 w-24 rounded-full text-2xl bg-background/30 hover:bg-background/50 backdrop-blur-sm"
      onClick={isActive ? onPause : onStart}
      aria-label={isActive ? "Pause Timer" : "Start Timer"}
    >
      {isActive ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10 ml-2" />}
    </Button>
  );
}
