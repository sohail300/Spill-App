import { z } from "zod";

export const usernameInput = z
  .string()
  .min(1, "Username should have 1 - 20 charcters")
  .max(20, "Username should have 1 - 20 charcters");

export const passwordInput = z
  .string()
  .min(6, "Password should have 6 - 20 charcters")
  .max(20, "Password should have 6 - 20 charcters")
  .regex(
    /^(?=.*[A-Z|a-z])(?=.*[0-9]).+$/,
    "Password must contain at least one uppercase letter or one lowercase letter and one digit"
  );

export const emailInput = z.string().email({ message: "Enter a valid email" });

export const signupInput = z.object({
  username: usernameInput,
  name: z
    .string()
    .min(1, "Name should have 1 - 20 charcters")
    .max(20, "Name should have 1 - 20 charcters"),
  email: emailInput,
  password: passwordInput,
});
