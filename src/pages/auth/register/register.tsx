import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useRegisterMutation } from "@/features/auth/authApi";

export const Register = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const [register, { isLoading }] = useRegisterMutation();

    const validateForm = () => {
        if (!fullName.trim()) {
            setError("Full name is required");
            return false;
        }

        if (!email.trim()) {
            setError("Email is required");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return false;
        }

        if (!password) {
            setError("Password is required");
            return false;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return false;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) {
            return;
        }

        try {
            const result = await register({
                name: fullName.trim(),
                email: email.trim(),
                password,
            }).unwrap();

            // Store the token in localStorage
            if (result.token) {
                localStorage.setItem("authToken", result.token);
            }

            // Store user info if needed
            if (result.user) {
                localStorage.setItem("user", JSON.stringify(result.user));
            }

            // Navigate to login or dashboard
            navigate("/login");

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Registration error:", err);

            if (err.data?.message) {
                setError(err.data.message);
            } else if (err.message) {
                setError(err.message);
            } else if (err.error) {
                setError(typeof err.error === "string" ? err.error : "Failed to create account");
            } else {
                setError("Failed to create account. Please try again.");
            }
        }
    };

    return (
        <Card className="w-full max-w-md rounded-sm">
            <CardHeader>
                <CardTitle>Create your account</CardTitle>
                <CardDescription>Enter your details below to create your account</CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>

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
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                    disabled={isLoading}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription className="text-sm">{error}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                </form>
            </CardContent>

            <CardFooter className="flex-col gap-2">
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    onClick={(e) => handleSubmit(e)}
                >
                    {isLoading ? "Creating account..." : "Sign up"}
                </Button>

                <Button variant="outline" className="w-full" type="button" disabled={isLoading}>
                    Continue with Google
                </Button>

                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="underline underline-offset-4">
                        Sign in
                    </Link>
                </div>

                <p className="text-center text-xs text-gray-500 mt-2">
                    By clicking continue, you agree to our{" "}
                    <button className="underline underline-offset-4">Terms of Service</button> and{" "}
                    <button className="underline underline-offset-4">Privacy Policy</button>
                </p>
            </CardFooter>
        </Card>
    );
};