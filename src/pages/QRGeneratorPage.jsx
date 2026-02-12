import { useState, useEffect } from 'react'
import { QrCode, Printer, Download, Coffee, Armchair, RefreshCw } from 'lucide-react'
import QRCode from 'qrcode'
import Sidebar from '../components/Sidebar'
import { supabase } from '../lib/supabase'

export default function QRGeneratorPage() {
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)
    const [qrCodes, setQrCodes] = useState({})
    const [baseUrl, setBaseUrl] = useState(window.location.origin)

    useEffect(() => {
        fetchRooms()
    }, [])

    useEffect(() => {
        if (rooms.length > 0) {
            generateAllQR()
        }
    }, [rooms, baseUrl])

    const fetchRooms = async () => {
        try {
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .order('name')
            if (error) throw error
            setRooms(data || [])
        } catch {
            setRooms(getSampleRooms())
        } finally {
            setLoading(false)
        }
    }

    const generateAllQR = async () => {
        const codes = {}
        for (const room of rooms) {
            const slug = room.name.toLowerCase().replace(/\s+/g, '-')
            const url = `${baseUrl}/book?roomId=${slug}`
            try {
                codes[room.id] = await QRCode.toDataURL(url, {
                    width: 280,
                    margin: 2,
                    color: { dark: '#2D1B18', light: '#FFFFFF' },
                    errorCorrectionLevel: 'H',
                })
            } catch (err) {
                console.error('QR Error:', err)
            }
        }
        setQrCodes(codes)
    }

    const printSingle = (roomId) => {
        const room = rooms.find(r => r.id === roomId)
        if (!room || !qrCodes[roomId]) return
        const slug = room.name.toLowerCase().replace(/\s+/g, '-')
        const url = `${baseUrl}/book?roomId=${slug}`
        const win = window.open('', '_blank')
        win.document.write(`
            <html>
            <head><title>QR - ${room.name}</title>
            <style>
                body { font-family: 'Georgia', serif; text-align: center; padding: 40px; }
                .card { border: 3px solid #2D1B18; border-radius: 20px; padding: 40px; max-width: 360px; margin: 0 auto; }
                .brand { font-size: 14px; letter-spacing: 3px; color: #8B7355; text-transform: uppercase; margin-bottom: 8px; }
                .room-name { font-size: 28px; font-weight: bold; color: #2D1B18; margin: 12px 0; }
                .instruction { font-size: 13px; color: #8B7355; margin-top: 16px; }
                img { margin: 16px 0; }
                .url { font-size: 10px; color: #aaa; word-break: break-all; margin-top: 8px; }
            </style></head>
            <body>
                <div class="card">
                    <p class="brand">☕ Miamor Coffee House</p>
                    <p class="room-name">${room.name}</p>
                    <img src="${qrCodes[roomId]}" width="220" />
                    <p class="instruction">Imbas untuk memesan</p>
                    <p class="url">${url}</p>
                </div>
                <script>window.onload = () => { window.print(); }</script>
            </body></html>
        `)
    }

    const printAll = () => {
        const cardsHtml = rooms.map(room => {
            const slug = room.name.toLowerCase().replace(/\s+/g, '-')
            const url = `${baseUrl}/book?roomId=${slug}`
            return `
                <div class="card">
                    <p class="brand">☕ Miamor Coffee House</p>
                    <p class="room-name">${room.name}</p>
                    <img src="${qrCodes[room.id] || ''}" width="180" />
                    <p class="instruction">Imbas untuk memesan</p>
                    <p class="url">${url}</p>
                </div>
            `
        }).join('')

        const win = window.open('', '_blank')
        win.document.write(`
            <html>
            <head><title>QR Codes - Miamor</title>
            <style>
                body { font-family: 'Georgia', serif; padding: 20px; }
                .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
                .card { border: 2px solid #2D1B18; border-radius: 16px; padding: 24px; text-align: center; page-break-inside: avoid; }
                .brand { font-size: 11px; letter-spacing: 3px; color: #8B7355; text-transform: uppercase; }
                .room-name { font-size: 20px; font-weight: bold; color: #2D1B18; margin: 8px 0; }
                .instruction { font-size: 11px; color: #8B7355; margin-top: 12px; }
                img { margin: 8px 0; }
                .url { font-size: 9px; color: #aaa; word-break: break-all; margin-top: 4px; }
                @media print { .grid { grid-template-columns: repeat(2, 1fr); } }
            </style></head>
            <body>
                <div class="grid">${cardsHtml}</div>
                <script>window.onload = () => { window.print(); }</script>
            </body></html>
        `)
    }

    return (
        <div className="min-h-screen flex">
            {/* Sidebar Navigation */}
            <Sidebar />
            <div className="hidden md:block w-64 flex-shrink-0" />

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-brand-brown z-30 flex items-center px-4 shadow-lg shadow-brand-brown/10">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-brand-beige/10 rounded-full">
                        <Coffee className="w-5 h-5 text-brand-red" />
                    </div>
                    <div>
                        <h1 className="font-brand font-bold text-lg tracking-wide text-white">MIAMOR</h1>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-brand-beige/60">Portal Kakitangan</p>
                    </div>
                </div>
            </div>

            <main className="flex-1 px-4 md:px-8 py-20 md:py-8 overflow-y-auto h-screen">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-brand-red/10 rounded-xl">
                            <QrCode className="w-8 h-8 text-brand-red" />
                        </div>
                        <div>
                            <h1 className="font-brand font-bold text-3xl text-brand-brown">QR Code</h1>
                            <p className="text-brand-lightBrown text-sm mt-1">
                                Jana kod QR untuk setiap bilik. Cetak dan letak di meja.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => generateAllQR()}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-brand-brown/10 text-brand-brown font-bold text-sm hover:bg-brand-brown/5 transition-colors shadow-sm"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                        <button
                            onClick={printAll}
                            disabled={Object.keys(qrCodes).length === 0}
                            className="btn-primary flex items-center gap-2 shadow-lg shadow-brand-red/20"
                        >
                            <Printer className="w-5 h-5" />
                            Cetak Semua
                        </button>
                    </div>
                </div>

                {/* Base URL config */}
                <div className="bg-white border border-brand-brown/10 rounded-xl p-4 mb-8 shadow-sm">
                    <label className="block text-xs font-bold tracking-wider text-brand-lightBrown uppercase mb-2">
                        URL Asas Laman Web
                    </label>
                    <input
                        type="text"
                        value={baseUrl}
                        onChange={(e) => setBaseUrl(e.target.value)}
                        className="w-full bg-brand-brown/5 border border-brand-brown/10 rounded-lg px-4 py-2.5 text-sm text-brand-brown focus:outline-none focus:border-brand-brown/30 transition-colors"
                        placeholder="https://miamor.com"
                    />
                    <p className="text-xs text-brand-lightBrown mt-2">
                        Tukar URL ini jika laman web anda di domain lain.
                    </p>
                </div>

                {/* QR Cards Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-brand-brown border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : rooms.length === 0 ? (
                    <div className="text-center py-20">
                        <Armchair className="w-16 h-16 text-brand-brown/20 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-brand-brown">Tiada bilik</h3>
                        <p className="text-brand-lightBrown mt-2">Sila tambah bilik dahulu di Tetapan Bilik.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {rooms.map(room => {
                            const slug = room.name.toLowerCase().replace(/\s+/g, '-')
                            const url = `${baseUrl}/book?roomId=${slug}`
                            return (
                                <div
                                    key={room.id}
                                    className="bg-white border border-brand-brown/10 rounded-2xl overflow-hidden shadow-lg shadow-brand-brown/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                                >
                                    {/* Card header */}
                                    <div className="bg-brand-brown p-4 text-center">
                                        <p className="text-brand-beige/60 text-[10px] uppercase tracking-[0.2em] font-bold">Miamor Coffee House</p>
                                        <h3 className="font-brand font-bold text-xl text-white mt-1">{room.name}</h3>
                                        <p className="text-brand-beige/50 text-xs mt-1">
                                            {room.category} • {room.capacity} Orang
                                        </p>
                                    </div>

                                    {/* QR Code */}
                                    <div className="p-6 flex flex-col items-center">
                                        {qrCodes[room.id] ? (
                                            <img
                                                src={qrCodes[room.id]}
                                                alt={`QR - ${room.name}`}
                                                className="w-48 h-48 rounded-xl border-2 border-brand-brown/10"
                                            />
                                        ) : (
                                            <div className="w-48 h-48 bg-brand-brown/5 rounded-xl flex items-center justify-center">
                                                <div className="w-8 h-8 border-4 border-brand-brown border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        )}

                                        <p className="text-[10px] text-brand-lightBrown mt-3 text-center break-all max-w-[220px]">
                                            {url}
                                        </p>

                                        <p className="text-sm text-brand-brown font-bold mt-3">
                                            Imbas untuk memesan
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="px-4 pb-4 flex gap-2">
                                        <button
                                            onClick={() => printSingle(room.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-brown text-white font-bold text-sm hover:bg-brand-lightBrown transition-colors"
                                        >
                                            <Printer className="w-4 h-4" />
                                            Cetak
                                        </button>
                                        <button
                                            onClick={() => {
                                                const link = document.createElement('a')
                                                link.href = qrCodes[room.id]
                                                link.download = `qr-${slug}.png`
                                                link.click()
                                            }}
                                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-brown/5 border border-brand-brown/10 text-brand-brown font-bold text-sm hover:bg-brand-brown/10 transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}

function getSampleRooms() {
    return [
        { id: '1', name: 'Bilik Raya', category: 'Private', capacity: 12 },
        { id: '2', name: 'Bilik Mesyuarat', category: 'Private', capacity: 8 },
        { id: '3', name: 'Bilik VIP', category: 'Private', capacity: 6 },
        { id: '4', name: 'Ruang Terbuka A', category: 'Open', capacity: 20 },
        { id: '5', name: 'Ruang Terbuka B', category: 'Open', capacity: 15 },
    ]
}
