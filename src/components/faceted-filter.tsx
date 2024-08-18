"use client"

/**
 * @see https://github.com/shadcn-ui/ui/blob/main/apps/www/app/(app)/examples/tasks/components/data-table-faceted-filter.tsx
 */
import * as React from "react"
import { type Option } from "@/types"
import { CheckIcon } from "@radix-ui/react-icons"
import { type PopoverTriggerProps } from "@radix-ui/react-popover"

import { cn, composeEventHandlers } from "@/lib/utils"
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
   * The array of options available for filtering.
   * Each option can have a label, value, and optional properties like description, icon, and others.
   *
   * @example
   * ```tsx
   * options={[
   *  { label: "Option 1", value: "option-1" },
   * { label: "Option 2", value: "option-2" },
   * ]}
   * ```
   */
  options: Option[]

  /**
   * The default value of the filter.
   * @example defaultValue={["option-1"]}
   */
  defaultValue?: string[]

  /**
   * The value of the filter.
   * @example value={["option-1", "option-2"]}
   */
  value?: string[]

  /**
   * Callback function to handle changes in the filter value.
   * @param value - The new value of the filter.
   * @example onValueChange={(value) => console.log(value)}
   */
  onValueChange?: React.Dispatch<React.SetStateAction<string[]>>

  /**
   * The placeholder text for the filter input.
   * @type string | undefined
   */
  placeholder?: string

  /**
   * Message to display when no results are found.
   * @default "No results found"
   */
  emptyMessage?: string

  /**
   * Whether to truncate the label text when it is too long.
   * @type boolean | undefined
   * @default false
   */
  truncateLabel?: boolean

  /**
   * Whether to show the filter options in equal width.
   * @type boolean | undefined
   * @default false
   */
  equalWidth?: boolean

  /**
   * Event handler called when auto-focusing on close.
   * Can be prevented.
   * @example onCloseAutoFocus={(event) => event.preventDefault()}
   */
  onCloseAutoFocus?: (event: Event) => void
}

export function FacetedFilter({
  options,
  defaultValue,
  value,
  onValueChange,
  placeholder,
  emptyMessage = "No results found",
  truncateLabel = false,
  equalWidth = false,
  onCloseAutoFocus,
  children,
  className,
  ...props
}: FacetedFilterProps) {
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
  const [filterValues, setFilterValues] = useControllableState({
    defaultProp: defaultValue,
    prop: value,
    onChange: onValueChange,
  })

  const selectedValues = new Set(filterValues)

  return (
    <Popover>
      <PopoverTrigger ref={triggerRef} asChild>
        <Button
          aria-label="Filter data"
          variant="outline"
          size="sm"
          className={cn(
            "focus:outline-none focus:ring-1 focus:ring-ring focus-visible:ring-0",
            className
          )}
          {...props}
        >
          {children}
          {selectedValues?.size > 0 && (
            <div className="flex items-center">
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden min-w-0 gap-1 lg:flex">
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
                        className="truncate rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "p-0",
          equalWidth ? "w-[var(--radix-popover-trigger-width)]" : "w-[12.5rem]"
        )}
        align="start"
        onCloseAutoFocus={composeEventHandlers(onCloseAutoFocus, (event) => {
          triggerRef.current?.focus({ preventScroll: true })
          event.preventDefault()
        })}
        collisionPadding={10}
      >
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList className="max-h-full">
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup className="max-h-[18.75rem] overflow-y-auto overflow-x-hidden">
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
