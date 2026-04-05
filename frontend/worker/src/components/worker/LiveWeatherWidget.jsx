// src/components/worker/LiveWeatherWidget.jsx

const weatherData = {
  city: "Hyderabad",
  zone: "Kukatpally Zone",
  temp: 34,
  condition: "Partly Cloudy",
  rainfall: "12 mm",
  aqi: 87,
  humidity: "68%",
  wind: "14 km/h",
  riskHint: "Moderate rainfall expected by evening. Payout trigger at 25mm.",
  riskLevel: "moderate",
  icon: "⛅",
  updatedAt: "2 min ago",
};

const riskStyles = {
  low: { bar: "bg-green-400", badge: "bg-green-50 text-green-700", label: "Low Payout Risk" },
  moderate: { bar: "bg-amber-400", badge: "bg-amber-50 text-amber-700", label: "Moderate Payout Risk" },
  high: { bar: "bg-red-400", badge: "bg-red-50 text-red-700", label: "High Payout Risk" },
};

export default function LiveWeatherWidget() {
  const { city, zone, temp, condition, rainfall, aqi, humidity, wind, riskHint, riskLevel, icon, updatedAt } = weatherData;
  const style = riskStyles[riskLevel];

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full">
      {/* Header gradient */}
      <div className="bg-gradient-to-r from-sky-400 to-indigo-500 px-5 pt-5 pb-8 relative">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/70 text-xs font-medium">{zone}</p>
            <h2 className="text-white text-lg font-bold">{city}</h2>
          </div>
          <span className="text-5xl">{icon}</span>
        </div>
        <div className="mt-2 flex items-end gap-2">
          <span className="text-white text-5xl font-black">{temp}°</span>
          <span className="text-white/80 text-sm mb-2">{condition}</span>
        </div>
        <p className="text-white/60 text-[10px] mt-1">Updated {updatedAt}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
        {[
          { label: "Rainfall", val: rainfall },
          { label: "AQI", val: aqi },
          { label: "Humidity", val: humidity },
          { label: "Wind", val: wind },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-center py-3 gap-0.5">
            <span className="text-sm font-bold text-gray-700">{s.val}</span>
            <span className="text-[10px] text-gray-400">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Risk hint */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Payout Risk</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>{style.label}</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
          <div className={`h-full w-2/3 rounded-full ${style.bar}`} />
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{riskHint}</p>
      </div>
    </div>
  );
}