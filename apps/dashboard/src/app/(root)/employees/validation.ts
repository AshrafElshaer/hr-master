import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

export const employeeSchema = z.object({
  address: z.string().min(5, {
    message: "Address must be at least 5 characters long",
  }),
  avatar_url: z.string().optional(),
  city: z.string().min(3, {
    message: "City must be at least 3 characters long",
  }),
  country: z.string().min(2, {
    message: "Select a country",
  }),
  date_of_birth: z.date(),
  department_id: z.string().min(1, {
    message: "Select a department",
  }),
  email: z.string().email(),
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters long",
  }),
  gender: z.string().min(4, {
    message: "Select a gender",
  }),
  hire_date: z.date(),
  last_name: z.string().min(3, {
    message: "Last name must be at least 3 characters long",
  }),
  organization_id: z.string().optional(),
  phone_number: z.string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  position: z.string().min(3, {
    message: "Position must be at least 3 characters long",
  }),
  role: z.enum(["employee", "manager"]),
  salary: z.number().positive().default(0),
  state: z.string().min(2, {
    message: "Select a state",
  }),
  employment_status: z.enum(["active", "inactive", "on-hold"]),
  zip_code: z.string().min(5, {
    message: "Zip code is invalide",
  }),
});
