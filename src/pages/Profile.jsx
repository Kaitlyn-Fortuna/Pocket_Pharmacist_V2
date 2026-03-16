const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("pp_user");
    navigate("/SignIn");
  };

  useEffect(() => {
    const loadUser = async () => {
      const stored = JSON.parse(localStorage.getItem("pp_user") || "null");
      if (!stored?.email) {
        setIsLoading(false);
        return;
      }

      const response = await fetch("/entities/users.json");
      const jsonUsers = response.ok ? await response.json() : [];
      const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");

      const allUsers = [...jsonUsers, ...localUsers];
      const found = allUsers.find(
        (u) => u.email.toLowerCase() === stored.email.toLowerCase()
      );

      setUser(found ?? stored);
      setIsLoading(false);
    };

    loadUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Profile</h1>
            <p className="text-xs text-muted-foreground">Your account details</p>
          </div>
        </div>
      </div>

      {/* Avatar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-6"
      >
        <div className="h-20 w-20 rounded-full bg-primary/15 flex items-center justify-center mb-3">
          <span className="text-3xl font-bold text-primary">
            {(user?.full_name || user?.email || "?")[0].toUpperCase()}
          </span>
        </div>
        <p className="font-semibold text-foreground text-lg">{user?.full_name || "—"}</p>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
      </motion.div>

      {/* Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-4 mb-4"
      >
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account Info</p>

        {/* Full Name */}
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Full Name</p>
            <p className="text-sm font-medium text-foreground">{user?.full_name || "—"}</p>
          </div>
        </div>

        {/* Email (read-only) */}
        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Email</p>
            <p className="text-sm font-medium text-foreground">{user?.email || "—"}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Phone</p>
            <p className="text-sm font-medium text-foreground">{user?.phone_number || "—"}</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Location</p>
            <p className="text-sm font-medium text-foreground">{user?.location || "—"}</p>
          </div>
        </div>

      </motion.div>

      {/* Sign Out */}
      <Button
        variant="outline"
        className="w-full h-11 rounded-xl text-destructive border-destructive/30 hover:bg-destructive/5 gap-2"
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </Button>
    </div>
  );
}