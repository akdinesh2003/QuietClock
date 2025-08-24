"use client";

import type { Session } from "@/types";
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { Separator } from "./ui/separator";

interface AnalyticsSheetProps {
  sessions: Session[];
}

export function AnalyticsSheet({ sessions }: AnalyticsSheetProps) {
  const analyticsData = useMemo(() => {
    const today = new Date();
    const last7Days = eachDayOfInterval({
      start: subDays(today, 6),
      end: today,
    });

    const dailyFocus = last7Days.map(day => {
      const formattedDate = format(day, 'yyyy-MM-dd');
      const daySessions = sessions.filter(
        s => format(new Date(s.date), 'yyyy-MM-dd') === formattedDate && s.mode === 'focus'
      );
      const totalMinutes = daySessions.reduce((sum, s) => sum + s.duration, 0);
      return {
        date: format(day, 'EEE'),
        minutes: totalMinutes,
      };
    });

    const totalFocusTime = sessions
      .filter(s => s.mode === 'focus')
      .reduce((sum, s) => sum + s.duration, 0);

    const completedCycles = sessions.filter(s => s.mode === 'focus').length;

    const getStreak = () => {
        if (sessions.length === 0) return 0;
        const uniqueDays = [...new Set(sessions.map(s => format(new Date(s.date), 'yyyy-MM-dd')))].sort().reverse();
        if (uniqueDays.length === 0) return 0;

        let streak = 0;
        let currentDate = new Date();
        
        if (!uniqueDays.includes(format(currentDate, 'yyyy-MM-dd'))) {
            currentDate = subDays(currentDate, 1);
        }

        for (const day of uniqueDays) {
            if (day === format(currentDate, 'yyyy-MM-dd')) {
                streak++;
                currentDate = subDays(currentDate, 1);
            } else {
                break;
            }
        }
        return streak;
    }


    return { dailyFocus, totalFocusTime, completedCycles, streak: getStreak() };
  }, [sessions]);


  return (
    <div className="w-full h-full p-6 text-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">History</h2>

        <div className="grid grid-cols-3 gap-4 text-center">
            <div>
                <p className="text-2xl font-bold">{analyticsData.streak}</p>
                <p className="text-muted-foreground">Streak</p>
            </div>
             <div>
                <p className="text-2xl font-bold">{Math.floor(analyticsData.totalFocusTime / 60)}<span className="text-base">h</span> {analyticsData.totalFocusTime % 60}<span className="text-base">m</span></p>
                <p className="text-muted-foreground">Focused</p>
            </div>
            <div>
                <p className="text-2xl font-bold">{analyticsData.completedCycles}</p>
                <p className="text-muted-foreground">Sessions</p>
            </div>
        </div>

        <Separator className="my-6"/>

        <div>
            <h3 className="font-semibold text-foreground mb-3">Last 7 Days</h3>
            <div className="space-y-3">
                {analyticsData.dailyFocus.map((day, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <span className="text-muted-foreground">{day.date}</span>
                        <span className="font-medium">{day.minutes > 0 ? `${day.minutes} min` : 'No activity'}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}
