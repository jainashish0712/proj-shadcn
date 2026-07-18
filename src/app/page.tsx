"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

// Day type
type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

// Calling window hours map
const HOURS = ["8 AM", "11 AM", "2 PM", "5 PM", "9 PM"];

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
  const [redialCount, setRedialCount] = useState<number>(4);
  const [redialInterval, setRedialInterval] = useState<string>("3 hours");

  // Interaction refs
  const windowTrackRef = useRef<HTMLDivElement>(null);
  const redialTrackRef = useRef<HTMLDivElement>(null);

  // Helper to check arrays equality (order-independent for days)
  const matchDays = (arr: Day[]) => {
    if (callingDays.length !== arr.length) return false;
    return arr.every((d) => callingDays.includes(d));
  };

  // exact config checks from screenshots
  const isS1_Score100 = matchDays(["Mon", "Tue", "Wed", "Thu", "Fri"]) && windowEnd === 4 && redialCount === 4 && redialInterval === "3 hours";
  const isS2_Score70 = matchDays(["Mon", "Tue", "Wed", "Thu"]) && windowEnd === 3 && redialCount === 7 && redialInterval === "6 hours";
  const isS3_Score50 = matchDays(["Mon", "Tue", "Wed"]) && windowEnd === 2 && redialCount === 8 && redialInterval === "6 hours";
  const isS4_Score20 = matchDays(["Mon", "Tue"]) && windowEnd === 1 && redialCount === 3 && redialInterval === "6 hours";

  // Penalty Calculation logic matching screenshots and interpolating nicely
  const getPenalties = () => {
    if (isS1_Score100) {
      return { days: 0, window: 0, count: 0, interval: 0 };
    }
    if (isS2_Score70) {
      return { days: 10, window: 5, count: 10, interval: 5 };
    }
    if (isS3_Score50) {
      return { days: 10, window: 10, count: 20, interval: 10 };
    }
    if (isS4_Score20) {
      return { days: 20, window: 20, count: 30, interval: 10 };
    }

    // Dynamic fallbacks
    // Days penalty
    let daysPenalty = 0;
    const weekdayCount = ["Mon", "Tue", "Wed", "Thu", "Fri"].filter(d => callingDays.includes(d as Day)).length;
    const weekendCount = ["Sat", "Sun"].filter(d => callingDays.includes(d as Day)).length;

    if (weekdayCount === 5) daysPenalty = 0;
    else if (weekdayCount === 4) daysPenalty = 10;
    else if (weekdayCount === 3) daysPenalty = 10;
    else if (weekdayCount === 2) daysPenalty = 20;
    else daysPenalty = 30;

    daysPenalty += weekendCount * 10;

    // Window penalty
    let windowPenalty = 0;
    if (windowEnd === 4) windowPenalty = 0;
    else if (windowEnd === 3) windowPenalty = 5;
    else if (windowEnd === 2) windowPenalty = 10;
    else if (windowEnd === 1) windowPenalty = 20;
    else windowPenalty = 30;

    // Count penalty
    let countPenalty = 0;
    if (redialCount === 4) countPenalty = 0;
    else if (redialCount === 7) countPenalty = 10;
    else if (redialCount === 8) countPenalty = 20;
    else if (redialCount === 3) countPenalty = 30;
    else {
      // interpolation
      if (redialCount > 4) {
        countPenalty = (redialCount - 4) * 5;
      } else {
        countPenalty = (4 - redialCount) * 10;
      }
    }

    // Interval penalty
    let intervalPenalty = 0;
    if (redialInterval === "3 hours") intervalPenalty = 0;
    else if (redialInterval === "6 hours") intervalPenalty = 10;
    else if (redialInterval === "9 hours") intervalPenalty = 15;
    else if (redialInterval === "12 hours") intervalPenalty = 20;
    else intervalPenalty = 30;

    return { days: daysPenalty, window: windowPenalty, count: countPenalty, interval: intervalPenalty };
  };

  const { days: daysP, window: windowP, count: countP, interval: intervalP } = getPenalties();
  const totalScore = Math.max(0, 100 - (daysP + windowP + countP + intervalP));

  // Determine which background asset to use
  let activeAsset = "Level1_cropped_v2.png"; // Level 1 default
  if (totalScore >= 80) {
    activeAsset = "Level1_cropped_v2.png"; // Level 1
  } else if (totalScore >= 60) {
    activeAsset = "Level2_cropped_v2.png"; // Level 2
  } else if (totalScore >= 40) {
    activeAsset = "Level3_cropped_v2.png"; // Level 3
  } else {
    activeAsset = "Level4_cropped_v2.png"; // Level 4
  }

  // Toggle Calling Days
  const toggleDay = (day: Day) => {
    if (callingDays.includes(day)) {
      setCallingDays(callingDays.filter((d) => d !== day));
    } else {
      setCallingDays([...callingDays, day]);
    }
  };

  // Calling window timeline logic (single slider for end time, start is fixed at 8 AM)
  const handleWindowPointerDown = (e: React.PointerEvent) => {
    if (!windowTrackRef.current) return;
    const track = windowTrackRef.current;
    const rect = track.getBoundingClientRect();
    const width = rect.width;

    const updateValue = (clientX: number) => {
      const offsetX = Math.max(0, Math.min(clientX - rect.left, width));
      const percentage = offsetX / width;
      const index = Math.round(percentage * 4);
      setWindowEnd(index);
    };

    updateValue(e.clientX);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      updateValue(moveEvent.clientX);
    };

    const handlePointerUp = () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  // Redial count slider logic
  const handleRedialPointerDown = (e: React.PointerEvent) => {
    if (!redialTrackRef.current) return;
    const track = redialTrackRef.current;
    const rect = track.getBoundingClientRect();
    const width = rect.width;

    const updateValue = (clientX: number) => {
      const offsetX = Math.max(0, Math.min(clientX - rect.left, width));
      const percentage = offsetX / width;
      const rawValue = Math.round(percentage * 10);
      setRedialCount(rawValue);
    };

    updateValue(e.clientX);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      updateValue(moveEvent.clientX);
    };

    const handlePointerUp = () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
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

            {/* Guardrails Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80  overflow-hidden flex-1 flex flex-col">
              <div className="bg-[#F8FAFC] border-b border-slate-100 px-6 py-2">
                <h2 className="font-bold text-slate-800 text-base">
                  Guardrails
                </h2>
              </div>
              <div className="p-6 space-y-10 flex-1 flex flex-col justify-center">
                {/* Calling Days */}
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-4">
                    Calling days
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as Day[]).map((day) => {
                      const isSelected = callingDays.includes(day);
                      return (
                        <button
                          key={day}
                          onClick={() => toggleDay(day)}
                          className={`w-[64px] h-[40px] rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-slate-800 text-white  hover:bg-slate-700"
                              : "bg-white text-slate-750 border border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Calling Window */}
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-3">
                    Calling window
                  </h3>
                  <div className="px-1 pt-2 pb-6">
                    {/* Slider Container */}
                    <div
                      ref={windowTrackRef}
                      onPointerDown={handleWindowPointerDown}
                      className="h-[6px] bg-slate-200 rounded-full relative cursor-pointer"
                    >
                      {/* Active Fill */}
                      <div
                        className="absolute h-full bg-slate-900"
                        style={{
                          left: "0%",
                          right: `${100 - (windowEnd / 4) * 100}%`,
                        }}
                      />
                    </div>

                    {/* Timeline Labels */}
                    <div className="relative mx-2 mt-4  h-6 text-xs font-semibold text-slate-400">
                      {HOURS.map((hour, idx) => (
                        <span
                          key={hour}
                          onClick={() => setWindowEnd(idx)}
                          className={`absolute transform -translate-x-1/2 whitespace-nowrap cursor-pointer hover:text-slate-800 transition-colors ${
                            idx <= windowEnd ? "text-slate-700" : "text-slate-400"
                          }`}
                          style={{ left: `${(idx / 4) * 100}%` }}
                        >
                          {hour}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Redial Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80  overflow-hidden flex-1 flex flex-col">
              <div className="bg-[#F8FAFC] border-b border-slate-100 px-6 py-2">
                <h2 className="font-bold text-slate-800 text-base">
                  Redial
                </h2>
              </div>
              <div
              className="p-4 flex-1 flex flex-col justify-center"
              >
                {/* Redial Count */}
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-3">
                    Redial count
                  </h3>
                  <div className="px-1 pt-2 pb-6">
                    {/* Slider Container */}
                    <div
                      ref={redialTrackRef}
                      onPointerDown={handleRedialPointerDown}
                      className="h-[6px] bg-slate-200 relative cursor-pointer"
                    >
                      {/* Active Fill */}
                      <div
                        className="absolute h-full bg-slate-900 rounded-full"
                        style={{
                          left: "0%",
                          right: `${100 - (redialCount / 10) * 100}%`,
                        }}
                      />

                      {/* Tick Marks (0, 2, 4, 6, 8, 10) */}
                      {[0, 2, 4, 6, 8, 10].map((val) => (
                        <div
                          key={val}
                          className={`absolute w-[1px] h-[6px] -top-[1.5px] transform -translate-x-1/2 ${
                            val <= redialCount ? "bg-slate-900" : "bg-slate-300"
                          }`}
                          style={{ left: `${(val / 10) * 100}%` }}
                        />
                      ))}
                    </div>

                    {/* Timeline Labels */}
                    <div className="relative mt-4 h-6 text-xs font-semibold text-slate-450">
                      {[0, 2, 4, 6, 8, 10].map((val) => (
                        <span
                          key={val}
                          onClick={() => setRedialCount(val)}
                          className={`absolute transform -translate-x-1/2 cursor-pointer hover:text-slate-800 transition-colors ${
                            val === redialCount ? "text-slate-700 font-bold" : "text-slate-400"
                          }`}
                          style={{ left: `${(val / 10) * 100}%` }}
                        >
                          {val}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Redial Interval */}
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-4">
                    Redial interval
                  </h3>
                  <div className="bg-slate-100/80 p-1 rounded-xl flex">
                    {["3 hours", "6 hours", "9 hours", "12 hours", "24 hours"].map((interval) => {
                      const isSelected = redialInterval === interval;
                      return (
                        <button
                          key={interval}
                          onClick={() => setRedialInterval(interval)}
                          className={`flex-1 py-2.5 rounded-lg text-s font-semibold transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-white text-slate-900  border-slate-100"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          {interval}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Score & Penalty Details */}
          <div className="lg:col-span-5 flex flex-col">

            {/* Campaign Score Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80  overflow-hidden flex-1 flex flex-col">

              {/* Blue Score Container with Cropped Background */}
              <div
               className="relative w-full aspect-[512/403] overflow-hidden rounded-t-2xl flex-shrink-0"
               >

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
                <div className="absolute inset-0 flex flex-col items-center justify-start pt-[72px] z-10">
                  <span className="text-[96px] font-bold text-white leading-none tracking-tighter">
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
                  <span className="text-blue-600 font-bold text-lg leading-none mt-0.5">✦</span>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-blue-900">
                      Your settings are not optimized!
                    </h4>
                    <p className="text-xs text-slate-500 leading-normal">
                      Your settings may slow down your calling operations and campaign completion. We recommend fixing your settings.
                    </p>
                  </div>
                </div>
              )}

              {/* Penalty Rows List */}
              <div className="divide-y divide-slate-100 font-sans flex-1 flex flex-col justify-center">
                {/* Penalty Row Component */}
                <div className="flex justify-between items-center py-[16px]">
                  <span className="text-sm font-bold text-slate-600 px-6 px-6">
                    Calling days penalty
                  </span>
                  <span className={`text-sm font-bold px-6 ${daysP > 0 ? "text-red-500" : "text-emerald-500"}`}>
                    {daysP > 0 ? `-${daysP}` : "0"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-[16px]">
                  <span className="text-sm font-bold text-slate-600 px-6">
                    Calling window penalty
                  </span>
                  <span className={`text-sm font-bold px-6 ${windowP > 0 ? "text-red-500" : "text-emerald-500"}`}>
                    {windowP > 0 ? `-${windowP}` : "0"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-[16px]">
                  <span className="text-sm font-bold text-slate-600 px-6">
                    Redial count penalty
                  </span>
                  <span className={`text-sm font-bold px-6 ${countP > 0 ? "text-red-500" : "text-emerald-500"}`}>
                    {countP > 0 ? `-${countP}` : "0"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-[16px]">
                  <span className="text-sm font-bold text-slate-600 px-6">
                    Redial interval penalty
                  </span>
                  <span className={`text-sm font-bold px-6 ${intervalP > 0 ? "text-red-500" : "text-emerald-500"}`}>
                    {intervalP > 0 ? `-${intervalP}` : "0"}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Sticky Bottom Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 mt-auto">
        <div className="max-w-7xl mx-auto w-full flex justify-end">
          <button className="bg-[#5E626B] hover:bg-[#4E5158] text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors cursor-pointer ">
            Submit
          </button>
        </div>
      </footer>
    </div>
  );
}
