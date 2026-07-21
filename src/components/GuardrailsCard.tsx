import React from "react";
import { Day } from "@/utils/scoring";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const HOURS = ["8 AM", "11 AM", "2 PM", "5 PM", "9 PM"];
const ALL_DAYS: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <CardTitle>Guardrails</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 flex-1 flex flex-col">
        {/* Calling Days */}
        <div>
          <h4 className="font-semibold text-slate-900 text-sm mb-3">
            Calling days
          </h4>
          <div className="flex flex-wrap gap-2">
            {ALL_DAYS.map((day) => {
              const isSelected = callingDays.includes(day);
              return (
                <Button
                  key={day}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => toggleDay(day)}
                  className={`w-16 h-10 text-sm font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {day}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Calling Window */}
        <div>
          <h4 className="font-semibold text-slate-900 text-sm mb-3">
            Calling window
          </h4>
          <div className="px-1 pt-1 pb-4">
            <Slider
              min={0}
              max={4}
              step={1}
              value={[windowEnd]}
              onValueChange={(val) => setWindowEnd(val[0])}
              aria-label="Calling window end time"
            />

            {/* Timeline Labels */}
            <div className="relative mx-1 mt-3 h-5 text-xs font-semibold">
              {HOURS.map((hour, idx) => (
                <span
                  key={hour}
                  onClick={() => setWindowEnd(idx)}
                  className={`absolute transform -translate-x-1/2 whitespace-nowrap cursor-pointer transition-colors ${
                    idx <= windowEnd
                      ? "text-slate-700 font-bold"
                      : "text-slate-400 font-semibold"
                  }`}
                  style={{ left: `${(idx / 4) * 100}%` }}
                >
                  {hour}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
