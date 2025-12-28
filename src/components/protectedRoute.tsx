import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Navigate, Outlet } from "react-router-dom";
import logo from "../../public/Screenshot_2025-12-27_164922-removebg-preview.png";

export const ProtectedRoute = () => {
    const { isLoaded, isSignedIn } = useAuth();
    if (!isLoaded) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-background dark:bg-[#141414]"
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(circle at center, rgba(255,255,255,0.04), transparent 60%),
                            linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.45))
                        `,
                    }}
                />

                <div className="relative z-10 flex flex-col items-center gap-6">
                    <motion.div
                        initial={{ scale: 0.95, y: 0 }}
                        animate={{
                            y: [0, -10, 0],
                            scale: [0.96, 1, 0.96]
                        }}
                        transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="relative w-20 h-20 flex items-center justify-center"
                    >
                        <motion.div
                            animate={{
                                opacity: [0.25, 0.6, 0.25],
                                scale: [1, 1.3, 1],
                            }}
                            transition={{
                                duration: 2.4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute inset-0 rounded-full bg-primary/25 blur-2xl"
                        />

                        <img
                            src={logo}
                            alt="Loading"
                            className="relative z-10 w-full h-full object-contain"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-1 text-sm tracking-wide text-neutral-600 dark:text-neutral-400"
                    >
                        Loading
                        <span className="flex">
                            {[0, 1, 2].map((i) => (
                                <motion.span
                                    key={i}
                                    animate={{ opacity: [0.2, 1, 0.2] }}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                >
                                    .
                                </motion.span>
                            ))}
                        </span>
                    </motion.div>
                </div>
            </motion.div>
        );
    }
    if (!isSignedIn) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};
export default ProtectedRoute;
