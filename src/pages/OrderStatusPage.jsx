import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, Clock, ChefHat, Coffee, ArrowLeft, Sparkles, MapPin } from 'lucide-react'
import Header from '../components/Header'
import { supabase } from '../lib/supabase'

const STATUS_STEPS = [
    {
        key: 'pending',
        label: 'Diterima',
        desc: 'Pesanan anda telah diterima oleh sistem.',
        icon: CheckCircle2,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500',
    },
    {
        key: 'confirmed',
        label: 'Sedang Masak',
        desc: 'Dapur sedang menyediakan pesanan anda.',
        icon: ChefHat,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500',
    },
    {
        key: 'completed',
        label: 'Sedia!',
        desc: 'Pesanan anda sudah siap. Selamat menikmati!',
        icon: Sparkles,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500',
    },
]

const STATUS_INDEX = { pending: 0, confirmed: 1, completed: 2 }

export default function OrderStatusPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [reservation, setReservation] = useState(null)
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchOrder()
        // Subscribe to realtime updates
        const channel = supabase
            .channel(`order-${id}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'reservations', filter: `id=eq.${id}` },
                (payload) => {
                    setReservation(prev => ({ ...prev, ...payload.new }))
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [id])

    const fetchOrder = async () => {
        try {
            const { data: res, error: resError } = await supabase
                .from('reservations')
                .select(`
                    *,
                    rooms ( name ),
                    reservation_items (
                        quantity,
                        menu_items ( name, price )
                    )
                `)
                .eq('id', id)
                .single()

            if (resError) throw resError
            setReservation(res)
            setItems(res.reservation_items || [])
        } catch (err) {
            console.error('Error:', err)
            setError('Pesanan tidak dijumpai.')
        } finally {
            setLoading(false)
        }
    }

    const currentStatusIndex = reservation ? (STATUS_INDEX[reservation.status] ?? 0) : 0
    const total = items.reduce((sum, item) => sum + (item.menu_items?.price || 0) * item.quantity, 0)
    const isCompleted = reservation?.status === 'completed'

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-cream bg-paper-texture">
                <Header />
                <div className="flex justify-center items-center py-32">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-brand-brown border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-brand-lightBrown">Memuatkan pesanan...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !reservation) {
        return (
            <div className="min-h-screen bg-brand-cream bg-paper-texture">
                <Header />
                <div className="max-w-md mx-auto px-6 py-32 text-center">
                    <Coffee className="w-16 h-16 text-brand-brown/20 mx-auto mb-4" />
                    <h2 className="text-2xl font-brand font-bold text-brand-brown mb-3">Pesanan Tidak Dijumpai</h2>
                    <p className="text-brand-lightBrown mb-8">{error || 'Sila semak semula pautan anda.'}</p>
                    <button onClick={() => navigate('/')} className="btn-secondary">
                        Kembali ke Utama
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-brand-cream bg-paper-texture">
            <Header />
            <div className="h-16" /> {/* Spacer for fixed header */}

            <main className="max-w-lg mx-auto px-4 py-8 pb-20">

                {/* Hero card */}
                <div className={`rounded-3xl overflow-hidden shadow-2xl mb-8 ${isCompleted ? 'bg-gradient-to-br from-emerald-600 to-emerald-700' : 'bg-gradient-to-br from-brand-brown to-[#1a0f0d]'}`}>
                    <div className="p-8 text-center text-white">
                        <div className={`w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center ${isCompleted ? 'bg-white/20 ring-4 ring-white/30' : 'bg-white/10 ring-4 ring-white/10'}`}>
                            {isCompleted ? (
                                <Sparkles className="w-10 h-10 text-white animate-pulse" />
                            ) : (
                                <ChefHat className="w-10 h-10 text-white" />
                            )}
                        </div>
                        <h1 className="font-brand font-bold text-2xl md:text-3xl tracking-wide">
                            {isCompleted ? 'Pesanan Siap!' : 'Pesanan Anda'}
                        </h1>
                        <p className="text-white/60 text-sm mt-2">
                            {isCompleted ? 'Selamat menikmati hidangan anda ☕' : 'Kami sedang menyediakan pesanan anda...'}
                        </p>

                        {reservation.rooms?.name && (
                            <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 bg-white/10 rounded-full border border-white/20">
                                <MapPin className="w-3.5 h-3.5 text-white/70" />
                                <span className="text-white/90 text-sm font-bold">{reservation.rooms.name}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="bg-white rounded-2xl p-6 shadow-lg shadow-brand-brown/5 border border-brand-brown/10 mb-6">
                    <h3 className="text-xs font-bold text-brand-lightBrown uppercase tracking-wider mb-6">Status Pesanan</h3>

                    <div className="relative">
                        {STATUS_STEPS.map((step, i) => {
                            const isActive = i <= currentStatusIndex
                            const isCurrent = i === currentStatusIndex
                            const StepIcon = step.icon
                            return (
                                <div key={step.key} className="flex items-start gap-4 relative">
                                    {/* Connector line */}
                                    {i < STATUS_STEPS.length - 1 && (
                                        <div className={`absolute left-[19px] top-10 w-0.5 h-12 ${i < currentStatusIndex ? step.bgColor : 'bg-brand-brown/10'}`} />
                                    )}

                                    {/* Step circle */}
                                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isActive
                                        ? `${step.bgColor} text-white shadow-lg ${isCurrent ? 'ring-4 ring-offset-2 ring-offset-white scale-110' : ''}`
                                        : 'bg-brand-brown/10 text-brand-brown/30'
                                        }`}
                                        style={isCurrent ? { ringColor: step.bgColor.replace('bg-', '').replace('-500', '') } : {}}
                                    >
                                        <StepIcon className="w-5 h-5" />
                                    </div>

                                    {/* Step content */}
                                    <div className={`pb-8 ${i === STATUS_STEPS.length - 1 ? 'pb-0' : ''}`}>
                                        <h4 className={`font-bold text-base ${isActive ? 'text-brand-brown' : 'text-brand-brown/30'}`}>
                                            {step.label}
                                            {isCurrent && (
                                                <span className={`ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${step.bgColor}`}>
                                                    {isCompleted ? '✓' : '•••'}
                                                </span>
                                            )}
                                        </h4>
                                        <p className={`text-sm mt-0.5 ${isActive ? 'text-brand-lightBrown' : 'text-brand-brown/20'}`}>
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Order details */}
                {items.length > 0 && (
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-brand-brown/5 border border-brand-brown/10 mb-6">
                        <div className="bg-brand-brown/5 px-5 py-3 border-b border-brand-brown/10">
                            <h4 className="font-brand font-bold text-brand-brown text-sm">Butiran Pesanan</h4>
                        </div>
                        <div className="divide-y divide-brand-brown/5">
                            {items.map((item, i) => (
                                <div key={i} className="px-5 py-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-brand-brown font-medium">{item.menu_items?.name}</p>
                                        <p className="text-xs text-brand-lightBrown">x {item.quantity}</p>
                                    </div>
                                    <p className="text-brand-brown font-bold">
                                        RM {((item.menu_items?.price || 0) * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                            <div className="px-5 py-4 flex items-center justify-between bg-brand-brown/5">
                                <p className="font-bold text-brand-brown">Jumlah</p>
                                <p className="text-xl font-brand font-bold text-brand-brown">
                                    RM {total.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Customer info */}
                <div className="bg-white rounded-2xl p-5 shadow-lg shadow-brand-brown/5 border border-brand-brown/10 mb-6">
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-brand-lightBrown">Pelanggan</span>
                            <span className="text-brand-brown font-bold">{reservation.customer_name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-brand-lightBrown">Jenis</span>
                            <span className="text-brand-brown font-bold">
                                {reservation.order_type === 'qr_walkin' ? 'Walk-in' : 'Tempahan'}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-brand-lightBrown">Masa</span>
                            <span className="text-brand-brown font-bold">
                                {new Date(reservation.start_time).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Back button */}
                <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-brown/5 border border-brand-brown/10 text-brand-brown font-bold hover:bg-brand-brown/10 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Utama
                </button>
            </main>
        </div>
    )
}
