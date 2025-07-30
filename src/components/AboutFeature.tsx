import React, { ReactNode } from "react";

interface AboutFeatureProps {
  children: ReactNode;
}

const AboutFeature: React.FC<AboutFeatureProps> = ({ children }) => (
  <li className="flex gap-3 items-start text-gray-800">
    {/* Inline SVG for a check icon */}
    <svg className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.704 6.167a.75.75 0 0 1 0 1.06l-6.237 6.237a.75.75 0 0 1-1.06 0l-3.237-3.237a.75.75 0 0 1 1.06-1.06L9 11.183l5.707-5.706a.75.75 0 0 1 1.06 0z"
        clipRule="evenodd"
      />
    </svg>
    <span>{children}</span>
  </li>
);

export default AboutFeature;
