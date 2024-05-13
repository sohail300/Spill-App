import { z } from "zod";
import { emailInput } from "./signupSchema";

export const otpInput = z.object({
    email: emailInput,
    otp: z.string().length(6, {message: 'Enter a 6 digit code'})
})