import { useEffect, useState } from "react";

interface SpeedometerGaugeProps {
  score: number; // 0-100
}

const SpeedometerGauge = ({ score }: SpeedometerGaugeProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  // Angle: -90 (left) to 90 (right), total 180 degrees
  const angle = -90 + (animatedScore / 100) * 180;

  const getColor = (s: number) => {
    if (s < 40) return "hsl(0 84% 60%)"; // red
    if (s < 70) return "hsl(30 90% 50%)"; // orange
    return "hsl(160 84% 39%)"; // green (accent)
  };

  const getLabel = (s: number) => {
    if (s < 40) return "Needs Work";
    if (s < 70) return "Getting There";
    return "ATS Ready!";
  };

  const color = getColor(animatedScore);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-64 h-40">
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Red zone */}
        <path
          d="M 20 100 A 80 80 0 0 1 60 32"
          fill="none"
          stroke="hsl(0 84% 60% / 0.3)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Orange zone */}
        <path
          d="M 60 32 A 80 80 0 0 1 140 32"
          fill="none"
          stroke="hsl(30 90% 50% / 0.3)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Green zone */}
        <path
          d="M 140 32 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="hsl(160 84% 39% / 0.3)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Needle */}
        <g
          transform={`rotate(${angle}, 100, 100)`}
          style={{ transition: "transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        >
          <line x1="100" y1="100" x2="100" y2="30" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="100" r="6" fill={color} />
        </g>
        {/* Center dot */}
        <circle cx="100" cy="100" r="3" fill="hsl(var(--foreground))" />
        {/* Labels */}
        <text x="20" y="115" className="text-[8px]" fill="hsl(0 84% 60%)" fontWeight="600">0</text>
        <text x="94" y="18" className="text-[8px]" fill="hsl(30 90% 50%)" fontWeight="600">50</text>
        <text x="172" y="115" className="text-[8px]" fill="hsl(160 84% 39%)" fontWeight="600">100</text>
      </svg>
      <div className="text-center -mt-2">
        <span className="text-5xl font-extrabold" style={{ color }}>{animatedScore}</span>
        <span className="text-lg text-muted-foreground font-medium">/100</span>
      </div>
      <p className="text-sm font-semibold mt-1" style={{ color }}>{getLabel(animatedScore)}</p>
    </div>
  );
};

export default SpeedometerGauge;
