import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Camera, Pill, FileText, User } from "lucide-react";

const NAV_ITEMS = [
  { path: "/Capture", icon: Camera, label: "Scan" },
  { path: "/Medications", icon: Pill, label: "My Meds" },
  { path: "/Results", icon: FileText, label: "Results" },
  { path: "/Profile", icon: User, label: "Profile" },
];

const navWrap = {
  position: "fixed",
  bottom: "0px",
  left: "0px",
  right: "0px",
  zIndex: 2147483647, // max possible z-index
  backgroundColor: "#ffffff",
  borderTop: "2px solid #e2e8f0",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  height: "68px",
  boxShadow: "0 -2px 16px rgba(0,0,0,0.08)",
};

const btnStyle = (isActive) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "3px",
  padding: "6px 20px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  color: isActive ? "#16a34a" : "#94a3b8",
  fontFamily: "sans-serif",
  minWidth: "60px",
});

const iconWrap = (isActive) => ({
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  background: isActive ? "#dcfce7" : "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const labelStyle = (isActive) => ({
  fontSize: "11px",
  fontWeight: isActive ? "700" : "500",
  lineHeight: "1",
});

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div style={navWrap}>
      {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={btnStyle(isActive)}
          >
            <div style={iconWrap(isActive)}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} color={isActive ? "#16a34a" : "#94a3b8"} />
            </div>
            <span style={labelStyle(isActive)}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}