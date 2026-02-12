import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard, Coffee, Settings, UtensilsCrossed,
    LogOut, Menu, X, ChevronRight, QrCode
} from 'lucide-react'
import { useAuth } from '../lib/AuthContext'

export default function Sidebar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { logout } = useAuth()
    const [isOpen, setIsOpen] = useState(false)

    const links = [
        { name: 'Dashboard', path: '/staff', icon: LayoutDashboard },
        { name: 'Bilik', path: '/staff/rooms', icon: Settings },
        { name: 'QR Code', path: '/staff/qr', icon: QrCode },
        { name: 'Dapur', path: '/kitchen', icon: UtensilsCrossed },
    ]

    const isActive = (path) => {
        if (path === '/staff' && location.pathname === '/staff') return true
        if (path !== '/staff' && location.pathname.startsWith(path)) return true
        return false
    }

    const handleLogout = () => {
        logout()
        navigate('/staff/login', { replace: true })
    }

    return (
        <>
            {/* Mobile Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 right-4 z-50 p-2 bg-brand-brown text-brand-beige rounded-lg shadow-lg"
                aria-label="Toggle menu"
            >
                {isOpen ? <X /> : <Menu />}
            </button>

            {/* Sidebar Overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed top-0 left-0 h-screen w-64 bg-brand-brown text-brand-beige z-40 transition-transform duration-300 shadow-2xl
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 flex items-center gap-3 border-b border-brand-beige/10">
                    <div className="p-2 bg-brand-beige/10 rounded-full">
                        <Coffee className="w-6 h-6 text-brand-red" />
                    </div>
                    <div>
                        <h1 className="font-brand font-bold text-xl tracking-wide text-white">MIAMOR</h1>
                        <p className="text-[10px] uppercase tracking-[0.2em] opacity-60">Portal Kakitangan</p>
                    </div>
                </div>

                <nav className="p-4 space-y-2">
                    {links.map((link) => {
                        const active = isActive(link.path)
                        const Icon = link.icon
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`
                                    flex items-center justify-between p-3 rounded-lg transition-all group
                                    ${active
                                        ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20'
                                        : 'text-brand-beige/70 hover:bg-brand-beige/5 hover:text-white'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-brand-beige/50 group-hover:text-white'}`} />
                                    <span className="font-medium tracking-wide">{link.name}</span>
                                </div>
                                {active && <ChevronRight className="w-4 h-4 opacity-50" />}
                            </Link>
                        )
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-brand-beige/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full p-3 text-brand-beige/60 hover:text-white hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Log Keluar</span>
                    </button>
                    <p className="text-center text-[10px] text-brand-beige/30 mt-4">
                        v1.0.0 • Miamor System
                    </p>
                </div>
            </aside>
        </>
    )
}
