"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

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
import { Building, Loader, User } from "lucide-react";

import PersonalForm from "./personal-form";
import { OrganizationForm } from "./organization-form";
import { useRouter } from "next/navigation";

const steps = [
	{ label: "Personal", icon: User },
	{ label: "Organization", icon: Building },
];

export default function OnboardingForm() {
	return (
		<div className="flex w-full flex-col gap-4 max-w-xl mx-auto">
			<Stepper variant="circle-alt" initialStep={0} steps={steps} size="sm">
				{steps.map((stepProps, index) => {
					if (index === 0) {
						return (
							<Step key={stepProps.label} {...stepProps}>
								<PersonalForm />
							</Step>
						);
					}
					return (
						<Step key={stepProps.label} {...stepProps}>
							<OrganizationForm />
						</Step>
					);
				})}
			</Stepper>
		</div>
	);
}

export function StepperFormActions({
	isSubmitting,
}: {
	isSubmitting?: boolean;
}) {
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
						disabled={isDisabledStep || isSubmitting}
						onClick={prevStep}
						size="sm"
						variant="secondary"
					>
						Prev
					</Button>
					<Button size="sm" disabled={isSubmitting}>
						{isSubmitting ? (
							<Loader className="mr-2 h-4 w-4 animate-spin" />
						) : null}
						{isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
					</Button>
				</>
			)}
		</div>
	);
}
