// app/utils/colors.ts
import { green } from 'react-native-reanimated/lib/typescript/Colors';
import tinycolor from 'tinycolor2';

export const colors = {
  primary: '#598CD2',
  secondary: '#A5A5A5',
  background: '#F2F2F7',
  // background: '#818188',
  white: '#F5F5F5',
  black: '#000000',
  error: '#b00020',
  border: '#DFDFDF',
  Gray: '#bababa',
  lightGray: '##DAE3E8',
  underline: '#D9D9D9',
  darkGray: '#777983',
  blue: '#095286',
  red: '#E4080A',
  button: '#095286',
  buttonDisable: '#F0EFF4',
  default: '#F2F2F2',
  green: '#0E771E',
  orange: '#FCA326',
};
export const darken = (color: string, amount: number = 20) => {
  return tinycolor(color).darken(amount).toHexString();
};

export const lighten = (color: string, amount: number = 20) => {
  return tinycolor(color).lighten(amount).toHexString();
};
