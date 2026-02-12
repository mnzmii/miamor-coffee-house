import { useState, useEffect, useRef } from 'react'
import { Clock, CheckCircle, Users, MapPin, UtensilsCrossed, Flame, AlertTriangle, History, ArrowLeft, Calendar, Coffee } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { supabase } from '../lib/supabase'
import { LABELS, ORDER_STATUS } from '../lib/constants'

export default function KitchenBoard() {
    const [orders, setOrders] = useState([])
    const [history, setHistory] = useState([])
    const [upcoming, setUpcoming] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('active') // 'active' | 'history' | 'upcoming'
    const intervalRef = useRef(null)
    const [now, setNow] = useState(new Date())
    const [confirmId, setConfirmId] = useState(null)

    useEffect(() => {
        fetchConfirmedOrders()
        fetchHistory()
        fetchUpcomingOrders()

        const channel = supabase
            .channel('kitchen-orders')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'reservations' },
                () => {
                    fetchConfirmedOrders()
                    fetchHistory()
                    fetchUpcomingOrders()
                }
            )
            .subscribe()

        intervalRef.current = setInterval(() => setNow(new Date()), 1000)

        return () => {
            supabase.removeChannel(channel)
            clearInterval(intervalRef.current)
        }
    }, [])

    const fetchConfirmedOrders = async () => {
        try {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)

            const { data, error } = await supabase
                .from('reservations')
                .select(`
          *,
          rooms ( name ),
          reservation_items (
            quantity,
            menu_items ( name )
          )
        `)
                .eq('status', ORDER_STATUS.CONFIRMED)
                .gte('start_time', today.toISOString())
                .lt('start_time', tomorrow.toISOString())
                .order('start_time', { ascending: true })

            if (error) throw error
            setOrders(data || [])
        } catch (err) {
            console.error('Error:', err)
            setOrders(getSampleKitchenOrders())
        } finally {
            setLoading(false)
        }
    }

    const fetchHistory = async () => {
        try {
            const { data, error } = await supabase
                .from('reservations')
                .select(`
          *,
          rooms ( name ),
          reservation_items (
            quantity,
            menu_items ( name )
          )
        `)
                .eq('status', ORDER_STATUS.COMPLETED)
                .order('updated_at', { ascending: false })
                .limit(20)

            if (error) throw error
            setHistory(data || [])
        } catch (err) {
            console.error('History error:', err)
            setHistory([])
        }
    }

    const fetchUpcomingOrders = async () => {
        try {
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            tomorrow.setHours(0, 0, 0, 0)

            const { data, error } = await supabase
                .from('reservations')
                .select(`
          *,
          rooms ( name ),
          reservation_items (
            quantity,
            menu_items ( name )
          )
        `)
                .eq('status', ORDER_STATUS.CONFIRMED)
                .gte('start_time', tomorrow.toISOString())
                .order('start_time', { ascending: true })

            if (error) throw error
            setUpcoming(data || [])
        } catch (err) {
            console.error('Upcoming error:', err)
            setUpcoming([])
        }
    }

    const handleDone = async (id) => {
        try {
            await supabase
                .from('reservations')
                .update({ status: ORDER_STATUS.COMPLETED })
                .eq('id', id)
            fetchConfirmedOrders()
            fetchHistory()
            fetchUpcomingOrders()
            setConfirmId(null)
        } catch (err) {
            console.error('Error:', err)
            setOrders((prev) => prev.filter((o) => o.id !== id))
        }
    }

    const getUrgency = (startTime) => {
        const diff = new Date(startTime) - now
        const minutes = Math.floor(diff / 60000)

        if (minutes < 0) {
            return {
                level: 'overdue',
                label: 'TERLAMBAT',
                bgColor: 'bg-red-500',
                borderColor: 'border-red-500',
                stripeColor: 'bg-red-600',
                itemBg: 'bg-red-50/70',
                itemBorder: 'border-red-100',
                qtyColor: 'text-red-600',
                textColor: 'text-white',
                pulse: true
            }
        }
        if (minutes < 5) {
            return {
                level: 'critical',
                label: `${minutes} MIN`,
                bgColor: 'bg-orange-500',
                borderColor: 'border-orange-500',
                stripeColor: 'bg-orange-500',
                itemBg: 'bg-orange-50/70',
                itemBorder: 'border-orange-100',
                qtyColor: 'text-orange-600',
                textColor: 'text-white',
                pulse: true
            }
        }
        if (minutes < 15) {
            return {
                level: 'urgent',
                label: `${minutes} MIN`,
                bgColor: 'bg-amber-500',
                borderColor: 'border-amber-500',
                stripeColor: 'bg-amber-500',
                itemBg: 'bg-amber-50/70',
                itemBorder: 'border-amber-100',
                qtyColor: 'text-amber-600',
                textColor: 'text-white',
                pulse: false
            }
        }
        return {
            level: 'normal',
            label: 'MENUNGGU',
            bgColor: 'bg-emerald-600',
            borderColor: 'border-emerald-500/50',
            stripeColor: 'bg-emerald-600',
            itemBg: 'bg-emerald-50/70',
            itemBorder: 'border-emerald-100',
            qtyColor: 'text-emerald-600',
            textColor: 'text-white',
            pulse: false
        }
    }

    const formatCountdown = (startTime) => {
        const diff = new Date(startTime) - now
        if (diff < 0) return '00:00'
        const hours = Math.floor(diff / 3600000)
        const mins = Math.floor((diff % 3600000) / 60000)
        const secs = Math.floor((diff % 60000) / 1000)
        if (hours > 0) return `${hours}j ${mins}m`
        return `${mins}m ${secs}s`
    }

    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })
    }

    const formatDate = (dateStr) => {
        const d = new Date(dateStr)
        const today = new Date()
        if (d.toDateString() === today.toDateString()) return 'Hari ini'
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        if (d.toDateString() === yesterday.toDateString()) return 'Semalam'
        return d.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' })
    }

    return (
        <div className="min-h-screen flex">
            {/* Sidebar Navigation */}
            <Sidebar />
            <div className="hidden md:block w-20 lg:w-64 flex-shrink-0" />

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-brand-brown z-30 flex items-center px-4 pr-14 shadow-lg shadow-brand-brown/10">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-brand-beige/10 rounded-full">
                        <Coffee className="w-5 h-5 text-brand-red" />
                    </div>
                    <div>
                        <h1 className="font-brand font-bold text-lg tracking-wide text-white">MIAMOR</h1>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-brand-beige/60">Portal Kakitangan</p>
                    </div>
                </div>
            </div>

            <main className="flex-1 px-4 py-20 md:py-8 overflow-y-auto h-screen">

                {/* Desktop Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-brand-red/10 rounded-xl">
                            <Flame className="w-8 h-8 text-brand-red" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-brand font-bold text-brand-brown tracking-wide">
                                Papan Dapur
                            </h2>
                            <p className="text-brand-lightBrown text-sm mt-1">
                                {orders.length} pesanan aktif
                            </p>
                        </div>
                    </div>
                    <div className="hidden md:block text-right glass-card px-4 py-2 border-white/5">
                        <div className="text-3xl font-mono font-bold text-brand-brown">
                            {now.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center justify-end gap-1.5 mt-1">
                            <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                            <p className="text-brand-lightBrown text-[10px] font-bold uppercase tracking-widest leading-none">
                                Sistem Langsung
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs & Time Bar */}
                <div className="flex items-center justify-between gap-2 mb-6">
                    {/* Tabs Group */}
                    <div className="flex items-center gap-2 glass-card p-1 shadow-sm overflow-x-auto no-scrollbar flex-1 w-0 sm:w-fit">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'active'
                                ? 'bg-brand-brown text-white shadow-lg'
                                : 'text-brand-lightBrown hover:bg-brand-brown/5'
                                }`}
                        >
                            <Flame className="w-4 h-4" />
                            Aktif
                            {orders.length > 0 && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'active' ? 'bg-white/20' : 'bg-brand-brown/10'
                                    }`}>
                                    {orders.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'upcoming'
                                ? 'bg-brand-brown text-white shadow-lg'
                                : 'text-brand-lightBrown hover:bg-brand-brown/5'
                                }`}
                        >
                            <Calendar className="w-4 h-4" />
                            Akan Datang
                            {upcoming.length > 0 && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'upcoming' ? 'bg-white/20' : 'bg-brand-brown/10'
                                    }`}>
                                    {upcoming.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'history'
                                ? 'bg-brand-brown text-white shadow-lg'
                                : 'text-brand-lightBrown hover:bg-brand-brown/5'
                                }`}
                        >
                            <History className="w-4 h-4" />
                            Sejarah
                            {history.length > 0 && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'history' ? 'bg-white/20' : 'bg-brand-brown/10'
                                    }`}>
                                    {history.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Mobile Time Display */}
                    <div className="md:hidden pr-1 shrink-0">
                        <div className="flex flex-col items-end gap-0.5 bg-white border border-brand-brown/10 px-3 py-1.5 rounded-lg shadow-sm">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-brand-brown/60" />
                                <span className="font-mono font-bold text-brand-brown text-lg">
                                    {now.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                                <span className="text-brand-lightBrown text-[9px] font-bold uppercase tracking-widest leading-none">
                                    SISTEM LANGSUNG
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Active Orders Tab ─── */}
                {activeTab === 'active' && (
                    <>
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-32 bg-brand-brown/5 rounded-3xl border-2 border-dashed border-brand-brown/10">
                                <UtensilsCrossed className="w-20 h-20 text-brand-brown/20 mx-auto mb-6" />
                                <h3 className="text-2xl font-display font-bold text-brand-brown/50">Dapur Tenang</h3>
                                <p className="text-brand-lightBrown mt-2">Tiada pesanan untuk disediakan.</p>
                            </div>
                        ) : (
                            <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
                                {orders.map((order) => {
                                    const urgency = getUrgency(order.start_time)
                                    return (
                                        <div key={order.id} className="break-inside-avoid-column">
                                            <div
                                                className={`flex flex-col rounded-2xl border-2 p-4 transition-all duration-500 relative overflow-hidden glass-card mb-6
                                                    ${urgency.level === 'overdue' ? 'shadow-2xl shadow-red-500/20' : 'shadow-xl shadow-brand-brown/5'}
                                                    ${urgency.borderColor}
                                                `}
                                            >
                                                <div className={`absolute top-0 left-0 w-1.5 h-full ${urgency.stripeColor}`} />
                                                {urgency.pulse && (
                                                    <div className="absolute inset-0 bg-red-600/5 animate-shimmer" />
                                                )}
                                                {/* Countdown Header */}
                                                <div className="flex items-center justify-between mb-3 pb-3 border-b border-brand-brown/10">
                                                    <div>
                                                        <p className="text-brand-lightBrown text-[9px] uppercase tracking-wider font-bold mb-0.5">BAKI MASA</p>
                                                        <span className="font-mono font-bold text-2xl tracking-tight text-brand-brown">
                                                            {formatCountdown(order.start_time)}
                                                        </span>
                                                    </div>
                                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${urgency.bgColor} ${urgency.textColor} border-transparent shadow-sm`}>
                                                        {urgency.label}
                                                    </span>
                                                </div>

                                                <div className="mb-2.5 pl-2">
                                                    <h3 className="font-display font-bold text-xl text-brand-brown mb-0.5 leading-tight">
                                                        {order.customer_name}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[13px] text-brand-lightBrown mb-1">
                                                        <div className={`flex items-center gap-1 ${urgency.level === 'normal' ? 'text-brand-lightBrown' : 'text-brand-red font-bold'}`}>
                                                            <Clock className="w-3.5 h-3.5" />
                                                            <span>Waktu Booking: {formatTime(order.start_time)}</span>
                                                        </div>
                                                        {order.rooms && (
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="w-3.5 h-3.5" />
                                                                <span className="text-brand-brown font-medium">{order.rooms.name}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-1">
                                                            <Users className="w-3.5 h-3.5" />
                                                            <span>{order.guest_count} pax</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={`${urgency.itemBg} rounded-xl p-4 mb-4 border ${urgency.itemBorder} pl-3`}>
                                                    <div className="space-y-3">
                                                        {order.reservation_items?.map((item, i) => (
                                                            <div key={i} className="flex items-start justify-between gap-4">
                                                                <span className="text-brand-brown font-medium text-lg leading-snug">
                                                                    {item.menu_items?.name}
                                                                </span>
                                                                <span className={`text-xl font-bold ${urgency.qtyColor} whitespace-nowrap`}>
                                                                    x{item.quantity}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => setConfirmId(order.id)}
                                                    className={`mt-auto w-full py-2.5 rounded-lg font-bold text-base tracking-wide flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md
                                                        ${urgency.level === 'overdue'
                                                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20'
                                                            : 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-emerald-900/20'}
                                                    `}
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                    Selesai Masak
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </>
                )}

                {/* ─── History Tab ─── */}
                {activeTab === 'history' && (
                    <div>
                        {history.length === 0 ? (
                            <div className="text-center py-32 bg-brand-brown/5 rounded-3xl border-2 border-dashed border-brand-brown/10">
                                <History className="w-20 h-20 text-brand-brown/20 mx-auto mb-6" />
                                <h3 className="text-2xl font-display font-bold text-brand-brown/50">Tiada Sejarah</h3>
                                <p className="text-brand-lightBrown mt-2">Belum ada pesanan yang diselesaikan.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {history.map((order) => (
                                    <div
                                        key={order.id}
                                        className="bg-white border border-brand-brown/10 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-brand-brown text-lg">{order.customer_name}</h4>
                                                    <div className="flex items-center gap-3 text-xs text-brand-lightBrown">
                                                        {order.rooms && (
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="w-3 h-3" />
                                                                {order.rooms.name}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-1">
                                                            <Users className="w-3 h-3" />
                                                            {order.guest_count} pax
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-brand-brown">{formatTime(order.start_time)}</p>
                                                <p className="text-xs text-brand-lightBrown">{formatDate(order.updated_at || order.start_time)}</p>
                                            </div>
                                        </div>
                                        {order.reservation_items?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-3 border-t border-brand-brown/5">
                                                {order.reservation_items.map((item, i) => (
                                                    <span key={i} className="text-xs font-medium bg-brand-brown/5 px-3 py-1 rounded-full text-brand-brown">
                                                        {item.menu_items?.name} × {item.quantity}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ─── Upcoming Orders Tab ─── */}
                {activeTab === 'upcoming' && (
                    <div>
                        {upcoming.length === 0 ? (
                            <div className="text-center py-32 bg-brand-brown/5 rounded-3xl border-2 border-dashed border-brand-brown/10">
                                <Calendar className="w-20 h-20 text-brand-brown/20 mx-auto mb-6" />
                                <h3 className="text-2xl font-display font-bold text-brand-brown/50">Tiada Tempahan</h3>
                                <p className="text-brand-lightBrown mt-2">Belum ada tempahan untuk hari-hari akan datang.</p>
                            </div>
                        ) : (
                            <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
                                {upcoming.map((order) => (
                                    <div key={order.id} className="break-inside-avoid-column">
                                        <div
                                            className="flex flex-col rounded-2xl border-2 border-brand-brown/10 p-4 transition-all duration-500 relative overflow-hidden glass-card shadow-xl shadow-brand-brown/5 mb-6"
                                        >
                                            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />

                                            {/* Date/Time Header */}
                                            <div className="flex items-center justify-between mb-3 pb-3 border-b border-brand-brown/10">
                                                <div>
                                                    <p className="text-brand-lightBrown text-[9px] uppercase tracking-wider font-bold mb-0.5">TARIKH & MASA</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-display font-bold text-lg text-brand-brown whitespace-nowrap">
                                                            {formatDate(order.start_time)}
                                                        </span>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-brown/20" />
                                                        <span className="font-mono font-bold text-lg text-brand-brown">
                                                            {formatTime(order.start_time)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-indigo-600 text-white border-transparent shadow-sm">
                                                    AKAN DATANG
                                                </span>
                                            </div>

                                            <div className="mb-2.5 pl-2">
                                                <h3 className="font-display font-bold text-xl text-brand-brown mb-0.5 leading-tight">
                                                    {order.customer_name}
                                                </h3>
                                                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[13px] text-brand-lightBrown mb-1">
                                                    {order.rooms && (
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-3.5 h-3.5" />
                                                            <span className="text-brand-brown font-medium">{order.rooms.name}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1">
                                                        <Users className="w-3.5 h-3.5" />
                                                        <span>{order.guest_count} pax</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-indigo-50/50 rounded-lg p-3 border border-indigo-100 pl-2 mt-auto">
                                                <div className="space-y-2">
                                                    {order.reservation_items?.map((item, i) => (
                                                        <div key={i} className="flex items-start justify-between gap-3">
                                                            <span className="text-brand-brown font-medium text-base leading-tight">
                                                                {item.menu_items?.name}
                                                            </span>
                                                            <span className="text-lg font-bold text-indigo-600 whitespace-nowrap">
                                                                x{item.quantity}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Confirmation Modal */}
            {
                confirmId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-fade-in">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="w-8 h-8 text-amber-600" />
                            </div>
                            <h3 className="font-brand font-bold text-xl text-brand-brown mb-2">Sahkan Siap?</h3>
                            <p className="text-brand-lightBrown text-sm mb-8">
                                Adakah pesanan ini sudah siap untuk dihidangkan?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmId(null)}
                                    className="flex-1 py-3 rounded-xl border-2 border-brand-brown/10 text-brand-brown font-bold hover:bg-brand-brown/5 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => handleDone(confirmId)}
                                    className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                                >
                                    Ya, Siap!
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}

function getSampleKitchenOrders() {
    return [
        {
            id: '1', customer_name: 'Ahmad Faizal', guest_count: 4,
            start_time: new Date(Date.now() + 600000).toISOString(),
            order_type: 'remote', rooms: { name: 'La Amistad' },
            reservation_items: [
                { quantity: 2, menu_items: { name: 'Latte' } },
                { quantity: 1, menu_items: { name: 'Nasi Lemak Ayam' } },
            ]
        },
        {
            id: '2', customer_name: 'Siti Aminah', guest_count: 2,
            start_time: new Date(Date.now() - 60000).toISOString(),
            order_type: 'qr_walkin', rooms: { name: 'Duo' },
            reservation_items: [
                { quantity: 1, menu_items: { name: 'Cappuccino' } },
            ]
        },
    ]
}
