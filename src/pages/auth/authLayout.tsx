import { Outlet } from "react-router";

export const AuthLayout = () => {
    return (
        <div className="min-h-screen flex justify-center items-center relative overflow-hidden dark:bg-[#141414]">

            {/* Dotted background with side emphasis */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
                        radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)
                    `,
                    backgroundSize: '16px 16px',
                    maskImage: `
                        radial-gradient(
                            ellipse at center,
                            transparent 0%,
                            transparent 35%,
                            rgba(0,0,0,0.6) 60%,
                            rgba(0,0,0,1) 100%
                        )
                    `,
                    WebkitMaskImage: `
                        radial-gradient(
                            ellipse at center,
                            transparent 0%,
                            transparent 35%,
                            rgba(0,0,0,0.6) 60%,
                            rgba(0,0,0,1) 100%
                        )
                    `,
                }}
            />

            {/* Extra side darkening for depth */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
                        linear-gradient(
                            to right,
                            rgba(0,0,0,0.55),
                            transparent 30%,
                            transparent 70%,
                            rgba(0,0,0,0.55)
                        )
                    `
                }}
            />

            {/* Soft vignette */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.5) 100%)'
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                <Outlet />
            </div>
        </div>
    );
};
