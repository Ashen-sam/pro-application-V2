import { Outlet } from "react-router";

export const AuthLayout = () => {
    return (
        <div className="min-h-screen  flex  justify-center items-center relative overflow-hidden dark:bg-[#141414] ">
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Radial gradient overlay for faded effect */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
                        radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
                        radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.02) 0%, transparent 40%),
                        radial-gradient(circle at 80% 60%, rgba(255, 255, 255, 0.02) 0%, transparent 40%)
                    `
                }}
            />

            {/* Subtle vignette effect */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)'
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                <Outlet />
            </div>
        </div>
    );
}