//src/components/auth/form-sections/CredentialsSection.tsx
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "../types";

interface CredentialsSectionProps {
  form: UseFormReturn<RegisterFormValues>;
  isLoading: boolean;
}

export function CredentialsSection({ form, isLoading }: CredentialsSectionProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="your@email.com"
                {...field}
                disabled={isLoading}
                onChange={(e) => {
                  field.onChange(e);
                  form.trigger("email"); // Validate on change
                }}
              />
            </FormControl>
            <FormMessage className="text-xs text-red-500" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Password</FormLabel>
              <span className="text-xs text-muted-foreground">
                {field.value?.length || 0}/50
              </span>
            </div>
            <FormControl>
              <Input
                type="password"
                placeholder="Create a strong password"
                {...field}
                disabled={isLoading}
                onChange={(e) => {
                  field.onChange(e);
                  form.trigger("password"); // Validate on change
                }}
              />
            </FormControl>
            <PasswordStrengthIndicator password={field.value} />
            <FormMessage className="text-xs text-red-500" />
          </FormItem>
        )}
      />
    </div>
  );
}

function PasswordStrengthIndicator({ password }: { password?: string }) {
  if (!password) return null;

  const requirements = [
    { id: 1, label: "6+ characters", valid: password.length >= 6 },
    { id: 2, label: "1 lowercase", valid: /[a-z]/.test(password) },
    { id: 3, label: "1 uppercase", valid: /[A-Z]/.test(password) },
    { id: 4, label: "1 number", valid: /\d/.test(password) },
  ];

  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      {requirements.map((req) => (
        <div
          key={req.id}
          className={`flex items-center space-x-1 text-xs ${
            req.valid ? "text-green-600" : "text-muted-foreground"
          }`}
        >
          <span className={req.valid ? "text-green-500" : ""}>
            {req.valid ? "✓" : "•"}
          </span>
          <span>{req.label}</span>
        </div>
      ))}
    </div>
  );
}


/*
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "../types";

interface CredentialsSectionProps {
  form: UseFormReturn<RegisterFormValues>;
  isLoading: boolean;
}

export function CredentialsSection({ form, isLoading }: CredentialsSectionProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="Enter your email address"
                {...field}
                disabled={isLoading}
              />
            </FormControl>
            <FormMessage className="text-sm text-red-500" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="Create a strong password"
                {...field}
                disabled={isLoading}
              />
            </FormControl>
            <FormMessage className="text-sm text-red-500" />
          </FormItem>
        )}
      />
    </>
  );
}
*/