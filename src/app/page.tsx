"use client";

import React, { useState } from "react";
import { Day, getPenalties, ScoringParams } from "@/utils/scoring";
import { GuardrailsCard } from "@/components/GuardrailsCard";
import { RedialCard } from "@/components/RedialCard";
import { ScoreCard } from "@/components/ScoreCard";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-6 sm:px-12 pt-10 pb-20 flex-1 flex flex-col">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">
          Redial & Guardrails
        </h1>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column - Controls (Shadcn components) */}
          <div className="lg:col-span-6 space-y-8 flex flex-col">
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

          {/* Right Column - Score & Weather Widget */}
          <div className="lg:col-span-6 flex flex-col">
            <ScoreCard
              totalScore={totalScore}
              daysP={daysP}
              windowP={windowP}
              countP={countP}
              intervalP={intervalP}
            />
          </div>
        </div>
      </main>

      {/* Sticky Bottom Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 sm:px-12 mt-auto">
        <div className="max-w-7xl mx-auto w-full flex justify-end">
          <Button className="bg-[#525866] hover:bg-[#3A3E47] text-white font-semibold text-sm px-7 py-2.5 rounded-lg transition-colors cursor-pointer">
            Submit
          </Button>
        </div>
      </footer>
    </div>
  );
}
