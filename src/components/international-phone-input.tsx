"use client"

import * as React from "react"
import {
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
  type UsePhoneInputConfig,
} from "react-international-phone"

import { cn } from "@/lib/utils"
import { internationalPhoneSchema } from "@/lib/validations"
import { useControllableState } from "@/hooks/use-controllable-state"
import { Input, type InputProps } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PhoneInputProps
  extends UsePhoneInputConfig,
    Omit<InputProps, "onChange" | "value"> {
  className?: string
  validate?: boolean
}

export function InternationalPhoneInput({
  className,
  validate,
  countries = defaultCountries,
  value,
  onChange,
  prefix,
  defaultMask,
  charAfterDialCode,
  historySaveDebounceMS,
  disableCountryGuess,
  disableDialCodePrefill,
  forceDialCode,
  disableDialCodeAndPrefix,
  disableFormatting,
  ...rest
}: PhoneInputProps) {
  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      countries,
      value,
      onChange,
      prefix,
      defaultMask,
      charAfterDialCode,
      historySaveDebounceMS,
      disableCountryGuess,
      disableDialCodePrefill,
      forceDialCode,
      disableDialCodeAndPrefix,
      disableFormatting,
    })

  const error = validate && internationalPhoneSchema.safeParse(inputValue).error

  console.log(error)

  return (
    <div className="space-y-1.5">
      <div className="flex w-full items-center space-x-2">
        <Select
          defaultValue={country.iso2}
          onValueChange={(iso2) => setCountry(iso2)}
        >
          <SelectTrigger className="w-20">
            <SelectValue asChild>
              <FlagImage iso2={country.iso2} className="h-4" />
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[240px] overflow-y-auto">
            {defaultCountries.map((c) => {
              const country = parseCountry(c)
              return (
                <SelectItem key={country.iso2} value={country.iso2}>
                  <div className="flex items-center space-x-2">
                    <FlagImage iso2={country.iso2} className="h-4" />
                    <span>{country.name}</span>
                    <span className="opacity-60">+{country.dialCode}</span>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>

        <Input
          className={cn(className)}
          ref={inputRef}
          type="tel"
          value={inputValue}
          onChange={handlePhoneValueChange}
          {...rest}
        />
      </div>
      {error && (
        <span className="text-sm text-destructive">
          {error.issues.at(0)?.message}
        </span>
      )}
    </div>
  )
}
