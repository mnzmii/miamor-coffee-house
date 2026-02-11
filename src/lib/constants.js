// ── Status constants ──
export const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
}

export const ORDER_TYPE = {
    REMOTE: 'remote',
    QR_WALKIN: 'qr_walkin',
}

export const ROOM_CATEGORY = {
    PRIVATE: 'Private',
    OPEN: 'Open',
}

// ── Malay UI labels ──
export const LABELS = {
    // General
    APP_NAME: 'Miamor Coffee House',
    WELCOME: 'Selamat Datang',
    SUBMIT: 'Hantar',
    CANCEL: 'Batal',
    SAVE: 'Simpan',
    DELETE: 'Padam',
    EDIT: 'Sunting',
    ADD: 'Tambah',
    CLOSE: 'Tutup',
    BACK: 'Kembali',
    NEXT: 'Seterusnya',
    CONFIRM: 'Sahkan',
    LOADING: 'Memuatkan...',

    // Customer form
    CUSTOMER_NAME: 'Nama',
    WHATSAPP_NUMBER: 'Nombor WhatsApp',
    GUEST_COUNT: 'Bilangan Tetamu',
    SELECT_DATE: 'Pilih Tarikh',
    SELECT_TIME: 'Pilih Masa',
    PREFERRED_TIME: 'Masa Pilihan',

    // Menu
    FOOD_MENU: 'Menu Makanan',
    ADD_TO_ORDER: 'Tambah',
    ORDER_SUMMARY: 'Ringkasan Pesanan',
    TOTAL: 'Jumlah',
    NO_ITEMS: 'Tiada item dipilih',

    // Status
    STATUS_PENDING: 'Menunggu',
    STATUS_CONFIRMED: 'Disahkan',
    STATUS_COMPLETED: 'Selesai',

    // Order types
    TYPE_REMOTE: 'Tempahan',
    TYPE_WALKIN: 'QR Walk-in',

    // Staff
    STAFF_DASHBOARD: 'Papan Pemuka',
    APPROVE: 'Sahkan',
    REJECT: 'Tolak',
    SYNC_POS: 'Sync ke Loyverse',
    ASSIGN_ROOM: 'Pilih Bilik',
    ROOM_SETTINGS: 'Tetapan Bilik',
    ALL_ORDERS: 'Semua Pesanan',
    FILTER: 'Tapis',

    // Rooms
    ROOM_NAME: 'Nama Bilik',
    ROOM_CAPACITY: 'Kapasiti',
    ROOM_CATEGORY: 'Kategori',
    ROOM_TABLES: 'Bilangan Meja',
    ROOM_COMBINABLE: 'Boleh Digabung',
    ADD_ROOM: 'Tambah Bilik',
    EDIT_ROOM: 'Sunting Bilik',
    BEST_FIT: 'Paling Sesuai',

    // Kitchen
    KITCHEN_BOARD: 'Papan Dapur',
    DONE_COOKING: 'Selesai Masak',
    TIME_LEFT: 'Masa Berbaki',
    ARRIVING_SOON: 'Akan Tiba',

    // Confirmation messages
    RESERVATION_SUBMITTED: 'Tempahan anda telah dihantar!',
    RESERVATION_PENDING: 'Sila tunggu pengesahan daripada kakitangan kami.',
    ORDER_SUBMITTED: 'Pesanan anda telah diterima!',
    ORDER_CONFIRMED: 'Pesanan sedang disediakan.',
}

// ── WhatsApp message templates ──
export const getWhatsAppConfirmationMessage = (customerName, roomName, startTime) => {
    const formattedTime = new Date(startTime).toLocaleString('ms-MY', {
        dateStyle: 'long',
        timeStyle: 'short',
    })
    return `Salam ${customerName}! 🎉\n\nTempahan anda di *Miamor Coffee House* telah disahkan.\n\n🏠 Bilik: *${roomName}*\n🕐 Masa: *${formattedTime}*\n\nKami menantikan kedatangan anda! ☕`
}

export const getWhatsAppLink = (phoneNumber, message) => {
    // Remove leading 0 and add Malaysia country code if needed
    let cleanNumber = phoneNumber.replace(/\D/g, '')
    if (cleanNumber.startsWith('0')) {
        cleanNumber = '60' + cleanNumber.slice(1)
    }
    if (!cleanNumber.startsWith('60')) {
        cleanNumber = '60' + cleanNumber
    }
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
}
