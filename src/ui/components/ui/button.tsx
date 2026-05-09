import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline-solid" | "outline" | "ghost" | "destructive" | "brand";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium",
          "transition-colors duration-150 ease-sentinel",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-foreground text-primary-foreground hover:bg-neutral-800":
              variant === "default",
            "bg-secondary text-foreground hover:bg-muted": variant === "secondary",
            "border border-border-strong bg-card text-foreground shadow-sm hover:bg-secondary":
              variant === "outline-solid" || variant === "outline",
            "text-muted-foreground hover:bg-secondary hover:text-foreground": variant === "ghost",
            "bg-destructive text-destructive-foreground hover:bg-red-700":
              variant === "destructive",
            "bg-brand text-brand-foreground hover:bg-orange-600": variant === "brand",
          },
          {
            "h-11 px-7 py-3 text-sm": size === "default",
            "h-9 px-4 text-sm": size === "sm",
            "h-14 px-8 text-base": size === "lg",
            "h-10 w-10 p-0": size === "icon",
          },
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
