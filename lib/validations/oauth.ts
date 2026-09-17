import { z } from "zod";

export const callbackQuerySchema = z.object({
  code: z.string().optional(),
  state: z.string(),
  error: z.string().optional(),
  error_reason: z.string().optional(),
  error_description: z.string().optional(),
});

export type CallbackQuery = z.infer<typeof callbackQuerySchema>;
