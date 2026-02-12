import { Link } from 'react-router-dom'
import { Coffee, MapPin, Clock, Phone, Instagram, Facebook, Music2 } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-brand-brown text-brand-beige relative overflow-hidden">
            {/* Decorative top edge */}
            <div className="h-1 bg-gradient-to-r from-brand-red via-brand-red/50 to-brand-red" />

            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand column */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-white/10 rounded-full">
                                <Coffee className="w-6 h-6 text-brand-red" />
                            </div>
                            <div>
                                <h3 className="font-brand font-bold text-xl tracking-[0.15em] text-white">MIAMOR</h3>
                                <span className="text-[10px] uppercase tracking-[0.2em] text-brand-beige/60 font-bold">Coffee House</span>
                            </div>
                        </div>
                        <p className="text-brand-beige/70 text-sm leading-relaxed">
                            Ruang selesa untuk menikmati kopi premium yang diseduh penuh kasih sayang. Rasai The Original Taste bersama kami.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-brand font-bold text-white uppercase tracking-wider text-sm mb-6">Pautan Pantas</h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'Utama', path: '/' },
                                { name: 'Menu', path: '/menu' },
                                { name: 'Tempah Meja', path: '/book' },
                            ].map(link => (
                                <li key={link.path}>
                                    <Link to={link.path} className="text-brand-beige/60 hover:text-white transition-colors text-sm font-medium">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Operating Hours */}
                    <div>
                        <h4 className="font-brand font-bold text-white uppercase tracking-wider text-sm mb-6">Waktu Operasi</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <Clock className="w-4 h-4 text-brand-red mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-white font-medium">Isnin – Sabtu</p>
                                    <p className="text-brand-beige/60">10:30 AM – 6:30 PM</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 opacity-50">
                                <Clock className="w-4 h-4 text-brand-beige/20 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-brand-beige/40 font-medium">Ahad</p>
                                    <p className="text-brand-beige/30 italic whitespace-nowrap">Tutup (Closed)</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-brand font-brand font-bold text-white uppercase tracking-wider text-sm mb-6">Hubungi Kami</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-brand-red mt-0.5 flex-shrink-0" />
                                <span className="text-brand-beige/60 leading-relaxed">
                                    Tingkat 1, 60-7, Jalan Sulaiman, Taman Sri Maharani, 84000 Muar, Johor
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-brand-red flex-shrink-0" />
                                <span className="text-brand-beige/60">017-740-2975</span>
                            </li>
                        </ul>
                        <div className="flex gap-3 mt-6">
                            <a
                                href="https://www.instagram.com/miamorcoffeemy?igsh=MWtqODgwM2lycWVwZg=="
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-4 h-4 text-white" />
                            </a>
                            <a
                                href="https://www.facebook.com/share/1CL9ZBoKcC/?mibextid=wwXIfr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-4 h-4 text-white" />
                            </a>
                            <a
                                href="https://www.tiktok.com/@miamorcoffee1?_r=1&_t=ZS-93riGkzyrCe"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition-colors"
                                aria-label="TikTok"
                            >
                                <Music2 className="w-4 h-4 text-white" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-brand-beige/40 text-xs">
                        © 2024 Miamor Coffee House. Hak cipta terpelihara.
                    </p>
                    <p className="text-brand-beige/30 text-xs">
                        Dibuat dengan ☕ dan ❤️
                    </p>
                </div>
            </div>
        </footer>
    )
}
