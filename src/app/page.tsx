"use client";

import React, { useState } from "react";
import { Day, getPenalties, ScoringParams } from "../utils/scoring";
import { GuardrailsCard } from "../components/GuardrailsCard";
import { RedialCard } from "../components/RedialCard";
import { ScoreCard } from "../components/ScoreCard";

export default function Home() {
  // Unified state for all scoring configuration parameters
  const [settings, setSettings] = useState<ScoringParams>({
    callingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    windowEnd: 4, // Default 9 PM (index 4)
    redialCount: 5,
    redialInterval: "3 hours",
  });

  const { days: daysP, window: windowP, count: countP, interval: intervalP } = getPenalties(settings);
  const totalScore = Math.max(0, 100 - (daysP + windowP + countP + intervalP));

  // Toggle Calling Days using early return (guard clause pattern)
  const toggleDay = (day: Day) => {
    setSettings((prev) => {
      const isSelected = prev.callingDays.includes(day);
      if (isSelected) {
        return {
          ...prev,
          callingDays: prev.callingDays.filter((d) => d !== day),
        };
      }
      return {
        ...prev,
        callingDays: [...prev.callingDays, day],
      };
    });
  };

  const setWindowEnd = (windowEnd: number) => {
    setSettings((prev) => ({ ...prev, windowEnd }));
  };

  const setRedialCount = (redialCount: number) => {
    setSettings((prev) => ({ ...prev, redialCount }));
  };

  const setRedialInterval = (redialInterval: string) => {
    setSettings((prev) => ({ ...prev, redialInterval }));
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col font-sans">
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-12 pt-12 pb-24 flex-1 flex flex-col">
        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-8">
          Redial & Guardrails
        </h1>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column - Controls */}
          <div className="lg:col-span-6 space-y-12 flex flex-col">
            <GuardrailsCard
              callingDays={settings.callingDays}
              toggleDay={toggleDay}
              windowEnd={settings.windowEnd}
              setWindowEnd={setWindowEnd}
            />

            <RedialCard
              redialCount={settings.redialCount}
              setRedialCount={setRedialCount}
              redialInterval={settings.redialInterval}
              setRedialInterval={setRedialInterval}
            />
          </div>

          {/* Right Column - Score & Penalty Details */}
          <div className="lg:col-span-5 flex flex-col">
            <ScoreCard
              totalScore={totalScore}
              daysP={daysP}
              windowP={windowP}
              countP={countP}
              intervalP={intervalP}
            />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 mt-auto">
        <div className="max-w-7xl mx-auto w-full flex justify-end">
          <button className="bg-black hover:bg-slate-900 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors cursor-pointer ">
            Submit
          </button>
        </div>
      </footer>
    </div>
  );
}
