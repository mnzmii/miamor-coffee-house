import { useState, useEffect } from 'react'
import { X, MapPin, Users, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { LABELS } from '../lib/constants'

export default function RoomAssignModal({ guestCount, onAssign, onClose }) {
    const [rooms, setRooms] = useState([])
    const [selectedRoom, setSelectedRoom] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRooms()
    }, [])

    const fetchRooms = async () => {
        try {
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .gte('capacity', guestCount)
                .order('capacity', { ascending: true })

            if (error) throw error
            setRooms(data || [])
        } catch (err) {
            console.error('Error fetching rooms:', err)
            // Sample fallback
            setRooms(getSampleRooms().filter((r) => r.capacity >= guestCount))
        } finally {
            setLoading(false)
        }
    }

    const handleAssign = () => {
        if (selectedRoom) {
            onAssign(selectedRoom)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-md glass-card p-6 animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-display font-bold text-white">{LABELS.ASSIGN_ROOM}</h3>
                        <p className="text-sm text-dark-400 flex items-center gap-1 mt-1">
                            <Users className="w-3.5 h-3.5" />
                            {guestCount} orang
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-dark-700 flex items-center justify-center text-dark-400 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Room list */}
                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : rooms.length === 0 ? (
                    <div className="text-center py-8 text-dark-500">
                        Tiada bilik yang sesuai untuk {guestCount} orang.
                    </div>
                ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {rooms.map((room, index) => {
                            const isBestFit = index === 0
                            const isSelected = selectedRoom?.id === room.id

                            return (
                                <button
                                    key={room.id}
                                    onClick={() => setSelectedRoom(room)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${isSelected
                                            ? 'bg-brand-500/10 border-brand-500/50 shadow-lg shadow-brand-500/10'
                                            : 'bg-dark-800/50 border-dark-700/50 hover:border-dark-500'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected
                                                        ? 'bg-brand-500 text-white'
                                                        : 'bg-dark-700 text-dark-400'
                                                    }`}
                                            >
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-white">{room.name}</h4>
                                                    {isBestFit && (
                                                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                                            {LABELS.BEST_FIT}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-dark-400 mt-0.5">
                                                    {room.category} • Maks {room.capacity} orang
                                                    {room.is_combinable && ' • Boleh digabung'}
                                                </p>
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <Check className="w-5 h-5 text-brand-400 mt-1" />
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="btn-secondary flex-1">
                        {LABELS.CANCEL}
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={!selectedRoom}
                        className="btn-primary flex-1"
                    >
                        {LABELS.CONFIRM}
                    </button>
                </div>
            </div>
        </div>
    )
}

function getSampleRooms() {
    return [
        { id: '1', name: 'La Amistad', category: 'Private', capacity: 8, tables_count: 2, seats_per_table: 4, is_combinable: true },
        { id: '2', name: 'Amorcito', category: 'Private', capacity: 6, tables_count: 2, seats_per_table: 3, is_combinable: false },
        { id: '3', name: 'Duo', category: 'Private', capacity: 4, tables_count: 1, seats_per_table: 4, is_combinable: false },
        { id: '4', name: 'El Corazon', category: 'Private', capacity: 15, tables_count: null, seats_per_table: null, is_combinable: false },
        { id: '5', name: 'La Rossa', category: 'Open', capacity: 8, tables_count: 2, seats_per_table: 4, is_combinable: true },
    ]
}
