import React from 'react';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  value: string; // e.g. "10:00 AM" or "07:30 PM"
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  label,
  required = false,
  className = '',
}) => {
  // Parse incoming value "HH:MM AM/PM" or "HH:MM"
  const parseTime = (val: string) => {
    if (!val) return { hour: '10', minute: '00', period: 'AM' };
    const clean = val.trim();
    const match = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (match) {
      let h = parseInt(match[1], 10);
      let p = match[3] ? match[3].toUpperCase() : 'AM';
      // If 24-hr format entered by mistake
      if (!match[3] && h >= 12) {
        if (h > 12) h -= 12;
        p = 'PM';
      }
      if (h === 0) h = 12;
      return {
        hour: String(h).padStart(2, '0'),
        minute: match[2],
        period: p as 'AM' | 'PM',
      };
    }
    return { hour: '10', minute: '00', period: 'AM' };
  };

  const parsed = parseTime(value);

  const updateTime = (newHour: string, newMin: string, newPeriod: string) => {
    const formatted = `${newHour}:${newMin} ${newPeriod}`;
    onChange(formatted);
  };

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{label} {required && <span className="text-red-500">*</span>}</span>
        </label>
      )}

      <div className="flex items-center gap-1.5 p-1 bg-slate-50 border border-slate-200 rounded-xl shadow-xs focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 transition-all">
        {/* Hour Selector */}
        <select
          value={parsed.hour}
          onChange={(e) => updateTime(e.target.value, parsed.minute, parsed.period)}
          className="bg-white border border-slate-200/80 rounded-lg px-2 py-1.5 text-xs font-extrabold text-slate-800 focus:outline-hidden cursor-pointer"
        >
          {hours.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        <span className="text-slate-400 font-extrabold text-xs">:</span>

        {/* Minute Selector */}
        <select
          value={parsed.minute}
          onChange={(e) => updateTime(parsed.hour, e.target.value, parsed.period)}
          className="bg-white border border-slate-200/80 rounded-lg px-2 py-1.5 text-xs font-extrabold text-slate-800 focus:outline-hidden cursor-pointer"
        >
          {minutes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* AM / PM Toggle Pill */}
        <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg ml-auto border border-slate-200">
          <button
            type="button"
            onClick={() => updateTime(parsed.hour, parsed.minute, 'AM')}
            className={`px-2 py-1 rounded-md text-[11px] font-black transition-all ${
              parsed.period === 'AM'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            AM
          </button>
          <button
            type="button"
            onClick={() => updateTime(parsed.hour, parsed.minute, 'PM')}
            className={`px-2 py-1 rounded-md text-[11px] font-black transition-all ${
              parsed.period === 'PM'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            PM
          </button>
        </div>
      </div>
    </div>
  );
};
