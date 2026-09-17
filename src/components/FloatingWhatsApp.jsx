import { MessageCircle } from 'lucide-react'
import { ADMIN_WHATSAPP, getWhatsAppLink } from '../lib/constants'

const DEFAULT_MSG = `Hi Miamor! 👋 I'd like to book a table.\n\n📅 Date:\n🕐 Time:\n👥 Pax:\n\nThank you! 😊`

export default function FloatingWhatsApp() {
    const waLink = getWhatsAppLink(ADMIN_WHATSAPP, DEFAULT_MSG)

    return (
        <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Miamor on WhatsApp"
            className="fixed z-40 bottom-5 right-5 md:bottom-8 md:right-8 group"
            style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
            {/* Button */}
            <span className="relative flex w-14 h-14 md:w-16 md:h-16">
                {/* Pulse ring */}
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-30 animate-ping" />
                <span className="relative inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/30 hover:bg-[#1fb857] hover:scale-105 active:scale-95 transition-all">
                    <MessageCircle className="w-7 h-7 md:w-8 md:h-8 fill-white/20" />
                </span>
            </span>
        </a>
    )
}
