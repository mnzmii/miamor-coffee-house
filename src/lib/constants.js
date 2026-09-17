// ── Highlighted menu items (edit these to update the website menu section) ──
// img: set image path like '/menu/nasi-putih.webp' (put images in public/menu/)
// sub: subcategory label shown above the item group
export const MENU_CATEGORIES = [
    {
        name: 'Rice',
        items: [
            { name: 'Nasi Putih Ikan Bawal Sweet Sour', price: '16.90', img: '/menu/nasi-putih-bawal.webp' },
            { name: 'Nasi Udang Salted Egg Kangkung Belacan', price: '15.90', img: '/menu/nasi-udang-salted.webp' },
            { name: 'Nasi Putih Buttermilk Amore', price: '14.90', img: '/menu/nasi-buttermilk.webp' },
            { name: 'Nasi Goreng Kampung Telur Mata', price: '10.90', img: '/menu/nasi-goreng-kampung.webp' },
            { name: 'Nasi Goreng Kampung Chicken Chop', price: '16.90', img: '/menu/nasi-goreng-kampung-chicken.webp' },
            { name: 'Nasi Goreng Tomyam Telur Mata', price: '12.90', img: '/menu/nasi-goreng-tomyam.webp' },
            { name: 'Nasi Goreng Tomyam Chicken Chop', price: '17.90', img: '/menu/nasi-goreng-tomyam-chicken.webp' },
            { name: 'Nasi Goreng Cina Telur Mata', price: '10.90', img: '/menu/nasi-goreng-cina.webp' },
            { name: 'Nasi Goreng Cina Chicken Chop', price: '16.90', img: '/menu/nasi-goreng-cina-chicken.webp' },
            { name: 'Nasi Goreng Kampung Sotong Crispy', price: '16.90', img: '/menu/nasi-goreng-sotong.webp' },
        ],
    },
    {
        name: 'Pasta',
        items: [
            { name: 'Spaghetti Bolognese', price: '15.90', img: '/menu/spaghetti-bolognese.webp' },
            { name: 'Spaghetti Buttermilk Chicken Crispy', price: '15.90', img: '/menu/spaghetti-buttermilk.webp' },
            { name: 'Spaghetti Creamy Tomyam', price: '15.90', img: '/menu/spaghetti-tomyam.webp' },
            { name: 'Spaghetti Aglio Olio', price: '14.90', img: '/menu/spaghetti-aglio.webp' },
            { name: 'Spaghetti Aglio Olio Chicken Chop', price: '17.90', img: '/menu/spaghetti-aglio-chicken.webp' },
            { name: 'Spaghetti Carbonara', price: '14.90', img: '/menu/spaghetti-carbonara.webp' },
            { name: 'Spaghetti Carbonara Chicken Crispy', price: '15.90', img: '/menu/spaghetti-carbonara-chicken.webp' },
            { name: 'Fiery Cheese Chilli Pasta', price: '15.90', img: '/menu/spaghetti-fiery.webp', highlight: true },
        ],
    },
    {
        name: 'Western',
        items: [
            { name: 'Chicken Chop', price: '14.90', img: '/menu/chicken-chop.webp', highlight: true },
            { name: 'Fish & Chips', price: '16.90', img: '/menu/fish-chips.webp' },
        ],
    },
    {
        name: 'Ramen & Sides',
        items: [
            { name: 'Ramen Korean Chicken (2pcs)', price: '14.90', img: '/menu/ramen-korean.webp' },
            { name: 'Ramen Telur Mata', price: '10.90', img: '/menu/ramen-telur.webp' },
            { name: 'Snack Plate', price: '10.90', img: '/menu/snack-plate.webp' },
            { name: 'Mantao Buttermilk', price: '10.90', img: '/menu/mantao.webp' },
            { name: 'Spicy Korean Chicken', price: '12.90', img: '/menu/spicy-korean.webp' },
            { name: 'Garlic Korean Chicken', price: '12.90', img: '/menu/garlic-korean.webp' },
        ],
    },
    {
        name: 'Desserts',
        items: [
            { name: 'Tiramisu Queen Amore', price: '15.90', img: '/menu/tiramisu-queen-amore.webp', highlight: true },
            { name: 'Waffle Magnum', price: '12.90', img: '/menu/waffle-magnum.webp' },
            { name: 'Fruit in Bowl (Small)', price: '12.90', img: '/menu/fruit-in-bowl-small.webp' },
            { name: 'Fruit in Bowl (Large)', price: '19.50', img: '/menu/fruit-in-bowl-large.webp' },
            { name: 'Croissant Kunafa Pistachio', price: '15.90', img: '/menu/croissant-kunafa-pistachio.webp' },
            { name: 'Croissant Magnum', price: '15.90', img: '/menu/croissant-magnum.webp' },
        ],
    },
    {
        name: 'Beverages',
        items: [
            // Coffee — Regular
            { name: 'Americano', price: '7.50', priceAlt: '8.50', img: '/menu/iced-americano.webp', sub: 'Coffee — Regular' },
            { name: 'Cappuccino', price: '11.50', priceAlt: '12.90', img: '/menu/cappucino.webp' },
            { name: 'Latte', price: '9.00', priceAlt: '10.90', img: '/menu/iced-latte.webp' },
            { name: 'Vanilla Latte', price: '9.90', priceAlt: '10.90', img: '/menu/vanilla-latte.webp' },
            { name: 'Caramel Latte', price: '9.90', priceAlt: '10.90', img: '/menu/caramel-latte.webp' },
            { name: 'Hazelnut Latte', price: '9.90', priceAlt: '10.90', img: '/menu/hazelnut-latte.webp' },
            { name: 'Butterscotch', price: '10.50', priceAlt: '11.50', img: '/menu/butterscotch-latte.webp' },
            { name: 'Mocha', price: '10.50', priceAlt: '11.50', img: '/menu/iced-mocha.webp' },
            { name: 'Spanish Latte', price: '12.00', priceAlt: '13.00', img: '/menu/spanish-latte.webp' },
            // Coffee — Special
            { name: 'Cheesecake', price: '—', priceAlt: '14.90', img: '/menu/iced-cheesecake-latte.webp', sub: 'Coffee — Special' },
            { name: 'Caramel Macchiato', price: '14.00', priceAlt: '15.90', img: '/menu/iced-caramel-macchiato.webp' },
            { name: 'Tiramisu Latte', price: '14.90', img: '/menu/tiramisu-latte.webp', highlight: true },
            { name: 'Buttercream Latte', price: '13.90', img: '/menu/buttercream-latte.webp', highlight: true },
            // Chocolate
            { name: 'Chocolate', price: '8.90', priceAlt: '9.90', img: '/menu/iced-chocolate.webp', sub: 'Chocolate' },
            { name: 'Chocolate Caramel', price: '9.90', priceAlt: '10.90', img: '/menu/iced-chocolate-caramel.webp' },
            { name: 'Chocolate Hazelnut', price: '9.90', priceAlt: '10.90', img: '/menu/iced-chocolate-hazelnut.webp' },
            { name: 'Chocolate Butterscotch', price: '9.90', priceAlt: '10.90', img: '/menu/iced-chocolate-butterscotch.webp' },
            { name: 'Chocolate Buttercream', price: '—', priceAlt: '13.90', img: '/menu/iced-chocolate-buttercream.webp' },
            // Matcha
            { name: 'Matcha Latte', price: '12.90', img: '/menu/matcha-latte.webp', sub: 'Matcha' },
            { name: 'Matcha Chocolate', price: '13.90', img: '/menu/matcha-chocolate.webp' },
            { name: 'Matcha Strawberry', price: '13.90', img: '/menu/matcha-strawberry.webp' },
            { name: 'Matcha Buttercream', price: '14.90', img: '/menu/matcha-buttercream.webp' },
            { name: 'Matcha Yam', price: '14.90', img: '/menu/matcha-yam.webp' },
            // Frappe
            { name: 'Chocolate Frappe', price: '13.90', img: '/menu/chocolate-frappe.webp', sub: 'Frappe' },
            { name: 'Matcha Frappe', price: '13.90', img: '/menu/matcha-frappe.webp' },
            { name: 'Strawberry Frappe', price: '13.90', img: '/menu/strawberry-frappe.webp' },
            // Milkshake
            { name: 'Strawberry Milkshake', price: '9.90', img: '/menu/milkshake-strawberry.webp', sub: 'Milkshake' },
            { name: 'Pineapple Milkshake', price: '9.90', img: '/menu/milkshake-pineapple.webp' },
            { name: 'Grape Milkshake', price: '9.90', img: '/menu/milkshake-grape.webp' },
            { name: 'Mango Milkshake', price: '9.90', img: '/menu/milkshake-mango.webp' },
            // Mojito
            { name: 'Blue Hawaii Mojito', price: '7.90', img: '/menu/mojito-blue-hawaii.webp', sub: 'Mojito' },
            { name: 'Honey Lemon Mojito', price: '7.90', img: '/menu/mojito-honey-lemon.webp' },
            { name: 'Pineapple Mojito', price: '7.90', img: '/menu/mojito-pineapple.webp' },
            { name: 'Strawberry Mojito', price: '7.90', img: '/menu/mojito-strawberry.webp' },
            { name: 'Grape Mojito', price: '7.90', img: '/menu/mojito-grape.webp' },
            // Others
            { name: 'Ice Lemon Tea', price: '6.90', img: '/menu/iced-lemon-tea.webp', sub: 'Others' },
            { name: 'Lemon', price: '5.90', img: '/menu/iced-lemon.webp' },
            { name: 'Teh Ais', price: '5.90', img: '/menu/teh-ais.webp' },
            { name: 'Teh O Ais', price: '5.90', img: '/menu/teh-o-ais.webp' },
        ],
    },
]

