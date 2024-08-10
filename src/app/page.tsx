import { PlusCircledIcon } from "@radix-ui/react-icons"

import { dataConfig } from "@/config/data"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FacetedFilter } from "@/components/faceted-filter"
import { Shell } from "@/components/shell"

export default function IndexPage() {
  return (
    <Shell>
      <Card>
        <CardHeader>
          <CardTitle>Faceted filter</CardTitle>
          <CardDescription>
            A filter that allows users to select multiple options from a list of
            available options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FacetedFilter
            placeholder="Search tricks..."
            truncateLabel
            options={dataConfig.speicalTricks.map((trick) => ({
              label: trick.name,
              value: trick.id,
            }))}
          >
            <PlusCircledIcon className="mr-2 size-4" aria-hidden="true" />
            Tricks
          </FacetedFilter>
        </CardContent>
      </Card>
    </Shell>
  )
}
