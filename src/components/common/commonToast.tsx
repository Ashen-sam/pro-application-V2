import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { toast } from "sonner";

type ToastType = "info" | "success" | "error" | "warning";

interface ToastConfig {
    title: string;
    description: string;
    type: ToastType;
}

export const CustomToast = ({
    title,
    description,
    type,
    onClose,
}: ToastConfig & { onClose: () => void }) => {
    const config = {
        info: {
            icon: Info,
            bg: "bg-blue-100 dark:bg-blue-900",
            iconBg: "bg-blue-200 dark:bg-blue-700",
            iconColor: "text-blue-700 dark:text-blue-200",
            title: "text-blue-900 dark:text-white",
            desc: "text-blue-700 dark:text-gray-300",
        },
        success: {
            icon: CheckCircle2,
            bg: "bg-emerald-100 dark:bg-emerald-900",
            iconBg: "bg-emerald-200 dark:bg-emerald-700",
            iconColor: "text-emerald-700 dark:text-emerald-200",
            title: "text-emerald-900 dark:text-white",
            desc: "text-emerald-700 dark:text-gray-300",
        },
        error: {
            icon: XCircle,
            bg: "bg-red-100 dark:bg-red-900",
            iconBg: "bg-red-200 dark:bg-red-700",
            iconColor: "text-red-700 dark:text-red-200",
            title: "text-red-900 dark:text-white",
            desc: "text-red-700 dark:text-gray-300",
        },
        warning: {
            icon: AlertTriangle,
            bg: "bg-yellow-100 dark:bg-yellow-900",
            iconBg: "bg-yellow-200 dark:bg-yellow-700",
            iconColor: "text-yellow-800 dark:text-yellow-200",
            title: "text-yellow-900 dark:text-white",
            desc: "text-yellow-700 dark:text-gray-300",
        },
    };

    const {
        icon: Icon,
        bg,
        iconBg,
        iconColor,
        title: titleColor,
        desc,
    } = config[type];

    return (
        <div
            className={`${bg} border border-black/5 dark:border-white/10 rounded-3xl px-6 py-4 flex items-center gap-4 min-w-[400px] shadow-lg`}
        >
            <div
                className={`${iconBg} rounded-full p-2 flex items-center justify-center`}
            >
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div className="flex-1">
                <div className={`font-semibold text-sm ${titleColor}`}>
                    {title}
                </div>
                <div className={`text-xs mt-0.5 ${desc}`}>
                    {description}
                </div>
            </div>
            <button
                onClick={onClose}
                className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const showToast = {
    info: (title: string, description: string) =>
        toast.custom(
            (t) => (
                <CustomToast
                    title={title}
                    description={description}
                    type="info"
                    onClose={() => toast.dismiss(t)}
                />
            ),
            { duration: 5000 }
        ),

    success: (title: string, description: string) =>
        toast.custom(
            (t) => (
                <CustomToast
                    title={title}
                    description={description}
                    type="success"
                    onClose={() => toast.dismiss(t)}
                />
            ),
            { duration: 5000 }
        ),

    error: (title: string, description: string) =>
        toast.custom(
            (t) => (
                <CustomToast
                    title={title}
                    description={description}
                    type="error"
                    onClose={() => toast.dismiss(t)}
                />
            ),
            { duration: 5000 }
        ),

    warning: (title: string, description: string) =>
        toast.custom(
            (t) => (
                <CustomToast
                    title={title}
                    description={description}
                    type="warning"
                    onClose={() => toast.dismiss(t)}
                />
            ),
            { duration: 5000 }
        ),
};

