import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UtensilsCrossed, ArrowRight, Coffee, Search } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

// Category images
const CATEGORY_IMAGES = {
    Minuman: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format&fit=crop',
    Makanan: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop',
    'Pencuci Mulut': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=600&auto=format&fit=crop',
}

// Item images for fallback
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
    'Kek Coklat Lava': 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=400&auto=format&fit=crop',
    Churros: 'https://images.unsplash.com/photo-1624371414361-e670c3e2a7f7?q=80&w=400&auto=format&fit=crop',
}

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400&auto=format&fit=crop'

export default function MenuPage() {
    const navigate = useNavigate()
    const [menuItems, setMenuItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchMenu()
    }, [])

    const fetchMenu = async () => {
        try {
            const { data, error } = await supabase
                .from('menu_items')
                .select('*')
                .eq('is_available', true)
                .order('category')
                .order('name')
            if (error) throw error
            setMenuItems(data || [])
        } catch {
            setMenuItems(getSampleMenuItems())
        } finally {
            setLoading(false)
        }
    }

    const categories = ['all', ...new Set(menuItems.map(item => item.category))]

    const filteredItems = menuItems.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const groupedItems = filteredItems.reduce((groups, item) => {
        const cat = item.category
        if (!groups[cat]) groups[cat] = []
        groups[cat].push(item)
        return groups
    }, {})

    return (
        <div className="min-h-screen bg-brand-cream bg-paper-texture">
            <Header />

            {/* Hero Banner */}
            <div className="relative h-72 md:h-80 flex items-end overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1600&auto=format&fit=crop"
                    alt="Menu"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-brown via-brand-brown/60 to-transparent" />
                <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pb-10">
                    <span className="text-brand-red font-bold text-sm uppercase tracking-[0.2em]">Jelajahi</span>
                    <h1 className="text-4xl md:text-6xl font-brand font-bold text-white mt-1 tracking-wide">
                        Menu Kami
                    </h1>
                    <p className="text-brand-beige/80 mt-2 max-w-md">
                        Setiap hidangan diolah dengan bahan berkualiti tinggi dan penuh kasih sayang.
                    </p>
                </div>
            </div>

            {/* Sticky Filter Bar */}
            <div className="sticky top-[68px] z-30 bg-white/95 backdrop-blur-md border-b border-brand-brown/10 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        {/* Category Pills */}
                        <div className="flex gap-2 overflow-x-auto pb-1 flex-1 scrollbar-hide">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border-2 ${activeCategory === cat
                                        ? 'bg-brand-brown border-brand-brown text-white shadow-md'
                                        : 'bg-transparent border-brand-brown/10 text-brand-lightBrown hover:border-brand-brown/30'
                                        }`}
                                >
                                    {cat === 'all' ? 'Semua' : cat}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-lightBrown" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari menu..."
                                className="w-full bg-brand-brown/5 border border-brand-brown/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-brand-brown placeholder-brand-brown/40 focus:outline-none focus:border-brand-red/50 transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Content */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-brand-brown border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-20">
                        <Coffee className="w-16 h-16 text-brand-brown/20 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-brand-brown">Tiada item dijumpai</h3>
                        <p className="text-brand-lightBrown mt-2">Cuba cari dengan kata kunci lain.</p>
                    </div>
                ) : (
                    Object.entries(groupedItems).map(([category, items]) => (
                        <div key={category} className="mb-16">
                            {/* Category header */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                                    <img
                                        src={CATEGORY_IMAGES[category] || DEFAULT_IMG}
                                        alt={category}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-brand font-bold text-brand-brown">{category}</h2>
                                    <p className="text-brand-lightBrown text-sm">{items.length} item</p>
                                </div>
                            </div>

                            {/* Items grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {items.map(item => (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-2xl overflow-hidden border border-brand-brown/5 shadow-md shadow-brand-brown/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                                    >
                                        <div className="relative h-44 overflow-hidden">
                                            <img
                                                src={ITEM_IMAGES[item.name] || DEFAULT_IMG}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-brand font-bold text-lg text-brand-brown leading-tight">{item.name}</h4>
                                            <p className="text-brand-red font-bold text-lg mt-2">
                                                RM {Number(item.price).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </main>

            {/* CTA Band */}
            <section className="py-12 bg-brand-brown">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-brand font-bold text-white mb-3">
                        Nak Pesan Sekarang?
                    </h2>
                    <p className="text-brand-beige/70 mb-6">
                        Tempah meja dan pre-order makanan kegemaran anda.
                    </p>
                    <button
                        onClick={() => navigate('/book')}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-brand-red text-white font-brand font-bold tracking-wide rounded-full hover:bg-brand-hoverRed transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Tempah & Pesan
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    )
}

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
