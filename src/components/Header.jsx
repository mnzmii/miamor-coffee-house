import { Link, useLocation } from 'react-router-dom'
import { Coffee, ChefHat, LayoutDashboard } from 'lucide-react'
import { LABELS } from '../lib/constants'

export default function Header({ title }) {
    const location = useLocation()
    const isStaff = location.pathname.startsWith('/staff')
    const isKitchen = location.pathname === '/kitchen'

    return (
        <header className="sticky top-0 z-50 bg-dark-950/80 backdrop-blur-lg border-b border-dark-800">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20">
                        <Coffee className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-lg text-white leading-tight">
                            {LABELS.APP_NAME}
                        </h1>
                        {title && (
                            <p className="text-xs text-dark-400 font-medium">{title}</p>
                        )}
                    </div>
                </div>

                {/* Navigation for staff/kitchen */}
                {(isStaff || isKitchen) && (
                    <nav className="flex items-center gap-2">
                        <Link
                            to="/staff"
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/staff'
                                    ? 'bg-brand-500/20 text-brand-400'
                                    : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800'
                                }`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="hidden sm:inline">{LABELS.STAFF_DASHBOARD}</span>
                        </Link>
                        <Link
                            to="/kitchen"
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/kitchen'
                                    ? 'bg-brand-500/20 text-brand-400'
                                    : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800'
                                }`}
                        >
                            <ChefHat className="w-4 h-4" />
                            <span className="hidden sm:inline">{LABELS.KITCHEN_BOARD}</span>
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    )
}
