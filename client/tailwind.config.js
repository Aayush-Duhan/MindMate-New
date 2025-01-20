/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
      require('tailwind-scrollbar'),
    ],
    variants: {
      scrollbar: ['dark', 'rounded']
    },
    safelist: [
      // Calendar-specific classes
      'react-calendar',
      'react-calendar__navigation',
      'react-calendar__navigation__label',
      'react-calendar__navigation__arrow',
      'react-calendar__month-view',
      'react-calendar__month-view__weekdays',
      'react-calendar__month-view__days',
      'react-calendar__tile',
      {
        pattern: /bg-(purple|gray|blue)-(400|500|600|700|800|900)/,
        variants: ['hover', 'focus', 'active'],
      },
    ],
  }