import { Calendar, Clock, ChevronRight } from 'lucide-react'
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
        <div className="space-y-6">
            {/* Date picker */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-lightBrown">
                    <Calendar className="w-4 h-4 text-brand-red" />
                    {LABELS.SELECT_DATE}
                </label>
                <div className="relative">
                    <input
                        type="date"
                        value={date}
                        min={today}
                        onChange={(e) => onDateChange(e.target.value)}
                        className="w-full bg-brand-brown/5 border-b-2 border-brand-brown/10 px-4 py-3 text-brand-brown focus:outline-none focus:border-brand-red transition-all text-lg rounded-t-lg"
                    />
                </div>
            </div>

            {/* Time slot grid */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-lightBrown">
                    <Clock className="w-4 h-4 text-brand-red" />
                    {LABELS.SELECT_TIME}
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-brand-brown/20 scrollbar-track-transparent">
                    {timeSlots.map((slot) => {
                        const isSelected = time === slot
                        return (
                            <button
                                key={slot}
                                type="button"
                                onClick={() => onTimeChange(slot)}
                                className={`
                                    py-3 px-1 rounded-xl text-sm font-bold transition-all duration-300 border-2
                                    ${isSelected
                                        ? 'bg-brand-brown border-brand-brown text-white shadow-xl shadow-brand-brown/20 scale-105 z-10'
                                        : 'bg-white text-brand-lightBrown border-brand-brown/5 hover:border-brand-brown/30 hover:bg-brand-brown/5'
                                    }
                                `}
                            >
                                {slot}
                            </button>
                        )
                    })}
                </div>
            </div>

            {date && time && (
                <div className="mt-8 p-6 bg-brand-brown text-white rounded-[1.5rem] flex items-center justify-between animate-fade-in shadow-2xl shadow-brand-brown/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
                        <Clock className="w-24 h-24" />
                    </div>
                    <div className="relative z-10 text-left">
                        <p className="text-[10px] font-bold uppercase text-brand-beige tracking-[0.2em] mb-1">Pilihan Masa</p>
                        <p className="font-brand font-bold text-xl text-white">
                            {new Date(date).toLocaleDateString('ms-MY', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                        <p className="text-brand-beige text-sm mt-1 font-medium italic">Jam {time}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
