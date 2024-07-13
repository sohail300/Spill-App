import { z } from "zod";
import { emailInput, passwordInput, usernameInput } from "./signupSchema";

export const loginInput = z.object({
  identifier: z.string(),
  password: passwordInput,
});
