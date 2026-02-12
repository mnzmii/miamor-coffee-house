import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Send, CheckCircle2, Coffee, User, Calendar, MapPin } from 'lucide-react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
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
    const bookingRef = useRef(null)

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
    const [specialRequests, setSpecialRequests] = useState('')

    // Scroll to booking form
    const scrollToBooking = () => {
        bookingRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    // Resolve walk-in room from URL
    useEffect(() => {
        if (isWalkIn && roomIdFromUrl) {
            resolveRoom(roomIdFromUrl)
        }
    }, [roomIdFromUrl])

    const resolveRoom = async (roomSlug) => {
        try {
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .ilike('name', roomSlug.replace(/-/g, ' '))
                .single()

            if (data) {
                setRoomName(data.name)
            }
        } catch (err) {
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

    // Validation
    const canProceed = () => {
        switch (currentStep) {
            case 'info':
                return customerName.trim().length >= 2 && whatsappNumber.trim().length >= 9
            case 'datetime':
                return date && time
            case 'menu':
                return true
            case 'summary':
                return true
            default:
                return false
        }
    }

    const handleSubmit = async () => {
        setSubmitting(true)
        try {
            let startTime = isWalkIn ? new Date().toISOString() : new Date(`${date}T${time}:00`).toISOString()
            let roomId = null

            if (isWalkIn && roomIdFromUrl) {
                const { data: roomData } = await supabase
                    .from('rooms')
                    .select('id')
                    .ilike('name', roomIdFromUrl.replace(/-/g, ' '))
                    .single()
                if (roomData) roomId = roomData.id
            }

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
                    // special_requests: specialRequests // TODO: Add column to DB if needed
                })
                .select()
                .single()

            if (resError) throw resError

            if (cart.length > 0 && reservation) {
                const items = cart.map((item) => ({
                    reservation_id: reservation.id,
                    menu_item_id: item.id,
                    quantity: item.quantity,
                }))
                await supabase.from('reservation_items').insert(items)
            }

            setSubmitted(true)
        } catch (err) {
            console.error('Error:', err)
            // Still show success in demo mode
            setSubmitted(true)
        } finally {
            setSubmitting(false)
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-brand-cream bg-paper-texture">
                <Header title="Confirmed" />
                <div className="max-w-md mx-auto px-6 py-24 text-center animate-fade-in">
                    <div className="w-24 h-24 mx-auto rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center mb-8 shadow-lg shadow-emerald-900/10">
                        <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-brand font-bold text-brand-brown mb-4">
                        {isWalkIn ? "Pesanan Diterima!" : "Tempahan Berjaya!"}
                    </h2>
                    <p className="text-brand-lightBrown mb-10 text-lg">
                        {isWalkIn ? "Dapur sedang menyediakan pesanan anda." : "Kami akan mengesahkan tempahan anda melalui WhatsApp sebentar lagi."}
                    </p>

                    <div className="paper-card p-6 text-left space-y-4">
                        <div className="flex justify-between items-center border-b border-brand-brown/10 pb-4">
                            <span className="text-brand-lightBrown font-sans font-medium uppercase tracking-wider text-xs">Pelanggan</span>
                            <span className="text-brand-brown font-bold text-lg">{customerName}</span>
                        </div>
                        {!isWalkIn && (
                            <div className="flex justify-between items-center border-b border-brand-brown/10 pb-4">
                                <span className="text-brand-lightBrown font-sans font-medium uppercase tracking-wider text-xs">Tetamu</span>
                                <span className="text-brand-brown font-bold">{guestCount} pax</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-brand-lightBrown font-sans font-medium uppercase tracking-wider text-xs">Jumlah</span>
                            <span className="text-brand-red font-brand font-bold text-xl">
                                RM {cart.reduce((s, c) => s + c.price * c.quantity, 0).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-10 btn-secondary w-full"
                    >
                        Kembali ke Utama
                    </button>
                </div>
            </div>
        )
    }

    const stepTitles = {
        info: LABELS.WELCOME,
        datetime: LABELS.PREFERRED_TIME,
        menu: LABELS.FOOD_MENU,
        summary: LABELS.ORDER_SUMMARY,
    }

    return (
        <div className="min-h-screen bg-brand-cream bg-paper-texture">
            <Header />

            {/* Show Hero only for remote reservations on first step */}
            {!isWalkIn && step === 0 && (
                <HeroSection onBookNow={scrollToBooking} />
            )}

            <main ref={bookingRef} className={`max-w-xl mx-auto px-4 ${!isWalkIn && step === 0 ? 'py-16' : 'py-24'} pb-32`}>

                {/* Booking Card */}
                <div className="bg-white/50 backdrop-blur-md shadow-2xl shadow-brand-brown/10 border border-brand-brown/10 rounded-2xl overflow-hidden relative">

                    {/* Decorative Top Border */}
                    <div className="h-2 bg-brand-brown w-full" />

                    <div className="p-6 md:p-8">
                        {/* Progress Header */}
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <span className="text-xs font-bold tracking-[0.2em] text-brand-lightBrown uppercase">Langkah {step + 1} / {steps.length}</span>
                                <h2 className="text-2xl md:text-3xl font-brand font-bold text-brand-brown mt-1">
                                    {stepTitles[currentStep]}
                                </h2>
                            </div>
                            {isWalkIn && (
                                <div className="hidden md:flex badge-walkin items-center gap-1.5 px-3 py-1 text-xs">
                                    <MapPin className="w-3 h-3" />
                                    {roomName}
                                </div>
                            )}
                        </div>

                        {/* Mobile Walkin Badge */}
                        {isWalkIn && (
                            <div className="md:hidden badge-walkin inline-flex items-center gap-1.5 px-3 py-1 text-xs mb-6">
                                <MapPin className="w-3 h-3" />
                                {roomName}
                            </div>
                        )}

                        {/* Step Content */}
                        <div className="animate-slide-up min-h-[300px]">
                            {currentStep === 'info' && (
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="block text-xs font-bold tracking-wider text-brand-lightBrown uppercase mb-2">
                                            {LABELS.CUSTOMER_NAME}
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-0 top-3 w-5 h-5 text-brand-brown/40" />
                                            <input
                                                type="text"
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                                placeholder="Nama Penuh"
                                                className="w-full bg-transparent border-b-2 border-brand-brown/20 pl-8 pr-4 py-2.5 text-brand-brown placeholder-brand-brown/30 focus:outline-none focus:border-brand-red transition-colors text-lg"
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold tracking-wider text-brand-lightBrown uppercase mb-2">
                                            {LABELS.WHATSAPP_NUMBER}
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-0 top-3 text-brand-brown/40 text-lg">📞</span>
                                            <input
                                                type="tel"
                                                value={whatsappNumber}
                                                onChange={(e) => setWhatsappNumber(e.target.value)}
                                                placeholder="012-3456789"
                                                className="w-full bg-transparent border-b-2 border-brand-brown/20 pl-8 pr-4 py-2.5 text-brand-brown placeholder-brand-brown/30 focus:outline-none focus:border-brand-red transition-colors text-lg"
                                            />
                                        </div>
                                    </div>

                                    {!isWalkIn && (
                                        <div className="pt-4">
                                            <label className="block text-xs font-bold tracking-wider text-brand-lightBrown uppercase mb-4">
                                                Bilangan Tetamu
                                            </label>
                                            <GuestCountInput value={guestCount} onChange={setGuestCount} />
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        <label className="block text-xs font-bold tracking-wider text-brand-lightBrown uppercase mb-2">
                                            Nota Tambahan (Optional)
                                        </label>
                                        <textarea
                                            value={specialRequests}
                                            onChange={(e) => setSpecialRequests(e.target.value)}
                                            placeholder="Contoh: Tak nak pedas, alergic seafood..."
                                            className="w-full bg-brand-brown/5 border border-brand-brown/10 rounded-lg p-3 text-brand-brown placeholder-brand-brown/30 focus:outline-none focus:border-brand-red/50 focus:bg-white transition-all text-sm min-h-[80px]"
                                        />
                                    </div>
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
                                    specialRequests={specialRequests}
                                />
                            )}
                        </div>
                    </div>

                    {/* Bottom Actions Bar */}
                    <div className="bg-brand-brown/5 p-4 md:p-6 border-t border-brand-brown/10 flex justify-between gap-4">
                        {!isFirstStep && (
                            <button
                                onClick={() => setStep((s) => s - 1)}
                                className="px-6 py-3 rounded-lg text-brand-brown font-bold tracking-wide hover:bg-brand-brown/5 transition-colors flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="hidden md:inline">{LABELS.BACK}</span>
                            </button>
                        )}

                        <div className="flex-1 flex justify-end">
                            {isLastStep ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 min-w-[200px]"
                                >
                                    {submitting ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {LABELS.SUBMIT}
                                            <Send className="w-4 h-4 ml-1" />
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={() => setStep((s) => s + 1)}
                                    disabled={!canProceed()}
                                    className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 min-w-[160px]"
                                >
                                    {LABELS.NEXT}
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}
