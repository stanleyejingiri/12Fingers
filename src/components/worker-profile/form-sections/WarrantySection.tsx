import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { WorkerProfileFormValues } from "../types";

interface WarrantySectionProps {
  form: UseFormReturn<WorkerProfileFormValues>;
}

export const WarrantySection = ({ form }: WarrantySectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Warranty Information</h3>
      <FormField
        control={form.control}
        name="offersWarranty"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Offers Warranty</FormLabel>
              <div className="text-sm text-muted-foreground">
                Do you offer warranty on your services?
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {form.watch("offersWarranty") && (
        <FormField
          control={form.control}
          name="warrantyDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Warranty Details</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your warranty terms..."
                  className="h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};
