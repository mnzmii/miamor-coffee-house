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
                    50: '#fdf4f0',
                    100: '#fbe5db',
                    200: '#f7c9b5',
                    300: '#f2a888',
                    400: '#ec8054',
                    500: '#e6602e',
                    600: '#d44a1e',
                    700: '#b03819',
                    800: '#8d2f19',
                    900: '#732a18',
                },
                dark: {
                    50: '#f6f6f7',
                    100: '#e2e3e5',
                    200: '#c4c6cb',
                    300: '#9fa2a9',
                    400: '#7b7f88',
                    500: '#61656e',
                    600: '#4c4f57',
                    700: '#3e4147',
                    800: '#2a2c31',
                    900: '#1a1b1f',
                    950: '#111215',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                display: ['Outfit', 'Inter', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
