import { Styles } from '@ijstech/components';

export const textCenterStyle = Styles.style({
  textAlign: 'center'
})

export const valueFontStyle = Styles.style({
  fontSize: '6rem',
  $nest: {
    '@media only screen and (max-width: 768px)': {
      fontSize: '3rem'
    }
  }
})

export const unitFontStyle = Styles.style({
  fontSize: '1.5rem',
  $nest: {
    '@media only screen and (max-width: 768px)': {
      fontSize: '1rem'
    }
  }
})
