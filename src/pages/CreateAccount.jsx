import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Eye, EyeOff, Lock, Mail, User, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function CreateAccount() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setIsLoading(true);

    try {
      // Check existing users in users.json
      const response = await fetch('/entities/users.json');
      let existingUsers = [];
      if (response.ok) {
        existingUsers = await response.json();
      }

      // Check if email already exists in users.json
      const emailExistsInJson = existingUsers.some(user => user.email.toLowerCase() === email.toLowerCase().trim());
      if (emailExistsInJson) {
        setError("An account with that email already exists.");
        setIsLoading(false);
        return;
      }

      // Check localStorage users
      const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
      const emailExistsInLocal = localUsers.some(user => user.email.toLowerCase() === email.toLowerCase().trim());
      if (emailExistsInLocal) {
        setError("An account with that email already exists.");
        setIsLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        email: email.toLowerCase().trim(),
        password_hash: btoa(password),
        role: "user",
        full_name: fullName.trim(),
      };

      // Add to localStorage
      localUsers.push(newUser);
      localStorage.setItem('localUsers', JSON.stringify(localUsers));

      setIsLoading(false);
      setSuccess(true);

      setTimeout(() => navigate("/SignIn"), 2000);
    } catch (err) {
      setError("Failed to create account. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-primary/90 to-primary pt-16 pb-12 px-6 text-primary-foreground overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center"
        >
           <div className="h-16 w-24 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
            <img
              src="pocket-pharmacist.png"
              alt="Pocket Pharmacist"
              className="w-24 h-24 rounded-full"
            />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">Create Account</h1>
          <p className="text-primary-foreground/80 text-sm">Join Pocket Pharmacist today</p>
        </motion.div>
      </div>

      {/* Form */}
      <div className="px-6 pt-6 flex-1 space-y-3">
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-12 text-center gap-4"
          >
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Account Created!</h2>
            <p className="text-sm text-muted-foreground">Redirecting you to sign in...</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleCreate}
            className="space-y-3"
          >
            {error && (
              <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full h-12 rounded-xl border border-input bg-card text-sm pl-10 pr-4 outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 rounded-xl border border-input bg-card text-sm pl-10 pr-4 outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 rounded-xl border border-input bg-card text-sm pl-10 pr-11 outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full h-12 rounded-xl border border-input bg-card text-sm pl-10 pr-4 outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full h-12 rounded-xl text-sm font-semibold bg-primary hover:bg-primary/90"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            <button
              type="button"
              onClick={() => navigate("/SignIn")}
              className="w-full text-sm text-muted-foreground hover:text-foreground text-center transition-colors py-1"
            >
              ← Back to Sign In
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
}