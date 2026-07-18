import React, { useRef } from "react";
import { useSlider } from "../hooks/useSlider";
import { SegmentedControl } from "./SegmentedControl";

const MAX_REDIAL_COUNT = 10;
const REDIAL_TICK_VALUES = [0, 2, 4, 6, 8, 10];
const INTERVAL_OPTIONS = ["3 hours", "6 hours", "9 hours", "12 hours", "24 hours"];

// Helper to compute layout percentage for slider positions
const getPercentage = (value: number, max: number): number => {
  return (value / max) * 100;
};

interface RedialCardProps {
  redialCount: number;
  setRedialCount: (count: number) => void;
  redialInterval: string;
  setRedialInterval: (interval: string) => void;
}

export const RedialCard: React.FC<RedialCardProps> = ({
  redialCount,
  setRedialCount,
  redialInterval,
  setRedialInterval,
}) => {
  const redialTrackRef = useRef<HTMLDivElement>(null);

  // Hook-encapsulated accessible slider handling
  const handleRedialPointerDown = useSlider(redialTrackRef, MAX_REDIAL_COUNT, setRedialCount);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setRedialCount(Math.min(MAX_REDIAL_COUNT, redialCount + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setRedialCount(Math.max(0, redialCount - 1));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex-1 flex flex-col">
      <div className="bg-slate-50 border-b border-slate-100 px-6 py-2">
        <h2 className="font-bold text-slate-800 text-base">Redial</h2>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-center">
        {/* Redial Count */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm mb-3">Redial count</h3>
          <div className="px-1 pt-2 pb-6">
            {/* Slider Container */}
            <div
              ref={redialTrackRef}
              onPointerDown={handleRedialPointerDown}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              role="slider"
              aria-valuemin={0}
              aria-valuemax={MAX_REDIAL_COUNT}
              aria-valuenow={redialCount}
              aria-label="Redial count"
              className="h-[6px] bg-slate-200 relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 rounded-full"
            >
              {/* Active Fill */}
              <div
                className="absolute h-full bg-slate-900 rounded-full"
                style={{
                  left: "0%",
                  right: `${100 - getPercentage(redialCount, MAX_REDIAL_COUNT)}%`,
                }}
              />

              {/* Tick Marks (0, 2, 4, 6, 8, 10) */}
              {REDIAL_TICK_VALUES.map((val) => (
                <div
                  key={val}
                  className={`absolute w-[1px] h-[6px] -top-[1.5px] transform -translate-x-1/2 ${
                    val <= redialCount ? "bg-slate-900" : "bg-slate-300"
                  }`}
                  style={{ left: `${getPercentage(val, MAX_REDIAL_COUNT)}%` }}
                />
              ))}
            </div>

            {/* Timeline Labels */}
            <div className="relative mt-4 h-6 text-xs font-semibold text-slate-400">
              {REDIAL_TICK_VALUES.map((val) => (
                <span
                  key={val}
                  onClick={() => setRedialCount(val)}
                  className={`absolute transform -translate-x-1/2 cursor-pointer hover:text-slate-800 transition-colors ${
                    val === redialCount ? "text-slate-700 font-bold" : "text-slate-400"
                  }`}
                  style={{ left: `${getPercentage(val, MAX_REDIAL_COUNT)}%` }}
                >
                  {val}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Redial Interval */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm mb-4">Redial interval</h3>
          <SegmentedControl
            options={INTERVAL_OPTIONS}
            selected={redialInterval}
            onChange={setRedialInterval}
            variant="tabs"
          />
        </div>
      </div>
    </div>
  );
};
