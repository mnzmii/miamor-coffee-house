import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Coffee, Users, ArrowRight, Star, QrCode, Clock,
    CalendarCheck, UtensilsCrossed, MessageCircle, Armchair, Smartphone, ChefHat, X
} from 'lucide-react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

// Room images from Unsplash
const ROOM_IMAGES = [
    'https://images.unsplash.com/photo-1559329007-40df8a9345d8?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
]

// Menu highlight images
const MENU_IMAGES = {
    Latte: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=600&auto=format&fit=crop',
    'Nasi Lemak Ayam': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=600&auto=format&fit=crop',
    'Kek Coklat Lava': 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=600&auto=format&fit=crop',
    Cappuccino: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop',
}

// Room additional details
const ROOM_DETAILS = {
    'Duo': {
        usage: 'Sesuai untuk Perbincangan & Temu Janji',
        quote: 'Ruang kecil yang tenang, memberikan suasana privasi yang sempurna untuk perbincangan fokus atau temu janji istimewa.'
    },
    'Amorcito': {
        usage: 'Sesuai untuk Perjumpaan Kecil',
        quote: 'Suasana yang hangat dan selesa, direka khas untuk perjumpaan keluarga kecil atau sesi santai bersama rakan karib.'
    },
    'La Amistad': {
        usage: 'Sesuai untuk Acara & Sambutan',
        quote: 'Ruang yang luas dan versatil, sesuai untuk meraikan persahabatan, sambutan ulang tahun, atau majlis kesyukuran.'
    },
    'La Rossa': {
        usage: 'Sesuai untuk Sesi Santai Terbuka',
        quote: 'Nikmati suasana kafe yang hidup dalam kawasan yang lebih teratur, sesuai untuk mereka yang sukakan keterbukaan.'
    },
    'El Corazon': {
        usage: 'Sesuai untuk Acara Korporat & Jamuan',
        quote: 'Bilik terbesar kami yang menawarkan kemudahan lengkap untuk mesyuarat korporat atau acara jamuan besar dengan privasi mutlak.'
    }
}

