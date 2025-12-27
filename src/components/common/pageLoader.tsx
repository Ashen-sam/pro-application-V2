import { motion } from "framer-motion";
import logo from '../../../public/Screenshot_2025-12-27_164922-removebg-preview.png';

export const PageLoader = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background dark:bg-[#141414]"
        >
            <div className="flex flex-col items-center gap-4">
                <motion.div
                    animate={{
                        scale: [0.6, 0.8, 0.4],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="w-20 h-20 flex items-center justify-center"
                >
                    <img
                        src={logo}
                        alt="Loading"
                        className="w-full h-full object-contain"
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};
