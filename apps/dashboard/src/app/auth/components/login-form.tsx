"use client";

import { createClient } from "@hr-toolkit/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import type { EmailOtpConfirmation, ReactSetState } from "@/types";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@hr-toolkit/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@hr-toolkit/ui/form";
import { Input } from "@hr-toolkit/ui/input";
import { Button } from "@hr-toolkit/ui/button";

import LogoSVG from "@/components/logo-svg";
import { Mail } from "lucide-react";

interface LoginFormProps {
	setConfirmation: ReactSetState<EmailOtpConfirmation>;
}

const signinSchema = z.object({
	email: z.string().email({
		message: "Invalid email address",
	}),
});

export default function LoginForm({ setConfirmation }: LoginFormProps) {
	const supabase = createClient(true);
	const form = useForm<z.infer<typeof signinSchema>>({
		resolver: zodResolver(signinSchema),
		defaultValues: {
			email: "",
		},
	});
	async function onSubmit(values: z.infer<typeof signinSchema>) {
		const { data, error } = await supabase.auth.admin.generateLink({
			email: values.email,
			type: "magiclink",
		});
		if (error) {
			toast.error("Error signing in:", {
				position: "top-center",
				description: error.message,
			});
			return;
		}

		if (data) {
			// TODO:SEND OTP EMAIL
			setConfirmation(data);
		}
	}
	return (
		<Card className="flex flex-col items-center w-full max-w-sm">
			<CardHeader className="flex flex-col items-center w-full">
				<LogoSVG className="w-10 h-10 fill-foreground  mb-4" />
				<CardTitle>Welcome back!</CardTitle>
				<CardDescription>Sign in to your account</CardDescription>
			</CardHeader>
			<CardContent className="w-full">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											id="email"
											type="email"
											placeholder="Email Address"
											className="w-full"
											startIcon={Mail}
											isError={Boolean(form.formState.errors.email)}
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" variant="secondary" className="w-full">
							Sign in
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="w-full text-sm grid">
				<div className="w-full flex flex-col md:flex-row items-center">
					<p>By signing in you agree to - </p>
					<Button variant="link" size="sm">
						Terms & Conditions
					</Button>
				</div>
				<div className="w-full flex flex-col md:flex-row items-center">
					<p>Need help ?!</p>
					<Button variant="link" size="sm">
						Conatct Support
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}
