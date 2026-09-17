import { Play, Sparkles, ArrowRight } from 'lucide-react'
import { TIKTOK_PROFILE_URL, TIKTOK_DECO_VIDEOS } from '../lib/constants'

// Placeholder slots shown until real TikTok URLs are added in constants.js
const PLACEHOLDERS = [
    { title: 'Birthday deco setup' },
    { title: 'Small event styling' },
    { title: 'Behind the scenes' },
]

export default function TikTokDecoSection() {
    const videos = TIKTOK_DECO_VIDEOS.length > 0 ? TIKTOK_DECO_VIDEOS : null
    const count = videos ? videos.length : PLACEHOLDERS.length
    const gridClass = count === 2
        ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto'
        : 'grid-cols-1 sm:grid-cols-3'

    return (
        <div className="max-w-6xl mx-auto px-5 md:px-6">
            <div className="text-center mb-10 md:mb-14">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-[2px] w-8 bg-brand-red rounded-full" />
                    <span className="text-brand-red font-bold text-xs uppercase tracking-[0.2em]">
                        Room Decoration
                    </span>
                    <div className="h-[2px] w-8 bg-brand-red rounded-full" />
                </div>
                <h2 className="text-3xl md:text-5xl font-heading font-semibold text-brand-brown mt-2 md:mt-3">
                    Deco Ideas for Your Event
                </h2>
                <p className="text-brand-lightBrown mt-3 md:mt-4 max-w-xl mx-auto text-sm md:text-base">
                    Birthday, meeting or small celebration? Watch how we style our rooms —
                    then tell us your theme on WhatsApp.
                </p>
            </div>

            <div className={`grid gap-4 md:gap-6 ${gridClass}`}>
                {videos
                    ? videos.map((v) => v.id
                        ? <TikTokEmbed key={v.id} id={v.id} title={v.title} />
                        : <VideoCard key={v.url} url={v.url} title={v.title} />)
                    : PLACEHOLDERS.map((p) => <PlaceholderCard key={p.title} title={p.title} />)}
            </div>

            <div className="text-center mt-8 md:mt-12">
                <a
                    href={TIKTOK_PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-sans font-bold tracking-wide rounded-full hover:bg-neutral-800 transition-all shadow-lg active:scale-95 text-sm md:text-base"
                >
                    <Play className="w-5 h-5 fill-white" />
                    View more on TikTok
                    <ArrowRight className="w-5 h-5" />
                </a>
            </div>
        </div>
    )
}

function TikTokEmbed({ id, title }) {
    return (
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] max-h-[520px] w-full shadow-xl shadow-brand-brown/20 ring-1 ring-brand-brown/10">
            <iframe
                src={`https://www.tiktok.com/player/v1/${id}`}
                title={title}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                scrolling="no"
                loading="lazy"
            />
        </div>
    )
}

function VideoCard({ url, title }) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-2xl overflow-hidden bg-brand-brown aspect-[9/16] max-h-[420px] w-full shadow-lg shadow-brand-brown/20 hover:shadow-xl hover:-translate-y-1 transition-all"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#2D1B18] to-brand-brown" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                <span className="w-16 h-16 rounded-full bg-white/15 backdrop-blur border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                </span>
                <p className="text-white font-bold text-sm md:text-base">{title}</p>
                <p className="text-brand-beige/60 text-xs font-medium">Tap to watch on TikTok</p>
            </div>
        </a>
    )
}

function PlaceholderCard({ title }) {
    return (
        <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-brand-brown/20 bg-white/60 aspect-[9/16] max-h-[420px] w-full flex flex-col items-center justify-center gap-3 p-6 text-center">
            <span className="w-16 h-16 rounded-full bg-brand-red/10 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-brand-red/50" />
            </span>
            <p className="text-brand-brown font-bold text-sm md:text-base">{title}</p>
            <p className="text-brand-lightBrown/70 text-xs leading-relaxed">
                Video coming soon —<br />paste your TikTok link in <code className="font-mono">constants.js</code>
            </p>
        </div>
    )
}
