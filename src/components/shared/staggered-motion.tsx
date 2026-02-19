"use client"

import { motion } from "framer-motion"

export const StaggerContainer = ({
    children,
    as: Component = motion.div,
    className
}: {
    children: React.ReactNode,
    as?: any,
    className?: string
}) => {
    return (
        <Component
            className={className}
            initial="hidden"
            animate="show"
            variants={{
                show: {
                    transition: {
                        staggerChildren: 0.1,
                    },
                },
            }}
        >
            {children}
        </Component>
    )
}

export const StaggerItem = ({
    children,
    as: Component = motion.div,
    className
}: {
    children: React.ReactNode,
    as?: any,
    className?: string
}) => {
    return (
        <Component
            className={className}
            variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {children}
        </Component>
    )
}
