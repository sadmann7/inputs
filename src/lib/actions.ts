"use server"

import { env } from "@/env"
import { faker } from "@faker-js/faker"

import { getPlacesSchema } from "@/lib/validations"

export async function getPlaces(query: string) {
  try {
    const apiKey = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return Array.from({ length: 10 }, () => ({
        description: faker.location.city(),
        place_id: faker.string.uuid(),
      }))
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    )
    const safeParsed = getPlacesSchema.safeParse(await response.json())

    if (!safeParsed.success) {
      throw new Error("Failed to fetch places")
    }

    return safeParsed.data.predictions
  } catch (err) {
    return []
  }
}
