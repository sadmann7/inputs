"use client"

import * as React from "react"
import { type Option } from "@/types"
import { CheckIcon } from "@radix-ui/react-icons"
import { type PopoverTriggerProps } from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/hooks/use-controllable-state"
import { Badge } from "@/components/ui/badge"
import { Button, type ButtonProps } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

interface FacetedFilterProps
  extends Omit<PopoverTriggerProps, "defaultValue" | "value">,
    Omit<ButtonProps, "defaultValue" | "value"> {
  /**
   * The placeholder text for the filter input.
   * @type {string}
   * @default undefined
   * @example placeholder="Search..."
   */
  placeholder?: string

  /**
   * The current value of the filter.
   * @type {string[]}
   * @default undefined
   * @example value={["option1", "option2"]}
   */
  value?: string[]

  /**
   * Callback function to handle changes in the filter value.
   * @param {React.SetStateAction<string[]>} value - The new value of the filter.
   * @example onValueChange={(newValue) => console.log(newValue)}
   */
  onValueChange?: React.Dispatch<React.SetStateAction<string[]>>

  /**
   * The array of options available for filtering.
   * Each option can have a label, value, and optional properties like description, icon, and others.
   *
   * @example
   * ```tsx
   * options={[
   *  {label: "Status", value: "status", variant: "checkbox", options: [{label: "Active", value: "active"}, {label: "Inactive", value: "inactive"}]}
   * ]}
   * ```
   */
  options: Option[]

  /**
   * Whether to truncate the label text when it is too long.
   * @type {boolean}
   * @default false
   */
  truncateLabel?: boolean
}

export function FacetedFilter({
  placeholder,
  value,
  onValueChange,
  options,
  truncateLabel,
  children,
  className,
  ...props
}: FacetedFilterProps) {
  const [filterValues, setFilterValues] = useControllableState({
    prop: value,
    onChange: onValueChange,
  })

  const selectedValues = new Set(filterValues)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="Filter data"
          variant="outline"
          size="sm"
          className={cn("h-8 border-dashed", className)}
          {...props}
        >
          {children}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[12.5rem] p-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList className="max-h-full">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto overflow-x-hidden">
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value)
                      } else {
                        selectedValues.add(option.value)
                      }
                      const filterValues = Array.from(selectedValues)
                      setFilterValues(
                        filterValues.length > 0 ? filterValues : []
                      )
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className="size-4" aria-hidden="true" />
                    </div>
                    {option.icon && (
                      <option.icon
                        className="mr-2 size-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={cn({
                        truncate: truncateLabel,
                      })}
                    >
                      {option.label}
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setFilterValues([])}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
