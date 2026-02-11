import { Calendar, Clock } from 'lucide-react'
import { LABELS } from '../lib/constants'

export default function TimeSelector({ date, time, onDateChange, onTimeChange }) {
    // Generate time slots from 10:00 to 22:00 in 30-min intervals
    const timeSlots = []
    for (let h = 10; h <= 22; h++) {
        timeSlots.push(`${String(h).padStart(2, '0')}:00`)
        if (h < 22) {
            timeSlots.push(`${String(h).padStart(2, '0')}:30`)
        }
    }

    // Get today's date in YYYY-MM-DD format for min attribute
    const today = new Date().toISOString().split('T')[0]

    return (
        <div className="space-y-5">
            {/* Date picker */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-dark-300">
                    <Calendar className="w-4 h-4 text-brand-400" />
                    {LABELS.SELECT_DATE}
                </label>
                <input
                    type="date"
                    value={date}
                    min={today}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="input-field"
                />
            </div>

            {/* Time slot grid */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-dark-300">
                    <Clock className="w-4 h-4 text-brand-400" />
                    {LABELS.SELECT_TIME}
                </label>
                <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((slot) => (
                        <button
                            key={slot}
                            type="button"
                            onClick={() => onTimeChange(slot)}
                            className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${time === slot
                                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                                    : 'bg-dark-800 text-dark-300 border border-dark-700 hover:border-dark-500 hover:text-white'
                                }`}
                        >
                            {slot}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
