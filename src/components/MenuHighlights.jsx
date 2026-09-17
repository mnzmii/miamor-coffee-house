import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X, Flame, Snowflake } from 'lucide-react'
import { MENU_CATEGORIES } from '../lib/constants'

const ITEMS_PER_PAGE = 8

// ── Price tag: elegant serif Hot/Ice text for drinks, plain price for food ──
function PriceTag({ price, priceAlt, large = false }) {
    if (!priceAlt) {
        return <>RM {price}</>
    }
    const hotAvailable = price !== '—'
    const text = large ? 'text-base' : 'text-sm md:text-base'
    const icon = large ? 'w-4 h-4' : 'w-3.5 h-3.5'
    return (
        <span className={`inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 font-heading italic ${text}`}>
            {hotAvailable && (
                <span className="inline-flex items-center gap-1 text-brand-red">
                    <Flame className={icon} />
                    RM{price}
                </span>
            )}
            {hotAvailable && <span className="text-white/25 not-italic">·</span>}
            <span className="inline-flex items-center gap-1 text-sky-200/90">
                <Snowflake className={icon} />
                RM{priceAlt}
            </span>
        </span>
    )
}

export default function MenuHighlights() {
    const [active, setActive] = useState(0)
    const [page, setPage] = useState(0)
    const [animType, setAnimType] = useState('')
    const [isAnimating, setIsAnimating] = useState(false)
    const tabsRef = useRef([])
    const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 })
    const [lightbox, setLightbox] = useState(null)

    const category = MENU_CATEGORIES[active]
    const items = category.items
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)
    const paged = items.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

    useEffect(() => {
        const updatePill = () => {
            const el = tabsRef.current[active]
            if (el) {
                setPillStyle({ left: el.offsetLeft, width: el.offsetWidth })
            }
        }
        updatePill()
        window.addEventListener('resize', updatePill)
        return () => window.removeEventListener('resize', updatePill)
    }, [active])

    const openLightbox = (i) => setLightbox(i)
    const closeLightbox = () => setLightbox(null)
    const lbPrev = (e) => {
        e?.stopPropagation()
        setLightbox(i => (i === 0 ? paged.length - 1 : i - 1))
    }
    const lbNext = (e) => {
        e?.stopPropagation()
        setLightbox(i => (i === paged.length - 1 ? 0 : i + 1))
    }

    useEffect(() => {
        if (lightbox === null) return
        document.body.style.overflow = 'hidden'
        const onKey = (e) => {
            if (e.key === 'Escape') setLightbox(null)
            if (e.key === 'ArrowLeft') setLightbox(i => (i === 0 ? paged.length - 1 : i - 1))
            if (e.key === 'ArrowRight') setLightbox(i => (i === paged.length - 1 ? 0 : i + 1))
        }
        window.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', onKey)
        }
    }, [lightbox, paged.length])

    const animate = (type) => {
        setAnimType(type)
        setIsAnimating(true)
        setTimeout(() => {
            setAnimType('')
            setIsAnimating(false)
        }, 500)
    }

    const nextPage = () => {
        if (page < totalPages - 1 && !isAnimating) {
            setPage(p => p + 1)
            animate('slide-left')
        }
    }

    const goPrevPage = () => {
        if (page > 0 && !isAnimating) {
            setPage(p => p - 1)
            animate('slide-right')
        }
    }

    const switchCategory = (i) => {
        if (isAnimating || i === active) return
        setPage(0)
        setActive(i)
        animate('fade')
    }

    const goToPage = (i) => {
        if (isAnimating || i === page) return
        setPage(i)
        animate(i > page ? 'slide-left' : 'slide-right')
    }

    const getAnimStyle = () => {
        switch (animType) {
            case 'slide-left':
                return { animation: 'menuSlideLeft 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards' }
            case 'slide-right':
                return { animation: 'menuSlideRight 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards' }
            case 'fade':
                return { animation: 'menuFade 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards' }
            default:
                return { opacity: 1, transform: 'translateY(0) scale(1)' }
        }
    }

    return (
        <div className="w-full">
            {/* Category Tabs */}
            <div className="flex justify-center mb-10">
                <div className="relative inline-flex gap-1 p-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 overflow-x-auto no-scrollbar">
                    <span
                        className="absolute top-1.5 bottom-1.5 bg-white rounded-full transition-all duration-500 ease-out z-0"
                        style={{ left: `${pillStyle.left}px`, width: `${pillStyle.width}px` }}
                    />
                    {MENU_CATEGORIES.map((cat, i) => (
                        <button
                            key={cat.name}
                            ref={(el) => (tabsRef.current[i] = el)}
                            onClick={() => switchCategory(i)}
                            className={`relative px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors duration-300 z-10 ${
                                i === active ? 'text-brand-brown' : 'text-brand-beige/60 hover:text-brand-beige'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Carousel */}
            <div className="relative group">
                {totalPages > 1 && (
                    <button
                        onClick={goPrevPage}
                        disabled={page === 0}
                        className="absolute -left-2 md:left-0 top-0 bottom-0 z-20 w-10 md:w-14 flex items-center justify-center text-white/60 hover:text-white transition-all disabled:opacity-0 disabled:pointer-events-none"
                    >
                        <ChevronLeft className="w-7 h-7 md:w-9 md:h-9" />
                    </button>
                )}
                {totalPages > 1 && (
                    <button
                        onClick={nextPage}
                        disabled={page === totalPages - 1}
                        className="absolute -right-2 md:right-0 top-0 bottom-0 z-20 w-10 md:w-14 flex items-center justify-center text-white/60 hover:text-white transition-all disabled:opacity-0 disabled:pointer-events-none"
                    >
                        <ChevronRight className="w-7 h-7 md:w-9 md:h-9" />
                    </button>
                )}

                <div className="overflow-hidden px-2 md:px-16 py-1">
                    <div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 will-change-transform"
                        style={getAnimStyle()}
                    >
                        {paged.map((item, i) => (
                            <div
                                key={item.name}
                                className="group/card text-left cursor-pointer"
                                onClick={() => openLightbox(i)}
                            >
                                <div
                                    className={`aspect-[4/3] relative overflow-hidden rounded-2xl bg-white/5 ${
                                        item.highlight ? 'ring-2 ring-brand-red/40' : ''
                                    }`}
                                >
                                    <img
                                        src={item.img}
                                        alt={item.name}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none'
                                            e.target.nextSibling.style.display = 'flex'
                                        }}
                                    />
                                    <div
                                        className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/3 flex items-center justify-center"
                                        style={{ display: 'none' }}
                                    >
                                        <span className="text-5xl opacity-20">
                                            {category.name === 'Beverages' ? '☕' : '🍽️'}
                                        </span>
                                    </div>
                                    {item.highlight && (
                                        <span className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-brand-red text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                                            Best Seller
                                        </span>
                                    )}
                                </div>
                                <div className="pt-3 md:pt-4">
                                    <p className="text-brand-beige font-heading font-semibold text-base md:text-lg leading-snug line-clamp-2 min-h-[3rem]">
                                        {item.name}
                                    </p>
                                    <p className="text-orange-200/90 font-heading font-bold text-base md:text-lg mt-1">
                                        <PriceTag price={item.price} priceAlt={item.priceAlt} />
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Dots */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => goToPage(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                i === page ? 'bg-brand-red w-8' : 'bg-white/20 w-2 hover:bg-white/40'
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* ── Lightbox popup (portalled to body to escape section stacking context) ── */}
            {lightbox !== null && paged[lightbox] && createPortal(
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

                    <button
                        onClick={lbPrev}
                        aria-label="Previous dish"
                        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={lbNext}
                        aria-label="Next dish"
                        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    <div
                        className="w-full max-w-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={paged[lightbox].img}
                            alt={paged[lightbox].name}
                            className="w-full max-h-[55vh] object-contain rounded-xl shadow-2xl"
                        />
                        <div className="flex items-center justify-between mt-4 text-white">
                            <div>
                                <h3 className="font-heading font-semibold text-xl md:text-2xl text-brand-beige">
                                    {paged[lightbox].name}
                                </h3>
                                <p className="font-heading font-bold text-lg text-orange-200/90 mt-1">
                                    <PriceTag price={paged[lightbox].price} priceAlt={paged[lightbox].priceAlt} large />
                                </p>
                            </div>
                            <p className="text-sm font-semibold text-white/80 tabular-nums">
                                {lightbox + 1} / {paged.length}
                            </p>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
