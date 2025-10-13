import { memo } from 'react';

export const DNAIcon = memo(() => (
  <svg
    className="w-full h-full"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M30 20C30 20 70 40 70 50C70 60 30 80 30 80"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="animate-pulse"
    />
    <path
      d="M70 20C70 20 30 40 30 50C30 60 70 80 70 80"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="animate-pulse"
    />
    {[...Array(5)].map((_, i) => (
      <circle
        key={i}
        cx={i % 2 ? 70 : 30}
        cy={20 + i * 15}
        r="3"
        fill="currentColor"
        className="animate-bounce"
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </svg>
));

export const PulseIcon = memo(() => (
  <svg
    className="w-full h-full"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 50H30L40 20L50 80L60 50H90"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="animate-pulse"
    />
  </svg>
));

export const CellIcon = memo(() => (
  <svg
    className="w-full h-full"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="50"
      cy="50"
      r="40"
      stroke="currentColor"
      strokeWidth="2"
      className="animate-pulse"
    />
    <circle
      cx="50"
      cy="50"
      r="20"
      stroke="currentColor"
      strokeWidth="2"
      className="animate-ping"
    />
    {[...Array(8)].map((_, i) => {
      const angle = (i * Math.PI) / 4;
      const x = 50 + 30 * Math.cos(angle);
      const y = 50 + 30 * Math.sin(angle);
      return (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="3"
          fill="currentColor"
          className="animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      );
    })}
  </svg>
));

export const MicroscopeIcon = memo(() => (
  <svg
    className="w-full h-full"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M40 80H60M50 80V60M40 40L60 20M55 25L65 35"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle
      cx="45"
      cy="35"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      className="animate-pulse"
    />
  </svg>
));