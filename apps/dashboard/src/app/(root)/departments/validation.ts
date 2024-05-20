import { z } from "zod";

export const departmentSchema = z.object({
  departmentName: z.string().min(2, {
    message: "Department name must be at least 2 characters long.",
  }),
  departmentDescription: z.string().optional(),
  personInCharge: z.string(),
});
