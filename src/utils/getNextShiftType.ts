export type ShiftType = 'morning' | 'evening' | 'night' | 'reinforcement';

export interface GetNextShiftType {
  (currentType: ShiftType | string): ShiftType | null;
}

export const getNextShiftType: GetNextShiftType = function (currentType) {
  switch (currentType) {
    case 'morning': return 'evening';
    case 'evening': return 'night';
    case 'night': return 'reinforcement';
    case 'reinforcement': return null;
    default: return 'morning';
  }
};
