import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Coffee, Menu, X } from 'lucide-react'

export default function Header() {
    const location = useLocation()
    const navigate = useNavigate()
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { name: 'Utama', path: '/' },
        { name: 'Menu', path: '/menu' },
    ]

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? 'bg-brand-brown/95 backdrop-blur-md shadow-lg py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className={`p-2 rounded-full transition-all duration-300 ${isScrolled ? 'bg-white/10' : 'bg-brand-brown/80'}`}>
                        <Coffee className="w-6 h-6 text-brand-beige" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className={`font-brand font-bold text-xl tracking-[0.15em] transition-colors ${isScrolled ? 'text-white' : 'text-brand-brown'} group-hover:text-brand-red`}>
                            MIAMOR
                        </h1>
                        <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isScrolled ? 'text-brand-beige' : 'text-brand-lightBrown'}`}>
                            Coffee House
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`font-semibold text-sm uppercase tracking-wider hover:text-brand-red transition-colors relative group
                ${location.pathname === link.path
                                    ? 'text-brand-red'
                                    : isScrolled ? 'text-white' : 'text-brand-brown'
                                }`}
                        >
                            {link.name}
                            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all duration-300 group-hover:w-full ${location.pathname === link.path ? 'w-full' : ''}`} />
                        </Link>
                    ))}

                    {/* Staff link */}
                    <Link
                        to="/staff/login"
                        className={`font-semibold text-sm uppercase tracking-wider hover:text-brand-red transition-colors relative group
                            ${location.pathname.startsWith('/staff')
                                ? 'text-brand-red'
                                : isScrolled ? 'text-white/60 hover:text-white' : 'text-brand-brown/50 hover:text-brand-brown'
                            }`}
                    >
                        Kakitangan
                        <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all duration-300 group-hover:w-full ${location.pathname.startsWith('/staff') ? 'w-full' : ''}`} />
                    </Link>

                    <button
                        onClick={() => navigate('/book')}
                        className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${location.pathname === '/book'
                            ? 'bg-brand-red text-white'
                            : 'bg-brand-brown text-white hover:bg-brand-lightBrown'
                            }`}
                    >
                        Tempah Meja
                    </button>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X className={isScrolled ? 'text-white' : 'text-brand-brown'} /> : <Menu className={isScrolled ? 'text-white' : 'text-brand-brown'} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-brand-brown shadow-xl border-t border-white/10 p-6 flex flex-col gap-4 animate-slide-up">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`text-lg font-brand font-bold tracking-wide ${location.pathname === link.path ? 'text-brand-red' : 'text-brand-beige'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        to="/staff/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-lg font-brand font-bold tracking-wide text-brand-beige/50"
                    >
                        Kakitangan
                    </Link>
                    <button
                        onClick={() => { setMobileMenuOpen(false); navigate('/book') }}
                        className="mt-2 bg-brand-red text-white px-6 py-3 rounded-full font-bold text-sm tracking-wide"
                    >
                        Tempah Meja
                    </button>
                </div>
            )}
        </header>
    )
}
