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
import { useSignUp } from "@clerk/clerk-react";
import { ArrowRight, CheckCircle2, Loader2, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../../../public/Screenshot_2025-12-27_164922-removebg-preview.png';

export const Register = () => {
    const navigate = useNavigate();
    const { signUp, setActive, isLoaded } = useSignUp();
    const [isLoading, setIsLoading] = useState(false);
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isLoaded) {
            showToast.error("Loading...", "Please wait a moment");
            return;
        }

        const { firstName, lastName, email, password, confirmPassword } = formData;

        // Validation
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            showToast.error("All fields are required", "Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            showToast.error("Passwords don't match", "Please ensure both passwords are identical");
            return;
        }

        if (password.length < 8) {
            showToast.error("Password too short", "Password must be at least 8 characters long");
            return;
        }

        setIsLoading(true);

        try {
            await signUp.create({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                emailAddress: email.trim(),
                password,
            });

            // Send email verification code
            await signUp.prepareEmailAddressVerification({
                strategy: "email_code"
            });

            setPendingVerification(true);
            showToast.success("Verification code sent", "Please check your email");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Registration error:", err);

            let errorMessage = "Registration failed";

            if (err?.errors?.[0]?.message) {
                errorMessage = err.errors[0].message;
            } else if (err?.message) {
                errorMessage = err.message;
            }

            showToast.error("Registration failed", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerification = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isLoaded || !code) {
            showToast.error("Invalid code", "Please enter the verification code");
            return;
        }

        setIsLoading(true);

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status === "complete") {
                await setActive({ session: completeSignUp.createdSessionId });

                showToast.success("Account created!", "Welcome to the platform");
                navigate("/home", { replace: true });
            } else {
                console.log("Verification incomplete:", completeSignUp);
                showToast.error("Verification failed", "Please try again");
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Verification error:", err);

            let errorMessage = "Invalid verification code";

            if (err?.errors?.[0]?.message) {
                errorMessage = err.errors[0].message;
            } else if (err?.message) {
                errorMessage = err.message;
            }

            showToast.error("Verification failed", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (pendingVerification) {
        return (
            <Card className="w-full min-w-[400px] max-w-md border-0 shadow-none bg-transparent">
                <CardHeader className="space-y-1 pb-4">
                    <div className="flex items-center justify-center mx-auto rounded-lg bg-transparent border-slate-200 dark:border-slate-800">
                        <CheckCircle2 className="w-12 h-12 text-slate-900 dark:text-slate-50" />
                    </div>
                    <CardTitle className="text-2xl font-semibold text-center text-slate-900 dark:text-slate-50">
                        Verify your email
                    </CardTitle>
                    <CardDescription className="text-center text-sm text-slate-600 dark:text-slate-400">
                        We've sent a verification code to {formData.email}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleVerification} className="space-y-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="code"
                                className="text-sm font-medium text-slate-700 dark:text-slate-300"
                            >
                                Verification code
                            </Label>
                            <Input
                                id="code"
                                type="text"
                                placeholder="Enter 6-digit code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                disabled={isLoading}
                                required
                                maxLength={6}
                                className="h-10 text-center text-lg tracking-widest border border-slate-200 bg-transparent focus:border-slate-900 focus:ring-1 focus:ring-slate-900 dark:border-slate-800 dark:bg-transparent dark:focus:border-slate-50 dark:focus:ring-slate-50"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-10 mt-2 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors"
                            disabled={isLoading || !code}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify email"
                            )}
                        </Button>
                        <div className="text-center text-xs text-slate-600 dark:text-slate-400">
                            Didn't receive the code?{" "}
                            <button
                                type="button"
                                onClick={() => signUp?.prepareEmailAddressVerification({ strategy: "email_code" })}
                                className="font-medium text-slate-900 hover:text-slate-700 dark:text-slate-50 dark:hover:text-slate-300"
                            >
                                Resend
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full min-w-[400px] max-w-md border-0 shadow-none bg-transparent">
            <CardHeader className="space-y-1 pb-4">
                <div className="flex items-center justify-center mx-auto rounded-lg bg-transparent border-slate-200 dark:border-slate-800">
                    <img src={logo} width={60} height={100} alt="boardy" />
                </div>
                <CardTitle className="text-2xl font-semibold text-center text-slate-900 dark:text-slate-50">
                    Create account
                </CardTitle>
                <CardDescription className="text-center text-sm text-slate-600 dark:text-zinc-400">
                    Sign up to get started with your account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="firstName"
                                className="text-sm font-medium text-slate-700 dark:text-slate-200"
                            >
                                First name
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-200" />
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    required
                                    className="h-10 pl-10 "
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="lastName"
                                className="text-sm font-medium text-slate-700 dark:text-slate-200"
                            >
                                Last name
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-200" />
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    required
                                    className="h-10 pl-10 "
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="email"
                            className="text-sm font-medium text-slate-700 dark:text-slate-200"
                        >
                            Email address
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-200" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                                required
                                className="h-10 pl-10 "
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="password"
                            className="text-sm font-medium text-slate-700 dark:text-slate-200"
                        >
                            Password
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-200" />
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="At least 8 characters"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                                required
                                className="h-10 pl-10 "
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="confirmPassword"
                            className="text-sm font-medium text-slate-700 dark:text-slate-200"
                        >
                            Confirm password
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-200" />
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                                required
                                className="h-10 pl-10 "
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-10 mt-2 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors"
                        disabled={isLoading || !isLoaded}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            "Create account"
                        )}
                    </Button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200 dark:border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-transparent px-2 text-slate-500 dark:text-slate-200">
                            Already have an account?
                        </span>
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-1 text-sm font-medium text-slate-900 hover:text-slate-700 dark:text-slate-50 dark:hover:text-slate-300 transition-colors"
                    >
                        Sign in instead
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};