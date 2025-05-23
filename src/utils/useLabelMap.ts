// utils/useLabelMapss.ts
import { Sun, SunHorizon, Moon, ShieldCheck } from '../theme/icons';


export const shiftTypeLabels: Record<string, string> = {
  morning: 'Mañana',
  evening: 'Tarde',
  night: 'Noche',
  reinforcement: 'Refuerzo',
};

export const shiftTypeIcons = {
  morning: Sun,
  evening: SunHorizon,
  night: Moon,
  reinforcement: ShieldCheck,
};

export const swapStatusLabels: Record<string, string> = {
  proposed: 'Pendiente',
  accepted: 'Aceptado',
  rejected: 'Rechazado',
  cancelled: 'Anulado',
};

export const workerTypeLabels: Record<string, string> = {
  nurse: 'Enfermería',
  doctor: 'Medicina',
  auxiliary: 'Auxiliar',
  orderly: 'Celador',
};
