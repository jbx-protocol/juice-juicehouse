/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // Use class for now, switch to media later
  important: true,
  theme: {
    colors: {
      black: '#000000',
      white: '#FFFFFF',
      haze: {
        25: '#F5FEFF',
        50: '#E9F9FA',
        100: '#D7F6FA',
        200: '#AAEAF2',
        300: '#48D0E0',
        400: '#18B4C7',
        500: '#049EB2',
        600: '#008198',
        700: '#015F72',
        800: '#013944',
        900: '#00262E',
        950: '#002127',
      },
      juice: {
        25: '#FFFCF5',
        50: '#FFFAEB',
        100: '#FEF0C7',
        200: '#FEDF89',
        300: '#FCBF30',
        400: '#F5A312',
        500: '#F08B08',
        600: '#DC6803',
        700: '#B54708',
        800: '#93370D',
        900: '#7A2E0E',
        950: '#592109',
      },
      grape: {
        25: '#FAFAFF',
        50: '#F4F3FF',
        100: '#EBE9FE',
        200: '#D9D6FE',
        300: '#BDB4FE',
        400: '#9B8AFB',
        500: '#7A5AF8',
        600: '#6938EF',
        700: '#5925DC',
        800: '#4A1FB8',
        900: '#3E1C96',
        950: '#2F1570',
      },
      tangerine: {
        25: '#FFF9F5',
        50: '#FFF4ED',
        100: '#FFE6D5',
        200: '#FFD6AE',
        300: '#FF9C66',
        400: '#FF692E',
        500: '#FF4405',
        600: '#E62E05',
        700: '#BC1B06',
        800: '#97180C',
        900: '#771A0D',
        950: '#4F140C',
      },
      smoke: {
        25: '#FEFDFB',
        50: '#FBF9F6',
        75: '#F5F4EF',
        100: '#EFECE6',
        200: '#E7E3DC',
        300: '#D4D1C7',
        400: '#C0BBAD',
        500: '#9C9580',
        600: '#857C63',
        700: '#575344',
        800: '#3F3A2E',
        900: '#353026',
      },
      grey: {
        25: '#FCFCFC',
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#E5E5E5',
        300: '#D6D6D6',
        400: '#A3A3A3',
        500: '#737373',
        600: '#525252',
        700: '#424242',
        800: '#292929',
        900: '#141414',
        950: '#0C0C03',
      },
      slate: {
        25: '#F7F7FA',
        50: '#F0EFF4',
        100: '#E1E0E8',
        200: '#A29FB7',
        300: '#5F5C7A',
        400: '#494361',
        500: '#39344E',
        600: '#2D293A',
        700: '#201E29',
        800: '#1A181F',
        900: '#16141D',
        950: '#131119',
      },
      error: {
        25: '#FFFBFA',
        50: '#FEF3F2',
        100: '#FEE4E2',
        200: '#FECDCA',
        300: '#FDA29B',
        400: '#F97066',
        500: '#F04438',
        600: '#D92D20',
        700: '#B42318',
        800: '#912018',
        900: '#7A271A',
        950: '#5C1D14',
      },
      warning: {
        25: '#FFFCF5',
        50: '#FFFAEB',
        100: '#FEF0C7',
        200: '#FEDF89',
        300: '#FEC84B',
        400: '#FDB022',
        500: '#F79009',
        600: '#DC6803',
        700: '#B54708',
        800: '#93370D',
        900: '#7A2E0E',
        950: '#592109',
      },
      success: {
        25: '#F6FEF9',
        50: '#ECFDF3',
        100: '#D1FADF',
        200: '#A6F4C5',
        300: '#6CE9A6',
        400: '#32D583',
        500: '#12B76A',
        600: '#039855',
        700: '#027A48',
        800: '#05603A',
        900: '#054F31',
        950: '#043B25',
      },
      extend: {},
    },
  },
  plugins: [],
}
