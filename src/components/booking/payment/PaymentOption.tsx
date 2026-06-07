//src/components/booking/payment/PaymentOption.tsx
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PaymentOptionProps {
  id: string;
  value: string;
  label: string;
  tooltipContent: string;
  icon: React.ReactNode;
}

export const PaymentOption = ({ id, value, label, tooltipContent, icon }: PaymentOptionProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <RadioGroupItem
            value={value}
            id={id}
            className="peer sr-only"
          />
          <Label
            htmlFor={id}
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            {icon}
            {label}
          </Label>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="mt-2">
        <p>{tooltipContent}</p>
      </TooltipContent>
    </Tooltip>
  );
};