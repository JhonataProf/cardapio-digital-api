import * as z from "zod";
import { createPratoSchema } from "../../presentation/http/validators/prato-schemas";

export type CreatePratoDTO = z.infer<typeof createPratoSchema>;