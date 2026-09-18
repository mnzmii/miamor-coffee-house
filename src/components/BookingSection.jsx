import { MessageCircle, ChevronRight, Clock, Users, MapPin } from 'lucide-react'
import { ADMIN_WHATSAPP, getWhatsAppLink } from '../lib/constants'

const DEFAULT_MSG = `Hi Miamor! 👋 I'd like to book a table.\n\n📅 Date:\n🕐 Time:\n👥 Pax:\n🎨 Decoration (if any):\n\nThank you! 😊`

export default function BookingSection() {
    const waLink = getWhatsAppLink(ADMIN_WHATSAPP, DEFAULT_MSG)

    return (
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-brown shadow-2xl shadow-brand-brown/30">
            {/* Background image + overlay */}
            <div className="absolute inset-0">
                <img
                    src="/miamor_hero.png"
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#2D1B18]/95 via-brand-brown/90 to-brand-brown/70" />
            </div>

            {/* Content */}
            <div className="relative z-10 px-6 py-12 md:px-16 md:py-20 text-center max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="h-[2px] w-8 bg-brand-red rounded-full" />
                    <span className="text-brand-beige/90 font-bold text-xs uppercase tracking-[0.25em]">
                        Reservation
                    </span>
                    <div className="h-[2px] w-8 bg-brand-red rounded-full" />
                </div>

                <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-semibold text-white leading-tight">
                    Ready to Book<br className="hidden sm:block" /> Your Private Room?
                </h2>

                <p className="text-brand-beige/80 mt-4 md:mt-5 text-sm md:text-lg leading-relaxed max-w-xl mx-auto">
                    Just send us your date, time &amp; pax on WhatsApp — we&apos;ll get
                    you confirmed in no time. Celebrating something special?{' '}
                    <a href="#deco" className="text-white font-bold underline underline-offset-4 decoration-brand-red hover:decoration-white transition-all">
                        See deco examples
                    </a>
                    .
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mt-8 md:mt-10">
                    <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-sans font-bold text-base md:text-lg rounded-full shadow-lg shadow-black/30 hover:bg-[#1fb857] hover:shadow-xl transition-all active:scale-95"
                    >
                        <MessageCircle className="w-5 h-5 fill-white/20" />
                        Book via WhatsApp
                    </a>

                    <a
                        href="#rooms"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-sans font-bold text-base md:text-lg rounded-full hover:bg-white/20 transition-all active:scale-95"
                    >
                        View Rooms
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

                {/* Trust row */}
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 md:mt-10 text-brand-beige/70 text-xs md:text-sm font-medium">
                    <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> Mon–Sat · 10:30AM–6:30PM
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <Users className="w-4 h-4" /> 4–15 pax · 6 spaces
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" /> Muar, Johor
                    </span>
                </div>
            </div>
        </div>
    )
}
