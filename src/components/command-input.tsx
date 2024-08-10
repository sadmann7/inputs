"use client"

/**
 * @see https://github.com/armandsalle/my-site/blob/main/src/react/autocomplete.tsx
 */
import * as React from "react"
import { type Option } from "@/types"
import { CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/hooks/use-controllable-state"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command"
import { Skeleton } from "@/components/ui/skeleton"

interface ComboboxInputProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof CommandInput>,
    "value" | "onValueChange"
  > {
  /**
   * The list of options available for selection.
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
   * The currently selected option.
   * @example { label: "Option 1", value: "option-1" }
   */
  value?: Option

  /**
   * Callback function that is called when the selected value changes.
   * @param value - The new selected option.
   * @example onValueChange={(value) => console.log(value)}
   */
  onValueChange?: (value: Option) => void

  /**
   * Message to display when no results are found.
   * @default "No results found"
   */
  emptyMessage?: string

  /**
   * Indicates whether the options should be displayed immediately when the input is focused.
   * @default false
   */
  immediate?: boolean

  /**
   * Indicates whether the component is in a loading state.
   * @default false
   */
  loading?: boolean
}

export function ComboboxInput({
  options,
  value,
  onValueChange,
  placeholder,
  emptyMessage = "No results found",
  immediate = false,
  loading = false,
  className,
  ...props
}: ComboboxInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [input, setInput] = React.useState("")
  const [currentOption, setCurrentOption] = useControllableState({
    prop: value,
    onChange: onValueChange,
  })

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!inputRef.current) return

      const ignoredKeys = [
        "Tab",
        "ArrowUp",
        "ArrowDown",
        "Control",
        "Alt",
        "Shift",
        "Escape",
        "Delete",
        "Home",
        "End",
        "PageUp",
        "PageDown",
        "Insert",
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
      ]

      if (ignoredKeys.includes(event.key)) return

      if (!open) {
        setOpen(true)
      }

      // This is not a default behaviour of the <input /> field
      if (event.key === "Enter" && inputRef.current.value !== "") {
        const selectedOption = options.find(
          (option) => option.label === inputRef.current?.value
        )
        setCurrentOption(selectedOption)
      }

      if (event.key === "Escape") {
        setInput("")
        setOpen(false)
      }
    },
    [open, options, setCurrentOption]
  )

  const onBlur = React.useCallback(() => {
    setOpen(false)
    setInput(currentOption?.label ?? "")
  }, [currentOption])

  const onSelect = React.useCallback(
    (selectedOption: Option) => {
      setInput(selectedOption.label)
      setCurrentOption(selectedOption)
      setOpen(false)
    },
    [setCurrentOption]
  )

  return (
    <Command
      className="overflow-visible [&_[cmdk-input-wrapper]]:rounded-md [&_[cmdk-input-wrapper]]:border"
      onKeyDown={onKeyDown}
    >
      <CommandInput
        ref={inputRef}
        value={input}
        onValueChange={(value) => {
          setInput(value)
          if (value === "") {
            setCurrentOption(undefined)
          }
        }}
        onBlur={onBlur}
        onFocus={() => {
          if (immediate) {
            setOpen(true)
          }
        }}
        placeholder={placeholder}
        className={cn("border-b-0", className)}
        {...props}
      />
      <div className="relative mt-1">
        <div
          className={cn(
            "absolute top-0 z-50 w-full rounded-xl bg-popover text-popover-foreground outline-none animate-in fade-in-0 zoom-in-95",
            open ? "block" : "hidden"
          )}
        >
          <CommandList className="rounded-lg ring-1 ring-border">
            {loading ? (
              <CommandLoading>
                <div className="p-1">
                  <Skeleton className="h-8 w-full" />
                </div>
              </CommandLoading>
            ) : null}
            {options.length > 0 && !loading ? (
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = currentOption?.value === option.value

                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onMouseDown={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                      }}
                      onSelect={() => onSelect(option)}
                      className={cn(
                        "flex w-full items-center gap-2",
                        !isSelected ? "pl-8" : null
                      )}
                    >
                      {isSelected ? (
                        <CheckIcon className="w-4" aria-hidden="true" />
                      ) : null}
                      {option.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ) : null}
            {!loading ? <CommandEmpty>{emptyMessage}</CommandEmpty> : null}
          </CommandList>
        </div>
      </div>
    </Command>
  )
}
