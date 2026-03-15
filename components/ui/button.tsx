import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-[0.95rem] font-medium tracking-tight transition-[transform,background-color,color,border-color,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lift hover:-translate-y-0.5 hover:bg-primary-hover active:translate-y-0 active:bg-primary-active",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lift hover:-translate-y-0.5 hover:bg-error/90 active:translate-y-0",
        outline:
          "border border-input bg-card/90 text-foreground shadow-soft hover:-translate-y-0.5 hover:bg-surface-soft hover:text-foreground active:translate-y-0",
        secondary: "bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary/90",
        ghost: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        soft: "bg-primary-soft text-primary shadow-none hover:bg-primary-soft/80",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3.5 text-sm",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
