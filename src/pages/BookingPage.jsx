import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Send, CheckCircle2, Coffee, User, Calendar, MapPin, Sparkles, Phone, Users, StickyNote } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GuestCountInput from '../components/GuestCountInput'
import TimeSelector from '../components/TimeSelector'
import MenuSection from '../components/MenuSection'
import OrderSummary from '../components/OrderSummary'
import { supabase } from '../lib/supabase'
import { LABELS, ORDER_TYPE, ORDER_STATUS } from '../lib/constants'

export default function BookingPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const roomIdFromUrl = searchParams.get('roomId')
    const isWalkIn = !!roomIdFromUrl

    // Form state
    const [step, setStep] = useState(0)
    const [customerName, setCustomerName] = useState(isWalkIn ? 'Walk-in' : '')
    const [whatsappNumber, setWhatsappNumber] = useState(isWalkIn ? '-' : '')
    const [guestCount, setGuestCount] = useState(2)
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [cart, setCart] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [roomName, setRoomName] = useState('')
    const [specialRequests, setSpecialRequests] = useState('')
    const [reservationId, setReservationId] = useState(null)

    const formRef = useRef(null)

    // Auto-scroll to form start when step changes
    useEffect(() => {
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [step])

    // Resolve walk-in room from URL
    useEffect(() => {
        if (isWalkIn && roomIdFromUrl) {
            resolveRoom(roomIdFromUrl)
        }
    }, [roomIdFromUrl])

    const resolveRoom = async (roomSlug) => {
        try {
            const { data } = await supabase
                .from('rooms')
                .select('*')
                .ilike('name', roomSlug.replace(/-/g, ' '))
                .single()
            if (data) setRoomName(data.name)
        } catch {
            setRoomName(roomSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
        }
    }

    // Steps configuration — walk-in skips info and datetime
    const walkInSteps = ['menu', 'summary']
    const remoteSteps = ['info', 'datetime', 'menu', 'summary']
    const steps = isWalkIn ? walkInSteps : remoteSteps
    const currentStep = steps[step]
    const isLastStep = step === steps.length - 1
    const isFirstStep = step === 0

    // Validation
    const canProceed = () => {
        switch (currentStep) {
            case 'info': return customerName.trim().length >= 2 && whatsappNumber.trim().length >= 9
            case 'datetime': return date && time
            case 'menu': return true
            case 'summary': return true
            default: return false
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

            setReservationId(reservation?.id)
            setSubmitted(true)
            window.scrollTo({ top: 0, behavior: 'smooth' })

            // Walk-in: redirect to order status page
            if (isWalkIn && reservation?.id) {
                navigate(`/order/${reservation.id}`)
                return
            }
        } catch (err) {
            console.error('Error:', err)
            setSubmitted(true)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } finally {
            setSubmitting(false)
        }
    }



    const stepConfig = {
        info: { title: LABELS.WELCOME, subtitle: 'Sila masukkan butiran anda untuk bermula', icon: User },
        datetime: { title: LABELS.PREFERRED_TIME, subtitle: 'Pilih tarikh dan slot masa pilihan anda', icon: Calendar },
        menu: { title: LABELS.FOOD_MENU, subtitle: isWalkIn ? 'Pilih hidangan anda' : 'Pre-order makanan kegemaran anda', icon: Coffee },
        summary: { title: LABELS.ORDER_SUMMARY, subtitle: 'Sila semak butiran sebelum hantar', icon: CheckCircle2 },
    }

    const currentConfig = stepConfig[currentStep]

    // ── Main booking form ──
    return (
        <div className="min-h-screen bg-brand-cream/30 bg-paper-texture">
            <Header />

            {/* Branded top banner — more compact and bold */}
            <div className="relative h-56 md:h-64 flex items-end overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1544739313-6fad02872377?q=80&w=1600&auto=format&fit=crop"
                    alt="Miamor Atmosphere"
                    className="absolute inset-0 w-full h-full object-cover scale-110 animate-slow-zoom"
                    onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1600&auto=format&fit=crop"
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-brown via-brand-brown/40 to-transparent" />
                <div className="absolute inset-0 bg-black/20" />

                <div className="relative z-10 max-w-2xl mx-auto w-full px-6 pb-8">
                    <div className="flex items-end justify-between gap-4">
                        <div className="animate-fade-in-up">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="h-px w-8 bg-brand-red hidden md:block" />
                                <span className="text-brand-red font-bold text-[10px] uppercase tracking-[0.3em]">
                                    {isWalkIn ? 'QR Walk-in' : 'Tempahan Meja'}
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-brand font-bold text-white tracking-wide leading-tight">
                                {isWalkIn ? 'Pesan Hidangan' : 'Cipta Kenangan'}
                            </h1>
                        </div>
                        {isWalkIn && roomName && (
                            <div className="mb-2 flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 animate-fade-in-up shadow-xl">
                                <MapPin className="w-4 h-4 text-brand-red" />
                                <span className="text-white font-bold text-xs uppercase tracking-widest">{roomName}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <main className={`${(currentStep === 'menu' || currentStep === 'summary') ? 'max-w-4xl' : 'max-w-2xl'} mx-auto px-4 py-8 pb-32 transition-all duration-700`}>

                {submitted && !isWalkIn ? (
                    <div className="max-w-md mx-auto animate-fade-in-up">
                        {/* Invitation/Receipt Card */}
                        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden relative border border-brand-brown/10">
                            {/* Header Section */}
                            <div className="p-8 pt-10 text-center">
                                <div className="w-20 h-20 bg-brand-brown/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Coffee className="w-10 h-10 text-brand-red" />
                                </div>

                                <h2 className="text-4xl font-brand font-bold text-brand-brown mb-2">
                                    Miamor
                                </h2>
                                <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-red mb-8">
                                    Coffee House
                                </p>

                                <div className="space-y-1 mb-8">
                                    <h3 className="text-2xl font-brand font-bold text-brand-brown">
                                        Pendaftaran Diterima
                                    </h3>
                                    <p className="text-brand-lightBrown text-sm">
                                        Terima kasih kerana memilih kami.
                                    </p>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-brand-brown/10 my-8" />

                                <div className="space-y-4 text-left bg-brand-brown/5 p-6 rounded-2xl border border-brand-brown/5">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-brand-lightBrown font-bold uppercase tracking-wider text-[10px]">Pelanggan</span>
                                        <span className="text-brand-brown font-bold">{customerName}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-brand-lightBrown font-bold uppercase tracking-wider text-[10px]">Tetamu</span>
                                        <span className="text-brand-brown font-bold">{guestCount} orang</span>
                                    </div>
                                    {date && time && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-brand-lightBrown font-bold uppercase tracking-wider text-[10px]">Tarikh & Masa</span>
                                            <span className="text-brand-brown font-bold text-right">
                                                {new Date(date).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })} • {time}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <p className="text-[10px] text-brand-lightBrown/60 mt-8 italic">
                                    *Sila nantikan pengesahan WhatsApp daripada kami.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-3">
                            {reservationId && (
                                <button
                                    onClick={() => navigate(`/order/${reservationId}`)}
                                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-brand-brown text-white font-bold hover:bg-brand-lightBrown transition-all shadow-xl shadow-brand-brown/20 active:scale-[0.98]"
                                >
                                    <Sparkles className="w-4 h-4 text-brand-red" />
                                    Jejak Status Pesanan
                                </button>
                            )}

                            <button
                                onClick={() => navigate('/')}
                                className="w-full py-4 rounded-2xl bg-white border border-brand-brown/10 text-brand-brown font-bold hover:bg-brand-brown/5 transition-all active:scale-[0.98]"
                            >
                                Kembali ke Utama
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Progress Steps — refined with labels and better visual weight */}
                        <div ref={formRef} className="mb-12 relative px-4 scroll-mt-24">
                            <div className="flex items-start justify-between">
                                {steps.map((s, i) => {
                                    const Icon = stepConfig[s].icon
                                    const isActive = i === step
                                    const isDone = i < step

                                    // Map step key to short display label
                                    const labels = {
                                        info: 'Info',
                                        datetime: 'Masa',
                                        menu: 'Menu',
                                        summary: 'Sahkan'
                                    }

                                    return (
                                        <div key={s} className="flex flex-col items-center flex-1 relative group">
                                            {/* Circle Icon */}
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 border-2 relative z-10 ${isActive
                                                ? 'bg-brand-brown border-brand-brown text-white shadow-2xl scale-110'
                                                : isDone
                                                    ? 'bg-brand-red border-brand-red text-white'
                                                    : 'bg-white border-brand-brown/10 text-brand-brown/20'
                                                }`}>
                                                {isDone ? (
                                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                                ) : (
                                                    <Icon className={`w-5 h-5 ${isActive ? 'animate-bounce-subtle' : ''}`} />
                                                )}

                                                {/* Status Glow for Active */}
                                                {isActive && (
                                                    <div className="absolute inset-0 rounded-full bg-brand-brown animate-ping opacity-20" />
                                                )}
                                            </div>

                                            {/* Text Label */}
                                            <span className={`mt-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${isActive ? 'text-brand-brown opacity-100' : isDone ? 'text-brand-red' : 'text-brand-brown/20'
                                                }`}>
                                                {labels[s]}
                                            </span>

                                            {/* Connecting Line (absolutely positioned) */}
                                            {i < steps.length - 1 && (
                                                <div className="absolute top-6 left-1/2 w-full -z-0">
                                                    <div className={`h-[2px] w-[80%] mx-auto transition-all duration-1000 ease-in-out ${isDone ? 'bg-brand-red shadow-[0_0_8px_rgba(198,40,40,0.3)]' : 'bg-brand-brown/10'
                                                        }`} />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Booking Card - Premium Glass style */}
                        <div className="glass-panel animate-fade-in-up transform transition-all duration-700">

                            <div className="p-6 md:p-10">
                                {/* Step Header - No Emoji */}
                                <div className="mb-6 text-center md:text-left">
                                    <h2 className="text-3xl md:text-4xl font-brand font-bold text-brand-brown leading-tight">
                                        {currentConfig.title}
                                    </h2>
                                    <div className="h-1 w-12 bg-brand-red mx-auto md:mx-0 mt-3 rounded-full" />
                                    <p className="text-brand-lightBrown text-sm font-medium mt-4 tracking-wide text-[11px] opacity-70">
                                        {currentConfig.subtitle}
                                    </p>
                                </div>

                                {/* Step Content */}
                                <div className="min-h-[320px] transition-all duration-500 ease-out">
                                    {currentStep === 'info' && (
                                        <div className="space-y-6">
                                            {/* Name input */}
                                            <div className="group">
                                                <label className="block text-xs font-bold tracking-wider text-brand-lightBrown uppercase mb-3">
                                                    {LABELS.CUSTOMER_NAME}
                                                </label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-brown/30 group-focus-within:text-brand-brown transition-colors" />
                                                    <input
                                                        type="text"
                                                        value={customerName}
                                                        onChange={(e) => setCustomerName(e.target.value)}
                                                        placeholder="Nama Penuh"
                                                        className="input-field pl-12 focus:ring-4 focus:ring-brand-brown/5"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>

                                            {/* WhatsApp input */}
                                            <div className="group">
                                                <label className="block text-xs font-bold tracking-wider text-brand-lightBrown uppercase mb-3">
                                                    {LABELS.WHATSAPP_NUMBER}
                                                </label>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-brown/30 group-focus-within:text-brand-brown transition-colors" />
                                                    <input
                                                        type="tel"
                                                        value={whatsappNumber}
                                                        onChange={(e) => setWhatsappNumber(e.target.value)}
                                                        placeholder="012-3456789"
                                                        className="input-field pl-12 focus:ring-4 focus:ring-brand-brown/5"
                                                    />
                                                </div>
                                            </div>

                                            {/* Guest count */}
                                            <div className="pt-2">
                                                <label className="block text-xs font-bold tracking-wider text-brand-lightBrown uppercase mb-4">
                                                    <Users className="w-4 h-4 inline mr-2 -mt-0.5" />
                                                    Bilangan Tetamu
                                                </label>
                                                <GuestCountInput value={guestCount} onChange={setGuestCount} />
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
                                        <div className="space-y-6">
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

                                            {/* Notes — placed in summary step */}
                                            <div className="group">
                                                <label className="block text-xs font-bold tracking-wider text-brand-lightBrown uppercase mb-3">
                                                    <StickyNote className="w-4 h-4 inline mr-2 -mt-0.5" />
                                                    Nota Tambahan (Pilihan)
                                                </label>
                                                <textarea
                                                    value={specialRequests}
                                                    onChange={(e) => setSpecialRequests(e.target.value)}
                                                    placeholder="Contoh: Nak tambah hiasan meja untuk hari lahir, sambutan ulang tahun, atau alahan..."
                                                    className="w-full bg-brand-brown/5 border-2 border-brand-brown/10 rounded-xl p-4 text-brand-brown placeholder-brand-brown/30 focus:outline-none focus:border-brand-brown/30 focus:bg-white transition-all text-sm min-h-[80px]"
                                                />
                                            </div>

                                            {/* Walk-in: optional name override */}
                                            {isWalkIn && (
                                                <div className="bg-brand-brown/5 rounded-xl p-4 border border-brand-brown/10">
                                                    <p className="text-xs font-bold text-brand-lightBrown uppercase tracking-wider mb-3">
                                                        Nama Anda (Pilihan)
                                                    </p>
                                                    <input
                                                        type="text"
                                                        value={customerName === 'Walk-in' ? '' : customerName}
                                                        onChange={(e) => setCustomerName(e.target.value || 'Walk-in')}
                                                        placeholder="Masukkan nama jika anda mahu"
                                                        className="w-full bg-white border border-brand-brown/10 rounded-lg px-4 py-2.5 text-sm text-brand-brown placeholder-brand-brown/30 focus:outline-none focus:border-brand-brown/30 transition-colors"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bottom Actions Bar */}
                            <div className="bg-gradient-to-t from-brand-brown/5 to-white p-4 md:p-6 border-t border-brand-brown/10 flex justify-between gap-4">
                                {!isFirstStep && (
                                    <button
                                        onClick={() => setStep((s) => s - 1)}
                                        className="px-6 py-3.5 rounded-xl text-brand-brown font-bold tracking-wide hover:bg-brand-brown/5 transition-colors flex items-center gap-2 border border-brand-brown/10"
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
                                            className="relative w-full md:w-auto px-8 py-3.5 rounded-xl bg-brand-brown text-white font-bold tracking-wide shadow-lg shadow-brand-brown/20 hover:shadow-xl hover:bg-brand-lightBrown transition-all flex items-center justify-center gap-2 min-w-[200px] disabled:opacity-50 overflow-hidden group"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                            {submitting ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    {isWalkIn ? 'Hantar Pesanan' : LABELS.SUBMIT}
                                                    <Send className="w-4 h-4 ml-1" />
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setStep((s) => s + 1)}
                                            disabled={!canProceed()}
                                            className="relative w-full md:w-auto px-8 py-3.5 rounded-xl bg-brand-brown text-white font-bold tracking-wide shadow-lg shadow-brand-brown/20 hover:shadow-xl hover:bg-brand-lightBrown transition-all flex items-center justify-center gap-2 min-w-[160px] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-lg overflow-hidden group"
                                        >
                                            {canProceed() && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                            )}
                                            {LABELS.NEXT}
                                            <ArrowRight className="w-4 h-4 ml-1" />
                                        </button>
                                    )}
                                </div>
                            </div>

                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    )
}
