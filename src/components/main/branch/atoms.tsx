import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";



export const LinkA: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({ className, children, ...rest }) => (
<a  className={cn("underline-offset-2 hover:underline text-primary", className)} {...rest}>
{children}
</a>
);


export const OpenStatusBadge: React.FC<{ open: boolean; closesAt?: string; opensAt?: string }> = ({ open, closesAt, opensAt }) => (
<Badge variant={open ? "secondary" : "outline"} className="gap-1">
<span className="h-1.5 w-1.5 rounded-full bg-foreground/70" />
{open ? (
<>Open now{closesAt ? ` · until ${closesAt}` : ""}</>
) : (
<>Closed now{opensAt ? ` · opens ${opensAt}` : ""}</>
)}
</Badge>
);



export const SectionTitle: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className, children }) => (
<h4 className={cn("text-sm font-medium uppercase tracking-wide text-muted-foreground", className)}>{children}</h4>
);