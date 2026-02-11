import { Minus, Plus, Users } from 'lucide-react'
import { LABELS } from '../lib/constants'

export default function GuestCountInput({ value, onChange, max = 15 }) {
    const decrease = () => {
        if (value > 1) onChange(value - 1)
    }

    const increase = () => {
        if (value < max) onChange(value + 1)
    }

    return (
        <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-dark-300">
                <Users className="w-4 h-4 text-brand-400" />
                {LABELS.GUEST_COUNT}
            </label>
            <div className="flex items-center justify-center gap-4">
                <button
                    type="button"
                    onClick={decrease}
                    disabled={value <= 1}
                    className="w-12 h-12 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center text-dark-300 hover:bg-dark-700 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
                >
                    <Minus className="w-5 h-5" />
                </button>
                <div className="w-20 text-center">
                    <span className="text-4xl font-display font-bold text-white">{value}</span>
                    <p className="text-xs text-dark-500 mt-1">orang</p>
                </div>
                <button
                    type="button"
                    onClick={increase}
                    disabled={value >= max}
                    className="w-12 h-12 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center text-dark-300 hover:bg-dark-700 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}
