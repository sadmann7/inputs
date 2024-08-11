"use client"

/**
 * @see https://github.com/armandsalle/my-site/blob/main/src/react/autocomplete.tsx
 */
import * as React from "react"
import { type Option } from "@/types"
import { CheckIcon } from "@radix-ui/react-icons"
import { usePopper, type PopperProps } from "react-popper"

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

const nonPrintableKeys = [
  "Tab",
  "Control",
  "Alt",
  "Shift",
  "Delete",
  "Home",
  "End",
  "PageUp",
  "PageDown",
  "Insert",
  "ArrowLeft",
  "ArrowRight",
]

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
   * The placement of the options list relative to the input.
   * @default "bottom-start"
   */
  placement?: PopperProps<HTMLElement>["placement"]

  /**
   * Horizontal distance in pixels between the options list and the input.
   * @default 0
   */
  alignOffset?: number

  /**
   * Vertical distance in pixels between the options list and the input.
   * @default 4
   */
  sideOffset?: number

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
  placement = "bottom-start",
  alignOffset = 0,
  sideOffset = 4,
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

  const [referenceElement, setReferenceElement] =
    React.useState<HTMLDivElement | null>(null)
  const [popperElement, setPopperElement] =
    React.useState<HTMLDivElement | null>(null)
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      { name: "offset", options: { offset: [alignOffset, sideOffset] } },
    ],
    placement,
  })

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const inputElement = inputRef.current
      if (!inputElement) return

      if (nonPrintableKeys.includes(event.key)) return

      /**
       * When the input field is empty and the options list is closed and the Backspace key is pressed, close the options list.
       * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/#:~:text=the%20characters%20typed.-,Backspace,to%20the%20combobox%20and%20deletes%20the%20character%20prior%20to%20the%20cursor.,-Delete
       */
      if (event.key === "Backspace" && inputElement.value === "" && !open) {
        if (open) setOpen(false)
        return
      }

      /**
       * When Escape is pressed:
       * - If the input value matches the current option's label, simply close the options list.
       * - If no option is selected or the input value does not match the current option, clear the input value, closes the options list, and sets the current option to undefined.
       * - Focus is then returned to the input element.
       * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/#:~:text=in%20the%20popup.-,Escape,is%20pressed%2C%20clears%20the%20combobox.,-Enter
       */
      if (event.key === "Escape") {
        if (currentOption && inputElement.value === currentOption.label) {
          if (open) setOpen(false)
          return
        }

        if (inputElement.value === "") {
          if (open) setOpen(false)
          return
        }

        setInput("")
        setOpen(false)
        setCurrentOption(undefined)
        inputRef.current.focus()
      }

      /**
       * When Enter is pressed and the input field is not empty:
       * - Search for an option whose label matches the current input value.
       * - If a matching option is found, set this option as the current option.
       * - The cursor is then moved to the end of the input field.
       * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/#:~:text=Enter,add%20another%20recipient.
       */
      if (event.key === "Enter" && inputElement.value !== "") {
        const selectedOption = options.find(
          (option) => option.label === inputElement.value
        )
        setCurrentOption(selectedOption)
      }

      if (!open) setOpen(true)
    },
    [currentOption, open, options, setCurrentOption]
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
      ref={setReferenceElement}
      className="relative overflow-visible [&_[cmdk-input-wrapper]]:rounded-md [&_[cmdk-input-wrapper]]:border"
      onKeyDown={onKeyDown}
      {...attributes.reference}
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
      <CommandList
        ref={setPopperElement}
        data-state={open ? "open" : "closed"}
        style={styles.popper}
        className={cn(
          "z-50 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:visible data-[state=closed]:invisible data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[popper-placement=bottom-end]:translate-x-1/2 data-[popper-placement=bottom-start]:-translate-x-1/2 data-[popper-placement=left-end]:translate-y-1/2 data-[popper-placement=left-start]:-translate-y-1/2 data-[popper-placement=right-end]:translate-y-1/2 data-[popper-placement=right-start]:-translate-y-1/2 data-[popper-placement=top-end]:translate-x-1/2 data-[popper-placement=top-start]:-translate-x-1/2 data-[popper-placement=bottom-end]:slide-in-from-top-2 data-[popper-placement=bottom-start]:slide-in-from-top-2 data-[popper-placement=bottom]:slide-in-from-top-2 data-[popper-placement=left-end]:slide-in-from-right-2 data-[popper-placement=left-start]:slide-in-from-right-2 data-[popper-placement=left]:slide-in-from-right-2 data-[popper-placement=right-end]:slide-in-from-left-2 data-[popper-placement=right-start]:slide-in-from-left-2 data-[popper-placement=right]:slide-in-from-left-2 data-[popper-placement=top-end]:slide-in-from-bottom-2 data-[popper-placement=top-start]:slide-in-from-bottom-2 data-[popper-placement=top]:slide-in-from-bottom-2"
        )}
        {...attributes.popper}
      >
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
    </Command>
  )
}
