import { ChevronRight } from 'lucide-react'
import { MENU_PDF_URL } from '../lib/constants'

export default function HeroSection() {
    return (
        <section id="hero" className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden">
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/miamor_hero.jpg"
                    alt="Suasana Miamor Coffee House"
                    className="w-full h-full object-cover object-center"
                />
                {/* Gradient: Gelap di kiri (untuk teks), lutsinar di kanan (untuk cawan kopi) */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 md:from-black/80 via-black/50 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-12 flex flex-col items-start justify-center min-h-[100svh] pt-20 pb-20">
                
                <div className="max-w-xl flex flex-col items-start text-left gap-6 md:gap-8">
                    
                    {/* STYLE BARU BADGE: Classic Editorial / Premium Roastery */}
                    <div className="flex items-center gap-4 pl-1">
                        <div className="h-[2px] w-8 md:w-12 bg-brand-red rounded-full"></div>
                        <span className="text-xs md:text-sm font-sans tracking-[0.4em] uppercase text-brand-beige font-bold drop-shadow-md">
                            EST. 2024
                        </span>
                    </div>

                    {/* Massive H1 Headline — editorial staggered look */}
                    <h1 className="font-display font-bold text-5xl md:text-7xl leading-[1.05] text-white drop-shadow-lg">
                        Experience
                        <br />
                        Mi Amor.
                    </h1>

                    {/* Description — below headline */}
                    <p className="text-base md:text-lg text-white/95 leading-relaxed font-heading italic drop-shadow-md">
                        A cozy space where premium coffee is brewed with love. Reserve a private room for your perfect moment.
                    </p>

                    {/* Action Buttons — bottom of content group */}
                    <div className="flex flex-col sm:flex-row items-center justify-start gap-3 md:gap-4 w-full sm:w-auto mt-2">
                        <a
                            href="#booking"
                            className="group w-full sm:w-auto px-8 py-4 bg-brand-red text-white font-sans font-bold text-base md:text-lg rounded-full shadow-lg shadow-brand-red/30 transition-all active:scale-95 tracking-wide flex items-center justify-center gap-2"
                        >
                            Book a Table
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>

                        <a
                            href={MENU_PDF_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-sans font-bold text-base md:text-lg rounded-full hover:bg-white/20 transition-all tracking-wide text-center active:scale-95"
                        >
                            View Menu
                        </a>
                    </div>
                </div>

            </div>
        </section>
    )
}