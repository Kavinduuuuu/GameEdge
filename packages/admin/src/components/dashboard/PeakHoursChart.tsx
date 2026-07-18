import React from 'react';

interface PeakHoursChartProps {
  data: { day: string; hours: { hour: string; bookings: number } }[];
}

export function PeakHoursChart({ data }: PeakHoursChartProps) {
  const maxBookings = Math.max(1, ...data.flatMap(d => d.hours.map(h => h.bookings)));

  return (
    <div className="card p-5">
      <h3 className="text-lg font-semibold text-white mb-4">Peak Hours Heatmap</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left text-gray-500 pb-2 pr-2">Day</th>
              {data[0]?.hours.map((h) => (
                <th key={h.hour} className="text-center text-gray-500 pb-2 px-0.5 whitespace-nowrap">
                  {h.hour.replace(':00', '')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((day) => (
              <tr key={day.day}>
                <td className="text-gray-400 py-0.5 pr-2 whitespace-nowrap">{day.day.slice(0, 3)}</td>
                {day.hours.map((h) => {
                  const intensity = h.bookings / maxBookings;
                  const bg = h.bookings === 0
                    ? 'bg-navy-900'
                    : `rgba(59, 130, 246, ${0.2 + intensity * 0.7})`;
                  return (
                    <td key={h.hour} className="py-0.5 px-0.5">
                      <div
                        className="w-full h-5 rounded-sm flex items-center justify-center"
                        style={{ backgroundColor: bg }}
                        title={`${day.day} ${h.hour}: ${h.bookings} bookings`}
                      >
                        {h.bookings > 0 && (
                          <span className="text-white text-[10px] font-medium">{h.bookings}</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
