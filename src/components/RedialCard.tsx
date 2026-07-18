import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

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
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex-1 flex flex-col">
      <div className="bg-[#F8FAFC] border-b border-slate-100 px-6 py-2">
        <h2 className="font-bold text-slate-800 text-base">Redial</h2>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-center">
        {/* Redial Count */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm mb-3">Redial count</h3>
          <div className="px-1 pt-2 pb-6">
            {/* Radix UI Standard Slider matching original styling */}
            <SliderPrimitive.Root
              value={[redialCount]}
              onValueChange={(val) => setRedialCount(val[0])}
              max={10}
              step={1}
              className="relative flex items-center select-none touch-none w-full h-[6px] bg-slate-200 rounded-full cursor-pointer"
            >
              <SliderPrimitive.Track className="relative grow h-full rounded-full">
                <SliderPrimitive.Range className="absolute h-full bg-slate-900 rounded-full" />
              </SliderPrimitive.Track>
              <SliderPrimitive.Thumb 
                className="block w-4 h-4 bg-transparent outline-none cursor-pointer focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 rounded-full" 
                aria-label="Redial count" 
              />

              {/* Tick Marks (0, 2, 4, 6, 8, 10) */}
              {[0, 2, 4, 6, 8, 10].map((val) => (
                <div
                  key={val}
                  className={`absolute w-[1px] h-[6px] -top-[0px] transform -translate-x-1/2 pointer-events-none ${
                    val <= redialCount ? "bg-slate-900" : "bg-slate-300"
                  }`}
                  style={{ left: `${(val / 10) * 100}%` }}
                />
              ))}
            </SliderPrimitive.Root>

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
          <h3 className="font-bold text-slate-900 text-sm mb-4">Redial interval</h3>
          <div className="bg-slate-100/80 p-1 rounded-xl flex">
            {["3 hours", "6 hours", "9 hours", "12 hours", "24 hours"].map((interval) => {
              const isSelected = redialInterval === interval;
              return (
                <button
                  key={interval}
                  onClick={() => setRedialInterval(interval)}
                  className={`flex-1 py-2.5 rounded-lg text-s font-semibold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-white text-slate-900 border-slate-100"
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
  );
};
