"use client";

import { useEffect, useState } from "react";
import { metroSchedules } from "./metroScheduleData";

export default function MetroTodaySchedule() {
  const [schedule, setSchedule] = useState<
    (typeof metroSchedules)["weekday"] | null
  >(null);

  useEffect(() => {
    const day = new Date().getDay();

    // 0 = Sunday
    // 5 = Friday
    // 6 = Saturday

    if (day === 5) {
      setSchedule(metroSchedules.friday);
    } else if (day === 6) {
      setSchedule(metroSchedules.saturday);
    } else {
      setSchedule(metroSchedules.weekday);
    }
  }, []);

  if (!schedule) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-10">
      <h2 className="text-2xl font-bold mb-4">{schedule.label}</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Uttara North → Motijheel</h3>

          <p>
            First Train: <strong>{schedule.northToMotijheel.first}</strong>
          </p>

          <p>
            Last Train: <strong>{schedule.northToMotijheel.last}</strong>
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Motijheel → Uttara North</h3>

          <p>
            First Train: <strong>{schedule.motijheelToNorth.first}</strong>
          </p>

          <p>
            Last Train: <strong>{schedule.motijheelToNorth.last}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
