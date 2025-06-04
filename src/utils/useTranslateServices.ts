export function translateShiftType(type) {
  switch (type) {
    case 'morning':
      return 'mañana';
    case 'evening':
      return 'tarde';
    case 'night':
      return 'noche';
    case 'reinforcement':
      return 'refuerzo';
    default:
      return type;
  }
}

const WORKER_TYPE_LABELS: Record<string, string> = {
  doctor: 'Médico',
  nurse: 'Enfermero/a',
  assistant: 'Auxiliar',
  porter: 'Celador/a',
  // Añade más tipos aquí según los que tenga tu sistema
};

export const translateWorkerType = (type?: string): string => {
  if (!type) return '';
  return WORKER_TYPE_LABELS[type] || type;
};
