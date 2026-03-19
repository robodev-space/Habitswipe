"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Dialog,
    DialogContent,
    DialogClose,
} from "@/components/ui/dialog"
import { AlertTriangle, LogOut, X, ShieldAlert, Trash2 } from "lucide-react"

interface ConfirmationProps {
    title: string
    description: string
    buttonLabel: string
    open: boolean
    setOpen: (open: boolean) => void
    onConfirm?: () => void
    variant?: "danger" | "default"
}

export function Confirmation({
    title,
    description,
    buttonLabel,
    open,
    setOpen,
    onConfirm,
    variant = "danger",
}: ConfirmationProps) {
    const [isConfirming, setIsConfirming] = useState(false)
    const [ripple, setRipple] = useState(false)

    useEffect(() => {
        if (!open) {
            setIsConfirming(false)
            setRipple(false)
        }
    }, [open])

    const isDanger = variant === "danger"

    const accentColor = isDanger ? "#ef4444" : "#6366f1"
    const accentColorSoft = isDanger ? "rgba(239,68,68,0.12)" : "rgba(99,102,241,0.12)"

    const IconComponent = isDanger ? Trash2 : ShieldAlert

    const handleConfirm = async () => {
        setRipple(true)
        setIsConfirming(true)
        setTimeout(() => {
            onConfirm?.()
            setOpen(false)
        }, 400)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="p-0 overflow-hidden border-0 bg-transparent shadow-none max-w-[380px] w-full"
                style={{ borderRadius: 0 }}
            >
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.88, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 10 }}
                            transition={{ type: "spring", stiffness: 420, damping: 30 }}
                            className="relative rounded-2xl overflow-hidden"
                            style={{
                                background: "linear-gradient(145deg, #13111f 0%, #0d0b18 100%)",
                                boxShadow: `0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.07), 0 0 40px ${isDanger ? "rgba(239,68,68,0.08)" : "rgba(99,102,241,0.08)"}`,
                            }}
                        >
                            {/* Animated top accent glow */}
                            <motion.div
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: 1 }}
                                transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
                                className="h-[2px] w-full origin-left"
                                style={{
                                    background: `linear-gradient(90deg, transparent 0%, ${accentColor} 40%, ${accentColor}99 70%, transparent 100%)`,
                                }}
                            />

                            {/* Close button */}
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                onClick={() => setOpen(false)}
                                className="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.08] transition-all duration-150 z-10"
                            >
                                <X className="w-3.5 h-3.5" />
                            </motion.button>

                            <div className="px-6 pt-6 pb-6">
                                {/* Icon block */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1, type: "spring", stiffness: 380, damping: 22 }}
                                    className="relative w-14 h-14 mb-5"
                                >
                                    {/* Outer glow ring */}
                                    <motion.div
                                        animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.15, 0.4] }}
                                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                                        className="absolute inset-0 rounded-2xl"
                                        style={{ background: accentColorSoft, filter: "blur(6px)" }}
                                    />
                                    {/* Icon container */}
                                    <div
                                        className="relative w-14 h-14 rounded-2xl flex items-center justify-center"
                                        style={{
                                            background: `linear-gradient(135deg, ${accentColorSoft}, rgba(255,255,255,0.03))`,
                                            border: `1px solid ${isDanger ? "rgba(239,68,68,0.25)" : "rgba(99,102,241,0.25)"}`,
                                            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.07)`,
                                        }}
                                    >
                                        <IconComponent
                                            className="w-6 h-6"
                                            style={{ color: accentColor }}
                                        />
                                    </div>
                                </motion.div>

                                {/* Title */}
                                <motion.h2
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="text-[17px] font-bold text-white leading-snug mb-2"
                                >
                                    {title}
                                </motion.h2>

                                {/* Description */}
                                <motion.p
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-[13.5px] text-white/40 leading-relaxed mb-6"
                                >
                                    {description}
                                </motion.p>

                                {/* Divider */}
                                <motion.div
                                    initial={{ scaleX: 0, opacity: 0 }}
                                    animate={{ scaleX: 1, opacity: 1 }}
                                    transition={{ delay: 0.25, duration: 0.4 }}
                                    className="h-px bg-white/[0.06] mb-5 origin-left"
                                />

                                {/* Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.28 }}
                                    className="flex gap-2.5"
                                >
                                    {/* Cancel */}
                                    <DialogClose asChild>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="flex-1 h-10 rounded-xl text-sm font-medium transition-all duration-150"
                                            style={{
                                                background: "rgba(255,255,255,0.05)",
                                                border: "1px solid rgba(255,255,255,0.08)",
                                                color: "rgba(255,255,255,0.5)",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = "rgba(255,255,255,0.09)"
                                                e.currentTarget.style.color = "rgba(255,255,255,0.8)"
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = "rgba(255,255,255,0.05)"
                                                e.currentTarget.style.color = "rgba(255,255,255,0.5)"
                                            }}
                                        >
                                            Cancel
                                        </motion.button>
                                    </DialogClose>

                                    {/* Confirm */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.96 }}
                                        animate={ripple ? { scale: [1, 0.95, 1] } : {}}
                                        onClick={handleConfirm}
                                        disabled={isConfirming}
                                        className="flex-1 h-10 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 relative overflow-hidden"
                                        style={{
                                            background: isDanger
                                                ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                                                : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                                            boxShadow: isDanger
                                                ? "0 4px 18px rgba(239,68,68,0.35), inset 0 1px 0 rgba(255,255,255,0.15)"
                                                : "0 4px 18px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                                            opacity: isConfirming ? 0.75 : 1,
                                            transition: "all 0.15s ease",
                                        }}
                                    >
                                        {/* Shimmer overlay */}
                                        <motion.span
                                            initial={{ x: "-100%", opacity: 0 }}
                                            whileHover={{ x: "150%", opacity: 0.15 }}
                                            transition={{ duration: 0.55, ease: "easeInOut" }}
                                            className="absolute inset-0 pointer-events-none"
                                            style={{
                                                background: "linear-gradient(90deg, transparent, white, transparent)",
                                                width: "60%",
                                                top: 0,
                                                bottom: 0,
                                                left: 0,
                                            }}
                                        />

                                        {isConfirming ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                            />
                                        ) : (
                                            <>
                                                <IconComponent className="w-3.5 h-3.5 opacity-90" />
                                                {buttonLabel}
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}