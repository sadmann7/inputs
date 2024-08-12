"use server"

import { env } from "@/env"

import { getPlacesSchema } from "@/lib/validations"

export async function getPlaces({ query }: { query: string }) {
  try {
    const apiKey = env.GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      throw new Error("Missing Google Maps API key")
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${apiKey}`
    )
    const safeParsedOutput = getPlacesSchema.safeParse(await response.json())

    if (!safeParsedOutput.success) {
      throw new Error("Failed to fetch places")
    }

    return safeParsedOutput.data.predictions
  } catch (err) {
    return []
  }
}
