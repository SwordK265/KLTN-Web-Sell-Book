/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      white: '#ffffff',
      green: '#0b703d',
      black: '#cccccc',
      grey: '#7A7E7F',
      red: '#c02026'
    },
    extend: {
      margin: {
        '3px': '0.1875rem',
        '5px': '0.3125rem',
        '15px': '0.9375rem',
        '30px': '1.875rem',
        '50px': '3.125rem'
      },
      padding: {
        '3px': '0.1875rem',
        '5px': '0.3125rem',
        '15px': '0.9375rem',
        '30px': '1.875rem',
        '38px': '2.375rem'
      },
      maxWidth: {
        '50px': '3.125rem',
        '154px': '9.625rem',
        '450px': '28.125rem',
        '578px': '36.125rem'
      },
      width: {
        90: '5.625rem',
        115: '7.1875rem',
        135: '8.4375rem',
        280: '17.5rem',
        336: '21rem',
        350: '21.875rem',
        430: '26.875rem',
        450: '28.125rem',
        472: '29.5rem',
        500: '31.25rem',
        600: '37.5rem',
        820: '51.25rem'
      },
      height: {
        180: '11.25rem',
        200: '12.5rem',
        350: '21.875rem',
        410: '25.625rem',
        430: '26.875rem',
        450: '28.125rem',
        500: '31.25rem',
        570: '35.625rem',
        600: '37.5rem'
      },
      minHeight: {
        200: '12.5rem'
      },
      lineHeight: {
        '26px': '1.625rem'
      },
      boxShadow: {
        picture: '0 0 15px #26545a',
        'box-book-price': '0 0 0 5px #e8e8e8',
        'box-author-info-detail-book': '0 5px 0 0 #d9d9d9'
      },
      borderWidth: {
        1: '1px',
        3: '3px',
        6: '6px'
      },
      fontSize: {
        '10px': '0.625rem',
        '11px': '0.6875rem',
        '12px': '0.75rem',
        '14px': '0.875rem',
        '15px': '0.9375rem',
        '16px': '1rem',
        '17px': '1.0625rem',
        '18px': '1.125rem'
      },
      borderRadius: {
        '3px': '0.1875rem',
        '5px': '0.3125rem',
        '10px': '0.625rem'
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif']
      }
    }
  },
  plugins: []
};
