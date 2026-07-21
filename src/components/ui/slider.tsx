"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  ticks?: number[];
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, ticks, value, defaultValue, max = 100, ...props }, ref) => {
  const currentValue = value?.[0] ?? defaultValue?.[0] ?? 0;

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center py-2 cursor-pointer",
        className
      )}
      value={value}
      defaultValue={defaultValue}
      max={max}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-[6px] w-full grow overflow-hidden rounded-full bg-slate-200">
        <SliderPrimitive.Range className="absolute h-full bg-slate-900" />
      </SliderPrimitive.Track>

      {/* Render optional tick marks on the track */}
      {ticks &&
        ticks.map((tick) => (
          <div
            key={tick}
            className={cn(
              "absolute w-[1px] h-[6px] top-[8px] transform -translate-x-1/2 pointer-events-none transition-colors",
              tick <= currentValue ? "bg-slate-900" : "bg-slate-300"
            )}
            style={{ left: `${(tick / max) * 100}%` }}
          />
        ))}

      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-slate-900 bg-white ring-offset-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing" />
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
