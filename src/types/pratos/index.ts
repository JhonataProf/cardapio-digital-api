import * as z from "zod";
import { createPratoSchema } from "../../schemas";

export type CreatePratoDTO = z.infer<typeof createPratoSchema>;