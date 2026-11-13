/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';
//color pallette
const darkplum= "#1F092A"
const mediumplum= "#4B1D5A"
const darkberry= "#561532"
const mediumberry= "#A32E5B"
const lightberry= "#F9D5E5"
const tan= "#D0B3AB"
const darktan= "#A67C6D"
const lighttan= "#FDF4F2"

export const Colors = {
  light: {
    // Page
    background: darkberry,
    divider: lighttan,
    // Header
    headerText: tan,
    headerBackground: mediumberry,
    headerDropShadow: darkberry,

    // Nav Bar (bottom)
    footerBackgroundDefault: tan,
    footerBackgroundSelected: 'rgba(86, 21, 50, 0.49)',
    tabIconDefault: darkplum,
    tabIconSelected: darkplum,

    // Homepage Buttons
    //phase box
    phaseBoxBackground: 'rgba(31, 9, 42, 0.49)',
    insightButtonDefault: tan,
    insightButtonSelected: darktan,
    insightButtonTextDefault: darkplum,
    insightButtonTextSelected: darkplum,

    GooglecalendarButtonDefault: darkplum,
    GooglecalendarButtonSelected: darkplum,
    GooglecalendarButtonTextDefault: lighttan,
    GooglecalendarButtonTextSelected: lighttan,

    addtaskbuttonDefault: tan,
    addtaskbuttonSelected: darktan,
    addtaskbuttoniconDefault: darkplum,
    addtaskbuttoniconSelected: darkplum,

    // Task List
    taskListText: darkplum,
    taskListBackground: lighttan,
    taskListDropShadow: darktan,
    taskcontainerBackground: lighttan,
    taskitemBackground: tan,
    taskbuttonselectedBackground: darkplum,
    taskbuttondefaultBackground: darkplum,
  /*
    sortButtonText: lightGreen,
    sortButtonBackground: mediumGreen,

    searchBarText: lightGreen,
    searchBarBackground: white,

    filterButtonBackgroundDefault: beige,
    filterButtonBackgroundSelected: darkBeige,
    filterButtonIconDefault: mediumGreen,
    filterButtonIconSelected: darkGreen,
    filterTagBackgroundDefault: darkBeige,
    filterTagBackgroundSelected: lightPink,

    rsvpButtonBackgroundDefault: lightGreen,
    rsvpButtonBackgroundSelected: darkGreen,
    rsvpButtonTextDefault: white,
    rsvpButtonTextSelected: white,

    logOutButtonBackgroundDefault: darkGreen,
    logOutButtonTextDefult: white,

    // Event Cards
    eventCardText: darkGreen,
    eventCardDescriptionText: black,
    eventCardBackground: beige,
    eventCardDropShadow: mediumGreen,
    eventCardIcon: darkGreen,
    eventCardStarDeselected: darkBeige,
    eventCardStarSelected: yellow,

    eventCardTagText: white,
    eventCardTagBackground: lightGreen,
*/
  },
  dark: {
    // Page
    background: darkberry,
    divider: lighttan,

    // Header
    headerText: tan,
    headerBackground: mediumberry,
    headerDropShadow: darkberry,

    // Nav Bar (bottom)
    footerBackgroundDefault: tan,
    footerBackgroundSelected: 'rgba(86, 21, 50, 0.49)',
    tabIconDefault: darkplum,
    tabIconSelected: darkplum,

    // Homepage Buttons
    phaseBoxBackground: 'rgba(31, 9, 42, 0.49)',

    insightButtonDefault: tan,
    insightButtonSelected: darktan,
    insightButtonTextDefault: darkplum,
    insightButtonTextSelected: darkplum,

    GooglecalendarButtonDefault: darkplum,
    GooglecalendarButtonSelected: darkplum,
    GooglecalendarButtonTextDefault: lighttan,
    GooglecalendarButtonTextSelected: lighttan,

    addtaskbuttonDefault: tan,
    addtaskbuttonSelected: darktan,
    addtaskbuttoniconDefault: darkplum,
    addtaskbuttoniconSelected: darkplum,

    // Task List
    taskListText: darkplum,
    taskListBackground: lighttan,
    taskListDropShadow: darktan,
    taskcontainerBackground: lighttan,
    taskitemBackground: tan,
    taskbuttonselectedBackground: darkplum,
    taskbuttondefaultBackground: darkplum,
  /*
    sortButtonText: lightGreen,
    sortButtonBackground: mediumGreen,

    searchBarText: lightGreen,
    searchBarBackground: white,

    filterButtonBackgroundDefault: beige,
    filterButtonBackgroundSelected: darkBeige,
    filterButtonIconDefault: mediumGreen,
    filterButtonIconSelected: darkGreen,
    filterTagBackgroundDefault: darkBeige,
    filterTagBackgroundSelected: lightPink,

    rsvpButtonBackgroundDefault: lightGreen,
    rsvpButtonBackgroundSelected: darkGreen,
    rsvpButtonTextDefault: white,
    rsvpButtonTextSelected: white,

    logOutButtonBackgroundDefault: darkGreen,
    logOutButtonTextDefult: white,

    // Event Cards
    eventCardText: darkGreen,
    eventCardDescriptionText: black,
    eventCardBackground: beige,
    eventCardDropShadow: mediumGreen,
    eventCardIcon: darkGreen,
    eventCardStarDeselected: darkBeige,
    eventCardStarSelected: yellow,

    eventCardTagText: white,
    eventCardTagBackground: lightGreen,
*/
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
