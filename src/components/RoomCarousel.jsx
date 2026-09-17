import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Users, ChevronLeft, ChevronRight, X, Expand } from 'lucide-react'

export default function RoomCarousel({ name, category, capacity, photos, usage, quote }) {
    const [active, setActive] = useState(0)
    const [lightbox, setLightbox] = useState(false)
    const [lbIndex, setLbIndex] = useState(0)
    const last = photos.length - 1

    const prev = (e) => {
        e?.stopPropagation()
        setActive(a => (a === 0 ? last : a - 1))
    }
    const next = (e) => {
        e?.stopPropagation()
        setActive(a => (a === last ? 0 : a + 1))
    }

    const openLightbox = (i) => {
        setLbIndex(i)
        setLightbox(true)
    }
    const closeLightbox = () => setLightbox(false)
    const lbPrev = (e) => {
        e?.stopPropagation()
        setLbIndex(i => (i === 0 ? last : i - 1))
    }
    const lbNext = (e) => {
        e?.stopPropagation()
        setLbIndex(i => (i === last ? 0 : i + 1))
    }

    useEffect(() => {
        if (!lightbox) return
        document.body.style.overflow = 'hidden'
        const onKey = (e) => {
            if (e.key === 'Escape') setLightbox(false)
            if (e.key === 'ArrowLeft') setLbIndex(i => (i === 0 ? last : i - 1))
            if (e.key === 'ArrowRight') setLbIndex(i => (i === last ? 0 : i + 1))
        }
        window.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', onKey)
        }
    }, [lightbox, last])

    return (
        <>
            <div
                className="bg-brand-cream/40 rounded-2xl overflow-hidden shadow-xl shadow-brand-brown/10 border border-brand-brown/5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-brown/20"
                onClick={() => openLightbox(active)}
            >
                <div className="relative h-56 md:h-64 bg-brand-brown/5 group">
                    <img
                        src={photos[active]}
                        alt={`${name} - photo ${active + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />

                    {/* Hover hint — tells users the photo can be tapped */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <Expand className="w-3.5 h-3.5" />
                        View
                    </div>

                    {photos.length > 1 && (
                        <>
                            <button
                                onClick={prev}
                                aria-label="Previous photo"
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-brand-brown hover:bg-white active:scale-90 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={next}
                                aria-label="Next photo"
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-brand-brown hover:bg-white active:scale-90 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>

                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {photos.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => { e.stopPropagation(); setActive(i) }}
                                        aria-label={`Go to photo ${i + 1}`}
                                        className={`h-1.5 rounded-full transition-all ${i === active ? 'w-6 bg-white' : 'w-1.5 bg-white/60'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-4 text-white">
                        <h3 className="font-heading font-semibold text-xl md:text-2xl tracking-wide">{name}</h3>
                        <p className="text-[10px] uppercase tracking-widest text-white/80">{category}</p>
                    </div>
                </div>

                <div className="p-5 md:p-6 space-y-3">
                    <div className="flex items-center gap-2 text-brand-lightBrown">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">Up to {capacity} guests</span>
                    </div>
                    <p className="text-sm font-bold text-brand-brown">{usage}</p>
                    <p className="text-sm text-brand-lightBrown italic leading-relaxed">"{quote}"</p>
                </div>
            </div>

            {/* ── Lightbox popup (portalled to body to escape section stacking context) ── */}
            {lightbox && createPortal(
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        aria-label="Close photo viewer"
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {photos.length > 1 && (
                        <>
                            <button
                                onClick={lbPrev}
                                aria-label="Previous photo"
                                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={lbNext}
                                aria-label="Next photo"
                                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    <div
                        className="w-full max-w-4xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={photos[lbIndex]}
                            alt={`${name} - photo ${lbIndex + 1}`}
                            className="w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
                        />
                        <div className="flex items-center justify-between mt-4 text-white">
                            <div>
                                <h3 className="font-heading font-semibold text-xl md:text-2xl">{name}</h3>
                                <p className="text-xs uppercase tracking-widest text-white/70 mt-1">
                                    {category} · Up to {capacity} guests
                                </p>
                            </div>
                            {photos.length > 1 && (
                                <p className="text-sm font-semibold text-white/80 tabular-nums">
                                    {lbIndex + 1} / {photos.length}
                                </p>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}
