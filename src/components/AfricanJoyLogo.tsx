interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'white';
}

const AfricanJoyLogo = ({ className = '', variant = 'full' }: LogoProps) => {
  if (variant === 'icon') {
    // Icon-only version for smaller spaces
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Circular background */}
        <circle cx="50" cy="50" r="48" fill="#377536" />

        {/* Milk drop/leaf shape */}
        <path
          d="M50 20 C35 20, 30 35, 30 45 C30 60, 40 70, 50 75 C60 70, 70 60, 70 45 C70 35, 65 20, 50 20Z"
          fill="white"
        />

        {/* Inner detail */}
        <ellipse cx="50" cy="45" rx="10" ry="15" fill="#377536" opacity="0.3" />

        {/* Bottom accent */}
        <path
          d="M40 75 Q50 80, 60 75"
          stroke="#E9242B"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === 'white') {
    // White version for dark backgrounds
    return (
      <svg
        viewBox="0 0 200 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Icon */}
        <circle cx="40" cy="40" r="35" fill="white" fillOpacity="0.2" />
        <path
          d="M40 15 C28 15, 24 27, 24 35 C24 47, 32 55, 40 59 C48 55, 56 47, 56 35 C56 27, 52 15, 40 15Z"
          fill="white"
        />
        <ellipse cx="40" cy="35" rx="7" ry="11" fill="white" fillOpacity="0.3" />

        {/* Text */}
        <text x="85" y="35" fill="white" fontSize="18" fontWeight="bold" fontFamily="Arial, sans-serif">
          African Joy
        </text>
        <text x="85" y="52" fill="white" fontSize="14" fontFamily="Arial, sans-serif" opacity="0.9">
          Dairy
        </text>
      </svg>
    );
  }

  // Full color version
  return (
    <svg
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Icon with circular background */}
      <circle cx="40" cy="40" r="35" fill="#377536" />

      {/* Milk drop/leaf shape */}
      <path
        d="M40 15 C28 15, 24 27, 24 35 C24 47, 32 55, 40 59 C48 55, 56 47, 56 35 C56 27, 52 15, 40 15Z"
        fill="white"
      />

      {/* Inner detail */}
      <ellipse cx="40" cy="35" rx="7" ry="11" fill="#377536" opacity="0.3" />

      {/* Bottom accent */}
      <path
        d="M32 59 Q40 63, 48 59"
        stroke="#E9242B"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Company name */}
      <text x="85" y="35" fill="#377536" fontSize="18" fontWeight="bold" fontFamily="Arial, sans-serif">
        African Joy
      </text>
      <text x="85" y="52" fill="#377536" fontSize="14" fontFamily="Arial, sans-serif">
        Dairy
      </text>
    </svg>
  );
};

export default AfricanJoyLogo;
