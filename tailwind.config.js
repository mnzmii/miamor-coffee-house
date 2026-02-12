/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    brown: '#3E2723',    // Primary: Dark brown
                    lightBrown: '#5D4037',
                    beige: '#D7CCC8',
                    cream: '#F5F5DC',    // Secondary: Cream/Latte
                    red: '#C62828',      // Accent: Deep red
                    darkRed: '#8E0000',
                    hoverRed: '#B71C1C',
                },
                dark: {
                    50: '#fcfbf9',
                    100: '#f5f2ed',
                    200: '#e8dfd5',
                    300: '#d7c4b3',
                    400: '#c2a38c',
                    500: '#a67c52', // Coffee color
                    600: '#8c6239',
                    700: '#3e2723', // Brand brown
                    800: '#2d1b18',
                    900: '#1a100e',
                    950: '#0f0807',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                body: ['Cormorant Garamond', 'Georgia', 'serif'],
                serif: ['DM Serif Display', 'Georgia', 'serif'],
                display: ['DM Serif Display', 'serif'],
                brand: ['Playfair Display', 'Georgia', 'serif'],
            },
            backgroundImage: {
                'coffee-pattern': "url('https://www.transparenttextures.com/patterns/black-linen.png')",
                'paper-texture': "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