export default function LandingPage() {
    const navigate = useNavigate()
    const [rooms, setRooms] = useState([])
    const [menuHighlights, setMenuHighlights] = useState([])
    const [showDetails, setShowDetails] = useState(null)

    useEffect(() => {
        fetchRooms()
        fetchMenuHighlights()
    }, [])

    const fetchRooms = async () => {
        try {
            const { data, error } = await supabase.from('rooms').select('*').order('capacity', { ascending: true })
            if (error) throw error
            setRooms(data || [])
        } catch {
            setRooms([
                { id: '1', name: 'Duo', category: 'Private', capacity: 4 },
                { id: '2', name: 'Amorcito', category: 'Private', capacity: 6 },
                { id: '3', name: 'La Amistad', category: 'Private', capacity: 8 },
                { id: '4', name: 'La Rossa', category: 'Open', capacity: 8 },
                { id: '5', name: 'El Corazon', category: 'Private', capacity: 15 },
            ])
        }
    }

    const fetchMenuHighlights = async () => {
        try {
            const { data, error } = await supabase.from('menu_items').select('*').eq('is_available', true).limit(4)
            if (error) throw error
            setMenuHighlights(data || [])
        } catch {
            setMenuHighlights([
                { id: '3', name: 'Latte', category: 'Minuman', price: 12.0 },
                { id: '4', name: 'Cappuccino', category: 'Minuman', price: 12.0 },
                { id: '9', name: 'Nasi Lemak Ayam', category: 'Makanan', price: 15.0 },
                { id: '15', name: 'Kek Coklat Lava', category: 'Pencuci Mulut', price: 16.0 },
            ])
        }
    }

    return (
        <div className="min-h-screen bg-brand-cream">
            <Header />

            {/* ── Section 1: Hero ── */}
            <HeroSection />

            {/* ── Section 2: About / Story ── */}
            <section className="py-20 md:py-28 bg-white relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop"
                            alt="Miamor Coffee"
                            className="rounded-2xl shadow-2xl shadow-brand-brown/20 w-full h-80 md:h-[450px] object-cover"
                        />
                        <div className="absolute -bottom-4 -right-4 bg-brand-red text-white px-6 py-3 rounded-xl font-brand font-bold tracking-wider shadow-lg">
                            EST. 2024
                        </div>
                    </div>
                    <div className="space-y-6">
                        <span className="text-brand-red font-bold text-sm uppercase tracking-[0.2em]">Kisah Kami</span>
                        <h2 className="text-4xl md:text-5xl font-brand font-bold text-brand-brown leading-tight">
                            Lebih Dari <br />Sekadar Kopi
                        </h2>
                        <p className="text-brand-lightBrown text-lg leading-relaxed">
                            Di Miamor, setiap cawan kopi dihidangkan dengan penuh kasih sayang. Kami percaya bahawa pengalaman menikmati kopi bukan sekadar tentang rasa — tetapi tentang suasana, ketenangan, dan momen bersama orang tersayang.
                        </p>
                        <p className="text-brand-lightBrown leading-relaxed">
                            Dengan bilik peribadi eksklusif dan menu yang diolah dengan bahan terbaik, Miamor adalah destinasi sempurna untuk meraikan setiap detik kehidupan.
                        </p>
                        <div className="flex items-center gap-8 pt-4">
                            <div className="text-center">
                                <p className="text-3xl font-brand font-bold text-brand-brown">{rooms.length || 5}</p>
                                <p className="text-xs text-brand-lightBrown uppercase tracking-wider font-bold">Bilik Eksklusif</p>
                            </div>
                            <div className="w-px h-12 bg-brand-brown/10" />
                            <div className="text-center">
                                <p className="text-3xl font-brand font-bold text-brand-brown">{menuHighlights.length > 0 ? '18+' : '18+'}</p>
                                <p className="text-xs text-brand-lightBrown uppercase tracking-wider font-bold">Item Menu</p>
                            </div>
                            <div className="w-px h-12 bg-brand-brown/10" />
                            <div className="text-center">
                                <p className="text-3xl font-brand font-bold text-brand-brown">★</p>
                                <p className="text-xs text-brand-lightBrown uppercase tracking-wider font-bold">Premium</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 3: Our Rooms Gallery ── */}
            <section id="rooms" className="py-20 md:py-28 bg-brand-cream bg-paper-texture">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-brand-red font-bold text-sm uppercase tracking-[0.2em]">Ruang Kami</span>
                        <h2 className="text-4xl md:text-5xl font-brand font-bold text-brand-brown mt-3">
                            Bilik Peribadi
                        </h2>
                        <p className="text-brand-lightBrown mt-4 max-w-lg mx-auto">
                            Pilih bilik eksklusif untuk pengalaman yang lebih peribadi dan selesa.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rooms.map((room, index) => (
                            <div
                                key={room.id}
                                className="group bg-white rounded-2xl overflow-hidden shadow-xl shadow-brand-brown/10 hover:shadow-[0_20px_50px_rgba(62,39,35,0.2)] hover:-translate-y-2 transition-all duration-500 border border-brand-brown/5"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={ROOM_IMAGES[index % ROOM_IMAGES.length]}
                                        alt={room.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4 text-white">
                                        <h3 className="font-brand font-bold text-2xl tracking-wide">{room.name}</h3>
                                        <p className="text-xs uppercase tracking-widest text-white/80">{room.category}</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-brand-lightBrown mb-4">
                                        <Users className="w-4 h-4" />
                                        <span className="text-sm font-medium">Sehingga {room.capacity} orang</span>
                                    </div>
                                    <button
                                        onClick={() => setShowDetails(room)}
                                        className="w-full py-3 rounded-xl bg-brand-beige/30 text-brand-brown border border-brand-brown/10 font-bold text-sm hover:bg-brand-brown hover:text-white transition-all flex items-center justify-center gap-2 group/btn shadow-sm hover:shadow-md"
                                    >
                                        Lihat Butiran
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Room Details Modal (Gallery) ── */}
                {showDetails && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <div
                            className="absolute inset-0 bg-brand-brown/95 backdrop-blur-md animate-fade-in"
                            onClick={() => setShowDetails(null)}
                        />
                        <div className="relative w-full max-w-5xl bg-white rounded-[2rem] overflow-hidden shadow-2xl animate-zoom-in max-h-[90vh] flex flex-col md:flex-row">
                            {/* Close Button - Top Right */}
                            <button
                                onClick={() => setShowDetails(null)}
                                className="absolute top-6 right-6 z-[110] w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-brand-brown hover:bg-brand-red hover:text-white transition-all duration-300 border border-brand-brown/10"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Gallery Side */}
                            <div className="md:w-3/5 bg-brand-brown/5 p-4 md:p-8 flex flex-col gap-4 overflow-y-auto">
                                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-brand-brown/5">
                                    <img
                                        src={ROOM_IMAGES[rooms.indexOf(showDetails) % ROOM_IMAGES.length]}
                                        className="w-full h-full object-cover"
                                        alt={showDetails.name}
                                    />
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="aspect-square rounded-xl overflow-hidden bg-brand-brown/10 border border-brand-brown/10 hover:border-brand-red transition-all cursor-pointer group">
                                            <div className="w-full h-full flex items-center justify-center text-brand-brown/20 group-hover:text-brand-red transition-colors">
                                                <Armchair className="w-6 h-6" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-center text-[10px] text-brand-lightBrown/50 font-bold uppercase tracking-widest mt-2">
                                    Imej sudut tambahan tersedia tidak lama lagi
                                </p>
                            </div>

                            {/* Info Side */}
                            <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-between overflow-y-auto">
                                <div>
                                    <div className="mb-8">
                                        <span className="text-brand-red font-bold text-[10px] uppercase tracking-[0.2em]">Bilik Peribadi</span>
                                        <h2 className="text-4xl font-brand font-bold text-brand-brown mt-1 lg:text-5xl">{showDetails.name}</h2>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4 group">
                                            <div className="w-12 h-12 rounded-2xl bg-brand-brown/5 flex items-center justify-center group-hover:bg-brand-brown/10 transition-colors">
                                                <Users className="w-5 h-5 text-brand-brown" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-brand-lightBrown font-bold uppercase tracking-widest leading-none mb-1">Kapasiti</p>
                                                <p className="text-brand-brown font-brand font-bold text-xl">Sehingga {showDetails.capacity} Orang</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 group">
                                            <div className="w-12 h-12 rounded-2xl bg-brand-brown/5 flex items-center justify-center group-hover:bg-brand-brown/10 transition-colors">
                                                <Clock className="w-5 h-5 text-brand-brown" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-brand-lightBrown font-bold uppercase tracking-widest leading-none mb-1">Penggunaan</p>
                                                <p className="text-brand-brown font-brand font-bold text-xl">{ROOM_DETAILS[showDetails.name]?.usage || 'Sesuai untuk Acara & Santai'}</p>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-brand-cream/30 rounded-2xl border border-brand-brown/5">
                                            <p className="text-sm text-brand-lightBrown leading-relaxed italic">
                                                "{ROOM_DETAILS[showDetails.name]?.quote || 'Ruang yang tenang dan selesa untuk momen istimewa anda.'}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 flex flex-col gap-4">
                                    <button
                                        onClick={() => {
                                            navigate('/book')
                                            window.scrollTo(0, 0)
                                        }}
                                        className="w-full py-4 bg-brand-red text-white font-brand font-bold rounded-2xl shadow-xl shadow-brand-red/20 hover:bg-brand-hoverRed hover:-translate-y-1 transition-all"
                                    >
                                        Teruskan Tempahan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* ── Section 4: Menu Highlights ── */}
            <section className="py-20 md:py-28 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-brand-red font-bold text-sm uppercase tracking-[0.2em]">Pilihan Terbaik</span>
                        <h2 className="text-4xl md:text-5xl font-brand font-bold text-brand-brown mt-3">
                            Pilihan Istimewa
                        </h2>
                        <p className="text-brand-lightBrown mt-4 max-w-lg mx-auto">
                            Nikmati pilihan terbaik kami — daripada kopi premium hingga hidangan istimewa.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {menuHighlights.map((item) => (
                            <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-md border border-brand-brown/5 transition-all duration-300">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={MENU_IMAGES[item.name] || `https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format&fit=crop`}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-white/90 backdrop-blur-sm text-brand-brown text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-brand font-bold text-lg text-brand-brown">{item.name}</h4>
                                    <p className="text-brand-red font-bold text-lg mt-1">RM {Number(item.price).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <button
                            onClick={() => { navigate('/menu'); window.scrollTo(0, 0); }}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-brown text-white font-brand font-bold tracking-wide rounded-full hover:bg-brand-lightBrown transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Lihat Menu Penuh
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Section 5: How It Works — Timeline ── */}
            <section className="py-20 md:py-28 bg-brand-brown text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-coffee-pattern opacity-5" />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-brand-red font-bold text-sm uppercase tracking-[0.2em]">Cara Ia Berfungsi</span>
                        <h2 className="text-4xl md:text-5xl font-brand font-bold text-white mt-3">
                            Dua Cara Menikmati
                        </h2>
                        <p className="text-brand-beige/70 mt-4 max-w-lg mx-auto">
                            Sama ada anda merancang lebih awal atau singgah secara spontan.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* ─── Remote Reservation Timeline ─── */}
                        <div>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-12 h-12 rounded-xl bg-brand-red/20 flex items-center justify-center">
                                    <CalendarCheck className="w-6 h-6 text-brand-red" />
                                </div>
                                <div>
                                    <h3 className="font-brand font-bold text-xl tracking-wide">Tempahan Online</h3>
                                    <p className="text-brand-beige/60 text-sm">Rancang lebih awal</p>
                                </div>
                            </div>

                            <div className="relative pl-8">
                                {/* Timeline vertical line */}
                                <div className="absolute left-[15px] top-0 bottom-0 w-px border-l-2 border-dashed border-brand-beige/20" />

                                {[
                                    { step: '01', icon: Smartphone, title: 'Lawati Laman Web', desc: 'Buka laman web dan klik "Tempah Meja".' },
                                    { step: '02', icon: UtensilsCrossed, title: 'Pilih Menu & Masa', desc: 'Pre-order makanan dan pilih masa kehadiran.' },
                                    { step: '03', icon: MessageCircle, title: 'Pengesahan WhatsApp', desc: 'Terima pengesahan bilik melalui WhatsApp.' },
                                    { step: '04', icon: Coffee, title: 'Nikmati!', desc: 'Tiba di cafe, bilik dan makanan sudah siap.' },
                                ].map((item, i, arr) => (
                                    <div key={i} className={`relative flex items-start gap-5 ${i < arr.length - 1 ? 'pb-10' : ''}`}>
                                        {/* Step circle */}
                                        <div className="relative z-10 flex-shrink-0 -ml-8">
                                            <div className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center shadow-lg shadow-brand-red/30 ring-4 ring-brand-brown">
                                                <span className="text-white font-bold text-xs">{item.step}</span>
                                            </div>
                                        </div>
                                        {/* Content */}
                                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 flex-1 hover:bg-white/10 transition-colors">
                                            <div className="flex items-center gap-3 mb-2">
                                                <item.icon className="w-5 h-5 text-brand-red flex-shrink-0" />
                                                <h4 className="font-medium text-white text-sm">{item.title}</h4>
                                            </div>
                                            <p className="text-brand-beige/60 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ─── QR Walk-in Timeline ─── */}
                        <div>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-12 h-12 rounded-xl bg-brand-red/20 flex items-center justify-center">
                                    <QrCode className="w-6 h-6 text-brand-red" />
                                </div>
                                <div>
                                    <h3 className="font-brand font-bold text-xl tracking-wide">Walk-in Sahaja</h3>
                                    <p className="text-brand-beige/60 text-sm">Terus ke kaunter</p>
                                </div>
                            </div>

                            <div className="relative pl-8">
                                {/* Timeline vertical line */}
                                <div className="absolute left-[15px] top-0 bottom-0 w-px border-l-2 border-dashed border-brand-beige/20" />

                                {[
                                    { step: '01', icon: Users, title: 'Daftar & Pilih Bilik', desc: 'Staf kami akan membantu menentukan bilik yang sesuai mengikut jumlah pax anda.' },
                                    { step: '02', icon: QrCode, title: 'Scan QR Code', desc: 'Imbas kod QR di meja untuk akses menu digital.' },
                                    { step: '03', icon: UtensilsCrossed, title: 'Pesan Makanan', desc: 'Pilih item dari menu dan hantar pesanan.' },
                                    { step: '04', icon: Coffee, title: 'Nikmati Hidangan', desc: 'Tunggu makanan sampai dan nikmati momen indah anda.' },
                                ].map((item, i, arr) => (
                                    <div key={i} className={`relative flex items-start gap-5 ${i < arr.length - 1 ? 'pb-10' : ''}`}>
                                        {/* Step circle */}
                                        <div className="relative z-10 flex-shrink-0 -ml-8">
                                            <div className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center shadow-lg shadow-brand-red/30 ring-4 ring-brand-brown">
                                                <span className="text-white font-bold text-xs">{item.step}</span>
                                            </div>
                                        </div>
                                        {/* Content */}
                                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 flex-1 hover:bg-white/10 transition-colors">
                                            <div className="flex items-center gap-3 mb-2">
                                                <item.icon className="w-5 h-5 text-brand-red flex-shrink-0" />
                                                <h4 className="font-medium text-white text-sm">{item.title}</h4>
                                            </div>
                                            <p className="text-brand-beige/60 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 6: Testimonials ── */}
            <section className="py-20 md:py-28 bg-brand-cream bg-paper-texture">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-brand-red font-bold text-sm uppercase tracking-[0.2em]">Testimoni</span>
                        <h2 className="text-4xl md:text-5xl font-brand font-bold text-brand-brown mt-3">
                            Apa Kata Pelanggan
                        </h2>
                        <p className="text-brand-lightBrown mt-4 max-w-lg mx-auto">
                            Dengar pengalaman daripada mereka yang telah menikmati suasana Miamor.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                name: 'Nana Tajuddin',
                                text: 'Pengalaman makan di bilik peribadi yang sangat tenang dan selesa, teringat nostalgia lama. Semua hidangannya juga sangat menyelerakan!',
                                rating: 5,
                            },
                            {
                                name: 'Min Yasmin',
                                text: 'Kopi yang sangat berkualiti! Iced Caffe Latte mereka terasa kesegaran biji kopinya dengan sukatan susu yang sempurna. Barista juga faham selera kopi asli.',
                                rating: 5,
                            },
                            {
                                name: 'Ainaa Fahira',
                                text: 'Hidangan yang sangat sedap disertakan dengan servis yang terbaik. Pengalaman yang sangat memuaskan di Miamor!',
                                rating: 5,
                            },
                            {
                                name: 'Leena 33',
                                text: 'Kualiti makanan yang sangat baik dan menyelerakan. Servis yang diberikan juga pantas dan memuaskan hati.',
                                rating: 5,
                            },
                        ].map((testimonial, i) => (
                            <div key={i} className="bg-white rounded-2xl p-8 shadow-lg shadow-brand-brown/5 border border-brand-brown/5 flex flex-col justify-between hover:shadow-xl transition-all h-full">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex gap-1">
                                            {[...Array(testimonial.rating)].map((_, j) => (
                                                <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-1 opacity-40">
                                            <span className="text-[10px] font-bold uppercase tracking-tighter">Google</span>
                                        </div>
                                    </div>
                                    <p className="text-brand-lightBrown leading-relaxed mb-6 italic text-sm">"{testimonial.text}"</p>
                                </div>
                                <p className="font-bold text-brand-brown text-sm">— {testimonial.name}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <a
                            href="https://www.google.com/maps/search/?api=1&query=Miamor+Coffee+Muar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-10 py-4 bg-brand-brown text-white font-brand font-bold tracking-wide rounded-full hover:bg-brand-lightBrown transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
                        >
                            Lihat Lebih Banyak di Google Reviews
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Section 7: CTA Band ── */}
            <section className="py-16 bg-brand-brown relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#2D1B18] to-brand-brown" />
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-brand font-bold text-brand-cream mb-4">
                        Sedia Untuk Menikmati?
                    </h2>
                    <p className="text-brand-beige/70 mb-8 text-lg">
                        Tempah meja anda sekarang dan nikmati pengalaman kopi terbaik.
                    </p>
                    <button
                        onClick={() => { navigate('/book'); window.scrollTo(0, 0); }}
                        className="inline-flex items-center gap-2 px-10 py-4 bg-brand-cream text-brand-brown font-brand font-bold tracking-wide rounded-full hover:bg-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Tempah Sekarang
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </section>

            {/* ── Section 8: Footer ── */}
            <Footer />
        </div>
    )
}
