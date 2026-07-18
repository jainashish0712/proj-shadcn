import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Day } from "@/utils/scoring";

const HOURS = ["8 AM", "11 AM", "2 PM", "5 PM", "9 PM"];

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
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex-1 flex flex-col">
      <div className="bg-[#F8FAFC] border-b border-slate-100 px-6 py-2">
        <h2 className="font-bold text-slate-800 text-base">Guardrails</h2>
      </div>
      <div className="p-6 space-y-10 flex-1 flex flex-col justify-center">
        {/* Calling Days */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm mb-4">Calling days</h3>
          <div className="flex flex-wrap gap-2">
            {(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as Day[]).map((day) => {
              const isSelected = callingDays.includes(day);
              return (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`w-[64px] h-[40px] rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-slate-800 text-white hover:bg-slate-700"
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
          <h3 className="font-bold text-slate-900 text-sm mb-3">Calling window</h3>
          <div className="px-1 pt-2 pb-6">
            {/* Radix UI Standard Slider matching original styling */}
            <SliderPrimitive.Root
              value={[windowEnd]}
              onValueChange={(val) => setWindowEnd(val[0])}
              max={4}
              step={1}
              className="relative flex items-center select-none touch-none w-full h-[6px] bg-slate-200 rounded-full cursor-pointer"
            >
              <SliderPrimitive.Track className="relative grow h-full rounded-full">
                <SliderPrimitive.Range className="absolute h-full bg-slate-900 rounded-full" />
              </SliderPrimitive.Track>
              <SliderPrimitive.Thumb 
                className="block w-4 h-4 bg-transparent outline-none cursor-pointer focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 rounded-full" 
                aria-label="Calling window end time" 
              />
            </SliderPrimitive.Root>

            {/* Timeline Labels */}
            <div className="relative mx-2 mt-4 h-6 text-xs font-semibold text-slate-400">
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
  );
};
