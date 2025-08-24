"use client";

import { Volume1, Volume2, VolumeX, Leaf, CloudRain, Waves, SlidersHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import type { Settings, AmbientSound } from "@/types";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

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
    <div className="flex items-center gap-2">
        <Popover>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon">
                                {getVolumeIcon()}
                            </Button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Volume</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <PopoverContent className="w-40">
                <Slider
                    value={[soundVolume]}
                    onValueChange={handleVolumeChange}
                    max={1}
                    step={0.05}
                    className="w-full"
                    aria-label="Volume"
                />
            </PopoverContent>
        </Popover>

        <Popover>
             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                             <Button variant="ghost" size="icon" aria-label="Ambient Sounds">
                                <SlidersHorizontal className="h-5 w-5"/>
                            </Button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Ambient Sounds</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <PopoverContent className="w-auto p-2">
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
            </PopoverContent>
        </Popover>
    </div>
  );
}
