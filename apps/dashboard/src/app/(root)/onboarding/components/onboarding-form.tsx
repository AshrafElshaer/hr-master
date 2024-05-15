"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import type * as RPNInput from "react-phone-number-input";
import * as z from "zod";
import { toast } from "sonner";
import * as dateFns from "date-fns";

import { COUNTRIES } from "@/constants/countries";

import { Step, Stepper, useStepper } from "@/components/stepper";
import { Button } from "@hr-toolkit/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@hr-toolkit/ui/form";
import { Input } from "@hr-toolkit/ui/input";
import { Building, User } from "lucide-react";
import { PhoneInputSimple } from "@/components/pnone-input";
import { CountrySelector } from "@/components/country-selector";
import { DatePicker } from "@hr-toolkit/ui/date-picker";
import { DateOfBirthPicker } from "@hr-toolkit/ui/date-of-birth-picker";

const steps = [
	{ label: "Personal", icon: User },
	{ label: "Organization", icon: Building },
];

export default function OnboardingForm() {
	return (
		<div className="flex w-full flex-col gap-4 max-w-lg mx-auto">
			<Stepper variant="circle-alt" initialStep={0} steps={steps} size="sm">
				{steps.map((stepProps, index) => {
					if (index === 0) {
						return (
							<Step key={stepProps.label} {...stepProps}>
								<FirstStepForm />
							</Step>
						);
					}
					return (
						<Step key={stepProps.label} {...stepProps}>
							<SecondStepForm />
						</Step>
					);
				})}
				<MyStepperFooter />
			</Stepper>
		</div>
	);
}

export const personalInfoSchema = z.object({
	firstName: z.string().min(3, {
		message: " must be at least 3 characters.",
	}),
	lastName: z.string().min(3, {
		message: " must be at least 3 characters.",
	}),
	address: z.string().min(3, {
		message: " must be at least 3 characters.",
	}),
	city: z.string().min(3, {
		message: " must be at least 3 characters.",
	}),
	state: z.string().min(3, {
		message: " must be at least 3 characters.",
	}),
	country: z.string(),
	zipCode: z.string().min(3, {
		message: " must be at least 3 characters.",
	}),
	phoneNumber: z
		.string()
		.refine(isValidPhoneNumber, { message: "Invalid phone number" }),
	dateOfBirth: z.date(),
});

function FirstStepForm() {
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

	function onSubmit(_data: z.infer<typeof personalInfoSchema>) {
		console.log(_data);
		// nextStep();

		toast("First step submitted!");
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
								<Input placeholder="123 Main st #112" {...field} />
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
									<Input placeholder="75079" {...field} />
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
										placeholder="+1 2144408050"
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
										mode="single"
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

				<StepperFormActions />
			</form>
		</Form>
	);
}

const SecondFormSchema = z.object({
	password: z.string().min(8, {
		message: "Password must be at least 8 characters.",
	}),
});

function SecondStepForm() {
	const { nextStep } = useStepper();

	const form = useForm<z.infer<typeof SecondFormSchema>>({
		resolver: zodResolver(SecondFormSchema),
		defaultValues: {
			password: "",
		},
	});

	function onSubmit(_data: z.infer<typeof SecondFormSchema>) {
		nextStep();

		toast("Second step submitted!");
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" {...field} />
							</FormControl>
							<FormDescription>This is your private password.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<StepperFormActions />
			</form>
		</Form>
	);
}

function StepperFormActions() {
	const {
		prevStep,
		resetSteps,
		isDisabledStep,
		hasCompletedAllSteps,
		isLastStep,
		isOptionalStep,
	} = useStepper();

	return (
		<div className="w-full flex justify-end gap-2">
			{hasCompletedAllSteps ? (
				<Button size="sm" onClick={resetSteps}>
					Reset
				</Button>
			) : (
				<>
					<Button
						disabled={isDisabledStep}
						onClick={prevStep}
						size="sm"
						variant="secondary"
					>
						Prev
					</Button>
					<Button size="sm">
						{isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
					</Button>
				</>
			)}
		</div>
	);
}

function MyStepperFooter() {
	const { activeStep, resetSteps, steps } = useStepper();

	if (activeStep !== steps.length) {
		return null;
	}

	return (
		<div className="flex items-center justify-end gap-2">
			<Button onClick={resetSteps}>Reset Stepper with Form</Button>
		</div>
	);
}
