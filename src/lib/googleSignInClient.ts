// lib/googleSignInClient.ts
import { Platform } from 'react-native';

let GoogleSignin: any = {};
let statusCodes: any = {};

if (Platform.OS !== 'web') {
  try {
    const googleModule = require('@react-native-google-signin/google-signin');
    GoogleSignin = googleModule.GoogleSignin;
    statusCodes = googleModule.statusCodes;
  } catch (e) {
    console.warn('[GOOGLE SIGNIN] Módulo nativo no disponible. Probablemente estás en Expo Go.');
  }
}

export { GoogleSignin, statusCodes };
