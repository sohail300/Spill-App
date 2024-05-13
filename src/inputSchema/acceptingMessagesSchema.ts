import { z } from "zod";

export const acceptingMessagesInput = z.object({
  acceptingMessages: z.boolean(),
});
