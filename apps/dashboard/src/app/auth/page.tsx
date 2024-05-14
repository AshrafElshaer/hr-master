"use client";
import React from "react";
import { createClient } from "@hr-toolkit/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@hr-toolkit/ui/form";
import LogoSVG from "@/components/logo-svg";
import { ThemeToggle } from "@hr-toolkit/ui/theme-toggle";

import { Input } from "@hr-toolkit/ui/input";
import { Button } from "@hr-toolkit/ui/button";
import { Mail } from "lucide-react";
import LoginForm from "./components/login-form";
import type { EmailOtpConfirmation } from "@/types";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
	InputOTPSeparator,
} from "@hr-toolkit/ui/input-otp";
import { OtpConfirmation } from "./components/otp-confirmation";

const signinSchema = z.object({
	email: z.string().email({
		message: "Invalid email address",
	}),
});

export default function LoginPage() {
	const [confirmation, setConfirmation] = React.useState<EmailOtpConfirmation>({
		properties: null,
		user: null,
	});

	return (
		<main className="grid place-items-center min-h-screen p-4">
			{confirmation.properties && confirmation.user ? (
				<OtpConfirmation confirmation={confirmation} />
			) : (
				<LoginForm setConfirmation={setConfirmation} />
			)}
		</main>
	);
}
