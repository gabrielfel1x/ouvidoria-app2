const primary = '#4f82f0';
const white = '#ffffff';
const black = '#000000';
const gray = '#9ca3af';
const tintColorLight = primary;
const tintColorDark = primary;

export default {
  light: {
    text: black,
    background: white,
    tint: tintColorLight,
    primary,
    white,
    black,
    gray,
    tabIconDefault: gray,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: white,
    background: black,
    tint: tintColorDark,
    primary,
    white,
    black,
    gray,
    tabIconDefault: gray,
    tabIconSelected: tintColorDark,
  },
};
