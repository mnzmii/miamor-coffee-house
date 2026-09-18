import { ArrowRight, Clock, Armchair, MapPin, Star, BookOpen } from 'lucide-react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import Footer from '../components/Footer'
import RoomCarousel from '../components/RoomCarousel'
import BookingSection from '../components/BookingSection'
import TikTokDecoSection from '../components/TikTokDecoSection'
import MenuHighlights from '../components/MenuHighlights'
import { MENU_PDF_URL } from '../lib/constants'

// ── Room data: each room has 1+ photos for the carousel ──
const ROOMS = [
    {
        name: 'Duo', category: 'Private', capacity: 4,
        usage: 'Perfect for Meetings & Catch-ups',
        quote: 'A quiet little nook for focused discussions or intimate catch-ups.',
        photos: ['/rooms/duo.jpg'],
    },
    {
        name: 'Amorcito', category: 'Private', capacity: 6,
        usage: 'Perfect for Small Gatherings',
        quote: 'A warm, cozy space for small family gatherings or close friends.',
        photos: ['/rooms/amorcito.jpg'],
    },
    {
        name: 'Amici Quattuor', category: 'Private', capacity: 8,
        usage: 'Perfect for Friend Reunions',
        quote: 'A friendly space to share special moments with your closest four — or more.',
        photos: ['/rooms/amiciquattuor.jpg'],
    },
    {
        name: 'La Amistad', category: 'Private', capacity: 8,
        usage: 'Perfect for Events & Celebrations',
        quote: 'A spacious, versatile room for celebrating friendships or special occasions.',
        photos: ['/rooms/laamistad.jpg'],
    },
    {
        name: 'La Rossa', category: 'Open', capacity: 8,
        usage: 'Perfect for Open, Lively Sessions',
        quote: 'Soak up the buzz of the café in a more curated setting.',
        photos: ['/rooms/larossa.jpg'],
    },
    {
        name: 'El Corazon', category: 'Private', capacity: 15,
        usage: 'Perfect for Corporate & Banquets',
        quote: 'Our largest room with full amenities for meetings or grand gatherings.',
        photos: ['/rooms/elcorazon.jpg'],
    },
]

const TESTIMONIALS = [
    { name: 'Nana Tajuddin', text: 'Such a peaceful and comfortable experience in the private room — brought back lovely memories. Every dish was absolutely delicious!', rating: 5 },
    { name: 'Min Yasmin', text: 'Top-quality coffee! Their Iced Caffe Latte tastes so clean with the perfect milk ratio.', rating: 5 },
    { name: 'Ainaa Fahira', text: 'Amazing food paired with the best service. A truly satisfying experience at Miamor!', rating: 5 },
    { name: 'Leena 33', text: 'Excellent, flavorful food. Service is quick and consistently pleasing.', rating: 5 },
]

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-brand-cream">
            <Header />

