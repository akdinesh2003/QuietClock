"use client";

import { SettingsDialog } from "./settings-dialog";
import { AnalyticsSheet } from "./analytics-sheet";
import { ThemeSelector } from "./theme-selector";
import { FullscreenButton } from "./fullscreen-button";
import type { Settings, Session } from "@/types";

interface HeaderProps {
  settings: Settings;
  onSettingsChange: (newSettings: Partial<Settings>) => void;
  sessions: Session[];
}

export function Header({
  settings,
  onSettingsChange,
  sessions,
}: HeaderProps) {
  return (
    <header className="absolute top-4 right-4 flex items-center gap-2">
      <ThemeSelector 
        selectedTheme={settings.selectedTheme} 
        onThemeChange={(theme) => onSettingsChange({ selectedTheme: theme })} 
      />
      <AnalyticsSheet sessions={sessions} />
      <SettingsDialog settings={settings} onSettingsChange={onSettingsChange} />
      <FullscreenButton />
    </header>
  );
}
