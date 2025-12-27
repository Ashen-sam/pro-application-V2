import { showToast } from "@/components/common/commonToast";
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
import { useLoginMutation } from "@/features/auth/authApi";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
            showToast.error("Please enter email and password", "Both fields are required.");
            return;
        }

        try {
            const result = await login({
                email: email.trim(),
                password,
            }).unwrap();

            // Store the token in localStorage
            if (result.token) {
                localStorage.setItem("authToken", result.token);
            }

            // Store user info in localStorage
            if (result.user) {
                localStorage.setItem("userId", result.user.user_id.toString());
                localStorage.setItem("userName", result.user.name);
                localStorage.setItem("userEmail", result.user.email);
                localStorage.setItem("user", JSON.stringify(result.user));
            }

            localStorage.setItem("isAuthenticated", "true");
            showToast.success("Login successful ", "Welcome back!");

            // Navigate to home/dashboard
            navigate("/home", { replace: true });
        } catch (err) {
            console.error("Login error:", err);

            // Handle RTK Query errors
            const error = err as {
                data?: { message?: string };
                error?: string;
                message?: string;
                status?: number;
            };

            let errorMessage = "Invalid email or password ❌";

            if (error?.data?.message) {
                errorMessage = error.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            } else if (error?.error) {
                errorMessage = typeof error.error === "string" ? error.error : "Login failed";
            }

            showToast.error(errorMessage, "Please try again");
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
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="underline underline-offset-4">
                        Sign up
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
};