"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/hooks/use-controllable-state"
import { useDebounce } from "@/hooks/use-debounce"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"

interface DebouncedInputProps extends React.HTMLAttributes<HTMLDivElement> {
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
   * The debounce time in milliseconds.
   * @default 500
   */
  debounceMs?: number

  /**
   * The placeholder text for the input.
   */
  placeholder?: string
}

export function DebouncedInput({
  queryKey,
  value,
  onValueChange,
  debounceMs = 500,
  placeholder,
  className,
  ...props
}: DebouncedInputProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = React.useTransition()

  const [controlledValue, setControlledValue] = useControllableState({
    defaultProp: queryKey ? (searchParams.get(queryKey) ?? "") : "",
    prop: value,
    onChange: onValueChange,
  })
  const debouncedValue = useDebounce(controlledValue, debounceMs)

  React.useEffect(() => {
    if (!queryKey) return
    if (debouncedValue !== controlledValue) return

    const newQueryString = new URLSearchParams(searchParams)

    if (debouncedValue) {
      newQueryString.set(queryKey, debouncedValue)
    } else {
      newQueryString.delete(queryKey)
    }

    startTransition(() => {
      router.replace(`${pathname}?${newQueryString.toString()}`, {
        scroll: false,
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledValue, debouncedValue, queryKey])

  return (
    <div className={cn("relative h-11 w-full", className)} {...props}>
      <div className="absolute left-3 top-3 flex size-[1.125rem] shrink-0 items-center justify-center text-foreground/50">
        {isPending ? (
          <Icons.spinner
            className="size-full animate-spin"
            aria-hidden="true"
          />
        ) : (
          <MagnifyingGlassIcon className="size-full" aria-hidden="true" />
        )}
      </div>
      <Input
        placeholder={placeholder}
        className="size-full pl-10"
        value={value}
        onChange={(e) => setControlledValue(e.target.value)}
      />
    </div>
  )
}
