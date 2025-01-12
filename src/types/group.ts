import { number, z } from "zod";

export const Groupz = z.object({
  id: z.string().length(6),
  admin: z.string(),
  name: z.string(),
  description: z.optional(z.string()),
  createDate: z.string(),
  count: z.number(),
  members: z.array(
    z.object({
      name: z.string(),
      email: z.string(),
    })
  ),
});
export type Group = z.infer<typeof Groupz>;

