"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

const Label = React.forwardRef<
	React.ElementRef<typeof LabelPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
	<LabelPrimitive.Root
		ref={ref}
		className={cn(
			"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			className,
		)}
		{...props}
	/>
));
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
