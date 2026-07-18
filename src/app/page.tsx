"use client";

import React, { useState } from "react";
import { Day, getPenalties } from "../utils/scoring";
import { GuardrailsCard } from "../components/GuardrailsCard";
import { RedialCard } from "../components/RedialCard";
import { ScoreCard } from "../components/ScoreCard";

export default function Home() {
  // State for Guardrails
  const [callingDays, setCallingDays] = useState<Day[]>([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ]);
  const [windowEnd, setWindowEnd] = useState<number>(4); // Default 9 PM (index 4)

  // State for Redial
  const [redialCount, setRedialCount] = useState<number>(5);
  const [redialInterval, setRedialInterval] = useState<string>("3 hours");

  const { days: daysP, window: windowP, count: countP, interval: intervalP } = getPenalties({
    callingDays,
    windowEnd,
    redialCount,
    redialInterval,
  });
  const totalScore = Math.max(0, 100 - (daysP + windowP + countP + intervalP));

  // Toggle Calling Days
  const toggleDay = (day: Day) => {
    if (callingDays.includes(day)) {
      setCallingDays(callingDays.filter((d) => d !== day));
    } else {
      setCallingDays([...callingDays, day]);
    }
  };

  return (
    <div className="flex-1 bg-[#F9FAFB] flex flex-col font-sans">
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
              callingDays={callingDays}
              toggleDay={toggleDay}
              windowEnd={windowEnd}
              setWindowEnd={setWindowEnd}
            />

            <RedialCard
              redialCount={redialCount}
              setRedialCount={setRedialCount}
              redialInterval={redialInterval}
              setRedialInterval={setRedialInterval}
            />
          </div>

          {/* Right Column - Score & Penalty Details */}
          <div className="lg:col-span-5 flex flex-col h-[95%]">
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
          <button className="bg-[#000] hover:bg-[#000] text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors cursor-pointer ">
            Submit
          </button>
        </div>
      </footer>
    </div>
  );
}
