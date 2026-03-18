import { Button } from "@/components/ui/Button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, LogOut } from "lucide-react"

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
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[360px] p-0 overflow-hidden border border-white/[0.08] bg-[#0d0b18] shadow-2xl shadow-black/60 rounded-2xl">

                {/* Top accent line */}
                <div className={`h-px w-full ${variant === "danger" ? "bg-gradient-to-r from-transparent via-red-500/60 to-transparent" : "bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent"}`} />

                <div className="px-6 pt-5 pb-6">
                    <DialogHeader className="mb-5">
                        {/* Icon */}
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${variant === "danger" ? "bg-red-500/10" : "bg-indigo-500/10"}`}>
                            {variant === "danger"
                                ? <LogOut className="w-5 h-5 text-red-400" />
                                : <AlertTriangle className="w-5 h-5 text-indigo-400" />
                            }
                        </div>

                        <DialogTitle className="text-[16px] font-semibold text-white leading-tight">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-[13px] text-white/40 leading-relaxed mt-1">
                            {description}
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex gap-2.5 sm:gap-2.5">
                        <DialogClose asChild>
                            <Button
                                variant="secondary"
                                className="flex-1 h-10 rounded-xl text-sm font-medium bg-white/[0.05] border border-white/[0.08] text-white/50 hover:text-white/80 hover:bg-white/[0.08] transition-all"
                            >
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button
                            type="button"
                            className={`flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.98] border-0 ${variant === "danger"
                                    ? "bg-red-500 hover:bg-red-400 shadow-lg shadow-red-500/20"
                                    : "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
                                }`}
                            onClick={() => {
                                onConfirm?.()
                                setOpen(false)
                            }}
                        >
                            {buttonLabel}
                        </Button>
                    </DialogFooter>
                </div>

            </DialogContent>
        </Dialog>
    )
}