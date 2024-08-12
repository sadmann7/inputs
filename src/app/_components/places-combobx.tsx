"use client"

import * as React from "react"
import { type Option } from "@/types"
import { useQuery } from "@tanstack/react-query"

import { getPlaces } from "@/lib/actions"
import { useDebounce } from "@/hooks/use-debounce"
import { ComboboxInput } from "@/components/combobox-input"

export function PlacesCombobox() {
  const [query, setQuery] = React.useState("")
  const [selectedOption, setSelectedOption] = React.useState<
    Option | undefined
  >(undefined)
  const debouncedQuery = useDebounce(query, 500)

  const { data, isLoading } = useQuery({
    queryKey: ["places", debouncedQuery],
    queryFn: async () => await getPlaces({ query: debouncedQuery }),
    enabled: debouncedQuery.length > 0,
  })

  return (
    <ComboboxInput
      placeholder="Search places..."
      immediate={false}
      options={
        data?.map((place) => ({
          label: place.description,
          value: place.place_id,
        })) ?? []
      }
      input={query}
      onInputChange={setQuery}
      value={selectedOption}
      onValueChange={setSelectedOption}
      loading={isLoading}
    />
  )
}
