import React from "react";
import Image from "next/image";

interface WeatherLevel {
  minScore: number;
  asset: string;
  label: string;
}

const WEATHER_LEVELS: WeatherLevel[] = [
  { minScore: 82, asset: "Level1_cropped_v2.png", label: "Level 1" },
  { minScore: 62, asset: "Level2_cropped_v2.png", label: "Level 2" },
  { minScore: 42, asset: "Level3_cropped_v2.png", label: "Level 3" },
  { minScore: 0,  asset: "Level4_cropped_v2.png", label: "Level 4" },
];

interface ScoreCardProps {
  totalScore: number;
  daysP: number;
  windowP: number;
  countP: number;
  intervalP: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  totalScore,
  daysP,
  windowP,
  countP,
  intervalP,
}) => {
  // Find matching weather level config based on totalScore
  const activeLevel =
    WEATHER_LEVELS.find((level) => totalScore >= level.minScore) ||
    WEATHER_LEVELS[WEATHER_LEVELS.length - 1];
  const activeAsset = activeLevel.asset;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex-1 flex flex-col">
      {/* Blue Score Container with Cropped Background */}
      <div className="relative w-full aspect-video overflow-hidden rounded-t-2xl flex-shrink-0">
        {/* Background Landscape / Skyline Illustration */}
        <Image
          src={`/${activeAsset}`}
          alt={`Campaign Score Skyline background - ${activeLevel.label}`}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          priority
          className="object-cover"
        />

        {/* Score overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-12 z-10">
          <span className="text-7xl font-bold text-white leading-none tracking-tighter">
            {totalScore}
          </span>
          <p className="text-xs font-semibold text-blue-100 tracking-wide mt-2">
            Campaign score
          </p>
        </div>
      </div>

      {/* Alert container if settings are not optimized (score <= 50) */}
      {totalScore <= 50 && (
        <div className="bg-blue-50 px-6 py-4 flex gap-3 border-b border-slate-100 flex-shrink-0">
          <span className="text-blue-600 font-bold text-lg leading-none">✦</span>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-blue-900">
              Your settings are not optimized!
            </h4>
            <p className="text-xs text-slate-500 leading-normal font-bold">
              Your settings may slow down your calling operations and campaign completion. We recommend fixing your settings.
            </p>
          </div>
        </div>
      )}

      {/* Penalty Rows List */}
      <div className="divide-y divide-slate-100 font-sans flex flex-col justify-center">
        {/* Penalty Row Component */}
        <div className="flex justify-between items-center py-4">
          <span className="text-sm font-semibold text-slate-600 px-8">
            Calling days penalty
          </span>
          <span className={`text-sm font-bold px-8 ${daysP > 0 ? "text-red-500" : "text-emerald-500"}`}>
            {daysP > 0 ? `-${daysP}` : "0"}
          </span>
        </div>

        <div className="flex justify-between items-center py-4">
          <span className="text-sm font-semibold text-slate-600 px-8">
            Calling window penalty
          </span>
          <span className={`text-sm font-bold px-8 ${windowP > 0 ? "text-red-500" : "text-emerald-500"}`}>
            {windowP > 0 ? `-${windowP}` : "0"}
          </span>
        </div>

        <div className="flex justify-between items-center py-4">
          <span className="text-sm font-semibold text-slate-600 px-8">
            Redial count penalty
          </span>
          <span className={`text-sm font-bold px-8 ${countP > 0 ? "text-red-500" : "text-emerald-500"}`}>
            {countP > 0 ? `-${countP}` : "0"}
          </span>
        </div>

        <div className="flex justify-between items-center py-4">
          <span className="text-sm font-semibold text-slate-600 px-8">
            Redial interval penalty
          </span>
          <span className={`text-sm font-bold px-8 ${intervalP > 0 ? "text-red-500" : "text-emerald-500"}`}>
            {intervalP > 0 ? `-${intervalP}` : "0"}
          </span>
        </div>
      </div>
    </div>
  );
};
