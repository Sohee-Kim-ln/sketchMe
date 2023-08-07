module.exports = {
  // 템플릿 파일의 경로 설정
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      zIndex: {
        '11':'11',
        '12':'12',
        '13':'13',
        '14':'14',
        '15':'15',
      }

    },
    colors: {
      white: '#ffffff',
      grey: '#D4D4D4',
      lightgrey: '#F6F6F6',
      darkgrey: '#00000080',
      black: '#18181B',
      primary: '#7532A8',
      primary_2: '#A77CC7',
      primary_3: '#D9C6E7',
      primary_4: '#F1EAF6',
      secondary: '#22C55E80',
      yellow: '#F9E000',
      kakao: '#FDE500',
      pink: '#FF9090',
      orange: '#FAAF1D',
      beige: '#D5BC9F',
    },
  },
  plugins: [

  ],
};
