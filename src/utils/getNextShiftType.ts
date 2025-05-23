export function getNextShiftType(currentType) {
  switch (currentType) {
    case 'morning': return 'evening';
    case 'evening': return 'night';
    case 'night': return 'reinforcement';
    case 'reinforcement': return null;
    default: return 'morning';
  }
}
