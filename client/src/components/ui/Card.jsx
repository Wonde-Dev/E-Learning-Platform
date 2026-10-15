import { cn } from "@/lib/utils";

/**
 * Reusable surface container.
 * Props: className, as (tag), padding (bool)
 */
export const Card = ({
  as: Tag = "div",
  className,
  padding = true,
  ...props
}) => (
  <Tag
    className={cn(
      "card",
      padding && "p-5",
      className
    )}
    {...props}
  />
);