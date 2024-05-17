import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

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
  zipCode: z.string().min(5, {
    message: " must be at least 3 characters.",
  }),
  phoneNumber: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  dateOfBirth: z.date(),
});

export const organizationFormSchema = z.object({
  organizationName: z.string().min(3, {
    message: "must be at least 3 characters.",
  }),
  organizationType: z
    .string()
    .min(3, { message: "must select a type" }),
  address: z.string().min(3, { message: "must be at least 3 characters." }),
  city: z.string().min(3, { message: "must be at least 3 characters." }),
  state: z.string().min(3, { message: "must be at least 3 characters." }),
  country: z.string(),
  zipCode: z.string().min(5, { message: "must be at least 3 characters." }),
  employeesCount: z.number().int().positive(),
  contactName: z.string().min(3, { message: "must be at least 3 characters." }),
  contactEmail: z.string().email(),
  contactNumber: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
});
