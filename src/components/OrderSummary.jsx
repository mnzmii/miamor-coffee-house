import { ShoppingBag, User, Users, Clock, MapPin } from 'lucide-react'
import { LABELS } from '../lib/constants'

export default function OrderSummary({ customerName, whatsappNumber, guestCount, date, time, cart, orderType, roomName, specialRequests }) {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-center gap-3 mb-2">
                <div className="h-px flex-1 bg-brand-brown/10" />
                <ShoppingBag className="w-5 h-5 text-brand-red" />
                <h3 className="text-xl font-brand font-bold text-brand-brown uppercase tracking-widest">{LABELS.ORDER_SUMMARY}</h3>
                <div className="h-px flex-1 bg-brand-brown/10" />
            </div>

            {/* Receipt Content */}
            <div className="bg-white border border-brand-brown/10 rounded-[2rem] shadow-xl overflow-hidden relative">

                <div className="p-8 pt-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <p className="font-brand font-bold text-2xl text-brand-brown">Miamor</p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-red">Coffee House</p>
                    </div>

                    {/* Meta Info */}
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-brand-lightBrown" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-lightBrown">Pelanggan</span>
                            </div>
                            <span className="text-brand-brown font-bold text-right">{customerName}</span>
                        </div>

                        {orderType === 'remote' && (
                            <>
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-3.5 h-3.5 text-brand-lightBrown" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-lightBrown">Tetamu</span>
                                    </div>
                                    <span className="text-brand-brown font-bold text-right">{guestCount} orang</span>
                                </div>
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-brand-lightBrown" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-lightBrown">Tarikh & Masa</span>
                                    </div>
                                    <span className="text-brand-brown font-bold text-right">
                                        {date && new Date(date).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })} • {time}
                                    </span>
                                </div>
                            </>
                        )}

                        {roomName && (
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-brand-lightBrown" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-lightBrown">Lokasi</span>
                                </div>
                                <span className="text-brand-brown font-bold text-right">{roomName}</span>
                            </div>
                        )}
                    </div>

                    {/* Divider with zig-zag feel */}
                    <div className="border-t-2 border-dashed border-brand-brown/10 my-8" />

                    {/* Order Items */}
                    <div className="space-y-4 mb-8">
                        {cart.length === 0 ? (
                            <p className="text-center text-brand-lightBrown italic text-sm">{LABELS.NO_ITEMS}</p>
                        ) : (
                            cart.map((item) => (
                                <div key={item.id} className="flex justify-between items-baseline gap-4">
                                    <div className="flex items-baseline gap-2 flex-1 min-w-0">
                                        <p className="text-brand-brown font-medium text-sm truncate">{item.name}</p>
                                        <p className="text-[10px] font-bold text-brand-lightBrown">x{item.quantity}</p>
                                    </div>
                                    <p className="text-brand-brown font-bold text-sm">
                                        RM {(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Total Section */}
                    <div className="bg-brand-brown/5 p-6 rounded-2xl border border-brand-brown/5">
                        <div className="flex justify-between items-center">
                            <p className="text-brand-brown font-bold uppercase tracking-widest text-xs">Jumlah Keseluruhan</p>
                            <p className="text-3xl font-brand font-bold text-brand-brown whitespace-nowrap">
                                RM {total.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Note section */}
                    {specialRequests && (
                        <div className="mt-8 pt-8 border-t border-brand-brown/10">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-lightBrown mb-2">Nota Tambahan</p>
                            <p className="text-sm text-brand-brown italic leading-relaxed bg-brand-brown/5 p-4 rounded-xl border border-brand-brown/5">
                                "{specialRequests}"
                            </p>
                        </div>
                    )}

                    {/* Footer text */}
                    <div className="mt-10 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-lightBrown/40">
                            Terima Kasih • Miamor Coffee House
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
