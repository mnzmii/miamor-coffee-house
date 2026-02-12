import { useState, useEffect, useRef } from 'react'
import { Plus, Minus, UtensilsCrossed, Coffee, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { LABELS } from '../lib/constants'

// Item images for rich menu cards
const ITEM_IMAGES = {
    Espresso: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?q=80&w=400&auto=format&fit=crop',
    Americano: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?q=80&w=400&auto=format&fit=crop',
    Latte: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=400&auto=format&fit=crop',
    Cappuccino: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=400&auto=format&fit=crop',
    Mocha: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?q=80&w=400&auto=format&fit=crop',
    'Matcha Latte': 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=400&auto=format&fit=crop',
    'Iced Chocolate': 'https://images.unsplash.com/photo-1517578239113-b03992acdd73?q=80&w=400&auto=format&fit=crop',
    'Teh Tarik': 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=400&auto=format&fit=crop',
    'Nasi Lemak Ayam': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=400&auto=format&fit=crop',
    'Mee Goreng Mamak': 'https://images.unsplash.com/photo-1569058242567-93de6f36f8e6?q=80&w=400&auto=format&fit=crop',
    'Roti Bakar Telur': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=400&auto=format&fit=crop',
    'Sandwich Klub': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=400&auto=format&fit=crop',
    'Pasta Carbonara': 'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=400&auto=format&fit=crop',
    'Nasi Goreng Kampung': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=400&auto=format&fit=crop',
    'Kek Coklat Lava': 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=400&auto=format&fit=crop',
    Churros: 'https://images.unsplash.com/photo-1624371414361-e670c3e2a7f7?q=80&w=400&auto=format&fit=crop',
    'Ais Krim Vanila': 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=400&auto=format&fit=crop',
    'Waffle & Ais Krim': 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?q=80&w=400&auto=format&fit=crop',
}

const ITEM_DESCRIPTIONS = {
    Espresso: 'Kopi tulen pekat dengan crema emas — asas semua minuman kopi.',
    Americano: 'Espresso dicairkan dengan air panas untuk rasa yang lebih ringan.',
    Latte: 'Espresso lembut dengan susu panas berbuih. Pilihan ramai.',
    Cappuccino: 'Espresso, susu berbuih tebal, dan serbuk koko di atas.',
    Mocha: 'Gabungan espresso dan coklat pekat bersama susu berbuih.',
    'Matcha Latte': 'Serbuk matcha Jepun premium dengan susu segar.',
    'Iced Chocolate': 'Coklat sejuk premium — manis, pekat, dan menyegarkan.',
    'Teh Tarik': 'Teh susu ditarik gaya tradisional. Wangi dan manis.',
    'Nasi Lemak Ayam': 'Nasi lemak harum dengan ayam goreng rangup dan sambal pedas.',
    'Mee Goreng Mamak': 'Mee goreng gaya mamak — pedas, manis, dan penuh rasa.',
    'Roti Bakar Telur': 'Roti bakar rangup dengan telur separuh masak dan mentega.',
    'Sandwich Klub': 'Sandwich berlapis dengan ayam, salad, dan sos istimewa.',
    'Pasta Carbonara': 'Pasta creamy dengan sos keju parmesan dan daging bacon.',
    'Nasi Goreng Kampung': 'Nasi goreng tradisional dengan ikan bilis dan sambal belacan.',
    'Kek Coklat Lava': 'Kek coklat panas dengan lelehan coklat di dalam. Premium!',
    Churros: 'Churros rangup ditabur gula kayu manis dengan sos coklat.',
    'Ais Krim Vanila': 'Ais krim vanila lembut — klasik dan menyegarkan.',
    'Waffle & Ais Krim': 'Waffle Belgium rangup dengan ais krim dan topping pilihan.',
}

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400&auto=format&fit=crop'

export default function MenuSection({ cart, setCart }) {
    const [menuItems, setMenuItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState('Minuman')
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 8
    const menuRef = useRef(null)

    useEffect(() => {
        // Scroll to top of menu when page changes
        if (currentPage > 1 && menuRef.current) {
            menuRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [currentPage])

    useEffect(() => {
        fetchMenu()
    }, [])

    // Reset pagination when category or search changes
    useEffect(() => {
        setCurrentPage(1)
    }, [activeCategory, searchQuery])

    const fetchMenu = async () => {
        // ... existing fetchMenu logic ...
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

    const filteredItems = menuItems.filter(item => {
        const matchesCategory = item.category === activeCategory
        const matchesSearch = searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    // Pagination logic
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0)
    const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0)

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex gap-2 overflow-hidden pb-2 -mx-2 px-2">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-10 w-24 bg-brand-brown/5 rounded-xl animate-pulse" />
                    ))}
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-28 bg-brand-brown/5 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 scroll-mt-32" ref={menuRef}>
            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pt-2 pb-4 no-scrollbar -mx-2 px-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-500 border-2 tracking-widest uppercase ${activeCategory === cat
                            ? 'bg-brand-brown border-brand-brown text-white shadow-md shadow-brand-brown/30'
                            : 'bg-white border-brand-brown/5 text-brand-lightBrown hover:border-brand-brown/20'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-brown/30 group-focus-within:text-brand-brown transition-colors" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari dalam menu..."
                    className="w-full bg-white/50 backdrop-blur-sm border-2 border-brand-brown/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-brand-brown placeholder-brand-brown/30 focus:outline-none focus:border-brand-brown/30 transition-all shadow-sm focus:shadow-md"
                />
            </div>

            {/* Menu items — rich grid layout */}
            <div className="min-h-[400px]">
                {paginatedItems.length === 0 ? (
                    <div className="text-center py-16 bg-brand-brown/5 rounded-[2rem] border-2 border-dashed border-brand-brown/10">
                        <Coffee className="w-12 h-12 mx-auto mb-4 text-brand-brown/10" />
                        <p className="text-sm font-bold text-brand-brown/40 uppercase tracking-widest">Tiada item dijumpai</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {paginatedItems.map((item, index) => {
                                const qty = getQuantity(item.id)
                                const desc = ITEM_DESCRIPTIONS[item.name] || 'Hidangan istimewa daripada dapur Miamor.'
                                const img = ITEM_IMAGES[item.name] || DEFAULT_IMG

                                return (
                                    <div
                                        key={item.id}
                                        className={`group bg-white rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border ${qty > 0
                                            ? 'border-brand-brown shadow-xl'
                                            : 'border-brand-brown/5 shadow-sm'
                                            }`}
                                    >
                                        <div className="flex flex-col sm:flex-row h-full">
                                            {/* Food image */}
                                            <div className="w-full sm:w-36 h-40 sm:h-auto flex-shrink-0 overflow-hidden relative">
                                                <img
                                                    src={img}
                                                    alt={item.name}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent sm:hidden" />
                                                {qty > 0 && (
                                                    <div className="absolute top-3 left-3 bg-brand-red text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-white/20 uppercase tracking-wider animate-bounce-subtle">
                                                        {qty} Dipilih
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 p-6 flex flex-col justify-between min-w-0">
                                                <div>
                                                    <div className="flex justify-between items-start gap-4">
                                                        <h4 className="font-brand font-bold text-brand-brown text-xl leading-tight">
                                                            {item.name}
                                                        </h4>
                                                        <p className="text-brand-brown font-brand font-bold text-lg whitespace-nowrap">
                                                            RM{Number(item.price).toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <p className="text-brand-lightBrown text-xs mt-2 leading-relaxed opacity-60">
                                                        {desc}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-end mt-6">
                                                    <div className="flex items-center gap-1.5 bg-brand-brown/5 p-1 rounded-xl border border-brand-brown/5">
                                                        {qty > 0 && (
                                                            <>
                                                                <button
                                                                    onClick={() => removeItem(item.id)}
                                                                    className="w-10 h-10 rounded-lg bg-white border border-brand-brown/10 flex items-center justify-center text-brand-brown hover:bg-brand-brown hover:text-white transition-all shadow-sm active:scale-90"
                                                                    aria-label="Kurang"
                                                                >
                                                                    <Minus className="w-4 h-4" />
                                                                </button>
                                                                <span className="w-8 text-center font-bold text-brand-brown text-base">
                                                                    {qty}
                                                                </span>
                                                            </>
                                                        )}
                                                        <button
                                                            onClick={() => addItem(item)}
                                                            className={`h-10 rounded-lg flex items-center justify-center transition-all shadow-lg active:scale-95 px-4 gap-2 font-bold text-sm ${qty > 0
                                                                ? 'bg-brand-brown text-white w-10 !px-0'
                                                                : 'bg-brand-brown text-white hover:bg-brand-lightBrown'
                                                                }`}
                                                            aria-label="Tambah"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                            {qty === 0 && <span>Tambah</span>}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 pt-10">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className={`p-3 rounded-xl border-2 transition-all ${currentPage === 1
                                        ? 'border-brand-brown/5 text-brand-brown/10 cursor-not-allowed'
                                        : 'border-brand-brown/10 text-brand-brown hover:bg-brand-brown hover:text-white hover:border-brand-brown shadow-sm active:scale-90'
                                        }`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-brand-brown uppercase tracking-widest">Halaman</span>
                                    <span className="w-8 h-8 rounded-lg bg-brand-brown text-white flex items-center justify-center text-xs font-bold">
                                        {currentPage}
                                    </span>
                                    <span className="text-xs font-bold text-brand-brown/30 uppercase tracking-widest">dari {totalPages}</span>
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`p-3 rounded-xl border-2 transition-all ${currentPage === totalPages
                                        ? 'border-brand-brown/5 text-brand-brown/10 cursor-not-allowed'
                                        : 'border-brand-brown/10 text-brand-brown hover:bg-brand-brown hover:text-white hover:border-brand-brown shadow-sm active:scale-90'
                                        }`}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Cart summary bar - more premium floating style */}
            {cart.length > 0 && (
                <div className="sticky bottom-6 z-40 px-2 animate-fade-in-up">
                    <div className="bg-brand-brown text-white p-5 rounded-3xl shadow-2xl shadow-brand-brown/40 flex items-center justify-between border border-white/10 group cursor-pointer active:scale-95 transition-all overflow-hidden relative">
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                                <UtensilsCrossed className="w-6 h-6 text-brand-beige" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-beige/60">Dalam Bakul</p>
                                <p className="font-bold text-sm">{cartCount} Hidangan Dipilih</p>
                            </div>
                        </div>
                        <div className="text-right relative z-10">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-beige/60">Jumlah</p>
                            <p className="font-brand font-bold text-2xl tracking-wide text-white">
                                RM {cartTotal.toFixed(2)}
                            </p>
                        </div>
                    </div>
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
