import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlot } from "@/types/worker";

interface BookingCalendarProps {
  selected: Date;
  onSelect: (date: Date | undefined) => void;
  availability?: TimeSlot[];
}

export const BookingCalendar = ({ selected, onSelect, availability }: BookingCalendarProps) => {
  const isDateAvailable = (date: Date) => {
    if (!availability) return true;
    
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    return availability.some(slot => slot.day === dayOfWeek);
  };

  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={onSelect}
      disabled={(date) => {
        const isInPast = date < new Date();
        const isUnavailable = !isDateAvailable(date);
        return isInPast || isUnavailable;
      }}
      className="rounded-md border"
    />
  );
};
