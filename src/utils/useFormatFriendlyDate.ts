// lib/formatFriendlyDate.ts
import { parseISO, format, isToday, isTomorrow } from 'date-fns';
import es from 'date-fns/locale/es';

export function formatFriendlyDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(d)) return `Hoy, ${format(d, 'dd/MM')}`;
  if (isTomorrow(d)) return `Mañana, ${format(d, 'dd/MM')}`;

  return capitalize(format(d, 'EEEE, dd/MM', { locale: es }));
}

export function formatFriendlyDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const options = { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' };

  const time = new Intl.DateTimeFormat('es-ES', options).format(d);
  const dateFormatted = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Europe/Madrid',
  }).format(d);

  return `${capitalize(dateFormatted)} a las ${time}`;
}

export function getFriendlyDateParts(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(d)) return { label: 'Hoy', short: format(d, 'dd/MM') };
  if (isTomorrow(d)) return { label: 'Mañana', short: format(d, 'dd/MM') };

  return {
    label: capitalize(format(d, 'EEEE', { locale: es })),
    short: format(d, 'dd/MM'),
  };
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
