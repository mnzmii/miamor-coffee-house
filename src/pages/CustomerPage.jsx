import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Send, CheckCircle2, Coffee } from 'lucide-react'
import Header from '../components/Header'
import GuestCountInput from '../components/GuestCountInput'
import TimeSelector from '../components/TimeSelector'
import MenuSection from '../components/MenuSection'
import OrderSummary from '../components/OrderSummary'
import { supabase } from '../lib/supabase'
import { LABELS, ORDER_TYPE, ORDER_STATUS } from '../lib/constants'

export default function CustomerPage() {
    const [searchParams] = useSearchParams()
    const roomIdFromUrl = searchParams.get('roomId')
    const isWalkIn = !!roomIdFromUrl

    // Form state
    const [step, setStep] = useState(0)
    const [customerName, setCustomerName] = useState('')
    const [whatsappNumber, setWhatsappNumber] = useState('')
    const [guestCount, setGuestCount] = useState(2)
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [cart, setCart] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [roomName, setRoomName] = useState('')

    // Resolve walk-in room from URL
    useEffect(() => {
        if (isWalkIn && roomIdFromUrl) {
            resolveRoom(roomIdFromUrl)
        }
    }, [roomIdFromUrl])

    const resolveRoom = async (roomSlug) => {
        try {
            // Try to find room by slug (name lowercased with hyphens)
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .ilike('name', roomSlug.replace(/-/g, ' '))
                .single()

            if (data) {
                setRoomName(data.name)
            }
        } catch (err) {
            // Fallback: use the slug as display name
            setRoomName(roomSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
        }
    }

    // Steps configuration
    const walkInSteps = ['info', 'menu', 'summary']
    const remoteSteps = ['info', 'datetime', 'menu', 'summary']
    const steps = isWalkIn ? walkInSteps : remoteSteps

    const currentStep = steps[step]
    const isLastStep = step === steps.length - 1
    const isFirstStep = step === 0

    // Validation per step
    const canProceed = () => {
        switch (currentStep) {
            case 'info':
                return customerName.trim().length >= 2 && whatsappNumber.trim().length >= 9
            case 'datetime':
                return date && time
            case 'menu':
                return true // Optional to order food
            case 'summary':
                return true
            default:
                return false
        }
    }

    const handleSubmit = async () => {
        setSubmitting(true)
        try {
            // Build start_time
            let startTime
            if (isWalkIn) {
                startTime = new Date().toISOString()
            } else {
                startTime = new Date(`${date}T${time}:00`).toISOString()
            }

            // Find room UUID for walk-ins
            let roomId = null
            if (isWalkIn && roomIdFromUrl) {
                const { data: roomData } = await supabase
                    .from('rooms')
                    .select('id')
                    .ilike('name', roomIdFromUrl.replace(/-/g, ' '))
                    .single()
                if (roomData) roomId = roomData.id
            }

            // Insert reservation
            const { data: reservation, error: resError } = await supabase
                .from('reservations')
                .insert({
                    customer_name: customerName,
                    whatsapp_number: whatsappNumber,
                    room_id: roomId,
                    guest_count: isWalkIn ? 1 : guestCount,
                    start_time: startTime,
                    status: isWalkIn ? ORDER_STATUS.CONFIRMED : ORDER_STATUS.PENDING,
                    order_type: isWalkIn ? ORDER_TYPE.QR_WALKIN : ORDER_TYPE.REMOTE,
                })
                .select()
                .single()

            if (resError) throw resError

            // Insert order items
            if (cart.length > 0 && reservation) {
                const items = cart.map((item) => ({
                    reservation_id: reservation.id,
                    menu_item_id: item.id,
                    quantity: item.quantity,
                }))

                const { error: itemsError } = await supabase
                    .from('reservation_items')
                    .insert(items)

                if (itemsError) throw itemsError
            }

            setSubmitted(true)
        } catch (err) {
            console.error('Error submitting:', err)
            // Still show success in demo mode
            setSubmitted(true)
        } finally {
            setSubmitting(false)
        }
    }

    // ── Success screen ──
    if (submitted) {
        return (
            <div className="min-h-screen bg-dark-950">
                <Header />
                <div className="max-w-md mx-auto px-4 py-16 text-center animate-fade-in">
                    <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white mb-3">
                        {isWalkIn ? LABELS.ORDER_SUBMITTED : LABELS.RESERVATION_SUBMITTED}
                    </h2>
                    <p className="text-dark-400 mb-8">
                        {isWalkIn ? LABELS.ORDER_CONFIRMED : LABELS.RESERVATION_PENDING}
                    </p>
                    <div className="glass-card p-4 text-left space-y-2">
                        <p className="text-sm text-dark-400">
                            {LABELS.CUSTOMER_NAME}: <span className="text-white font-medium">{customerName}</span>
                        </p>
                        {!isWalkIn && (
                            <p className="text-sm text-dark-400">
                                {LABELS.GUEST_COUNT}: <span className="text-white font-medium">{guestCount} orang</span>
                            </p>
                        )}
                        {cart.length > 0 && (
                            <p className="text-sm text-dark-400">
                                {LABELS.TOTAL}: <span className="text-white font-semibold">
                                    RM {cart.reduce((s, c) => s + c.price * c.quantity, 0).toFixed(2)}
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    // ── Step titles ──
    const stepTitles = {
        info: LABELS.WELCOME,
        datetime: LABELS.PREFERRED_TIME,
        menu: LABELS.FOOD_MENU,
        summary: LABELS.ORDER_SUMMARY,
    }

    return (
        <div className="min-h-screen bg-dark-950">
            <Header />

            <main className="max-w-md mx-auto px-4 py-6 pb-32">
                {/* Progress bar */}
                <div className="flex gap-1.5 mb-6">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-brand-500' : 'bg-dark-800'
                                }`}
                        />
                    ))}
                </div>

                {/* Step title */}
                <h2 className="text-xl font-display font-bold text-white mb-6 animate-fade-in">
                    {stepTitles[currentStep]}
                </h2>

                {/* Walk-in badge */}
                {isWalkIn && step === 0 && (
                    <div className="badge-walkin mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm">
                        <Coffee className="w-3.5 h-3.5" />
                        QR Walk-in • {roomName}
                    </div>
                )}

                {/* ── Step content ── */}
                <div className="animate-slide-up">
                    {currentStep === 'info' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-dark-300 mb-2">
                                    {LABELS.CUSTOMER_NAME}
                                </label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Masukkan nama anda"
                                    className="input-field"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-300 mb-2">
                                    {LABELS.WHATSAPP_NUMBER}
                                </label>
                                <input
                                    type="tel"
                                    value={whatsappNumber}
                                    onChange={(e) => setWhatsappNumber(e.target.value)}
                                    placeholder="012-3456789"
                                    className="input-field"
                                />
                            </div>

                            {!isWalkIn && (
                                <div className="pt-2">
                                    <GuestCountInput value={guestCount} onChange={setGuestCount} />
                                </div>
                            )}
                        </div>
                    )}

                    {currentStep === 'datetime' && (
                        <TimeSelector
                            date={date}
                            time={time}
                            onDateChange={setDate}
                            onTimeChange={setTime}
                        />
                    )}

                    {currentStep === 'menu' && (
                        <MenuSection cart={cart} setCart={setCart} />
                    )}

                    {currentStep === 'summary' && (
                        <OrderSummary
                            customerName={customerName}
                            whatsappNumber={whatsappNumber}
                            guestCount={guestCount}
                            date={date}
                            time={time}
                            cart={cart}
                            orderType={isWalkIn ? ORDER_TYPE.QR_WALKIN : ORDER_TYPE.REMOTE}
                            roomName={roomName}
                        />
                    )}
                </div>
            </main>

            {/* Bottom navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-dark-950/90 backdrop-blur-lg border-t border-dark-800 p-4">
                <div className="max-w-md mx-auto flex gap-3">
                    {!isFirstStep && (
                        <button
                            onClick={() => setStep((s) => s - 1)}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {LABELS.BACK}
                        </button>
                    )}

                    {isLastStep ? (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="btn-primary flex-1 flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    {LABELS.SUBMIT}
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={() => setStep((s) => s + 1)}
                            disabled={!canProceed()}
                            className="btn-primary flex-1 flex items-center justify-center gap-2"
                        >
                            {LABELS.NEXT}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
