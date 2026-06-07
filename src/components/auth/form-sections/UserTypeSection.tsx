import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "../types";

interface UserTypeSectionProps {
  form: UseFormReturn<RegisterFormValues>;
}

export function UserTypeSection({ form }: UserTypeSectionProps) {
  return (
    <FormField
      control={form.control}
      name="userType"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <RadioGroup
              defaultValue={field.value}
              onValueChange={field.onChange}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="user" id="user" />
                <Label htmlFor="user">Regular User</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="worker" id="worker" />
                <Label htmlFor="worker">Service Provider</Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage className="text-sm text-red-500" />
        </FormItem>
      )}
    />
  );
}