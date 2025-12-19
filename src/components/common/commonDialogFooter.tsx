import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import type { DialogFooterProps } from "./commonDialogTypes";

// CommonDialogFooter component for consistent footer buttons

export function CommonDialogFooter({
    onCancel,
    onConfirm,
    onConfirmAndCreateAnother,
    cancelText = "Cancel",
    confirmText = "Confirm",
    isLoading = false,
    showCancel = true,
    showConfirm = true,
    enableCreateAnother = true,
    formMode,
}: DialogFooterProps) {
    return (
        <div className="flex justify-end gap-3 py-1">
            {showCancel && (
                <Button
                    className="text-xs"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    {cancelText}
                </Button>
            )}
            {showConfirm && (
                <div className="flex">
                    <Button
                        className={`text-xs ${formMode === "add" ? "rounded-r-none border-r-0 border" : ""}`}
                        variant="outline"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : confirmText}
                    </Button>

                    {formMode === "add" && enableCreateAnother && !isLoading && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    className="text-xs rounded-l-none px-2 "
                                    variant="outline"
                                    disabled={isLoading}
                                >
                                    <ChevronDown size={14} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-2" >

                                <DropdownMenuItem
                                    onClick={onConfirmAndCreateAnother}
                                    className="text-xs cursor-pointer"

                                >
                                    Create Another
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            )}
        </div>
    );
}