import { z } from "zod";
import { emailInput, passwordInput, usernameInput } from "./signupSchema";

export const loginInput = z.object({
  identifier: usernameInput || emailInput,
  password: passwordInput,
});
