import { z } from "zod"

export const getPlacesSchema = z.object({
  status: z.string(),
  predictions: z.array(
    z.object({
      description: z.string(),
      place_id: z.string(),
    })
  ),
})
