import React, { useRef } from "react";
import { Day } from "../utils/scoring";
import { useSlider } from "../hooks/useSlider";
import { SegmentedControl } from "./SegmentedControl";

const HOURS = ["8 AM", "11 AM", "2 PM", "5 PM", "9 PM"];
const MAX_WINDOW_INDEX = HOURS.length - 1;
const DAYS_OPTIONS: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Helper to compute layout percentage for slider positions
const getPercentage = (value: number, max: number): number => {
  return (value / max) * 100;
};

interface GuardrailsCardProps {
  callingDays: Day[];
  toggleDay: (day: Day) => void;
  windowEnd: number;
  setWindowEnd: (index: number) => void;
}

export const GuardrailsCard: React.FC<GuardrailsCardProps> = ({
  callingDays,
  toggleDay,
  windowEnd,
  setWindowEnd,
}) => {
  const windowTrackRef = useRef<HTMLDivElement>(null);

  // Hook-encapsulated accessible slider handling
  const handleWindowPointerDown = useSlider(windowTrackRef, MAX_WINDOW_INDEX, setWindowEnd);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setWindowEnd(Math.min(MAX_WINDOW_INDEX, windowEnd + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setWindowEnd(Math.max(0, windowEnd - 1));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex-1 flex flex-col">
      <div className="bg-slate-50 border-b border-slate-100 px-6 py-2">
        <h2 className="font-bold text-slate-800 text-base">Guardrails</h2>
      </div>
      <div className="p-6 space-y-10 flex-1 flex flex-col justify-center">
        {/* Calling Days */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm mb-4">Calling days</h3>
          <SegmentedControl
            options={DAYS_OPTIONS}
            selected={callingDays}
            onChange={toggleDay}
            isMulti
            variant="pills"
          />
        </div>

        {/* Calling Window */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm mb-3">Calling window</h3>
          <div className="px-1 pt-2 pb-6">
            {/* Slider Container */}
            <div
              ref={windowTrackRef}
              onPointerDown={handleWindowPointerDown}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              role="slider"
              aria-valuemin={0}
              aria-valuemax={MAX_WINDOW_INDEX}
              aria-valuenow={windowEnd}
              aria-valuetext={HOURS[windowEnd]}
              aria-label="Calling window end time"
              className="h-[6px] bg-slate-200 rounded-full relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              {/* Active Fill */}
              <div
                className="absolute h-full bg-slate-900 rounded-full"
                style={{
                  left: "0%",
                  right: `${100 - getPercentage(windowEnd, MAX_WINDOW_INDEX)}%`,
                }}
              />
            </div>

            {/* Timeline Labels */}
            <div className="relative mx-2 mt-4 h-6 text-xs font-semibold text-slate-400">
              {HOURS.map((hour, idx) => (
                <span
                  key={hour}
                  onClick={() => setWindowEnd(idx)}
                  className={`absolute transform -translate-x-1/2 whitespace-nowrap cursor-pointer hover:text-slate-800 transition-colors ${
                    idx <= windowEnd ? "text-slate-700" : "text-slate-400"
                  }`}
                  style={{ left: `${getPercentage(idx, MAX_WINDOW_INDEX)}%` }}
                >
                  {hour}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
