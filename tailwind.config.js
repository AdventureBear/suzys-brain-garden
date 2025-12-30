module.exports = {
  important: true,
  content: [
    "./_includes/**/*.{html,njk,js,md}",
    "./content/**/*.{html,njk,js,md}",
    "./*.{html,njk,md}",
    "./admin/**/*.{html,njk}",
    "./docs/**/*.md"
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
    },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            a: {
              color: '#1D4ED8',
              '&:hover': {
              color: '#1E3A8A',
              },
            },
            '.prose a.edit, .tag a': {
              color: '#333',
              'text-decoration': 'none',
            },
            'ul.footer-nav': {
              '::before': {
                display: 'none',
                'text-decoration': 'none',
              }
            },
            'ul.contains-task-list': {
              '::before': {
                display: 'none',
              }
            },
            'ul.spacelog': {
              '::before': {
                display: 'none',
              }
            },
          },
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}