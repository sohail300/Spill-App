import { z } from "zod";

export const messageInput = z.object({
  content: z.string(),
});
