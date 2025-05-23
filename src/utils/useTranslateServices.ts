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

  export const translateWorkerType = {
    doctor: 'Médico',
    nurse: 'Enfermero/a',
    assistant: 'Auxiliar',
    porter: 'Celador/a',
  };