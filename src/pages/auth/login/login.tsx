import { showToast } from "@/components/common/commonToast";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@clerk/clerk-react";
import { ArrowRight, Github, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from '../../../../public/Screenshot_2025-12-27_164922-removebg-preview.png';

export const Login = () => {
    const navigate = useNavigate();
    const { signIn, setActive, isLoaded } = useSignIn();
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isGithubLoading, setIsGithubLoading] = useState(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isLoaded) {
            showToast.error("Loading...", "Please wait a moment");
            return;
        }

        if (!email || !password) {
            showToast.error("Missing credentials", "Please enter both email and password");
            return;
        }

        setIsLoading(true);

        try {
            const result = await signIn.create({
                identifier: email.trim(),
                password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });

                showToast.success("Welcome back!", "Login successful");
                navigate("/home", { replace: true });
            } else {
                console.log("Additional verification required:", result);
                showToast.error("Additional verification required", "Please complete the verification process");
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Login error:", err);

            let errorMessage = "Invalid email or password";

            if (err?.errors?.[0]?.message) {
                errorMessage = err.errors[0].message;
            } else if (err?.message) {
                errorMessage = err.message;
            }

            showToast.error("Login failed", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthSignIn = async (strategy: "oauth_google" | "oauth_github") => {
        if (!isLoaded) {
            showToast.error("Loading...", "Please wait a moment");
            return;
        }

        const isGoogle = strategy === "oauth_google";

        if (isGoogle) {
            setIsGoogleLoading(true);
        } else {
            setIsGithubLoading(true);
        }

        try {
            await signIn.authenticateWithRedirect({
                strategy,
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/home",
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(`${isGoogle ? 'Google' : 'GitHub'} OAuth error:`, err);

            let errorMessage = `Failed to sign in with ${isGoogle ? 'Google' : 'GitHub'}`;
            if (err?.errors?.[0]?.message) {
                errorMessage = err.errors[0].message;
            }

            showToast.error("Authentication failed", errorMessage);

            if (isGoogle) {
                setIsGoogleLoading(false);
            } else {
                setIsGithubLoading(false);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeIn" }}
        >
            <Card className="w-full min-w-[400px] max-w-md border-0 shadow-none bg-transparent">
                <CardHeader className="space-y-1 pb-4">
                    <div className="flex items-center justify-center x-auto rounded-lg bg-transparent  border-slate-200 dark:border-slate-800">
                        <img src={logo} width={60} height={100} alt="boardy" />
                    </div>
                    <CardTitle className="text-2xl font-semibold text-center text-slate-900 dark:text-slate-50">
                        Welcome back
                    </CardTitle>
                    <CardDescription className="text-center text-sm text-slate-600 dark:text-zinc-400">
                        Sign in to continue to your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOAuthSignIn("oauth_google")}
                            disabled={isGoogleLoading || isGithubLoading || isLoading}
                            className="h-10 "
                        >
                            {isGoogleLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                            )}
                            Google
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOAuthSignIn("oauth_github")}
                            disabled={isGoogleLoading || isGithubLoading || isLoading}
                            className="h-10 text-sm "
                        >
                            {isGithubLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Github className="mr-2 h-4 w-4" />
                            )}
                            GitHub
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200 dark:border-zinc-800" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-transparent px-2 text-slate-500 dark:text-slate-200">
                                Or continue with email
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-2">
                        <div className="space-y-1">

                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email adress..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading || isGoogleLoading || isGithubLoading}
                                    required
                                    className="h-12"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center justify-end">


                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password..."
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading || isGoogleLoading || isGithubLoading}
                                    required
                                    className="h-12"

                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-10 mt-2 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors"
                            disabled={isLoading || isGoogleLoading || isGithubLoading || !isLoaded}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200 dark:border-zinc-800" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-transparent px-2 text-slate-500 dark:text-slate-200">
                                Don't have an account?
                            </span>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-1 text-sm font-medium text-slate-900 hover:text-slate-700 dark:text-slate-50 dark:hover:text-slate-300 transition-colors"
                        >
                            Create a new account
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};