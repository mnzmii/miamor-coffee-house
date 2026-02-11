import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    RefreshCw, ExternalLink, Settings, Users, Clock,
    MessageCircle, Zap, Filter, Coffee
} from 'lucide-react'
import Header from '../components/Header'
import StatusBadge from '../components/StatusBadge'
import RoomAssignModal from '../components/RoomAssignModal'
import { supabase } from '../lib/supabase'
import {
    LABELS, ORDER_STATUS, ORDER_TYPE,
    getWhatsAppConfirmationMessage, getWhatsAppLink
} from '../lib/constants'

export default function StaffDashboard() {
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [assignModalData, setAssignModalData] = useState(null)
    const [syncingId, setSyncingId] = useState(null)

    useEffect(() => {
        fetchReservations()
        // Subscribe to real-time updates
        const channel = supabase
            .channel('reservations-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'reservations' },
                () => fetchReservations()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const fetchReservations = async () => {
        try {
            const { data, error } = await supabase
                .from('reservations')
                .select(`
          *,
          rooms ( name, capacity ),
          reservation_items (
            quantity,
            menu_items ( name, price )
          )
        `)
                .order('created_at', { ascending: false })

            if (error) throw error
            setReservations(data || [])
        } catch (err) {
            console.error('Error fetching:', err)
            setReservations(getSampleReservations())
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = (reservation) => {
        setAssignModalData(reservation)
    }

    const handleRoomAssigned = async (room) => {
        const reservation = assignModalData
        try {
            const { error } = await supabase
                .from('reservations')
                .update({
                    status: ORDER_STATUS.CONFIRMED,
                    room_id: room.id,
                })
                .eq('id', reservation.id)

            if (error) throw error

            // Open WhatsApp confirmation
            const message = getWhatsAppConfirmationMessage(
                reservation.customer_name,
                room.name,
                reservation.start_time
            )
            const waLink = getWhatsAppLink(reservation.whatsapp_number, message)
            window.open(waLink, '_blank')

            setAssignModalData(null)
            fetchReservations()
        } catch (err) {
            console.error('Error approving:', err)
            setAssignModalData(null)
        }
    }

    const handleComplete = async (id) => {
        try {
            await supabase
                .from('reservations')
                .update({ status: ORDER_STATUS.COMPLETED })
                .eq('id', id)
            fetchReservations()
        } catch (err) {
            console.error('Error completing:', err)
        }
    }

    const handleSync = async (reservation) => {
        setSyncingId(reservation.id)
        try {
            // Call Loyverse Edge Function (when configured)
            // For now, just mark as synced
            await supabase
                .from('reservations')
                .update({ is_synced: true })
                .eq('id', reservation.id)
            fetchReservations()
        } catch (err) {
            console.error('Sync error:', err)
        } finally {
            setSyncingId(null)
        }
    }

    const filteredReservations = reservations.filter((r) => {
        if (filter === 'all') return true
        return r.status === filter
    })

    const filterTabs = [
        { key: 'all', label: LABELS.ALL_ORDERS },
        { key: ORDER_STATUS.PENDING, label: LABELS.STATUS_PENDING },
        { key: ORDER_STATUS.CONFIRMED, label: LABELS.STATUS_CONFIRMED },
        { key: ORDER_STATUS.COMPLETED, label: LABELS.STATUS_COMPLETED },
    ]

    const getItemsTotal = (items) => {
        if (!items || items.length === 0) return 0
        return items.reduce((sum, item) => {
            const price = item.menu_items?.price || 0
            return sum + price * item.quantity
        }, 0)
    }

    return (
        <div className="min-h-screen bg-dark-950">
            <Header title={LABELS.STAFF_DASHBOARD} />

            <main className="max-w-4xl mx-auto px-4 py-6">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-dark-400" />
                        <div className="flex gap-1.5 overflow-x-auto">
                            {filterTabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setFilter(tab.key)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${filter === tab.key
                                            ? 'bg-brand-500/20 text-brand-400'
                                            : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Link
                        to="/staff/rooms"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors"
                    >
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">{LABELS.ROOM_SETTINGS}</span>
                    </Link>
                </div>

                {/* Orders list */}
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredReservations.length === 0 ? (
                    <div className="text-center py-16">
                        <Coffee className="w-12 h-12 text-dark-700 mx-auto mb-4" />
                        <p className="text-dark-500">Tiada pesanan ditemui.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredReservations.map((res) => (
                            <div
                                key={res.id}
                                className="glass-card-hover p-5 animate-fade-in"
                            >
                                {/* Card header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-display font-bold text-white text-lg">
                                            {res.customer_name}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                            <StatusBadge type={res.status} />
                                            <StatusBadge type={res.order_type} />
                                            {res.is_synced && (
                                                <span className="badge bg-violet-500/20 text-violet-400 border border-violet-500/30">
                                                    Synced
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs text-dark-500">
                                        {new Date(res.created_at).toLocaleString('ms-MY', { dateStyle: 'short', timeStyle: 'short' })}
                                    </p>
                                </div>

                                {/* Details */}
                                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                                    <div className="flex items-center gap-2 text-dark-400">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        <span>{res.whatsapp_number}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-dark-400">
                                        <Users className="w-3.5 h-3.5" />
                                        <span>{res.guest_count} orang</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-dark-400">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>
                                            {new Date(res.start_time).toLocaleString('ms-MY', { dateStyle: 'short', timeStyle: 'short' })}
                                        </span>
                                    </div>
                                    {res.rooms && (
                                        <div className="flex items-center gap-2 text-dark-400">
                                            <span className="text-brand-400 font-medium">🏠 {res.rooms.name}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Order items */}
                                {res.reservation_items && res.reservation_items.length > 0 && (
                                    <div className="bg-dark-900/50 rounded-xl p-3 mb-4">
                                        <div className="space-y-1.5">
                                            {res.reservation_items.map((item, i) => (
                                                <div key={i} className="flex items-center justify-between text-sm">
                                                    <span className="text-dark-300">
                                                        {item.menu_items?.name || 'Item'} × {item.quantity}
                                                    </span>
                                                    <span className="text-dark-400">
                                                        RM {((item.menu_items?.price || 0) * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                            <div className="border-t border-dark-700 pt-1.5 flex justify-between font-semibold">
                                                <span className="text-dark-300">{LABELS.TOTAL}</span>
                                                <span className="text-white">
                                                    RM {getItemsTotal(res.reservation_items).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div className="flex flex-wrap gap-2">
                                    {res.status === ORDER_STATUS.PENDING && (
                                        <button
                                            onClick={() => handleApprove(res)}
                                            className="btn-success text-sm flex items-center gap-1.5 !py-2 !px-4"
                                        >
                                            ✓ {LABELS.APPROVE}
                                        </button>
                                    )}

                                    {res.status === ORDER_STATUS.CONFIRMED && (
                                        <button
                                            onClick={() => handleComplete(res.id)}
                                            className="btn-primary text-sm flex items-center gap-1.5 !py-2 !px-4"
                                        >
                                            {LABELS.STATUS_COMPLETED}
                                        </button>
                                    )}

                                    {!res.is_synced && res.status !== ORDER_STATUS.PENDING && (
                                        <button
                                            onClick={() => handleSync(res)}
                                            disabled={syncingId === res.id}
                                            className="btn-secondary text-sm flex items-center gap-1.5 !py-2 !px-4"
                                        >
                                            {syncingId === res.id ? (
                                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                <Zap className="w-3.5 h-3.5" />
                                            )}
                                            {LABELS.SYNC_POS}
                                        </button>
                                    )}

                                    {/* WhatsApp link */}
                                    <a
                                        href={getWhatsAppLink(res.whatsapp_number, `Salam ${res.customer_name}, ini dari Miamor Coffee House.`)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-secondary text-sm flex items-center gap-1.5 !py-2 !px-4"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        WhatsApp
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Room assignment modal */}
            {assignModalData && (
                <RoomAssignModal
                    guestCount={assignModalData.guest_count}
                    onAssign={handleRoomAssigned}
                    onClose={() => setAssignModalData(null)}
                />
            )}
        </div>
    )
}

function getSampleReservations() {
    return [
        {
            id: '1', customer_name: 'Ahmad Faizal', whatsapp_number: '012-3456789',
            guest_count: 4, start_time: new Date(Date.now() + 3600000).toISOString(),
            status: 'pending', order_type: 'remote', is_synced: false,
            created_at: new Date().toISOString(), rooms: null,
            reservation_items: [
                { quantity: 2, menu_items: { name: 'Latte', price: 12 } },
                { quantity: 1, menu_items: { name: 'Nasi Lemak Ayam', price: 15 } },
            ]
        },
        {
            id: '2', customer_name: 'Siti Aminah', whatsapp_number: '019-8765432',
            guest_count: 2, start_time: new Date(Date.now() + 1800000).toISOString(),
            status: 'confirmed', order_type: 'qr_walkin', is_synced: false,
            created_at: new Date(Date.now() - 600000).toISOString(),
            rooms: { name: 'Duo', capacity: 4 },
            reservation_items: [
                { quantity: 1, menu_items: { name: 'Cappuccino', price: 12 } },
                { quantity: 1, menu_items: { name: 'Churros', price: 12 } },
            ]
        },
    ]
}
