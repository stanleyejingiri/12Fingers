import React from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { DayOfWeek } from '../types/config';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';

const AdminConfig = () => {
  const { config, updateConfig } = useConfig();
  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>App Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Enabled Days</Label>
          <ToggleGroup
            type="multiple"
            value={config.enabledDays}
            onValueChange={(value) => updateConfig({ enabledDays: value as DayOfWeek[] })}
            className="flex flex-wrap gap-2"
          >
            {days.map((day) => (
              <ToggleGroupItem
                key={day}
                value={day}
                aria-label={day}
                className="data-[state=on]:bg-primary"
              >
                {day.slice(0, 3)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="space-y-2">
          <Label>Time Range</Label>
          <div className="flex gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={config.timeRanges[0].start}
                onChange={(e) => updateConfig({
                  timeRanges: [{ ...config.timeRanges[0], start: e.target.value }]
                })}
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={config.timeRanges[0].end}
                onChange={(e) => updateConfig({
                  timeRanges: [{ ...config.timeRanges[0], end: e.target.value }]
                })}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminConfig;