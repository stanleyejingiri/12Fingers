import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Clock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TimeSlot } from "@/types/worker";

interface WorkerAvailabilityProps {
  availability: TimeSlot[];
}

export const WorkerAvailability = ({ availability }: WorkerAvailabilityProps) => {
  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={new Date()}
        className="rounded-md border"
      />
      <Accordion type="single" collapsible>
        <AccordionItem value="schedule">
          <AccordionTrigger className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Weekly Schedule
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {availability.map((slot, index) => (
                <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                  <span className="font-medium">{slot.day}</span>
                  <span>{slot.startTime} - {slot.endTime}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};