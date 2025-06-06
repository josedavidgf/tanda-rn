// styles/components/calendar.ts
import { StyleSheet } from 'react-native';

export const calendarStyles = StyleSheet.create({
  calendarContainer: {
    padding: 16,
  },
  calendarHeaderDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
    calendarShiftIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
  },

  calendarShiftIconRow: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    flexDirection: 'row',
    gap: 2,
  },
  calendarDayContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: '#F3F4F6',
    opacity: 0.8,
    position: 'relative',
    padding: 6,
  },
  calendarDayNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  calendarShiftIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
  calendarAvailabilityDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#12dc92',
  },
  selectedDay: {
    borderWidth: 1,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  shiftMorning: { backgroundColor: '#FFD000' },
  shiftEvening: { backgroundColor: '#FF336B' },
  shiftNight: { backgroundColor: '#016EFF' },
  shiftReinforcement: { backgroundColor: '#FF6000' },
  past: { opacity: 0.5 },
});
