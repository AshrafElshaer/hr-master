"use client";
import { useStepper } from "@/components/stepper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type * as RPNInput from "react-phone-number-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@hr-toolkit/ui/form";
import { Input } from "@hr-toolkit/ui/input";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { StepperFormActions } from "./onboarding";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@hr-toolkit/ui/select";
import { ScrollArea } from "@hr-toolkit/ui/scroll-area";
import { COUNTRIES } from "@/constants/countries";
import { CountrySelector } from "@/components/country-selector";
import { PhoneInputSimple } from "@/components/phone-input";
import { onboardingOrganization } from "../actions";
import { organizationFormSchema } from "../validations";

const organizationTypes = [
  "For-Profit Organization",
  "Non-Profit Organization",
  "Government Agency",
  "Public Corporation",
  "Sole Proprietorship",
];

export function OrganizationForm() {
  const { nextStep } = useStepper();
  const router = useRouter();

  const form = useForm<z.infer<typeof organizationFormSchema>>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      organizationName: "",
      organizationType: "",
      address: "",
      city: "",
      state: "",
      country: "US",
      zipCode: "",
      employeesCount: 1,
      contactName: "",
      contactEmail: "",
      contactNumber: "",
    },
  });

  async function onSubmit(_data: z.infer<typeof organizationFormSchema>) {
    const { data, serverError, validationError } =
      await onboardingOrganization(_data);

    if (serverError) {
      toast.error(serverError, {
        position: "top-center",
      });
      return;
    }
    if (validationError) {
      toast.error(
        validationError.address ||
          validationError.city ||
          validationError.contactEmail ||
          validationError.contactName ||
          validationError.contactNumber ||
          validationError.country ||
          validationError.employeesCount ||
          validationError.organizationName ||
          validationError.organizationType ||
          validationError.state ||
          validationError.zipCode,
        {
          position: "top-center",
        },
      );
      return;
    }
    if (data?.success) {
      toast.success("Organization created successfully", {
        position: "top-center",
      });
    }
    setTimeout(() => {
      router.push("/");
    }, 2000);
    nextStep();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="organizationName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Organization Name</FormLabel>
                <FormControl>
                  <Input placeholder="Space X" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="organizationType"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Organization Type</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder="Select organization type"
                        className="mx-auto"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <ScrollArea className="h-[195px] w-full">
                        <SelectGroup>
                          <SelectLabel>Type</SelectLabel>
                          {organizationTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Mailing Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St " {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="McKinney" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="Texas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input placeholder="75676" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <CountrySelector
                    value={field.value as RPNInput.Country}
                    onChange={(val) => field.onChange(val as RPNInput.Country)}
                    options={COUNTRIES}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row  gap-4">
          <FormField
            control={form.control}
            name="employeesCount"
            render={({ field: { onChange, ...props } }) => (
              <FormItem className="w-full">
                <FormLabel>How many employees ?</FormLabel>
                <FormControl>
                  <Input
                    placeholder="15"
                    type="number"
                    min={1}
                    onChange={(e) => {
                      onChange(Number(e.target.value));
                    }}
                    {...props}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Contact Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <PhoneInputSimple
                    value={field.value as RPNInput.Value}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultCountry={form.watch("country") as RPNInput.Country}
                    placeholder="(214) 876-7876"
                    disabled={!form.getValues().country}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <StepperFormActions isSubmitting={form.formState.isSubmitting} />
      </form>
    </Form>
  );
}
