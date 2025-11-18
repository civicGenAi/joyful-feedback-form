import { useEffect, useState } from "react";
import AfricanJoyLogo from "./AfricanJoyLogo";

interface LoadingIndicatorProps {
  message?: string;
  autoHide?: boolean;
  duration?: number;
}

const LoadingIndicator = ({
  message = "Loading...",
  autoHide = true,
  duration = 1500
}: LoadingIndicatorProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!autoHide) return;

    // Start exit animation
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 300);

    // Hide loading indicator
    const hideTimer = setTimeout(() => {
      setIsLoading(false);
    }, duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, [autoHide, duration]);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 backdrop-blur-sm transition-opacity duration-300 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        {/* Modern circular loader with company logo */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin"></div>

          {/* Middle pulsing ring */}
          <div className="absolute inset-2 rounded-full border-2 border-primary/30 animate-pulse"></div>

          {/* African Joy Dairy Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AfricanJoyLogo variant="icon" className="w-20 h-20 animate-bounce-in" />
          </div>
        </div>

        {/* Brand name with elegant animation */}
        <div className="space-y-2 animate-fade-in">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            African Joy Dairy
          </h2>

          {/* Loading message */}
          <p className="text-sm text-muted-foreground font-medium">
            {message}
          </p>

          {/* Modern dot loader */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            <span className="w-2.5 h-2.5 bg-primary rounded-full animate-[bounce_1.4s_ease-in-out_0s_infinite]"></span>
            <span className="w-2.5 h-2.5 bg-primary rounded-full animate-[bounce_1.4s_ease-in-out_0.2s_infinite]"></span>
            <span className="w-2.5 h-2.5 bg-primary rounded-full animate-[bounce_1.4s_ease-in-out_0.4s_infinite]"></span>
          </div>
        </div>

        {/* Subtle shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-[shimmer_2s_ease-in-out_infinite] pointer-events-none"></div>
      </div>
    </div>
  );
};

// Reusable inline loader for buttons and small areas
export const InlineLoader = ({
  size = "md",
  className = ""
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3"
  };

  return (
    <div className={`inline-block ${sizeClasses[size]} border-primary/30 border-t-primary rounded-full animate-spin ${className}`}></div>
  );
};

export default LoadingIndicator;
