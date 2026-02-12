import { useState, useEffect } from 'react'
import { X, MapPin, Users, Check, Armchair } from 'lucide-react'
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
            <div className="absolute inset-0 bg-brand-brown/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white border border-brand-brown/10 shadow-2xl rounded-2xl p-6 animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 border-b border-brand-brown/10 pb-4">
                    <div>
                        <h3 className="text-xl font-brand font-bold text-brand-brown">{LABELS.ASSIGN_ROOM}</h3>
                        <p className="text-sm text-brand-lightBrown flex items-center gap-1 mt-1">
                            <Users className="w-4 h-4" />
                            Keperluan: {guestCount} orang
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-brand-brown/5 flex items-center justify-center text-brand-lightBrown hover:text-brand-brown transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Room list */}
                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="w-8 h-8 border-2 border-brand-brown border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : rooms.length === 0 ? (
                    <div className="text-center py-8 text-brand-lightBrown bg-brand-brown/5 rounded-xl border border-dashed border-brand-brown/10">
                        <Armchair className="w-10 h-10 mx-auto mb-2 text-brand-brown/20" />
                        <p>Tiada bilik yang sesuai untuk {guestCount} orang.</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                        {rooms.map((room, index) => {
                            const isBestFit = index === 0
                            const isSelected = selectedRoom?.id === room.id

                            return (
                                <button
                                    key={room.id}
                                    onClick={() => setSelectedRoom(room)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group ${isSelected
                                        ? 'bg-brand-brown/5 border-brand-brown shadow-md'
                                        : 'bg-white border-brand-brown/10 hover:border-brand-brown/30 hover:bg-brand-brown/5'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isSelected
                                                    ? 'bg-brand-brown text-white'
                                                    : 'bg-brand-brown/5 text-brand-brown group-hover:bg-brand-brown/10'
                                                    }`}
                                            >
                                                <Armchair className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className={`font-brand font-bold text-lg ${isSelected ? 'text-brand-brown' : 'text-brand-lightBrown group-hover:text-brand-brown'}`}>
                                                        {room.name}
                                                    </h4>
                                                    {isBestFit && (
                                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                            Pilihan Terbaik
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-brand-lightBrown mt-0.5">
                                                    {room.category} • Maks {room.capacity} orang
                                                    {room.is_combinable && ' • Boleh Gabung'}
                                                </p>
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <div className="w-6 h-6 rounded-full bg-brand-red flex items-center justify-center text-white shadow-lg shadow-brand-red/30">
                                                <Check className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3 mt-8 pt-4 border-t border-brand-brown/10">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-lg font-bold text-brand-lightBrown hover:bg-brand-brown/5 transition-colors"
                    >
                        {LABELS.CANCEL}
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={!selectedRoom}
                        className="flex-1 py-3 rounded-lg font-bold text-white bg-brand-brown hover:bg-brand-lightBrown shadow-lg shadow-brand-brown/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
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
