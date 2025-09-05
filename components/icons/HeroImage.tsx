import React from 'react';

const HeroImage: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g transform="translate(50, 50) scale(0.9)">
            <path d="M 0 -45 L 0 40" stroke="#6b7280" strokeWidth="3" fill="none" />
            <path d="M -40 -35 L 40 -35" stroke="#6b7280" strokeWidth="3" fill="none" />
            
            <path d="M -30 -35 L -30 -25" stroke="#a5b4fc" strokeWidth="2" fill="none" />
            <path d="M 30 -35 L 30 -25" stroke="#a5b4fc" strokeWidth="2" fill="none" />
            
            <path d="M -40 -15 C -40 5, -20 5, -20 -15" stroke="#4f46e5" strokeWidth="3" fill="none" />
            <path d="M 20 -15 C 20 5, 40 5, 40 -15" stroke="#4f46e5" strokeWidth="3" fill="none" />
            
            <circle cx="0" cy="-35" r="3" fill="#6b7280" />
            <circle cx="-40" cy="-35" r="3" fill="#6b7280" />
            <circle cx="40" cy="-35" r="3" fill="#6b7280" />
            <circle cx="0" cy="45" r="8" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2"/>
            <circle cx="0" cy="45" r="2" fill="#4f46e5" />
        </g>
    </svg>
);

export default HeroImage;