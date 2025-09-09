/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Colores para layout y estructura
      colors: {
        layout: {
          primary: '#1a202c',
          secondary: '#2d3748',
          accent: '#4a5568',
          surface: '#f7fafc',
          border: '#e2e8f0',
        },
      },
      // Espaciado para layout
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Grid para layout
      gridTemplateColumns: {
        'sidebar': '300px 1fr',
        'sidebar-sm': '250px 1fr',
        'sidebar-lg': '350px 1fr',
      },
    },
  },
  plugins: [],
}

