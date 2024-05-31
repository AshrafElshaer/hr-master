"use client";
import React from "react";
import * as dateFns from "date-fns";
import { useStepper } from "@/components/stepper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { onboardingPersonal } from "../actions";

import { COUNTRIES } from "@/constants/countries";

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
import { CountrySelector } from "@/components/country-selector";
import { PhoneInputSimple } from "@/components/phone-input";
import { DateOfBirthPicker } from "@hr-toolkit/ui/date-of-birth-picker";
import { StepperFormActions } from "./onboarding";
import { personalInfoSchema } from "../validations";

export function PersonalForm() {
	const { nextStep } = useStepper();

	const form = useForm<z.infer<typeof personalInfoSchema>>({
		resolver: zodResolver(personalInfoSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			address: "",
			city: "",
			country: "US",
			zipCode: "",
			phoneNumber: "",
			dateOfBirth: new Date(dateFns.subYears(new Date(), 18)),
		},
	});

	async function onSubmit(_data: z.infer<typeof personalInfoSchema>) {
		const { serverError, validationError } = await onboardingPersonal(_data);
		if (serverError) {
			toast.error(serverError, {
				position: "top-center",
			});
			return;
		}
		if (validationError) {
			toast.error(
				validationError.firstName ||
					validationError.lastName ||
					validationError.address ||
					validationError.city ||
					validationError.state ||
					validationError.country ||
					validationError.zipCode ||
					validationError.phoneNumber ||
					validationError.dateOfBirth,
				{
					position: "top-center",
				},
			);
			return;
		}

		nextStep();
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="flex flex-col md:flex-row gap-4">
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input placeholder="John" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="lastName"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Last Name</FormLabel>
								<FormControl>
									<Input placeholder="Doe" {...field} />
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
							<FormLabel>Address</FormLabel>
							<FormControl>
								<Input placeholder="123 Main st #123" {...field} />
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
									<Input placeholder="Los Angelos" {...field} />
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
									<Input placeholder="California" {...field} />
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
									<Input placeholder="75079" inputMode="numeric" {...field} />
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
				<div className="flex flex-col md:flex-row gap-4">
					<FormField
						control={form.control}
						name="phoneNumber"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Phone Number</FormLabel>
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
					<FormField
						control={form.control}
						name="dateOfBirth"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Date of Birth</FormLabel>
								<FormControl>
									<DateOfBirthPicker
										date={field.value}
										onSelect={field.onChange}
										className="w-full"
										toDate={new Date(dateFns.subYears(new Date(), 18))}
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

export default PersonalForm;
