import { queryOptions } from "@tanstack/react-query"

import { getPlaces } from "@/lib/actions"

export const placesQueryOpts = queryOptions({
  queryKey: ["places", ""],
  queryFn: () => getPlaces(""),
  enabled: false,
})
