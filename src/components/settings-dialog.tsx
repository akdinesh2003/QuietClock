"use client";

import { Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Settings as SettingsType } from "@/types";
import { useState } from "react";

interface SettingsDialogProps {
  settings: SettingsType;
  onSettingsChange: (newSettings: Partial<SettingsType>) => void;
}

export function SettingsDialog({ settings, onSettingsChange }: SettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
  };
  
  return (
    <Dialog onOpenChange={(open) => !open && setLocalSettings(settings)}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open Settings">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
          <DialogDescription>
            Customize your focus and break intervals.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="focus" className="text-right">
              Focus
            </Label>
            <Input
              id="focus"
              type="number"
              value={localSettings.focusDuration}
              onChange={(e) => setLocalSettings(s => ({...s, focusDuration: parseInt(e.target.value, 10)}))}
              className="col-span-3"
              min="1"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="short-break" className="text-right">
              Short Break
            </Label>
            <Input
              id="short-break"
              type="number"
              value={localSettings.shortBreakDuration}
              onChange={(e) => setLocalSettings(s => ({...s, shortBreakDuration: parseInt(e.target.value, 10)}))}
              className="col-span-3"
              min="1"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="long-break" className="text-right">
              Long Break
            </Label>
            <Input
              id="long-break"
              type="number"
              value={localSettings.longBreakDuration}
              onChange={(e) => setLocalSettings(s => ({...s, longBreakDuration: parseInt(e.target.value, 10)}))}
              className="col-span-3"
              min="1"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="long-break-interval" className="text-right">
              Cycles
            </Label>
            <Input
              id="long-break-interval"
              type="number"
              value={localSettings.longBreakInterval}
              onChange={(e) => setLocalSettings(s => ({...s, longBreakInterval: parseInt(e.target.value, 10)}))}
              className="col-span-3"
              min="1"
              aria-describedby="cycles-description"
            />
            <p id="cycles-description" className="col-span-4 text-sm text-muted-foreground text-right -mt-2">Cycles until long break.</p>
          </div>
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button type="submit" onClick={handleSave}>Save changes</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
