"use client";

import { Volume1, Volume2, VolumeX, Leaf, CloudRain, Waves } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import type { Settings, AmbientSound } from "@/types";
import { cn } from "@/lib/utils";

interface AmbientSoundPlayerProps {
    settings: Settings;
    onSettingsChange: (newSettings: Partial<Settings>) => void;
    onSoundChange: (sound: AmbientSound) => void;
}

export function AmbientSoundPlayer({ settings, onSettingsChange, onSoundChange }: AmbientSoundPlayerProps) {
  const { ambientSound, soundVolume } = settings;

  const handleVolumeChange = (value: number[]) => {
    onSettingsChange({ soundVolume: value[0] });
  };
  
  const toggleMute = () => {
    onSettingsChange({ soundVolume: soundVolume > 0 ? 0 : 0.5 });
  }

  const getVolumeIcon = () => {
    if (soundVolume === 0) return <VolumeX className="h-5 w-5" />;
    if (soundVolume < 0.5) return <Volume1 className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
  };

  return (
    <div className="mt-8 w-full max-w-sm p-4 rounded-lg bg-card/50">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={toggleMute} aria-label="Toggle Mute">
                    {getVolumeIcon()}
                </Button>
                <Slider
                    value={[soundVolume]}
                    onValueChange={handleVolumeChange}
                    max={1}
                    step={0.05}
                    className="w-32"
                    aria-label="Volume"
                />
            </div>
            <div className="flex items-center gap-2">
                 <Button 
                    variant={ambientSound === 'rain' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    onClick={() => onSoundChange(ambientSound === 'rain' ? 'none' : 'rain')}
                    aria-label="Rain Sound"
                    className={cn(ambientSound === 'rain' && "ring-2 ring-ring")}
                >
                    <CloudRain className="h-5 w-5" />
                 </Button>
                 <Button 
                    variant={ambientSound === 'forest' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    onClick={() => onSoundChange(ambientSound === 'forest' ? 'none' : 'forest')}
                    aria-label="Forest Sound"
                    className={cn(ambientSound === 'forest' && "ring-2 ring-ring")}
                >
                    <Leaf className="h-5 w-5" />
                 </Button>
                 <Button 
                    variant={ambientSound === 'whitenoise' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    onClick={() => onSoundChange(ambientSound === 'whitenoise' ? 'none' : 'whitenoise')}
                    aria-label="White Noise"
                    className={cn(ambientSound === 'whitenoise' && "ring-2 ring-ring")}
                >
                    <Waves className="h-5 w-5" />
                 </Button>
            </div>
        </div>
    </div>
  );
}
