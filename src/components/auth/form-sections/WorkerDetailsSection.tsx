// src/components/auth/form-sections/WorkerDetailsSection.tsx
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "../types";
import { CountrySelector } from "@/components/location/CountrySelector";
import { useQuery } from '@tanstack/react-query';
import { useLocationData } from "@/hooks/useLocationData";

interface WorkerDetailsSectionProps {
  form: UseFormReturn<RegisterFormValues>;
}

export function WorkerDetailsSection({ form }: WorkerDetailsSectionProps) {
  // 🔴 Moved useQuery INSIDE the component
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['workerCategories'],
    queryFn: async () => {
      const res = await fetch('https://one2fingers-backend.onrender.com/api/workers/categories');
      const data = await res.json();
      return data.categories;
    },
  });
  
  const { countries, loading } = useLocationData();

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your full name"
                {...field}
                required
              />
            </FormControl>
            <FormMessage className="text-sm text-red-500" />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
                {categoriesLoading ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : (
                  categories?.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage className="text-sm text-red-500" />
          </FormItem>
        )}
      />

      <FormItem>
        <FormLabel>Country</FormLabel>
        <CountrySelector className="w-full" />
      </FormItem>
    </>
  );
}
