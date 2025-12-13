import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignInMutation } from "@/features/auth/authApi";
import { Loader2 } from "lucide-react";

export const Login = () => {
    const navigate = useNavigate();
    const [signIn, { isLoading }] = useSignInMutation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please enter email and password");
            return;
        }

        try {
            const result = await signIn({
                email: email.trim(),
                password,
            }).unwrap();

            if (result && result.user_id) {
                // Store user data in localStorage
                localStorage.setItem("userId", result.user_id.toString());
                localStorage.setItem("userName", result.name);
                localStorage.setItem("userEmail", result.email);
                localStorage.setItem("isAuthenticated", "true");

                toast.success("Login successful ✅");

                // Navigate to home page
                navigate("/home", { replace: true });
            } else {
                toast.error("Login failed. Please try again.");
            }
        } catch (err: any) {
            console.error("Login error:", err);

            // Extract error message
            const errorMessage =
                err?.data?.message ||
                err?.error?.message ||
                err?.message ||
                "Invalid email or password ❌";

            toast.error(errorMessage);
        }
    };

    return (
        <Card className="w-full min-w-[400px] rounded-sm dark:bg-[#282828]">
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleLogin}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    to="/forgot-password"
                                    className="ml-auto text-xs text-muted-foreground underline underline-offset-4"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>

            <CardFooter className="flex-col gap-2">
                <Button variant="outline" className="w-full" disabled={isLoading}>
                    Continue with Google
                </Button>

                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/register"
                        className="underline underline-offset-4"
                    >
                        Sign up
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
};