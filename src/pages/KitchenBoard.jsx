import { useState, useEffect, useRef } from 'react'
import { Clock, CheckCircle, Users, MapPin, UtensilsCrossed, Flame } from 'lucide-react'
import Header from '../components/Header'
import { supabase } from '../lib/supabase'
import { LABELS, ORDER_STATUS } from '../lib/constants'

export default function KitchenBoard() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const intervalRef = useRef(null)
    const [now, setNow] = useState(new Date())

    useEffect(() => {
        fetchConfirmedOrders()

        // Subscribe to real-time updates
        const channel = supabase
            .channel('kitchen-orders')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'reservations' },
                () => fetchConfirmedOrders()
            )
            .subscribe()

        // Tick every second for countdown
        intervalRef.current = setInterval(() => setNow(new Date()), 1000)

        return () => {
            supabase.removeChannel(channel)
            clearInterval(intervalRef.current)
        }
    }, [])

    const fetchConfirmedOrders = async () => {
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
                .eq('status', ORDER_STATUS.CONFIRMED)
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

    const handleDone = async (id) => {
        try {
            await supabase
                .from('reservations')
                .update({ status: ORDER_STATUS.COMPLETED })
                .eq('id', id)
            fetchConfirmedOrders()
        } catch (err) {
            console.error('Error:', err)
            // Demo: remove from local state
            setOrders((prev) => prev.filter((o) => o.id !== id))
        }
    }

    // ── Urgency calculation ──
    const getUrgency = (startTime) => {
        const diff = new Date(startTime) - now
        const minutes = Math.floor(diff / 60000)

        if (minutes < 0) {
            return { level: 'overdue', label: 'TERLAMBAT', color: 'bg-red-600', textColor: 'text-red-300', borderColor: 'border-red-500/50', pulse: true }
        }
        if (minutes < 5) {
            return { level: 'critical', label: `${minutes}m`, color: 'bg-red-500/20', textColor: 'text-red-400', borderColor: 'border-red-500/40', pulse: true }
        }
        if (minutes < 15) {
            return { level: 'urgent', label: `${minutes}m`, color: 'bg-amber-500/20', textColor: 'text-amber-400', borderColor: 'border-amber-500/40', pulse: false }
        }
        if (minutes < 30) {
            return { level: 'soon', label: `${minutes}m`, color: 'bg-yellow-500/10', textColor: 'text-yellow-400', borderColor: 'border-yellow-500/30', pulse: false }
        }
        return { level: 'normal', label: `${minutes}m`, color: 'bg-emerald-500/10', textColor: 'text-emerald-400', borderColor: 'border-emerald-500/30', pulse: false }
    }

    const formatCountdown = (startTime) => {
        const diff = new Date(startTime) - now
        if (diff < 0) return 'TERLAMBAT'
        const hours = Math.floor(diff / 3600000)
        const mins = Math.floor((diff % 3600000) / 60000)
        const secs = Math.floor((diff % 60000) / 1000)
        if (hours > 0) return `${hours}j ${mins}m`
        return `${mins}m ${secs}s`
    }

    return (
        <div className="min-h-screen bg-dark-950">
            <Header title={LABELS.KITCHEN_BOARD} />

            <main className="max-w-6xl mx-auto px-4 py-6">
                {/* Header info */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Flame className="w-6 h-6 text-brand-400" />
                        <h2 className="text-xl font-display font-bold text-white">
                            {LABELS.KITCHEN_BOARD}
                        </h2>
                        <span className="badge bg-brand-500/20 text-brand-400 border-brand-500/30 text-sm">
                            {orders.length} pesanan
                        </span>
                    </div>
                    <div className="text-sm text-dark-400">
                        {now.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                </div>

                {/* Orders grid */}
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20">
                        <UtensilsCrossed className="w-16 h-16 text-dark-700 mx-auto mb-4" />
                        <p className="text-dark-500 text-lg">Tiada pesanan untuk disediakan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {orders.map((order) => {
                            const urgency = getUrgency(order.start_time)

                            return (
                                <div
                                    key={order.id}
                                    className={`rounded-2xl border-2 ${urgency.borderColor} ${urgency.color} p-5 transition-all duration-300 ${urgency.pulse ? 'urgency-critical' : ''
                                        }`}
                                >
                                    {/* Order header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-display font-bold text-white text-xl">
                                                {order.customer_name}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1 text-sm">
                                                {order.rooms && (
                                                    <span className="flex items-center gap-1 text-dark-300">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {order.rooms.name}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1 text-dark-300">
                                                    <Users className="w-3.5 h-3.5" />
                                                    {order.guest_count}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Countdown */}
                                        <div className={`text-right ${urgency.textColor}`}>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span className="font-mono font-bold text-lg">
                                                    {formatCountdown(order.start_time)}
                                                </span>
                                            </div>
                                            <p className="text-xs opacity-75 mt-0.5">
                                                {new Date(order.start_time).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Items list */}
                                    {order.reservation_items && order.reservation_items.length > 0 && (
                                        <div className="bg-dark-900/40 rounded-xl p-3 mb-4">
                                            <div className="space-y-2">
                                                {order.reservation_items.map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between">
                                                        <span className="text-white font-medium">
                                                            {item.menu_items?.name || 'Unknown'}
                                                        </span>
                                                        <span className="text-lg font-bold text-dark-300">
                                                            ×{item.quantity}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Walk-in badge */}
                                    {order.order_type === 'qr_walkin' && (
                                        <div className="badge-walkin mb-3">QR Walk-in</div>
                                    )}

                                    {/* Done button */}
                                    <button
                                        onClick={() => handleDone(order.id)}
                                        className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-lg shadow-emerald-600/20"
                                    >
                                        <CheckCircle className="w-6 h-6" />
                                        {LABELS.DONE_COOKING}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}

function getSampleKitchenOrders() {
    return [
        {
            id: '1', customer_name: 'Ahmad Faizal', guest_count: 4,
            start_time: new Date(Date.now() + 600000).toISOString(), // 10 mins
            order_type: 'remote', rooms: { name: 'La Amistad' },
            reservation_items: [
                { quantity: 2, menu_items: { name: 'Latte' } },
                { quantity: 1, menu_items: { name: 'Nasi Lemak Ayam' } },
                { quantity: 1, menu_items: { name: 'Cappuccino' } },
            ]
        },
        {
            id: '2', customer_name: 'Siti Aminah', guest_count: 2,
            start_time: new Date(Date.now() + 180000).toISOString(), // 3 mins — critical!
            order_type: 'qr_walkin', rooms: { name: 'Duo' },
            reservation_items: [
                { quantity: 1, menu_items: { name: 'Cappuccino' } },
                { quantity: 1, menu_items: { name: 'Churros' } },
            ]
        },
        {
            id: '3', customer_name: 'Razak bin Ali', guest_count: 8,
            start_time: new Date(Date.now() + 2400000).toISOString(), // 40 mins
            order_type: 'remote', rooms: { name: 'El Corazon' },
            reservation_items: [
                { quantity: 4, menu_items: { name: 'Mocha' } },
                { quantity: 3, menu_items: { name: 'Pasta Carbonara' } },
                { quantity: 2, menu_items: { name: 'Kek Coklat Lava' } },
            ]
        },
    ]
}
