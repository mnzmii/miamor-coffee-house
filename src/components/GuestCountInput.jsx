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
        <div className="space-y-4">
            <div className="flex items-center justify-between border-2 border-brand-brown/10 rounded-2xl p-2 bg-brand-brown/5 group-focus-within:border-brand-brown/30 transition-all duration-300">
                <button
                    type="button"
                    onClick={decrease}
                    disabled={value <= 1}
                    className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-brown disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-brown hover:text-white active:scale-95 transition-all duration-300 border border-brand-brown/5"
                >
                    <Minus className="w-5 h-5" />
                </button>

                <div className="text-center px-4">
                    <span className="block text-4xl font-brand font-bold text-brand-brown leading-none">{value}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-lightBrown mt-2 block">Bilangan Tetamu</span>
                </div>

                <button
                    type="button"
                    onClick={increase}
                    disabled={value >= max}
                    className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-brown disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-brown hover:text-white active:scale-95 transition-all duration-300 border border-brand-brown/5"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}
