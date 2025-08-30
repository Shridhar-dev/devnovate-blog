const colors = require('tailwindcss/colors');

module.exports = {
	content: [
		'./index.html',
		'./src/**/*.{js,jsx,ts,tsx}',
		'./components/**/*.{js,jsx,ts,tsx}',
		'./pages/**/*.{js,jsx,ts,tsx}',
		'./hooks/**/*.{js,jsx,ts,tsx}',
	],
	theme: {
		extend: {
			colors: {
				primary: colors.indigo[600],
				secondary: colors.sky[400],
				accent: colors.pink[400],
				background: colors.slate[50],
				foreground: colors.slate[900],
				card: colors.white,
				muted: colors.slate[200],
				border: colors.slate[300],
			},
			borderRadius: {
				xl: '1rem',
			},
			boxShadow: {
				pretty: '0 4px 24px 0 rgba(80, 80, 180, 0.10)',
			},
			animation: {
				fade: 'fadeIn 0.7s ease-in',
				bounce: 'bounce 1s infinite',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: 0 },
					'100%': { opacity: 1 },
				},
			},
		},
	},
	plugins: [require('tw-animate-css')],
};
