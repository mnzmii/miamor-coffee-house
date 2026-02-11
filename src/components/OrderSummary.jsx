import { ShoppingBag, User, Users, Clock, MapPin } from 'lucide-react'
import { LABELS } from '../lib/constants'

export default function OrderSummary({ customerName, whatsappNumber, guestCount, date, time, cart, orderType, roomName }) {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-400" />
                <h3 className="text-lg font-display font-semibold text-white">{LABELS.ORDER_SUMMARY}</h3>
            </div>

            {/* Customer info */}
            <div className="glass-card p-4 space-y-3">
                <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-dark-400" />
                    <div>
                        <p className="text-xs text-dark-500">{LABELS.CUSTOMER_NAME}</p>
                        <p className="text-white font-medium">{customerName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="w-4 h-4 text-dark-400 flex items-center justify-center text-sm">📱</span>
                    <div>
                        <p className="text-xs text-dark-500">{LABELS.WHATSAPP_NUMBER}</p>
                        <p className="text-white font-medium">{whatsappNumber}</p>
                    </div>
                </div>
                {orderType === 'remote' && (
                    <>
                        <div className="flex items-center gap-3">
                            <Users className="w-4 h-4 text-dark-400" />
                            <div>
                                <p className="text-xs text-dark-500">{LABELS.GUEST_COUNT}</p>
                                <p className="text-white font-medium">{guestCount} orang</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-dark-400" />
                            <div>
                                <p className="text-xs text-dark-500">{LABELS.PREFERRED_TIME}</p>
                                <p className="text-white font-medium">
                                    {date && new Date(date).toLocaleDateString('ms-MY', { dateStyle: 'long' })} • {time}
                                </p>
                            </div>
                        </div>
                    </>
                )}
                {roomName && (
                    <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-dark-400" />
                        <div>
                            <p className="text-xs text-dark-500">{LABELS.ROOM_NAME}</p>
                            <p className="text-white font-medium">{roomName}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Order items */}
            <div className="glass-card divide-y divide-dark-700/50">
                {cart.length === 0 ? (
                    <div className="p-6 text-center text-dark-500">{LABELS.NO_ITEMS}</div>
                ) : (
                    <>
                        {cart.map((item) => (
                            <div key={item.id} className="px-4 py-3 flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-white font-medium">{item.name}</p>
                                    <p className="text-xs text-dark-500">× {item.quantity}</p>
                                </div>
                                <p className="text-brand-400 font-semibold">
                                    RM {(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        ))}
                        <div className="px-4 py-4 flex items-center justify-between bg-dark-900/50">
                            <p className="text-dark-300 font-semibold">{LABELS.TOTAL}</p>
                            <p className="text-xl font-display font-bold text-white">
                                RM {total.toFixed(2)}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
