import React from 'react';

export const BrandLogo: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width={size}
    height={size}
    fill="none"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <defs>
      <linearGradient
        id="hc-logo-bg"
        x1="0"
        y1="0"
        x2="64"
        y2="64"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#1E3A5F" />
        <stop offset="100%" stopColor="#0F2440" />
      </linearGradient>
      <linearGradient
        id="hc-logo-roof"
        x1="12"
        y1="14"
        x2="52"
        y2="34"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#E35D33" />
        <stop offset="100%" stopColor="#C84B24" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="15" fill="url(#hc-logo-bg)" />
    <path
      d="M16 14V50M32 14V50M48 14V50M14 32H50M14 44H50"
      stroke="#FFFFFF"
      strokeOpacity="0.09"
      strokeWidth="1"
    />
    <path
      d="M13 31L32 14.5L51 31"
      stroke="url(#hc-logo-roof)"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 31.5V47.5H45V31.5"
      stroke="#FFFFFF"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M26 47.5V42.5M32 47.5V40M38 47.5V42.5"
      stroke="#F59E7A"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <circle cx="32" cy="27" r="2.6" fill="#FFFFFF" />
  </svg>
);
