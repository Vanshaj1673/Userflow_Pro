import { z } from 'zod';

const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export const userSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().regex(/^\d{10}$/),
  panNumber: z.string().regex(panRegex),
});
