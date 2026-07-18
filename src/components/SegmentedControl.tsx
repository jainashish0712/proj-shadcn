import React from "react";

interface SegmentedControlProps<T extends string | number> {
  options: T[];
  selected: T | T[];
  onChange: (value: T) => void;
  isMulti?: boolean;
  variant?: "pills" | "tabs";
}

export function SegmentedControl<T extends string | number>({
  options,
  selected,
  onChange,
  isMulti = false,
  variant = "pills",
}: SegmentedControlProps<T>) {
  const isSelected = (option: T): boolean => {
    if (isMulti && Array.isArray(selected)) {
      return selected.includes(option);
    }
    return selected === option;
  };

  if (variant === "tabs") {
    return (
      <div className="bg-slate-100 p-1 rounded-xl flex w-full">
        {options.map((option) => {
          const active = isSelected(option);
          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                active
                  ? "bg-white text-slate-900 shadow-sm border-slate-100"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    );
  }

  // pills variant (used for calling days selection)
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = isSelected(option);
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`w-16 h-10 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
              active
                ? "bg-slate-800 text-white hover:bg-slate-700"
                : "font-semibold bg-white text-slate-900 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
