"use client";

import { BarChart, CalendarIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { Session } from "@/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, BarChart as RechartsBarChart } from "recharts";
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { format, subDays, eachDayOfInterval } from 'date-fns';

interface AnalyticsSheetProps {
  sessions: Session[];
}

const chartConfig = {
  minutes: {
    label: "Minutes",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

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

    return { dailyFocus, totalFocusTime, completedCycles };
  }, [sessions]);


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="View Analytics">
          <BarChart className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Focus Analytics</SheetTitle>
          <SheetDescription>
            Review your focus trends and session history.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="grid grid-cols-2 gap-4">
              <Card>
                  <CardHeader>
                      <CardTitle>{analyticsData.totalFocusTime}</CardTitle>
                      <CardDescription>Total Minutes Focused</CardDescription>
                  </CardHeader>
              </Card>
              <Card>
                  <CardHeader>
                      <CardTitle>{analyticsData.completedCycles}</CardTitle>
                      <CardDescription>Completed Focus Cycles</CardDescription>
                  </CardHeader>
              </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Weekly Focus Activity</CardTitle>
              <CardDescription>Focus minutes over the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <RechartsBarChart accessibilityLayer data={analyticsData.dailyFocus}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Bar dataKey="minutes" fill="var(--color-minutes)" radius={4} />
                </RechartsBarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