// ── Admin WhatsApp number ──
// Customer messages go here when they submit the booking form.
export const ADMIN_WHATSAPP = '0177402975'

// ── Menu PDF link ──
// Hosted menu that customers open in a new tab.
export const MENU_PDF_URL = 'https://drive.google.com/file/d/15pyHzFwm8Q_eBzVHSVpSZ31hCT8KiTrZ/view?usp=drive_link'

// ── TikTok ──
// Profile link for the "View more on TikTok" button.
export const TIKTOK_PROFILE_URL = 'https://www.tiktok.com/@miamorcoffee1'
// Deco example videos (play inline via TikTok player).
// id = numeric video ID (needed for embedding), url = canonical video link.
export const TIKTOK_DECO_VIDEOS = [
    { id: '7672247841795919124', url: 'https://www.tiktok.com/@miamorcoffee1/video/7672247841795919124', title: 'Couple deco setup' },
    { id: '7679337182754016533', url: 'https://www.tiktok.com/@miamorcoffee1/video/7679337182754016533', title: 'Behind the scenes — deco setup' },
]

// ── Operating hours (used to restrict bookable time slots) ──
export const OPEN_HOUR = 10  // 10:30 AM
export const OPEN_MIN = 30
export const CLOSE_HOUR = 18 // 6:30 PM — last booking slot is 18:00
export const CLOSE_MIN = 30

