// lib/AmplitudeService.ts
import { init, track, identify, setUserId, reset, flush, Identify } from '@amplitude/analytics-react-native';

const AMPLITUDE_ENABLED = Boolean(process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY);

class AmplitudeService {
  static init() {
    if (!AMPLITUDE_ENABLED) {
      console.info('[Amplitude] Deshabilitado');
      return;
    }

    console.info(`[Amplitude] ENV: ${process.env.EXPO_PUBLIC_ENV}`);
    init(process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY || '');
  }

  static identify(userProfile: any) {
    if (!AMPLITUDE_ENABLED || !userProfile?.user_id) return;

    const identifyObj = new Identify();
    identifyObj.set('email', userProfile.email || '');
    identifyObj.set('workerId', userProfile.worker_id || '');
    identifyObj.set('workerTypeName', userProfile.worker_types?.worker_type_name || '');
    identifyObj.set('hospitalName', userProfile.workers_hospitals?.[0]?.hospitals?.name || '');
    identifyObj.set('specialityCategory', userProfile.workers_specialities?.[0]?.specialities?.speciality_category || '');

    setUserId(userProfile.user_id);
    identify(identifyObj);
    flush();
  }

  static track(eventName: string, eventProperties: Record<string, any> = {}) {
    if (!AMPLITUDE_ENABLED) {
      console.info(`[Amplitude - ${process.env.EXPO_PUBLIC_ENV}] ${eventName}`, eventProperties);
      return;
    }

    track(eventName, eventProperties);
  }

  static flush() {
    if (AMPLITUDE_ENABLED) flush();
  }

  static reset() {
    if (AMPLITUDE_ENABLED) {
      reset();
      console.info('[Amplitude] Reset completo');
    }
  }
}

export default AmplitudeService;
