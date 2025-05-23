import * as Font from 'expo-font';

export const useFonts = () =>
  Font.loadAsync({
    HostGroteskRegular: require('@assets/fonts/HostGrotesk-Regular.ttf'),
    HostGroteskBold: require('@assets/fonts/HostGrotesk-Bold.ttf'),
  });
