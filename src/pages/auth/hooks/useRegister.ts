import { useState } from "react";

export const useRegister = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (!fullName || !email || !password || !confirmPassword) {
        setError("Please fill in all fields");
      } else if (password !== confirmPassword) {
        setError("Passwords do not match");
      } else if (password.length < 8) {
        setError("Password must be at least 8 characters");
      } else {
        console.log("Registration successful", { fullName, email, password });
      }
      setIsLoading(false);
    }, 1000);
  };

  return {
    fullName,
    email,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    error,
    isLoading,

    setFullName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    handleSubmit,
  };
};
