import React from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background font-inter">
      <main className="max-w-md mx-auto pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}