import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface CommonDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: "sm" | "md" | "lg";
    className?: string;
    icon?: React.ReactNode
    note?: string
    minWidth?: number;
}

export function CommonDialog({
    open,
    onOpenChange,
    title,
    children,
    footer,
    className = "",
    icon,
    note
}: CommonDialogProps) {
    return (
        <Dialog open={open} onOpenChange={(val) => {
            // Only allow closing via button, ignore outside clicks
            if (!val) return; // Prevent closing from outside click
            onOpenChange(val)
        }} >
            <DialogContent
                className={`
                        ${className}
                        /* macOS glass effect */
                        p-0 gap-0 rounded-md
                        backdrop-blur-xl bg-white/70 dark:bg-zinc-900/50 
                         border border-zinc-300 dark:border-zinc-700
                        shadow-[0_0_40px_rgba(0,0,0,0.20)]

                        /* macOS animation */
                        data-[state=open]:animate-in
                        data-[state=open]:fade-in-0
                        data-[state=open]:zoom-in-95
                        data-[state=closed]:animate-out
                        data-[state=closed]:fade-out-0
                        data-[state=closed]:zoom-out-95

                        duration-200
                        overflow-hidden
                    `}
            >
                {/* Header */}
                <div
                    className="
                            flex items-center justify-between px-4 py-2.5
                            bg-white/60 dark:bg-[#282828] 
                             
                            backdrop-blur-xl 
                        "
                >

                    <div className=" flex gap-3 items-center pt-3">
                        <div className="border bg-primary/10 rounded-sm p-2">
                            {icon}
                        </div>
                        <div className="flex flex-col gap-[3px]">
                            <DialogTitle className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                {title}
                            </DialogTitle>
                            <div className="text-xs font-medium text-gray-800 dark:text-gray-400">
                                {note}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="
                                w-6 h-6 flex items-center justify-center rounded-md absolute top-2 right-3
                                hover:bg-white/50 dark:hover:bg-white/10
                                transition-colors
                            "
                    >
                        <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <div
                    className="
                            px-4 py-4 
                            bg-white/40 dark:bg-[#282828]
                            backdrop-blur-xl
                            max-h-[70vh] overflow-y-auto
                        "
                >
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div
                        className="
                                px-4 py-3 border-t-3 border-dotted flex justify-end
                                bg-white/50 dark:bg-[#282828]
                                  dark:border-white/10
                                backdrop-blur-xl
                            "
                    >
                        {footer}
                    </div>
                )}
            </DialogContent>
        </Dialog >
    );
}
