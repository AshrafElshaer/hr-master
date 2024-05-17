import * as React from "react";
import { cn } from "../../lib/utils";

import type { LucideIcon } from "lucide-react";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	startIcon?: LucideIcon;
	endIcon?: LucideIcon;
	isError?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, startIcon, endIcon, isError, ...props }, ref) => {
		const [isFocused, setIsFocused] = React.useState(false);
		const StartIcon = startIcon;
		const EndIcon = endIcon;

		return (
			<div
				className="w-full relative"
				onBlur={() => {
					setIsFocused(false);
				}}
			>
				{StartIcon && (
					<div
						className={cn(
							"absolute left-2 top-1/2 transform -translate-y-1/2 transition-all",
							isFocused ? "text-primary/70" : "text-muted-foreground",
							isError ? "text-destructive" : "",
						)}
					>
						<StartIcon size={18} />
					</div>
				)}
				<input
					type={type}
					className={cn(
						"flex h-9 w-full rounded-md  border bg-transparent px-3 py-1 text-sm ui-transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ",
						startIcon ? "pl-8" : "",
						endIcon ? "pr-8" : "",
						isFocused ? "border-primary/70" : "border-border",
						isError ? "border-destructive" : "",
						className,
					)}
					ref={ref}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					{...props}
				/>
				{EndIcon && (
					<div
						className={cn(
							"absolute right-3 top-1/2 transform -translate-y-1/2",
							isFocused ? "text-primary/70" : "text-muted-foreground",
							isError ? "text-destructive" : "",
						)}
					>
						<EndIcon className="text-muted-foreground" size={18} />
					</div>
				)}
			</div>
		);
	},
);
Input.displayName = "Input";

export { Input };
