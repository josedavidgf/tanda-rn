/**
 * Devuelve el siguiente tipo de turno en ciclo
 */
export function getNextShiftType(current: 'morning' | 'evening' | 'night'): 'morning' | 'evening' | 'night' {
  if (current === 'morning') return 'evening';
  if (current === 'evening') return 'night';
  return 'morning';
}
