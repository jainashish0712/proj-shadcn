import React from "react";
import Image from "next/image";

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
  // Determine which background asset to use based on thresholds
  let activeAsset = "Level1.png"; // Level 1 default
  if (totalScore >= 82) {
    activeAsset = "Level1.png"; // Level 1
  } else if (totalScore >= 62) {
    activeAsset = "Level2.png"; // Level 2
  } else if (totalScore >= 42) {
    activeAsset = "Level3.png"; // Level 3
  } else {
    activeAsset = "Level4.png"; // Level 4
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex-1 flex flex-col">
      {/* Blue Score Container with Cropped Background */}
      <div className="relative w-full aspect-[512/403] overflow-hidden rounded-t-2xl flex-shrink-0">
        {/* Background Landscape / Skyline Illustration */}
        <Image
          src={`/${activeAsset}`}
          alt="Campaign Score Skyline background"
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          priority
          className="object-cover"
        />

        {/* Score overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[52px] z-10">
          <span className="text-[76px] font-bold text-white leading-none tracking-tighter">
            {totalScore}
          </span>
          <p className="text-[13px] font-semibold text-blue-100/90 tracking-wide mt-2">
            Campaign score
          </p>
        </div>
      </div>

      {/* Alert container if settings are not optimized (score <= 50) */}
      {totalScore <= 50 && (
        <div className="bg-[#F0F7FF] px-6 py-4 flex gap-3 border-b border-slate-100 flex-shrink-0">
          <span className="text-blue-600 font-bold text-lg leading-none mt-[-2px]">✦</span>
          <div className="space-y-1">
            <h4 className="mx-[-4px] text-xs font-bold text-blue-900">
              Your settings are not optimized!
            </h4>
            <p className="text-xs text-slate-500 leading-normal font-bold mx-[-24px]">
              Your settings may slow down your calling operations and campaign completion. We recommend fixing your settings.
            </p>
          </div>
        </div>
      )}

      {/* Penalty Rows List */}
      <div className="divide-y divide-slate-100 font-sans flex flex-col justify-center">
        {/* Penalty Row Component */}
        <div className="flex justify-between items-center py-[16px]">
          <span className="text-sm font-semibold text-slate-600 px-8">
            Calling days penalty
          </span>
          <span className={`text-sm font-bold px-8 ${daysP > 0 ? "text-red-500" : "text-emerald-500"}`}>
            {daysP > 0 ? `-${daysP}` : "0"}
          </span>
        </div>

        <div className="flex justify-between items-center py-[16px]">
          <span className="text-sm font-semibold text-slate-600 px-8">
            Calling window penalty
          </span>
          <span className={`text-sm font-bold px-8 ${windowP > 0 ? "text-red-500" : "text-emerald-500"}`}>
            {windowP > 0 ? `-${windowP}` : "0"}
          </span>
        </div>

        <div className="flex justify-between items-center py-[16px]">
          <span className="text-sm font-semibold text-slate-600 px-8">
            Redial count penalty
          </span>
          <span className={`text-sm font-bold px-8 ${countP > 0 ? "text-red-500" : "text-emerald-500"}`}>
            {countP > 0 ? `-${countP}` : "0"}
          </span>
        </div>

        <div className="flex justify-between items-center py-[16px]">
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
