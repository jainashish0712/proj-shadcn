import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

const REDIAL_INTERVALS = ["3 hours", "6 hours", "9 hours", "12 hours", "24 hours"];
const REDIAL_TICKS = [0, 2, 4, 6, 8, 10];

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
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <CardTitle>Redial</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 flex-1 flex flex-col">
        {/* Redial Count */}
        <div>
          <h4 className="font-semibold text-slate-900 text-sm mb-3">
            Redial count
          </h4>
          <div className="px-1 pt-1 pb-4">
            <Slider
              min={0}
              max={10}
              step={1}
              value={[redialCount]}
              onValueChange={(val) => setRedialCount(val[0])}
              ticks={REDIAL_TICKS}
              aria-label="Redial count"
            />

            {/* Timeline Labels */}
            <div className="relative mx-1 mt-3 h-5 text-xs font-semibold">
              {REDIAL_TICKS.map((val) => (
                <span
                  key={val}
                  onClick={() => setRedialCount(val)}
                  className={`absolute transform -translate-x-1/2 cursor-pointer transition-colors ${
                    val === redialCount
                      ? "text-slate-700 font-bold"
                      : "text-slate-400 font-semibold"
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
          <h4 className="font-semibold text-slate-900 text-sm mb-3">
            Redial interval
          </h4>
          <div className="bg-slate-100 p-1 flex border border-slate-200/50">
            {REDIAL_INTERVALS.map((interval) => {
              const isSelected = redialInterval === interval;
              return (
                <button
                  key={interval}
                  type="button"
                  onClick={() => setRedialInterval(interval)}
                  className={`flex-1 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {interval}
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
