import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Coffee, Lock, AlertCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'

export default function StaffLoginPage() {
    const navigate = useNavigate()
    const { login, isAuthenticated } = useAuth()
    const [pin, setPin] = useState(['', '', '', '', '', ''])
    const [error, setError] = useState('')
    const [shaking, setShaking] = useState(false)
    const inputRefs = useRef([])

    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
        navigate('/staff', { replace: true })
        return null
    }

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return

        const newPin = [...pin]
        newPin[index] = value.slice(-1)
        setPin(newPin)
        setError('')

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }

        // Auto-submit when all 6 digits entered
        if (index === 5 && value) {
            const fullPin = newPin.join('')
            if (fullPin.length === 6) {
                handleSubmit(fullPin)
            }
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        if (pasted.length === 6) {
            const newPin = pasted.split('')
            setPin(newPin)
            handleSubmit(pasted)
        }
    }

    const handleSubmit = (fullPin) => {
        const success = login(fullPin)
        if (success) {
            navigate('/staff', { replace: true })
        } else {
            setError('PIN tidak sah. Sila cuba lagi.')
            setShaking(true)
            setTimeout(() => {
                setShaking(false)
                setPin(['', '', '', '', '', ''])
                inputRefs.current[0]?.focus()
            }, 500)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            {/* Café atmosphere background */}
            <div className="fixed inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1920&auto=format&fit=crop" alt="" className="w-full h-full object-cover" style={{ filter: 'sepia(0.15) brightness(0.95)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(245,240,232,0.80) 0%, rgba(245,240,232,0.84) 60%, rgba(245,240,232,0.88) 100%)' }} />
            </div>
            {/* Back to home */}
            <button
                onClick={() => navigate('/')}
                className="fixed top-6 left-6 z-20 flex items-center gap-2 text-brand-lightBrown hover:text-brand-brown transition-colors text-sm font-medium"
            >
                <ArrowLeft className="w-4 h-4" />
                Kembali
            </button>

            <div className="relative z-10 w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-brown rounded-2xl shadow-lg shadow-brand-brown/30 mb-6">
                        <Coffee className="w-8 h-8 text-brand-beige" />
                    </div>
                    <h1 className="font-brand font-bold text-3xl text-brand-brown tracking-wide">
                        MIAMOR
                    </h1>
                    <p className="text-brand-lightBrown text-sm mt-1">Portal Kakitangan</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-brand-brown/10 border border-brand-brown/5 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-brand-brown/5 rounded-xl">
                            <Lock className="w-5 h-5 text-brand-brown" />
                        </div>
                        <div>
                            <h2 className="font-bold text-brand-brown text-lg">Masukkan PIN</h2>
                            <p className="text-brand-lightBrown text-xs">6-digit PIN kakitangan</p>
                        </div>
                    </div>

                    {/* PIN Input Grid */}
                    <div
                        className={`flex gap-3 justify-center mb-6 ${shaking ? 'animate-shake' : ''}`}
                        onPaste={handlePaste}
                    >
                        {pin.map((digit, i) => (
                            <input
                                key={i}
                                ref={(el) => (inputRefs.current[i] = el)}
                                type="password"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-200 focus:outline-none
                                    ${error
                                        ? 'border-red-300 bg-red-50 text-red-600'
                                        : digit
                                            ? 'border-brand-brown/30 bg-brand-brown/5 text-brand-brown'
                                            : 'border-brand-brown/10 bg-white text-brand-brown focus:border-brand-brown/40 focus:bg-brand-brown/5'
                                    }`}
                                autoFocus={i === 0}
                            />
                        ))}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 text-red-600 text-sm mb-4 justify-center">
                            <AlertCircle className="w-4 h-4" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={() => handleSubmit(pin.join(''))}
                        disabled={pin.some(d => !d)}
                        className="w-full btn-primary py-4 text-lg disabled:opacity-30"
                    >
                        Log Masuk
                    </button>

                    <p className="text-center text-brand-lightBrown/50 text-xs mt-6">
                        Hanya kakitangan Miamor sahaja
                    </p>
                </div>
            </div>
        </div>
    )
}
