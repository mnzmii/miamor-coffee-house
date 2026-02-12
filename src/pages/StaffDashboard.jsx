import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    RefreshCw, ExternalLink, Settings, Users, Clock,
    MessageCircle, Zap, Filter, Coffee, CheckCircle2, Trash2
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import StatusBadge from '../components/StatusBadge'
import RoomAssignModal from '../components/RoomAssignModal'
import ConfirmDialog from '../components/ConfirmDialog'
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
    const [showClearConfirm, setShowClearConfirm] = useState(false)

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

    const completedCount = reservations.filter(r => r.status === ORDER_STATUS.COMPLETED).length

    const handleClearCompleted = async () => {
        try {
            // Get IDs of completed reservations
            const completedIds = reservations
                .filter(r => r.status === ORDER_STATUS.COMPLETED)
                .map(r => r.id)

            if (completedIds.length === 0) return

            // Delete reservation_items first (foreign key)
            await supabase
                .from('reservation_items')
                .delete()
                .in('reservation_id', completedIds)

            // Then delete reservations
            await supabase
                .from('reservations')
                .delete()
                .in('id', completedIds)

            setShowClearConfirm(false)
            fetchReservations()
        } catch (err) {
            console.error('Error clearing:', err)
            setShowClearConfirm(false)
        }
    }

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
        <div className="min-h-screen flex">
            {/* Sidebar Navigation */}
            <Sidebar />
            <div className="hidden md:block w-64 flex-shrink-0" />

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-brand-brown z-30 flex items-center px-4 shadow-lg shadow-brand-brown/10">
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

            <main className="flex-1 px-4 md:px-8 py-20 md:py-8 overflow-y-auto h-screen">
                {/* Top Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="font-brand font-bold text-3xl text-brand-brown">Dashboard</h1>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Live</span>
                            </div>
                        </div>
                        <p className="text-brand-lightBrown text-sm mt-1">
                            {new Date().toLocaleDateString('ms-MY', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 glass-card p-1 shadow-sm">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setFilter(tab.key)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${filter === tab.key
                                    ? 'bg-brand-brown text-white shadow-lg'
                                    : 'text-brand-lightBrown hover:bg-brand-brown/5'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {completedCount > 0 && (
                        <button
                            onClick={() => setShowClearConfirm(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold hover:bg-red-100 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Kosongkan Selesai
                            <span className="bg-red-200 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{completedCount}</span>
                        </button>
                    )}
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-brand-brown border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredReservations.length === 0 ? (
                    <div className="text-center py-24 bg-white/40 rounded-3xl border-2 border-dashed border-brand-brown/10">
                        <div className="bg-brand-brown/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Coffee className="w-10 h-10 text-brand-brown/40" />
                        </div>
                        <h3 className="text-xl font-bold text-brand-brown mb-2">Tiada Pesanan</h3>
                        <p className="text-brand-lightBrown">Belum ada tempahan baru untuk hari ini.</p>
                    </div>
                ) : (
                    <div className="columns-1 lg:columns-2 xl:columns-3 gap-6 space-y-6">
                        {filteredReservations.map((res) => (
                            <div key={res.id} className="break-inside-avoid-column">
                                <div
                                    className={`glass-card p-6 flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden group mb-6`}
                                >
                                    {/* Decorative elements */}
                                    <div className={`absolute top-0 left-0 w-1.5 h-full ${res.status === ORDER_STATUS.PENDING ? 'bg-amber-400' :
                                        res.status === ORDER_STATUS.CONFIRMED ? 'bg-indigo-500' : 'bg-brand-brown/10'
                                        }`} />

                                    {/* Card Header */}
                                    <div className="flex justify-between items-start mb-4 pl-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-display font-bold text-xl text-brand-brown">
                                                    {res.customer_name}
                                                </h3>
                                                {res.is_synced && (
                                                    <Zap className="w-4 h-4 text-violet-500 fill-violet-500" />
                                                )}
                                            </div>
                                            <div className="flex gap-2 text-xs font-bold uppercase tracking-wider">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${res.order_type === 'qr_walkin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {res.order_type === 'qr_walkin' ? 'Walk-in' : 'Remote'}
                                                </span>
                                                <span className="text-brand-lightBrown">• {res.guest_count} Pax</span>
                                            </div>
                                        </div>
                                        <StatusBadge type={res.status} />
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm mb-6 pl-3">
                                        <div className="flex items-center gap-2 text-brand-lightBrown">
                                            <Clock className="w-4 h-4" />
                                            <span className="font-medium text-brand-brown">
                                                {new Date(res.start_time).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-brand-lightBrown">
                                            <MessageCircle className="w-4 h-4" />
                                            {res.whatsapp_number && res.whatsapp_number !== '-' ? (
                                                <a
                                                    href={`https://wa.me/${res.whatsapp_number.replace(/[^0-9]/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-medium text-emerald-600 hover:text-emerald-700 underline underline-offset-2 transition-colors"
                                                >
                                                    {res.whatsapp_number}
                                                </a>
                                            ) : (
                                                <span className="font-medium text-brand-brown">{res.whatsapp_number}</span>
                                            )}
                                        </div>
                                        {res.rooms && (
                                            <div className="col-span-2 flex items-center gap-2 bg-brand-brown/5 p-2 rounded-lg">
                                                <span className="text-brand-brown font-bold">🏠 Bilik: {res.rooms.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Items Summary */}
                                    {res.reservation_items?.length > 0 && (
                                        <div className="bg-brand-cream/50 rounded-lg p-3 mb-6 pl-3 border border-brand-brown/5">
                                            <div className="max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                                                <ul className="space-y-1 text-sm">
                                                    {res.reservation_items.map((item, i) => (
                                                        <li key={i} className="flex justify-between text-brand-brown leading-relaxed border-b border-brand-brown/5 pb-1 last:border-0">
                                                            <span>{item.menu_items?.name}</span>
                                                            <span className="font-bold text-brand-lightBrown ml-4">x{item.quantity}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="mt-2 pt-2 border-t border-brand-brown/10 flex justify-between font-bold text-brand-brown">
                                                <span>Total</span>
                                                <span>RM {getItemsTotal(res.reservation_items).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Special Requests */}
                                    {res.special_requests && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 pl-3">
                                            <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">📝 Nota Khas</p>
                                            <p className="text-sm text-amber-800">{res.special_requests}</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="pl-3 mt-auto flex gap-2">
                                        {res.status === ORDER_STATUS.PENDING ? (
                                            <button
                                                onClick={() => handleApprove(res)}
                                                className="btn-primary w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 shadow-amber-600/20 active:scale-95 transition-all"
                                            >
                                                <Zap className="w-4 h-4" />
                                                Sahkan
                                            </button>
                                        ) : res.status === ORDER_STATUS.CONFIRMED ? (
                                            <div className="flex gap-2 w-full">
                                                {!res.is_synced && (
                                                    <button
                                                        onClick={() => handleSync(res)}
                                                        disabled={syncingId === res.id}
                                                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-indigo-600/20 text-indigo-700 text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-[0.98] disabled:opacity-50"
                                                    >
                                                        {syncingId === res.id ? (
                                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            <Zap className="w-3.5 h-3.5" />
                                                        )}
                                                        Sync POS
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleComplete(res.id)}
                                                    className="btn-primary flex-1 bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20 flex items-center justify-center gap-2 whitespace-nowrap"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Selesaikan
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-full text-center py-3 text-[10px] text-brand-lightBrown font-bold uppercase tracking-[0.2em] bg-brand-brown/5 rounded-xl border border-brand-brown/10">
                                                Pesanan Selesai
                                            </div>
                                        )}
                                    </div>
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

            {/* Clear completed confirmation dialog */}
            <ConfirmDialog
                open={showClearConfirm}
                onConfirm={handleClearCompleted}
                onCancel={() => setShowClearConfirm(false)}
                title="Kosongkan Pesanan Selesai?"
                message={`Anda akan memadamkan ${completedCount} pesanan yang telah selesai. Tindakan ini tidak boleh dibatalkan.`}
                confirmText="Ya, Padam"
                cancelText="Batal"
                variant="danger"
            />
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
