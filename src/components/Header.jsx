import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { MENU_PDF_URL } from '../lib/constants'

const LOGO_URL = '/miamor_logo.jpg'

const NAV = [
    { label: 'Home', href: '#hero' },
    { label: 'Rooms', href: '#rooms' },
    { label: 'Menu', href: '#menu' },
    { label: 'Book', href: '#booking' },
]

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Lock body scroll when mobile menu open
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [mobileMenuOpen])

    const closeMenu = () => setMobileMenuOpen(false)

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-brand-brown shadow-md safe-top">
                <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between py-3 md:py-4">
                    <a href="#hero" onClick={closeMenu} className="flex items-center gap-3 group">
                        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                            <img
                                src={LOGO_URL}
                                alt="Miamor Coffee House logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="hidden sm:flex flex-col font-logo font-bold tracking-tight leading-none justify-center">
                            <span className="text-3xl text-brand-red">MIAMOR</span>
                            <span className="text-sm mt-0.5 text-white">COFFEE HOUSE</span>
                        </span>
                    </a>

                    <nav className="hidden md:flex items-center gap-8">
                        {NAV.map(({ label, href }) => (
                            <a
                                key={href}
                                href={href}
                                className="font-semibold text-sm uppercase tracking-wider text-white hover:text-brand-red transition-colors relative group"
                            >
                                {label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all duration-300 group-hover:w-full" />
                            </a>
                        ))}
                        <a
                            href={MENU_PDF_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-sm uppercase tracking-wider text-white hover:text-brand-red transition-colors relative group"
                        >
                            Menu
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all duration-300 group-hover:w-full" />
                        </a>
                        <a
                            href="#booking"
                            className="px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95 bg-brand-red text-white hover:bg-brand-hoverRed"
                        >
                            Book a Table
                        </a>
                    </nav>

                    <button
                        className="md:hidden p-2.5 -mr-2 text-white"
                        onClick={() => setMobileMenuOpen(o => !o)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </header>

            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[60] md:hidden animate-fade-in">
                    <div className="absolute inset-0 bg-brand-brown" />
                    <div className="relative flex flex-col items-center justify-center min-h-screen px-8 gap-6">
                        <button
                            onClick={closeMenu}
                            className="absolute top-5 right-5 p-3 text-white/70 hover:text-white"
                            aria-label="Close menu"
                        >
                            <X className="w-7 h-7" />
                        </button>

                        <div className="text-center mb-2">
                            <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden">
                                <img src={LOGO_URL} alt="Miamor Coffee House logo" className="w-full h-full object-cover" />
                            </div>
                            <p className="font-logo font-bold flex flex-col tracking-tight leading-none">
                                <span className="text-5xl text-brand-red">MIAMOR</span>
                                <span className="text-base mt-1 text-white">COFFEE HOUSE</span>
                            </p>
                        </div>

                        {NAV.map(({ label, href }) => (
                            <a
                                key={href}
                                href={href}
                                onClick={closeMenu}
                                className="text-2xl font-sans font-bold tracking-wide text-brand-beige hover:text-white transition-colors"
                            >
                                {label}
                            </a>
                        ))}

                        <a
                            href={MENU_PDF_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={closeMenu}
                            className="text-2xl font-sans font-bold tracking-wide text-brand-beige hover:text-white transition-colors"
                        >
                            Menu
                        </a>

                        <a
                            href="#booking"
                            onClick={closeMenu}
                            className="mt-4 bg-brand-red text-white px-10 py-4 rounded-full font-bold text-lg tracking-wide shadow-2xl shadow-brand-red/30 active:scale-95 transition-transform w-full max-w-xs text-center"
                        >
                            Book a Table
                        </a>
                    </div>
                </div>
            )}
        </>
    )
}