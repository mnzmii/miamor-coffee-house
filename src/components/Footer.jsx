import { MapPin, Clock, Phone, Instagram, Facebook, Music2 } from 'lucide-react'
import { MENU_PDF_URL } from '../lib/constants'

const LOGO_URL = '/miamor_logo.jpg'

export default function Footer() {
    return (
        <footer className="bg-brand-brown text-brand-beige relative overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-brand-red via-brand-red/50 to-brand-red" />

            <div className="max-w-7xl mx-auto px-5 md:px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 text-center md:text-left">

                    <div>
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-5">
                            <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                                <img src={LOGO_URL} alt="Miamor Coffee House logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-logo font-bold flex flex-col tracking-tight leading-none justify-center">
                                <span className="text-3xl text-brand-red">MIAMOR</span>
                                <span className="text-sm mt-0.5 text-white">COFFEE HOUSE</span>
                            </span>
                        </div>
                        <p className="text-brand-beige/70 text-sm leading-relaxed">
                            A cozy space to enjoy premium coffee brewed with love.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-sans font-bold text-brand-beige uppercase tracking-[0.2em] text-[13px] mb-5">Quick Links</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            <li><a href="#hero" className="text-brand-beige/60 hover:text-white transition-colors">Home</a></li>
                            <li><a href="#rooms" className="text-brand-beige/60 hover:text-white transition-colors">Rooms</a></li>
                            <li><a href="#menu" className="text-brand-beige/60 hover:text-white transition-colors">Menu</a></li>
                            <li><a href="#booking" className="text-brand-beige/60 hover:text-white transition-colors">Book a Table</a></li>
                            <li><a href={MENU_PDF_URL} target="_blank" rel="noopener noreferrer" className="text-brand-beige/60 hover:text-white transition-colors">Menu (PDF)</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-sans font-bold text-brand-beige uppercase tracking-[0.2em] text-[13px] mb-5">Opening Hours</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start justify-center md:justify-start gap-3">
                                <Clock className="w-4 h-4 text-brand-red mt-0.5 flex-shrink-0" />
                                <div className="text-center md:text-left">
                                    <p className="text-white font-medium">Monday – Saturday</p>
                                    <p className="text-brand-beige/60">10:30 AM – 6:30 PM</p>
                                </div>
                            </li>
                            <li className="flex items-start justify-center md:justify-start gap-3 opacity-50">
                                <Clock className="w-4 h-4 text-brand-beige/20 mt-0.5 flex-shrink-0" />
                                <div className="text-center md:text-left">
                                    <p className="text-brand-beige/40 font-medium">Sunday</p>
                                    <p className="text-brand-beige/30 italic">Closed</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-sans font-bold text-brand-beige uppercase tracking-[0.2em] text-[13px] mb-5">Contact</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start justify-center md:justify-start gap-3">
                                <MapPin className="w-4 h-4 text-brand-red mt-0.5 flex-shrink-0" />
                                <span className="text-brand-beige/60 leading-relaxed">
                                    1st Floor, 60-7, Jalan Sulaiman, Taman Sri Maharani, 84000 Muar, Johor
                                </span>
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-3">
                                <Phone className="w-4 h-4 text-brand-red flex-shrink-0" />
                                <a href="tel:0177402975" className="text-brand-beige/60 hover:text-white transition-colors">017-740-2975</a>
                            </li>
                        </ul>

                        <div className="flex justify-center md:justify-start gap-3 mt-5">
                            <a href="https://www.instagram.com/miamorcoffeemy?igsh=MWtqODgwM2lycWVwZg==" target="_blank" rel="noopener noreferrer"
                                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition-colors active:scale-90" aria-label="Instagram">
                                <Instagram className="w-5 h-5 text-white" />
                            </a>
                            <a href="https://www.facebook.com/share/1CL9ZBoKcC/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"
                                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition-colors active:scale-90" aria-label="Facebook">
                                <Facebook className="w-5 h-5 text-white" />
                            </a>
                            <a href="https://www.tiktok.com/@miamorcoffee1?_r=1&_t=ZS-93riGkzyrCe" target="_blank" rel="noopener noreferrer"
                                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition-colors active:scale-90" aria-label="TikTok">
                                <Music2 className="w-5 h-5 text-white" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-white/10 text-center">
                    <p className="text-brand-beige/40 text-xs">© 2024 Miamor Coffee House. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}