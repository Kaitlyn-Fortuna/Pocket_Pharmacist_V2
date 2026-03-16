import React from "react";

export default function LoadingSkeleton({ variant = "result" }) {
  const SkeletonBar = ({ className }) => (
    <div className={`relative overflow-hidden rounded-md bg-muted ${className}`}>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
    </div>
  );

  if (variant === "result") {
    return (
      <div className="space-y-6 p-5">
        {/* Banner skeleton */}
        <SkeletonBar className="h-14 w-full rounded-xl" />
        {/* Drug name */}
        <div className="space-y-3">
          <SkeletonBar className="h-7 w-3/5" />
          <SkeletonBar className="h-4 w-full" />
          <SkeletonBar className="h-4 w-full" />
          <SkeletonBar className="h-4 w-4/5" />
        </div>
        {/* Interaction cards */}
        <div className="space-y-3 pt-2">
          <SkeletonBar className="h-5 w-2/5" />
          <SkeletonBar className="h-24 w-full rounded-xl" />
          <SkeletonBar className="h-24 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  // Medications list skeleton
  return (
    <div className="space-y-3 p-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <SkeletonBar className="h-12 flex-1 rounded-xl" />
          <SkeletonBar className="h-10 w-10 rounded-lg" />
        </div>
      ))}
    </div>
  );
}