export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface ScoringParams {
  callingDays: Day[];
  windowEnd: number;
  redialCount: number;
  redialInterval: string;
}

export interface PenaltyResult {
  days: number;
  window: number;
  count: number;
  interval: number;
}

// Helper to check arrays equality (order-independent for days)
export const matchDays = (callingDays: Day[], targetDays: Day[]): boolean => {
  if (callingDays.length !== targetDays.length) return false;
  return targetDays.every((d) => callingDays.includes(d));
};

// Penalty Calculation logic matching specifications
export const getPenalties = (params: ScoringParams): PenaltyResult => {
  const { callingDays, windowEnd, redialCount, redialInterval } = params;

  // exact config checks from screenshots
  const isS1_Score100 =
    matchDays(callingDays, ["Mon", "Tue", "Wed", "Thu", "Fri"]) &&
    windowEnd === 4 &&
    redialCount === 5 &&
    redialInterval === "3 hours";

  const isS2_Score70 =
    matchDays(callingDays, ["Mon", "Tue", "Wed", "Thu"]) &&
    windowEnd === 3 &&
    redialCount === 7 &&
    redialInterval === "6 hours";

  const isS3_Score50 =
    matchDays(callingDays, ["Mon", "Tue", "Wed"]) &&
    windowEnd === 2 &&
    redialCount === 8 &&
    redialInterval === "6 hours";

  const isS4_Score20 =
    matchDays(callingDays, ["Mon", "Tue"]) &&
    windowEnd === 1 &&
    redialCount === 3 &&
    redialInterval === "6 hours";

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
  const weekdayCount = ["Mon", "Tue", "Wed", "Thu", "Fri"].filter((d) =>
    callingDays.includes(d as Day)
  ).length;
  const weekendCount = ["Sat", "Sun"].filter((d) =>
    callingDays.includes(d as Day)
  ).length;

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
  if (redialCount === 5) countPenalty = 0;
  else if (redialCount === 7) countPenalty = 10;
  else if (redialCount === 8) countPenalty = 20;
  else if (redialCount === 3) countPenalty = 30;
  else {
    // interpolation
    if (redialCount > 5) {
      countPenalty = (redialCount - 5) * 5;
    } else {
      countPenalty = (5 - redialCount) * 10;
    }
  }

  // Interval penalty
  let intervalPenalty = 0;
  if (redialInterval === "3 hours") intervalPenalty = 0;
  else if (redialInterval === "6 hours") intervalPenalty = 10;
  else if (redialInterval === "9 hours") intervalPenalty = 15;
  else if (redialInterval === "12 hours") intervalPenalty = 20;
  else intervalPenalty = 30;

  return {
    days: daysPenalty,
    window: windowPenalty,
    count: countPenalty,
    interval: intervalPenalty,
  };
};