// ── Generate time slots from open to last-bookable, every 30 min ──
export const getTimeSlots = () => {
    const slots = []
    const last = CLOSE_HOUR * 60 + CLOSE_MIN - 30  // 30 min before close
    for (let m = OPEN_HOUR * 60 + OPEN_MIN; m <= last; m += 30) {
        slots.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`)
    }
    return slots
}

// ── Build the WhatsApp message sent from customer to staff ──
export const getWhatsAppBookingMessage = ({ name, phone, guests, date, time, notes }) => {
    const formattedDate = date
        ? new Date(date).toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' })
        : '—'

    let msg = `Hi Miamor! 👋 I'd like to make a *reservation*.\n\n`
    msg += `📛 *Name:* ${name}\n`
    msg += `📱 *WhatsApp:* ${phone}\n`
    msg += `👥 *Guests:* ${guests}\n`
    msg += `📅 *Date:* ${formattedDate}\n`
    msg += `🕐 *Time:* ${time}\n`
    if (notes) msg += `\n📝 *Notes:* ${notes}\n`
    msg += `\nThank you! 😊`
    return msg
}

// ── Build wa.me link from a local phone number ──
export const getWhatsAppLink = (phoneNumber, message) => {
    let cleanNumber = phoneNumber.replace(/\D/g, '')
    if (cleanNumber.startsWith('0')) cleanNumber = '60' + cleanNumber.slice(1)
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
}