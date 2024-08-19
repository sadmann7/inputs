import { PhoneNumberUtil } from "google-libphonenumber"
import { z } from "zod"

const phoneUtil = PhoneNumberUtil.getInstance()

export const getPlacesSchema = z.object({
  status: z.string(),
  predictions: z.array(
    z.object({
      description: z.string(),
      place_id: z.string(),
    })
  ),
})

export const internationalPhoneSchema = z.string().refine((phone) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone))
  } catch (error) {
    return false
  }
}, "Please enter a valid phone number")
