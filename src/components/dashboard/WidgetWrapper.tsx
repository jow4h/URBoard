"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface WidgetWrapperProps {
    children: ReactNode;
    className?: string;
    title?: string;
    icon?: ReactNode;
    isFloating?: boolean;
}

export default function WidgetWrapper({
    children,
    className,
    title,
    icon,
    isFloating = false,
}: WidgetWrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "group relative h-full w-full overflow-hidden rounded-2xl glass transition-all duration-300 hover:border-accent/40 flex flex-col",
                isFloating && "animate-float",
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />

            {(title || icon) && (
                <div className="flex-shrink-0 flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-3 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <span className="text-accent">{icon}</span>
                        <h3 className="text-sm font-medium tracking-wider text-white/80 uppercase">
                            {title}
                        </h3>
                    </div>
                </div>
            )}

            <div className="relative flex-1 w-full overflow-auto p-4 custom-scrollbar">
                {children}
            </div>
        </motion.div>
    );
}
