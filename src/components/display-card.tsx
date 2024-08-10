import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface DisplayCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  title: string
  description?: string
  footer?: React.ReactNode
}

export function DisplayCard({
  title,
  description,
  footer,
  children,
  className,
  ...props
}: DisplayCardProps) {
  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>{footer}</CardFooter>
    </Card>
  )
}
