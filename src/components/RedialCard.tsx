import React, { useRef } from "react";

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setRedialCount(Math.min(10, redialCount + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setRedialCount(Math.max(0, redialCount - 1));
    }
  };

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
            {/* Slider Container */}
            <div
              ref={redialTrackRef}
              onPointerDown={handleRedialPointerDown}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              role="slider"
              aria-valuemin={0}
              aria-valuemax={10}
              aria-valuenow={redialCount}
              aria-label="Redial count"
              className="h-[6px] bg-slate-200 relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 rounded-full"
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
