import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Pencil, Trash2, X, MapPin, Save, Armchair, Coffee } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { supabase } from '../lib/supabase'
import { LABELS, ROOM_CATEGORY } from '../lib/constants'

export default function RoomManagement() {
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingRoom, setEditingRoom] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        category: ROOM_CATEGORY.PRIVATE,
        capacity: 4,
        tables_count: 1,
        seats_per_table: 4,
        is_combinable: false,
    })

    useEffect(() => {
        fetchRooms()
    }, [])

    const fetchRooms = async () => {
        try {
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .order('capacity', { ascending: true })

            if (error) throw error
            setRooms(data || [])
        } catch (err) {
            console.error('Error:', err)
            setRooms(getSampleRooms())
        } finally {
            setLoading(false)
        }
    }

    const openAddForm = () => {
        setFormData({
            name: '',
            category: ROOM_CATEGORY.PRIVATE,
            capacity: 4,
            tables_count: 1,
            seats_per_table: 4,
            is_combinable: false,
        })
        setEditingRoom(null)
        setShowForm(true)
    }

    const openEditForm = (room) => {
        setFormData({
            name: room.name,
            category: room.category,
            capacity: room.capacity,
            tables_count: room.tables_count || 1,
            seats_per_table: room.seats_per_table || 4,
            is_combinable: room.is_combinable || false,
        })
        setEditingRoom(room)
        setShowForm(true)
    }

    const handleSave = async () => {
        try {
            if (editingRoom) {
                const { error } = await supabase
                    .from('rooms')
                    .update(formData)
                    .eq('id', editingRoom.id)
                if (error) throw error
            } else {
                const { error } = await supabase.from('rooms').insert(formData)
                if (error) throw error
            }
            setShowForm(false)
            setEditingRoom(null)
            fetchRooms()
        } catch (err) {
            console.error('Error saving:', err)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Adakah anda pasti ingin memadam bilik ini?')) return
        try {
            const { error } = await supabase.from('rooms').delete().eq('id', id)
            if (error) throw error
            fetchRooms()
        } catch (err) {
            console.error('Error deleting:', err)
        }
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
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="font-brand font-bold text-3xl text-brand-brown">{LABELS.ROOM_SETTINGS}</h1>
                        <p className="text-brand-lightBrown text-sm mt-1">
                            Uruskan konfigurasi bilik dan kapasiti.
                        </p>
                    </div>
                    <button
                        onClick={openAddForm}
                        className="btn-primary flex items-center gap-2 shadow-lg shadow-brand-red/20"
                    >
                        <Plus className="w-5 h-5" />
                        {LABELS.ADD_ROOM}
                    </button>
                </div>

                {/* Room list */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-brand-brown border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {rooms.map((room) => (
                            <div key={room.id} className="bg-white border border-brand-brown/10 shadow-lg shadow-brand-brown/5 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-brand-brown/5 flex items-center justify-center group-hover:bg-brand-red/10 transition-colors">
                                            <Armchair className="w-7 h-7 text-brand-brown group-hover:text-brand-red transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="font-display font-bold text-xl text-brand-brown">{room.name}</h3>
                                            <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-brand-brown/10 text-brand-brown mt-1">
                                                {room.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openEditForm(room)}
                                            className="w-8 h-8 rounded-lg hover:bg-brand-brown/10 flex items-center justify-center text-brand-lightBrown hover:text-brand-brown transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(room.id)}
                                            className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-brand-lightBrown hover:text-brand-red transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 border-t border-brand-brown/5 pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-brand-lightBrown">Kapasiti</span>
                                        <span className="font-bold text-brand-brown">{room.capacity} Orang</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-brand-lightBrown">Susunan</span>
                                        <span className="font-bold text-brand-brown">
                                            {room.tables_count || 1} Meja x {room.seats_per_table || 4} Kerusi
                                        </span>
                                    </div>
                                    {room.is_combinable && (
                                        <div className="flex justify-between text-sm pt-1">
                                            <span className="text-brand-lightBrown">Status</span>
                                            <span className="font-bold text-emerald-600 flex items-center gap-1">
                                                ✓ Boleh Gabung
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add/Edit Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-brand-brown/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-slide-up border border-brand-brown/10">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-display font-bold text-brand-brown">
                                    {editingRoom ? LABELS.EDIT_ROOM : LABELS.ADD_ROOM}
                                </h3>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="p-2 hover:bg-brand-brown/5 rounded-full transition-colors text-brand-lightBrown hover:text-brand-brown"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold tracking-wider text-brand-lightBrown uppercase mb-2">{LABELS.ROOM_NAME}</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-brand-brown/5 border-b-2 border-brand-brown/10 px-4 py-3 text-brand-brown focus:outline-none focus:border-brand-red transition-all text-lg rounded-t-lg"
                                        placeholder="cth: La Amistad"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold tracking-wider text-brand-lightBrown uppercase mb-2">{LABELS.ROOM_CATEGORY}</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-brand-brown/5 border-b-2 border-brand-brown/10 px-4 py-3 text-brand-brown focus:outline-none focus:border-brand-red transition-all rounded-t-lg"
                                    >
                                        <option value="Private">Private</option>
                                        <option value="Open">Open</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold tracking-wider text-brand-lightBrown uppercase mb-2">Kapasiti</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.capacity}
                                            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                                            className="w-full bg-brand-brown/5 border-b-2 border-brand-brown/10 px-2 py-3 text-center text-brand-brown focus:outline-none focus:border-brand-red transition-all font-bold text-lg rounded-t-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold tracking-wider text-brand-lightBrown uppercase mb-2">Meja</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.tables_count}
                                            onChange={(e) => setFormData({ ...formData, tables_count: parseInt(e.target.value) || 1 })}
                                            className="w-full bg-brand-brown/5 border-b-2 border-brand-brown/10 px-2 py-3 text-center text-brand-brown focus:outline-none focus:border-brand-red transition-all font-bold text-lg rounded-t-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold tracking-wider text-brand-lightBrown uppercase mb-2">Kerusi</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.seats_per_table}
                                            onChange={(e) => setFormData({ ...formData, seats_per_table: parseInt(e.target.value) || 1 })}
                                            className="w-full bg-brand-brown/5 border-b-2 border-brand-brown/10 px-2 py-3 text-center text-brand-brown focus:outline-none focus:border-brand-red transition-all font-bold text-lg rounded-t-lg"
                                        />
                                    </div>
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer p-4 border border-brand-brown/10 rounded-xl hover:bg-brand-brown/5 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_combinable}
                                        onChange={(e) => setFormData({ ...formData, is_combinable: e.target.checked })}
                                        className="w-5 h-5 rounded border-brand-brown text-brand-red focus:ring-brand-red"
                                    />
                                    <span className="text-sm font-bold text-brand-brown">{LABELS.ROOM_COMBINABLE}</span>
                                </label>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="btn-secondary flex-1 border-brand-brown/20 text-brand-lightBrown hover:text-brand-brown"
                                >
                                    {LABELS.CANCEL}
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!formData.name.trim()}
                                    className="btn-primary flex-1 flex items-center justify-center gap-2 shadow-lg shadow-brand-red/20"
                                >
                                    <Save className="w-5 h-5" />
                                    {LABELS.SAVE}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

function getSampleRooms() {
    return [
        { id: '1', name: 'Duo', category: 'Private', capacity: 4, tables_count: 1, seats_per_table: 4, is_combinable: false },
        { id: '2', name: 'Amorcito', category: 'Private', capacity: 6, tables_count: 2, seats_per_table: 3, is_combinable: false },
        { id: '3', name: 'La Amistad', category: 'Private', capacity: 8, tables_count: 2, seats_per_table: 4, is_combinable: true },
        { id: '4', name: 'La Rossa', category: 'Open', capacity: 8, tables_count: 2, seats_per_table: 4, is_combinable: true },
        { id: '5', name: 'El Corazon', category: 'Private', capacity: 15, tables_count: null, seats_per_table: null, is_combinable: false },
    ]
}
