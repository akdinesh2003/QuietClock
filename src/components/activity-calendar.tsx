
"use client";

import { useMemo } from 'react';
import { ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis, Cell, Bar, BarChart } from 'recharts';
import { format, subDays, startOfWeek, addDays, getDay, eachDayOfInterval, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import type { Session } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ActivityCalendarProps {
  sessions: Session[];
}

const ActivityCalendar = ({ sessions }: ActivityCalendarProps) => {
  const data = useMemo(() => {
    const today = new Date();
    const past90Days = eachDayOfInterval({
      start: subDays(today, 89),
      end: today,
    });

    const sessionData = sessions.reduce((acc: { [key: string]: number }, session) => {
      const date = format(new Date(session.date), 'yyyy-MM-dd');
      if(session.mode === 'focus') {
        acc[date] = (acc[date] || 0) + session.duration;
      }
      return acc;
    }, {});
    
    return past90Days.map(day => ({
      date: format(day, 'yyyy-MM-dd'),
      day: format(day, 'EEE'),
      week: format(startOfWeek(day), 'yyyy-MM-dd'),
      value: sessionData[format(day, 'yyyy-MM-dd')] || 0,
    }));
  }, [sessions]);

  const weeks = [...new Set(data.map(item => item.week))].sort();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarData = weeks.map(week => {
    const weekData = { name: format(new Date(week), 'MMM d') };
    weekDays.forEach((day, dayIndex) => {
      const entry = data.find(d => d.week === week && getDay(new Date(d.date)) === dayIndex);
      // @ts-ignore
      weekData[day] = entry ? entry.value : 0;
    });
    return weekData;
  });

  const getColor = (value: number) => {
    if (value === 0) return 'hsl(var(--muted))';
    if (value < 30) return 'hsl(var(--primary) / 0.2)';
    if (value < 60) return 'hsl(var(--primary) / 0.4)';
    if (value < 90) return 'hsl(var(--primary) / 0.6)';
    if (value < 120) return 'hsl(var(--primary) / 0.8)';
    return 'hsl(var(--primary))';
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
          const data = payload[0].payload;
          const day = payload[0].dataKey;
          const date = data.name + `, ${day}`;
          return (
          <div className="bg-popover text-popover-foreground text-xs rounded-md p-2 shadow-lg border border-border">
              <p className="font-bold">{`${data[day]} minutes`}</p>
              <p className="text-muted-foreground">{date}</p>
          </div>
          );
      }
      return null;
  };

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-base font-semibold text-foreground">Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ResponsiveContainer width="100%" height={150}>
            <BarChart data={calendarData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border) / 0.5)"/>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="Sun" type="category" tickFormatter={() => ''} hide/>
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent) / 0.3)' }}/>
                {weekDays.map(day => (
                    <Bar key={day} dataKey={day} stackId="a" fill="#8884d8">
                    {calendarData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getColor(entry[day as keyof typeof entry])} radius={2}/>
                    ))}
                    </Bar>
                ))}
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ActivityCalendar;
