import { z } from "zod";
import { usernameInput } from "./signupSchema";

export const otpInput = z.object({
  username: usernameInput,
  otp: z.string().length(6, { message: "Enter a 6 digit code" }),
});
