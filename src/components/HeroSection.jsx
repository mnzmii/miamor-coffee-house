import { useNavigate } from 'react-router-dom'
import { Coffee, ChevronRight, MapPin, Clock } from 'lucide-react'

export default function HeroSection() {
    const navigate = useNavigate()

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pb-12">

            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2574&auto=format&fit=crop"
                    alt="Suasana selesa Miamor Coffee House"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-brand-brown/90" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in flex flex-col items-center justify-center pt-24 space-y-8">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-beige text-xs font-bold tracking-[0.2em] uppercase mb-4 animate-slide-up">
                    <Coffee className="w-3 h-3" />
                    EST. 2024
                </div>

                {/* Headline */}
                <h1 className="font-brand font-bold text-5xl md:text-7xl lg:text-8xl text-white leading-tight drop-shadow-2xl">
                    Rasai <br />
                    <span className="text-brand-red italic font-display">The Original Taste</span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg md:text-xl text-brand-beige/90 max-w-2xl mx-auto leading-relaxed font-light">
                    Ruang selesa dengan kopi premium yang diseduh penuh kasih sayang. <br className="hidden md:block" />
                    Tempah bilik peribadi atau pesan lebih awal untuk momen sempurna.
                </p>

                {/* CTAs */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
                    <button
                        onClick={() => navigate('/book')}
                        className="group relative px-8 py-4 bg-brand-red text-white font-brand font-bold text-lg rounded-full overflow-hidden shadow-lg shadow-brand-red/30 transition-all hover:scale-105 active:scale-95 tracking-wide"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Tempah Meja
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-hoverRed to-brand-red opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <button
                        onClick={() => navigate('/menu')}
                        className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-brand font-bold text-lg rounded-full hover:bg-white/20 transition-all tracking-wide"
                    >
                        Lihat Menu
                    </button>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-12 bg-black/40 backdrop-blur-md p-8 md:p-10 rounded-3xl mx-4 border border-white/10 shadow-2xl overflow-hidden">
                    <div className="flex flex-col items-center gap-3 transition-transform hover:scale-105 duration-300">
                        <Clock className="w-6 h-6 text-brand-red" />
                        <div className="text-center">
                            <h3 className="text-white font-bold font-brand uppercase tracking-wider text-sm mb-1">Waktu Operasi</h3>
                            <p className="text-brand-beige/70 text-xs">Isnin - Sabtu</p>
                            <p className="text-brand-beige font-medium text-sm">10:30 AM - 6:30 PM</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3 border-y md:border-y-0 md:border-x border-white/10 py-6 md:py-0">
                        <MapPin className="w-6 h-6 text-brand-red" />
                        <div className="text-center flex flex-col items-center">
                            <h3 className="text-white font-bold font-brand uppercase tracking-wider text-sm mb-1">Lokasi</h3>
                            <p className="text-brand-beige/70 text-sm mb-4">
                                Miamor Coffee House,<br />
                                Muar, Johor
                            </p>
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=Miamor+Coffee+House+Muar+Johor"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-red/20 hover:bg-brand-red text-brand-red hover:text-white border border-brand-red/30 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300"
                            >
                                <MapPin className="w-3 h-3" />
                                Buka Peta
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3 transition-transform hover:scale-105 duration-300">
                        <Coffee className="w-6 h-6 text-brand-red" />
                        <div className="text-center">
                            <h3 className="text-white font-bold font-brand uppercase tracking-wider text-sm mb-1">Bilik Peribadi</h3>
                            <p className="text-brand-beige/70 text-sm">5 Ruang Eksklusif</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}
