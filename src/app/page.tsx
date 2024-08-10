import { Suspense } from "react"
import { PlusCircledIcon } from "@radix-ui/react-icons"

import { dataConfig } from "@/config/data"
import { siteConfig } from "@/config/site"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ComboboxInput } from "@/components/command-input"
import { DebouncedInput } from "@/components/debounced-input"
import { FacetedFilter } from "@/components/faceted-filter"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shell"

export default function IndexPage() {
  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading>{siteConfig.name}</PageHeaderHeading>
        <PageHeaderDescription>{siteConfig.description}</PageHeaderDescription>
      </PageHeader>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Faceted filter</CardTitle>
            <CardDescription>
              A filter that allows multiple options to be selected from a list.
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
        <Card>
          <CardHeader>
            <CardTitle>Combobox input</CardTitle>
            <CardDescription>
              An autocomplete input that allows a single option to be selected
              from a list.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ComboboxInput
              placeholder="Search tricks..."
              options={dataConfig.speicalTricks.map((trick) => ({
                label: trick.name,
                value: trick.id,
              }))}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Debounced input</CardTitle>
            <CardDescription>
              An input that debounces the value before triggering a callback.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-10" />}>
              <DebouncedInput placeholder="Search..." className="h-10" />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </Shell>
  )
}
