// theme/typography.ts

import { colors } from '../utilities/colors';
import { fontSizes } from './variables';
import { spacing } from '../utilities/spacing';

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'HostGrotesk-Bold',
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'HostGrotesk-Bold',
  },
  h3: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'HostGrotesk-Bold',
  },
  p: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'HostGrotesk-Regular',
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'HostGrotesk-Regular',
  },
  link: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'HostGrotesk-Medium',
    color: colors.secondary,
  },
};

