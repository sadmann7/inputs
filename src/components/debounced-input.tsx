"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { Input } from "@/components/ui/input"

interface DebouncedInputProps
  extends React.ComponentPropsWithoutRef<typeof Input> {
  /**
   * The key of the query.
   * When provided, the input value will be synced with the query string.
   * @type string | undefined
   */
  queryKey?: string

  /**
   * The value of the input.
   * @example "value"
   */
  value?: string

  /**
   * Callback function that is called when the input value changes.
   * @param value - The new value of the input.
   * @example onValueChange={(value) => console.log(value)}
   */
  onValueChange?: (value: string) => void

  /**
   * The placeholder text for the input.
   */
  placeholder?: string

  /**
   * The debounce time in milliseconds.
   * @default 500
   */
  debounceMs?: number

  /**
   * The method to use when updating the URL.
   * - "push" - Pushes a new entry onto the history stack.
   * - "replace" - Replaces the current entry on the history stack.
   * @default "replace"
   */
  method?: "push" | "replace"

  /**
   * Flag to disable scroll restoration when updating the URL.
   * @default false
   */
  scroll?: boolean

  /**
   * A callback function that is invoked before the transition
   * when the input value changes.
   * This function can be used to retrieve the pending state of the input.
   * @see https://react.dev/reference/react/useTransition
   *
   */
  startTransition?: React.TransitionStartFunction
}

export function DebouncedInput({
  queryKey,
  value,
  onValueChange,
  debounceMs = 500,
  placeholder,
  scroll,
  method = "replace",
  startTransition,
  className,
  ...props
}: DebouncedInputProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [controlledValue = "", setControlledValue] = React.useState(
    value ?? searchParams.get(queryKey ?? "") ?? ""
  )
  const debouncedValue = useDebounce(controlledValue, debounceMs, onValueChange)

  React.useEffect(() => {
    if (!queryKey) return
    if (debouncedValue !== controlledValue) return

    const newQueryString = new URLSearchParams(searchParams)

    if (debouncedValue) {
      newQueryString.set(queryKey, debouncedValue)
    } else {
      newQueryString.delete(queryKey)
    }

    function onUrlChange() {
      const url = `${pathname}?${newQueryString.toString()}`

      method === "push"
        ? router.push(url, { scroll })
        : router.replace(url, { scroll })
    }

    startTransition
      ? startTransition(() => {
          onUrlChange()
        })
      : onUrlChange()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledValue, debouncedValue, queryKey])

  return (
    <Input
      placeholder={placeholder}
      value={controlledValue}
      onChange={(event) => setControlledValue(event.target.value)}
      className={cn(className)}
      {...props}
    />
  )
}
