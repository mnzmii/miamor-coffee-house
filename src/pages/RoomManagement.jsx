import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Pencil, Trash2, X, MapPin, Save } from 'lucide-react'
import Header from '../components/Header'
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
        <div className="min-h-screen bg-dark-950">
            <Header title={LABELS.ROOM_SETTINGS} />

            <main className="max-w-2xl mx-auto px-4 py-6">
                {/* Back + Add */}
                <div className="flex items-center justify-between mb-6">
                    <Link
                        to="/staff"
                        className="flex items-center gap-1.5 text-sm text-dark-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {LABELS.STAFF_DASHBOARD}
                    </Link>
                    <button onClick={openAddForm} className="btn-primary text-sm flex items-center gap-1.5 !py-2 !px-4">
                        <Plus className="w-4 h-4" />
                        {LABELS.ADD_ROOM}
                    </button>
                </div>

                {/* Room list */}
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {rooms.map((room) => (
                            <div key={room.id} className="glass-card-hover p-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-700/20 flex items-center justify-center">
                                            <MapPin className="w-6 h-6 text-brand-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-display font-bold text-white text-lg">{room.name}</h3>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-dark-400">
                                                <span className="badge bg-dark-700 text-dark-300 border-dark-600">
                                                    {room.category}
                                                </span>
                                                <span>Maks {room.capacity} orang</span>
                                                {room.tables_count && (
                                                    <span>{room.tables_count} meja</span>
                                                )}
                                                {room.is_combinable && (
                                                    <span className="text-emerald-400">✓ {LABELS.ROOM_COMBINABLE}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => openEditForm(room)}
                                            className="w-8 h-8 rounded-lg bg-dark-700 flex items-center justify-center text-dark-400 hover:text-white hover:bg-dark-600 transition-colors"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(room.id)}
                                            className="w-8 h-8 rounded-lg bg-dark-700 flex items-center justify-center text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add/Edit Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                        <div className="relative w-full max-w-md glass-card p-6 animate-slide-up">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-display font-bold text-white">
                                    {editingRoom ? LABELS.EDIT_ROOM : LABELS.ADD_ROOM}
                                </h3>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="w-8 h-8 rounded-lg bg-dark-700 flex items-center justify-center text-dark-400 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-1.5">{LABELS.ROOM_NAME}</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field"
                                        placeholder="cth: La Amistad"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-1.5">{LABELS.ROOM_CATEGORY}</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="Private">Private</option>
                                        <option value="Open">Open</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-dark-300 mb-1.5">{LABELS.ROOM_CAPACITY}</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.capacity}
                                            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-dark-300 mb-1.5">{LABELS.ROOM_TABLES}</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.tables_count}
                                            onChange={(e) => setFormData({ ...formData, tables_count: parseInt(e.target.value) || 1 })}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-dark-300 mb-1.5">Kerusi/Meja</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.seats_per_table}
                                            onChange={(e) => setFormData({ ...formData, seats_per_table: parseInt(e.target.value) || 1 })}
                                            className="input-field"
                                        />
                                    </div>
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_combinable}
                                        onChange={(e) => setFormData({ ...formData, is_combinable: e.target.checked })}
                                        className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-brand-500 focus:ring-brand-500"
                                    />
                                    <span className="text-sm text-dark-300">{LABELS.ROOM_COMBINABLE}</span>
                                </label>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                                    {LABELS.CANCEL}
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!formData.name.trim()}
                                    className="btn-primary flex-1 flex items-center justify-center gap-1.5"
                                >
                                    <Save className="w-4 h-4" />
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