{/* ── HERO ── */}
            <HeroSection />

            {/* ── ABOUT / STORY ── */}
            <section className="py-14 md:py-28 bg-brand-cream relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-5 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
                    <div className="relative">
                        <img
                            src="/miamor.png"
                            alt="Miamor Coffee"
                            className="rounded-2xl shadow-2xl shadow-brand-brown/20 w-full h-80 md:h-[450px] object-cover"
                        />
                    </div>
                    <div className="space-y-4 md:space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-[2px] w-8 md:w-12 bg-brand-red rounded-full"></div>
                            <span className="text-brand-red font-bold text-sm md:text-base uppercase tracking-[0.2em]">Why Miamor Coffee House?</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-heading font-semibold text-brand-brown leading-tight">
                            <span className="block">Your Own Room,</span>
                            <span className="block text-right">Your Own People</span>
                        </h2>
                        <p className="text-brand-lightBrown text-base md:text-lg leading-relaxed text-justify">
                            No queuing for tables, no talking over the next crowd. At Miamor, you book one of our 6 rooms and spaces, from a quiet room for 4 up to a hall for 15, and the space is yours for as long as you stay.
                        </p>
                        <p className="text-brand-lightBrown leading-relaxed text-sm md:text-base text-justify">
                            Whether it is a family gathering, a birthday, a meeting, or a small event, enjoy a diverse menu ranging from local delights and Western classics, to decadent desserts and premium coffee, served straight to your room.
                        </p>
                        <div className="flex items-center justify-center gap-6 md:gap-8 pt-2 md:pt-4 mt-2 md:mt-4">
                            <Stat value={ROOMS.length} label="Rooms & Spaces" />
                            <Divider />
                            <div className="text-center">
                                <p className="text-3xl md:text-4xl font-heading font-semibold text-brand-brown">4 – 15</p>
                                <p className="text-[10px] text-brand-brown/70 uppercase tracking-widest font-bold">Pax per room</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── ROOMS (carousel) ── */}
            <section id="rooms" className="py-14 md:py-28 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10 md:mb-16 px-5">
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[2px] w-8 bg-brand-red rounded-full"></div>
                            <span className="text-brand-red font-bold text-xs uppercase tracking-[0.2em]">Our Spaces</span>
                            <div className="h-[2px] w-8 bg-brand-red rounded-full"></div>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-heading font-semibold text-brand-brown mt-2 md:mt-3">Our Spaces</h2>
                        <p className="text-brand-lightBrown mt-3 md:mt-4 max-w-lg mx-auto text-sm md:text-base">
                            Pick a space that fits your plan, from private rooms to our open area.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 px-5 md:px-6">
                        {ROOMS.map(room => (
                            <RoomCarousel key={room.name} {...room} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── MENU CTA ── */}
            <section id="menu" className="py-14 md:py-20 bg-brand-brown relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2D1B18] to-brand-brown" />
                <div className="relative z-10 max-w-6xl mx-auto px-5">
                    <div className="text-center mb-10 md:mb-14">
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[2px] w-8 bg-brand-red rounded-full"></div>
                            <span className="text-brand-red font-bold text-xs uppercase tracking-[0.2em]">Our Menu</span>
                            <div className="h-[2px] w-8 bg-brand-red rounded-full"></div>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-heading font-semibold text-white mt-3 md:mt-4">Explore the Menu</h2>
                        <p className="text-brand-beige/70 mt-3 md:mt-4 text-sm md:text-base max-w-xl mx-auto">
                            From hearty mains to delicate desserts, discover a carefully curated selection of over 60 dishes made to satisfy every craving.
                        </p>
                    </div>

                    <MenuHighlights />

                    <div className="text-center mt-10">
                        <a
                            href={MENU_PDF_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-cream text-brand-brown font-sans font-bold tracking-wide rounded-full hover:bg-white transition-all shadow-lg hover:shadow-xl active:scale-95 text-base"
                        >
                            <BookOpen className="w-5 h-5" />
                            Open Full Menu
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="py-14 md:py-28 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-10 md:mb-16 px-5">
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[2px] w-8 bg-brand-red rounded-full"></div>
                            <span className="text-brand-red font-bold text-xs uppercase tracking-[0.2em]">Reviews</span>
                            <div className="h-[2px] w-8 bg-brand-red rounded-full"></div>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-heading font-semibold text-brand-brown mt-2 md:mt-3">What Guests Say</h2>
                        <p className="text-brand-lightBrown mt-3 text-sm md:text-base max-w-lg mx-auto">
                            Hear from those who've enjoyed the Miamor experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-5 md:px-6">
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} className="bg-brand-cream rounded-2xl p-6 md:p-8 shadow-lg shadow-brand-brown/10 border border-brand-brown/10 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex gap-0.5">
                                            {[...Array(t.rating)].map((_, j) => (
                                                <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-tighter opacity-40">Google</span>
                                    </div>
                                    <p className="text-brand-lightBrown leading-relaxed mb-4 italic text-sm">"{t.text}"</p>
                                </div>
                                <p className="font-bold text-brand-brown text-sm">— {t.name}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8 md:mt-12 px-5">
                        <a
                            href="https://www.google.com/maps/search/?api=1&query=Miamor+Coffee+Muar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-brand-brown text-white font-sans font-bold tracking-wide rounded-full hover:bg-brand-lightBrown transition-all shadow-lg active:scale-95 text-sm md:text-base"
                        >
                            See on Google Reviews
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </section>

            {/* ── DECO / TIKTOK ── */}
            <section id="deco" className="py-14 md:py-28 bg-brand-cream scroll-mt-20">
                <TikTokDecoSection />
            </section>

            {/* ── BOOKING CTA ── */}
            <section id="booking" className="py-14 md:py-28 bg-white scroll-mt-20">
                <div className="max-w-6xl mx-auto px-5 md:px-6">
                    <BookingSection />
                </div>
            </section>

            {/* ── INFO & LOCATION ── */}
            <section id="find-us" className="py-14 md:py-20 bg-brand-cream">
                <div className="max-w-6xl mx-auto px-5 md:px-6">
                    <div className="text-center mb-10 md:mb-14">
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[2px] w-8 bg-brand-red rounded-full"></div>
                            <span className="text-brand-red font-bold text-xs uppercase tracking-[0.2em]">About Us</span>
                            <div className="h-[2px] w-8 bg-brand-red rounded-full"></div>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-heading font-semibold text-brand-brown mt-2 md:mt-3">Find Us</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                        <div className="space-y-4">
                            <InfoCard icon={Clock} title="Opening Hours">
                                <div className="flex justify-between text-sm">
                                    <span className="text-brand-lightBrown">Monday — Saturday</span>
                                    <span className="text-brand-brown font-bold">10:30 AM — 6:30 PM</span>
                                </div>
                                <div className="flex justify-between text-sm opacity-50">
                                    <span className="text-brand-lightBrown">Sunday</span>
                                    <span className="text-brand-lightBrown italic">Closed</span>
                                </div>
                            </InfoCard>

                            <InfoCard icon={Armchair} title="Private Rooms">
                                <p className="text-brand-lightBrown text-sm">{ROOMS.length} exclusive spaces for a more private and comfortable experience.</p>
                                <a href="#rooms" className="inline-flex items-center gap-1 text-brand-red text-sm font-bold mt-2 hover:gap-2 transition-all">
                                    View Rooms <ArrowRight className="w-3.5 h-3.5" />
                                </a>
                            </InfoCard>

                            <InfoCard icon={MapPin} title="Address">
                                <p className="text-brand-lightBrown text-sm leading-relaxed">
                                    1st Floor, 60-7, Jalan Sulaiman,<br />
                                    Taman Sri Maharani, 84000 Muar, Johor
                                </p>
                            </InfoCard>
                        </div>

                        <div className="rounded-2xl overflow-hidden shadow-xl border border-brand-brown/5 h-[300px] md:min-h-[400px]">
                            <iframe
                                src="https://maps.google.com/maps?q=Miamor%20Coffee%20House%2C%20Jalan%20Sulaiman%2C%20Muar%2C%20Johor&hl=en&z=16&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: '300px' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Miamor Coffee House location"
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

function InfoCard({ icon: Icon, title, children }) {
    return (
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-brand-brown/10 shadow-lg shadow-brand-brown/5">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-brand-red" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-brand-brown">{title}</h3>
            </div>
            <div className="ml-[52px] space-y-1.5">{children}</div>
        </div>
    )
}

function Stat({ value, label }) {
    return (
        <div className="text-center">
            <p className="text-3xl md:text-4xl font-heading font-semibold text-brand-brown">{value}</p>
            <p className="text-[10px] text-brand-brown/70 uppercase tracking-widest font-bold">{label}</p>
        </div>
    )
}

function Divider() {
    return <div className="w-px h-10 md:h-12 bg-brand-brown/10" />
}