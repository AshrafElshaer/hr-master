"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { sendOtpEmail } from "../actions/send-otp-email";
import { toast } from "sonner";

import type { EmailOtpConfirmation, ReactSetState } from "@/types";

import { motion, AnimatePresence } from "framer-motion";
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
import { Loader, Mail } from "lucide-react";

interface LoginFormProps {
  setConfirmation: ReactSetState<EmailOtpConfirmation>;
}

const signinSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
});

export default function LoginForm({ setConfirmation }: LoginFormProps) {
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
    },
  });
  async function onSubmit(values: z.infer<typeof signinSchema>) {
    const { data, serverError, validationError } = await sendOtpEmail({
      email: values.email,
    });

    if (serverError) {
      console.error({ serverError });
      toast.error("Failed to send OTP email", {
        description: serverError,
        position: "top-center",
      });

      return;
    }
    if (validationError) {
      toast.error("Invalid email address", {
        position: "top-center",
      });

      return;
    }
    if (data) {
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
                      inputMode="email"
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
            <Button
              type="submit"
              variant="secondary"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              <AnimatePresence mode="wait" initial={false}>
                {form.formState.isSubmitting ? (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center w-full"
                  >
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP Email ...
                  </motion.div>
                ) : (
                  <motion.span
                    key="text"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Continue
                  </motion.span>
                )}
              </AnimatePresence>
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
