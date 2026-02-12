import { AlertTriangle, Trash2, X } from 'lucide-react'

export default function ConfirmDialog({ open, onConfirm, onCancel, title, message, confirmText = 'Ya, Teruskan', cancelText = 'Batal', variant = 'danger' }) {
    if (!open) return null

    const iconColors = {
        danger: 'bg-red-100 text-red-600',
        warning: 'bg-amber-100 text-amber-600',
    }

    const btnColors = {
        danger: 'bg-red-600 hover:bg-red-700 shadow-red-600/20',
        warning: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20',
    }

    const IconComponent = variant === 'danger' ? Trash2 : AlertTriangle

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center relative"
                style={{ animation: 'fadeInScale 0.2s ease-out' }}
            >
                {/* Close button */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-brand-brown/5 text-brand-lightBrown transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${iconColors[variant]}`}>
                    <IconComponent className="w-8 h-8" />
                </div>

                {/* Content */}
                <h3 className="font-brand font-bold text-xl text-brand-brown mb-2">{title}</h3>
                <p className="text-brand-lightBrown text-sm mb-8 leading-relaxed">{message}</p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-xl border-2 border-brand-brown/10 text-brand-brown font-bold hover:bg-brand-brown/5 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-3 rounded-xl text-white font-bold transition-colors shadow-lg ${btnColors[variant]}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}
