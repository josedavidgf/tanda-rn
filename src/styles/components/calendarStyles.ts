import { StyleSheet } from 'react-native';
import { spacing } from '@/styles';

export const calendarStyles = StyleSheet.create({
  calendarContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  calendarHeaderDayText: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  weekRow: {
    flexDirection: 'row',
  },
  gridContainer: {
    gap: spacing.sm,
  },
  calendarDayWrapper: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 0.2, // ajusta este valor para el “gap”
  },
  calendarDayContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: spacing.xs,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs, // opcional
  },
  calendarDayNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
    position: 'absolute',
    top: 4,
    left: 4,
  },
  calendarShiftIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarAvailabilityDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    backgroundColor: '#12dc92',
    borderRadius: 4,
  },
  shiftMorning: {
    backgroundColor: '#FFD000',
  },
  shiftEvening: {
    backgroundColor: '#FF336B',
  },
  shiftNight: {
    backgroundColor: '#016EFF',
  },
  shiftReinforcement: {
    backgroundColor: '#FF6000',
  },
  selectedDay: {
    borderColor: '#000',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  past: {
    opacity: 0.5,
  },
});