import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.email("Please enter a valid email address."),
  phone: z.string().trim().min(6, "Phone number is required."),
  company: z.string().trim().optional().or(z.literal("")),
  service: z.string().trim().min(1, "Please choose a service."),
  budget: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().min(10, "Message must be at least 10 characters."),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
