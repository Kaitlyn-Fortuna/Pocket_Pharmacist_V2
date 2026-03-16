import React, { useEffect, useState } from "react";
import { Zap, ShieldCheck, ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const features = [
  { icon: "📷", text: "Scan any pill bottle instantly" },
  { icon: "⚠️", text: "Real-time interaction warnings" },
  { icon: "💊", text: "Track all your medications" },
];

export default function SignIn() {
  // Defaulted to true to show the login form immediately since external auth is removed
  const [showManual, setShowManual] = useState(true); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [logoSrc, setLogoSrc] = useState("/pocket-pharmacist.gif");

  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const handleTestLogin = () => { //THIS IS THE TEST USER LOGIN, REMOVE BEFORE SUBMITTING
  const testUser = {
    id: "test123",
    name: "Test User",
    email: "test@test.com"
  };      
localStorage.setItem("user", JSON.stringify(testUser));
    window.location.href = "/Capture";
  };      //END OF SECTION 1 HERE, REMOVE BEFORE SUBMITTING

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Fetch the data from your entities folder
      // Note: This file must be in your 'public' folder to be fetchable this way
      const response = await fetch('/entities/users.json'); 
      
      if (!response.ok) {
        throw new Error("Could not load login records.");
      }

      const jsonUsers = await response.json();

      // 2. Get users from localStorage
      const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');

      // 3. Combine users
      const users = [...jsonUsers, ...localUsers];

      // 4. Find the user
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase().trim()
      );

      // 5. Check password (using your base64 logic from the code)
      if (user && user.password_hash === btoa(password)) {
        // Success!
        localStorage.setItem("pp_user", JSON.stringify({ 
          email: user.email, 
          role: user.role, 
          full_name: user.full_name 
        }));
        navigate("/Capture");
      } else {
        // Fail
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError("Login failed. Please ensure the records file exists.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLogoSrc("pocket-pharmacist.png");
    }, 1800); 

    return () => clearTimeout(timeout);
  }, []);


  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Hero gradient */}
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
              src={logoSrc}
              alt="Pocket Pharmacist"
              className="w-24 h-24 rounded-full"
            />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight mb-1">Pocket Pharmacist</h1>
          <p className="text-primary-foreground/80 text-sm">
            AI-powered medication safety at your fingertips
          </p>
        </motion.div>
      </div>

      {/* Feature list */}
      <div className="px-6 mt-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border shadow-sm p-4 space-y-2.5"
        >
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xl">{f.icon}</span>
              <p className="text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Auth section */}
      <div className="px-6 flex-1 space-y-3">
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleManualLogin}
          className="space-y-3"
        >
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
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full h-12 rounded-xl text-sm font-semibold bg-primary hover:bg-primary/90"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
          
           {/* SECTION 2 OF TEST USER LOGIN, REMOVE BEFORE SUBMITTING */}
          <button onClick={handleTestLogin}>
            Continue as Test User
          </button> {/* REMOVE BEFORE SUBMITTING */}  


          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              className="w-full text-sm text-primary font-medium hover:underline text-center"
            >
              Forgot password?
            </button>
            <button
              type="button"
              className="w-full text-sm text-muted-foreground hover:text-foreground text-center transition-colors"
              onClick={() => navigate("/CreateAccount")}  
            >
              Don't have an account? Sign up
            </button>
          </div>
        </motion.form>

        <p className="text-center text-xs text-muted-foreground pb-8 pt-6">
          Secure encrypted connection · Your data is encrypted at rest
        </p>
      </div>
    </div>
  );
}