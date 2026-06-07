//src/components/auth/RegisterForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UserTypeSection } from "./form-sections/UserTypeSection";
import { WorkerDetailsSection } from "./form-sections/WorkerDetailsSection";
import { CredentialsSection } from "./form-sections/CredentialsSection";
import { registerSchema, RegisterFormValues } from "./types";
import { useRegistration } from "@/hooks/useRegistration";
import { VerificationMessage } from "./form-sections/VerificationMessage";

interface RegisterFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
  defaultUserType?: "user" | "worker";
}

export function RegisterForm({ 
  onSuccess, 
  onError, 
  defaultUserType = "user" 
}: RegisterFormProps) {
  const { isLoading, verificationSent, handleRegister } = useRegistration(onSuccess, onError);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      userType: defaultUserType,
    },
    mode: "onChange", // Validate on every change
  });

  const userType = form.watch("userType");

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      // Explicitly trigger validation
      const isValid = await form.trigger();
      if (!isValid) {
        throw new Error("Please fix the validation errors");
      }
      
      await handleRegister(values);
    } catch (err) {
      onError(err.message || "Registration failed");
    }
  };

  if (verificationSent) {
    return <VerificationMessage onClose={onSuccess} />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <UserTypeSection form={form} />
        {userType === "worker" && <WorkerDetailsSection form={form} />}
        <CredentialsSection form={form} isLoading={isLoading} />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}

/*
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UserTypeSection } from "./form-sections/UserTypeSection";
import { WorkerDetailsSection } from "./form-sections/WorkerDetailsSection";
import { CredentialsSection } from "./form-sections/CredentialsSection";
import { registerSchema, RegisterFormValues } from "./types";
import { useRegistration } from "@/hooks/useRegistration";
import { VerificationMessage } from "./form-sections/VerificationMessage";

interface RegisterFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
  defaultUserType?: "user" | "worker";
}

export function RegisterForm({ 
  onSuccess, 
  onError, 
  defaultUserType = "user" 
}: RegisterFormProps) {
  const { isLoading, verificationSent, handleRegister } = useRegistration(onSuccess, onError);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      userType: defaultUserType,
    },
  });

  const userType = form.watch("userType");

  if (verificationSent) {
    return <VerificationMessage onClose={onSuccess} />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
        <UserTypeSection form={form} />
        {userType === "worker" && <WorkerDetailsSection form={form} />}
        <CredentialsSection form={form} isLoading={isLoading} />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}
*/
