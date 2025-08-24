"use client";

interface TimerDisplayProps {
  seconds: number;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export function TimerDisplay({ seconds }: TimerDisplayProps) {
  return (
    <div className="font-sans text-7xl md:text-8xl font-bold tracking-tighter text-foreground/90">
      {formatTime(seconds)}
    </div>
  );
}
