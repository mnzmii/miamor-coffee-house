import { useState, useEffect } from 'react'
import { Plus, Minus, UtensilsCrossed } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { LABELS } from '../lib/constants'

export default function MenuSection({ cart, setCart }) {
    const [menuItems, setMenuItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState('Minuman')

    useEffect(() => {
        fetchMenu()
    }, [])

    const fetchMenu = async () => {
        try {
            const { data, error } = await supabase
                .from('menu_items')
                .select('*')
                .eq('is_available', true)
                .order('name')

            if (error) throw error
            setMenuItems(data || [])
        } catch (err) {
            console.error('Error fetching menu:', err)
            // Use sample data if Supabase is not configured
            setMenuItems(getSampleMenuItems())
        } finally {
            setLoading(false)
        }
    }

    const categories = [...new Set(menuItems.map((item) => item.category))]

    const getQuantity = (itemId) => {
        const cartItem = cart.find((c) => c.id === itemId)
        return cartItem ? cartItem.quantity : 0
    }

    const addItem = (item) => {
        setCart((prev) => {
            const existing = prev.find((c) => c.id === item.id)
            if (existing) {
                return prev.map((c) =>
                    c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
                )
            }
            return [...prev, { ...item, quantity: 1 }]
        })
    }

    const removeItem = (itemId) => {
        setCart((prev) => {
            const existing = prev.find((c) => c.id === itemId)
            if (existing && existing.quantity > 1) {
                return prev.map((c) =>
                    c.id === itemId ? { ...c, quantity: c.quantity - 1 } : c
                )
            }
            return prev.filter((c) => c.id !== itemId)
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-brand-400" />
                <h3 className="text-lg font-display font-semibold text-white">{LABELS.FOOD_MENU}</h3>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeCategory === cat
                                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                                : 'bg-dark-800 text-dark-400 border border-dark-700 hover:text-white'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Menu items grid */}
            <div className="space-y-3">
                {menuItems
                    .filter((item) => item.category === activeCategory)
                    .map((item) => {
                        const qty = getQuantity(item.id)
                        return (
                            <div
                                key={item.id}
                                className={`glass-card p-4 flex items-center justify-between transition-all duration-200 ${qty > 0 ? 'border-brand-500/30 shadow-lg shadow-brand-500/5' : ''
                                    }`}
                            >
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-white truncate">{item.name}</h4>
                                    <p className="text-sm text-brand-400 font-semibold mt-0.5">
                                        RM {Number(item.price).toFixed(2)}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 ml-3">
                                    {qty > 0 ? (
                                        <>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="w-9 h-9 rounded-lg bg-dark-700 border border-dark-600 flex items-center justify-center text-dark-300 hover:bg-dark-600 hover:text-white transition-all active:scale-90"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-semibold text-white text-lg">
                                                {qty}
                                            </span>
                                            <button
                                                onClick={() => addItem(item)}
                                                className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white hover:bg-brand-600 transition-all active:scale-90"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => addItem(item)}
                                            className="px-4 py-2 rounded-lg bg-dark-700 border border-dark-600 text-sm font-medium text-dark-300 hover:bg-dark-600 hover:text-white hover:border-dark-500 transition-all active:scale-95"
                                        >
                                            {LABELS.ADD_TO_ORDER}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
            </div>

            {/* Cart summary bar */}
            {cart.length > 0 && (
                <div className="sticky bottom-4 glass-card p-3 flex items-center justify-between animate-slide-up border-brand-500/30">
                    <div>
                        <p className="text-sm text-dark-400">
                            {cart.reduce((sum, c) => sum + c.quantity, 0)} item
                        </p>
                        <p className="font-semibold text-white">
                            RM {cart.reduce((sum, c) => sum + c.price * c.quantity, 0).toFixed(2)}
                        </p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                </div>
            )}
        </div>
    )
}

// Fallback sample data when Supabase is not configured
function getSampleMenuItems() {
    return [
        { id: '1', name: 'Espresso', category: 'Minuman', price: 8.0, is_available: true },
        { id: '2', name: 'Americano', category: 'Minuman', price: 10.0, is_available: true },
        { id: '3', name: 'Latte', category: 'Minuman', price: 12.0, is_available: true },
        { id: '4', name: 'Cappuccino', category: 'Minuman', price: 12.0, is_available: true },
        { id: '5', name: 'Mocha', category: 'Minuman', price: 14.0, is_available: true },
        { id: '6', name: 'Matcha Latte', category: 'Minuman', price: 14.0, is_available: true },
        { id: '7', name: 'Iced Chocolate', category: 'Minuman', price: 12.0, is_available: true },
        { id: '8', name: 'Teh Tarik', category: 'Minuman', price: 6.0, is_available: true },
        { id: '9', name: 'Nasi Lemak Ayam', category: 'Makanan', price: 15.0, is_available: true },
        { id: '10', name: 'Mee Goreng Mamak', category: 'Makanan', price: 12.0, is_available: true },
        { id: '11', name: 'Roti Bakar Telur', category: 'Makanan', price: 8.0, is_available: true },
        { id: '12', name: 'Sandwich Klub', category: 'Makanan', price: 16.0, is_available: true },
        { id: '13', name: 'Pasta Carbonara', category: 'Makanan', price: 18.0, is_available: true },
        { id: '14', name: 'Nasi Goreng Kampung', category: 'Makanan', price: 14.0, is_available: true },
        { id: '15', name: 'Kek Coklat Lava', category: 'Pencuci Mulut', price: 16.0, is_available: true },
        { id: '16', name: 'Churros', category: 'Pencuci Mulut', price: 12.0, is_available: true },
        { id: '17', name: 'Ais Krim Vanila', category: 'Pencuci Mulut', price: 8.0, is_available: true },
        { id: '18', name: 'Waffle & Ais Krim', category: 'Pencuci Mulut', price: 18.0, is_available: true },
    ]
}
