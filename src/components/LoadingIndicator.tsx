import { useEffect, useState } from "react";

const LoadingIndicator = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide loading indicator after page load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background animate-fade-out">
      <div className="text-center">
        {/* Milk bottle animation */}
        <div className="relative w-24 h-32 mx-auto mb-4">
          <svg
            viewBox="0 0 100 140"
            className="w-full h-full animate-bounce-in"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Bottle body */}
            <path
              d="M30 35 L30 120 Q30 130 40 130 L60 130 Q70 130 70 120 L70 35 Z"
              fill="hsl(var(--primary))"
              opacity="0.2"
              className="animate-pulse"
            />
            {/* Bottle neck */}
            <rect
              x="40"
              y="20"
              width="20"
              height="15"
              fill="hsl(var(--primary))"
              opacity="0.3"
            />
            {/* Bottle cap */}
            <rect
              x="38"
              y="15"
              width="24"
              height="8"
              rx="2"
              fill="hsl(var(--secondary))"
              className="animate-pulse"
            />
            {/* Milk level - animated */}
            <path
              d="M32 80 L32 120 Q32 128 40 128 L60 128 Q68 128 68 120 L68 80 Z"
              fill="hsl(var(--primary))"
              opacity="0.6"
              className="animate-[slideUp_1.5s_ease-in-out_infinite]"
            />
            {/* Milk waves */}
            <path
              d="M32 80 Q40 75 50 80 T68 80"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              fill="none"
              opacity="0.8"
              className="animate-pulse"
            />
          </svg>
        </div>
        
        {/* Loading text */}
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-xl font-semibold text-primary">
            African Joy Dairy
          </h2>
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-primary rounded-full animate-[bounce_1s_ease-in-out_0s_infinite]"></span>
            <span className="w-2 h-2 bg-primary rounded-full animate-[bounce_1s_ease-in-out_0.2s_infinite]"></span>
            <span className="w-2 h-2 bg-primary rounded-full animate-[bounce_1s_ease-in-out_0.4s_infinite]"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
