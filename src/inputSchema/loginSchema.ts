import { z } from "zod";
import { passwordInput, usernameInput } from "./signupSchema";

export const loginInput = z.object({
  username: usernameInput,
  password: passwordInput,
});
