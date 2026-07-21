import React from "react";
import Image from "next/image";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ScoreCardProps {
  totalScore: number;
  daysP: number;
  windowP: number;
  countP: number;
  intervalP: number;
}

const WEATHER_SVGS = [
  "/svgs/Frame 1533211488.svg",    // Level 1: Score 82 - 100
  "/svgs/Frame 1533211488(1).svg", // Level 2: Score 62 - 81
  "/svgs/Frame 1533211488(2).svg", // Level 3: Score 42 - 61
  "/svgs/Frame 1533211488(3).svg", // Level 4: Score 0 - 41
];

// Sky background colors per level — extracted from the exact fill values
// of the inner <g> element in each SVG file. The SVGs have transparent
// sky areas, so the container background shows through and must match.
const SKY_COLORS = [
  "#3478f5", // Level 1: from Frame 1533211488.svg <g fill="#3478f5">
  "#2a61c7", // Level 2: from Frame 1533211488(1).svg <g fill="#2a61c7">
  "#204da7", // Level 3: from Frame 1533211488(2).svg <g fill="#204da7">
  "#12367e", // Level 4: from Frame 1533211488(3).svg <g fill="#12367e">
];

export const ScoreCard: React.FC<ScoreCardProps> = ({
  totalScore,
  daysP,
  windowP,
  countP,
  intervalP,
}) => {
  // Determine active weather level index
  let activeLevelIndex = 0;
  if (totalScore >= 82) {
    activeLevelIndex = 0; // Level 1
  } else if (totalScore >= 62) {
    activeLevelIndex = 1; // Level 2
  } else if (totalScore >= 42) {
    activeLevelIndex = 2; // Level 3
  } else {
    activeLevelIndex = 3; // Level 4
  }

  return (
    <div className="bg-white  border border-slate-200/80 shadow-xs overflow-hidden flex-1 flex flex-col">
      {/* Weather Illustration Header with Stacked SVG Crossfade */}
      <div
        className="relative w-full aspect-[540/404] overflow-hidden  flex-shrink-0 transition-[background-color] duration-700 ease-in-out"
        style={{ backgroundColor: SKY_COLORS[activeLevelIndex] }}
      >
        {WEATHER_SVGS.map((svgPath, idx) => (
          <Image
            key={svgPath}
            src={svgPath}
            alt={`Weather condition level ${idx + 1}`}
            fill
            priority={idx === 0}
            sizes="(max-width: 768px) 100vw, 540px"
            className={`object-cover transition-opacity duration-700 ease-in-out pointer-events-none ${
              activeLevelIndex === idx ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Campaign Score overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-12 z-10 pointer-events-none">
          <span className="text-[76px] font-extrabold text-white leading-none tracking-tight drop-shadow-sm">
            {totalScore}
          </span>
          <p className="text-xs font-semibold text-white/90 tracking-wide mt-2">
            Campaign score
          </p>
        </div>
      </div>

      {/* Warning Alert Banner for Level 3 and Level 4 (score <= 61) */}
      {activeLevelIndex >= 2 && (
        <Alert className="flex-shrink-0">
          <span className="text-blue-600 font-bold text-sm leading-none mt-0.5 select-none">
            ✦
          </span>
          <div className="space-y-0.5">
            <AlertTitle>Your settings are not optimized!</AlertTitle>
            <AlertDescription>
              Your settings may slow down your calling operations and campaign completion. We recommend fixing your settings.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Penalty Rows List */}
      <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-center">
        {/* Calling Days Penalty */}
        <div className="flex justify-between items-center py-4 px-6">
          <span className="text-sm font-medium text-slate-600">
            Calling days penalty
          </span>
          <span
            className={`text-sm font-bold ${
              daysP > 0 ? "text-red-500" : "text-emerald-600"
            }`}
          >
            {daysP > 0 ? `-${daysP}` : "0"}
          </span>
        </div>

        {/* Calling Window Penalty */}
        <div className="flex justify-between items-center py-4 px-6">
          <span className="text-sm font-medium text-slate-600">
            Calling window penalty
          </span>
          <span
            className={`text-sm font-bold ${
              windowP > 0 ? "text-red-500" : "text-emerald-600"
            }`}
          >
            {windowP > 0 ? `-${windowP}` : "0"}
          </span>
        </div>

        {/* Redial Count Penalty */}
        <div className="flex justify-between items-center py-4 px-6">
          <span className="text-sm font-medium text-slate-600">
            Redial count penalty
          </span>
          <span
            className={`text-sm font-bold ${
              countP > 0 ? "text-red-500" : "text-emerald-600"
            }`}
          >
            {countP > 0 ? `-${countP}` : "0"}
          </span>
        </div>

        {/* Redial Interval Penalty */}
        <div className="flex justify-between items-center py-4 px-6">
          <span className="text-sm font-medium text-slate-600">
            Redial interval penalty
          </span>
          <span
            className={`text-sm font-bold ${
              intervalP > 0 ? "text-red-500" : "text-emerald-600"
            }`}
          >
            {intervalP > 0 ? `-${intervalP}` : "0"}
          </span>
        </div>
      </div>
    </div>
  );
};
