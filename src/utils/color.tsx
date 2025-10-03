// app/utils/colors.ts
import tinycolor from 'tinycolor2';

export const colors = {
  primary: '#598CD2',
  secondary: '#A5A5A5',
  background: '#F2F3F5',
  white: '#FFFFFF',
  black: '#000000',
  error: '#b00020',
  border: '#e1e1e1',
  Gray: '#bababa',
  lightGray: '#d3d3d3',
  darkGray: '#333333',
  blue: '#095286',
  red: '#E4080A',
  button: '#095286',
  buttonDisable: '#F0EFF4',
  default: '#F2F2F2',
};
export const darken = (color: string, amount: number = 20) => {
  return tinycolor(color).darken(amount).toHexString();
};

export const lighten = (color: string, amount: number = 20) => {
  return tinycolor(color).lighten(amount).toHexString();
};
