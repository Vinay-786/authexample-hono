import { z } from "zod";

export const SignUpSchema = z.object({
    name: z.string().min(5),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
});

export const SignInSchema = SignUpSchema.omit({ name: true, confirmPassword: true });

