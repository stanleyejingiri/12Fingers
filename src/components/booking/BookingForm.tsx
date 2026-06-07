//src/components/booking/BookingForm.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // New import
import { ServicePackage } from "@/types/worker";
import { BookingFormData } from "@/types/booking";
import { DateTimeSection } from "./form-sections/DateTimeSection";
import { DepositAlert } from "./form-sections/DepositAlert";
import { useToast } from "@/hooks/use-toast";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"; // New imports

const bookingSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
    invalid_type_error: "Please select a valid date",
  }),
  startTime: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time (HH:MM)")
    .refine((time) => {
      const [hours] = time.split(':').map(Number);
      return hours >= 8 && hours <= 20;
    }, "Booking hours must be between 8:00 and 20:00"),
  endTime: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time (HH:MM)")
    .refine((time) => {
      const [hours] = time.split(':').map(Number);
      return hours >= 8 && hours <= 20;
    }, "Booking hours must be between 8:00 and 20:00"),
  serviceDetails: z.string() // New field
    .min(10, "Please describe your request (minimum 10 characters)")
    .max(500, "Description too long (maximum 500 characters)")
    .optional(),
}).refine((data) => {
  const start = new Date(`1970-01-01T${data.startTime}`);
  const end = new Date(`1970-01-01T${data.endTime}`);
  return end > start;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

export const BookingForm = ({ onSubmit, isSubmitting, selectedPackage }: BookingFormProps) => {
  const { toast } = useToast();
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      date: new Date(),
      startTime: "09:00",
      endTime: "10:00",
      serviceDetails: "", // New default value
    },
  });

  const handleSubmit = async (data: BookingFormData) => {
    try {
      await onSubmit({
        ...data,
        // Include package ID if available
        packageId: selectedPackage?.id,
        isCustomOffer: !selectedPackage, // Flag for custom requests
      });
      toast({
        title: selectedPackage ? "Booking Request Sent" : "Custom Offer Submitted",
        description: selectedPackage 
          ? "Your booking request has been sent to the worker." 
          : "Your custom offer has been submitted for review.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {selectedPackage && <DepositAlert selectedPackage={selectedPackage} />}
        
        <DateTimeSection form={form} />

        {/* New Service Details Field */}
        <FormField
          control={form.control}
          name="serviceDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {selectedPackage ? "Special Instructions" : "Service Details"}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    selectedPackage
                      ? "Any modifications or special requests?"
                      : "Please describe exactly what service you need..."
                  }
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 flex justify-end space-x-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting 
              ? "Processing..." 
              : selectedPackage 
                ? "Request Booking" 
                : "Send Custom Request"}
          </Button>
        </div>
      </form>
    </Form>
  );
};







/*
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ServicePackage } from "@/types/worker";
import { BookingFormData } from "@/types/booking";
import { DateTimeSection } from "./form-sections/DateTimeSection";
import { DepositAlert } from "./form-sections/DepositAlert";
import { useToast } from "@/hooks/use-toast";

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
  isSubmitting: boolean;
  selectedPackage?: ServicePackage;
}

const bookingSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
    invalid_type_error: "Please select a valid date",
  }),
  startTime: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time (HH:MM)")
    .refine((time) => {
      const [hours] = time.split(':').map(Number);
      return hours >= 8 && hours <= 20;
    }, "Booking hours must be between 8:00 and 20:00"),
  endTime: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time (HH:MM)")
    .refine((time) => {
      const [hours] = time.split(':').map(Number);
      return hours >= 8 && hours <= 20;
    }, "Booking hours must be between 8:00 and 20:00"),
}).refine((data) => {
  const start = new Date(`1970-01-01T${data.startTime}`);
  const end = new Date(`1970-01-01T${data.endTime}`);
  return end > start;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

export const BookingForm = ({ onSubmit, isSubmitting, selectedPackage }: BookingFormProps) => {
  const { toast } = useToast();
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      date: new Date(),
      startTime: "09:00",
      endTime: "10:00",
    },
  });

  const handleSubmit = async (data: BookingFormData) => {
    try {
      await onSubmit(data);
      toast({
        title: "Booking Submitted",
        description: "Your booking request has been sent to the worker.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit booking. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {selectedPackage && <DepositAlert selectedPackage={selectedPackage} />}
        <DateTimeSection form={form} />
        <div className="pt-4 flex justify-end space-x-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : `Pay ${selectedPackage ? 'Deposit' : 'Now'}`}
          </Button>
        </div>
      </form>
    </Form>
  );
};
*/
