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
        <Card className="w-full min-w-[400px] rounded-lg border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-semibold">Sign in</CardTitle>
                <CardDescription className="text-neutral-600 dark:text-neutral-400">
                    Enter your credentials to continue
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            required
                            className="h-10"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            required
                            className="h-10"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full h-10 mt-2"
                        disabled={isLoading}
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
                    <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-neutral-900 dark:text-neutral-100 hover:underline font-medium"
                        >
                            Create account
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};