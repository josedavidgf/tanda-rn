import React from 'react';
import {
  CalendarCheck,
  Repeat,
  CheckCircle,
  XCircle,
  ArrowClockwise,
} from 'phosphor-react-native';
import { formatFriendlyDate } from './useFormatFriendlyDate';
import { shiftTypeLabels } from './useLabelMap';

type UserEventConfig = {
  icon: React.ComponentType<{ size: number; color: string; backgroundColor: string }>;
  title: string;
  getDescription: (metadata: any) => string;
};

export const USER_EVENT_CONFIG: Record<string, UserEventConfig> = {
  shift_published: {
    icon: CalendarCheck,
    title: 'Turno publicado',
    getDescription: (metadata) =>
      `Has publicado tu turno del ${formatFriendlyDate(metadata.date)} de ${shiftTypeLabels[metadata.shift_type]}.`,
  },
  swap_proposed: {
    icon: Repeat,
    title: 'Has propuesto un intercambio',
    getDescription: (metadata) => {
      const isNoReturn = metadata.swap_type === 'no_return';

      if (isNoReturn) {
        return `Has ofrecido a ${metadata.shift_owner_name} ${metadata.shift_owner_surname} tu turno del ${formatFriendlyDate(metadata.shift_date)} de ${shiftTypeLabels[metadata.shift_type]} sin necesidad de devolución.`;
      }

      return `Has ofrecido a ${metadata.shift_owner_name} ${metadata.shift_owner_surname} tu turno del ${formatFriendlyDate(metadata.offered_date)} de ${shiftTypeLabels[metadata.offered_type]} por su turno del ${formatFriendlyDate(metadata.shift_date)} de ${shiftTypeLabels[metadata.shift_type]}.`;
    },
  },
  swap_received: {
    icon: Repeat,
    title: 'Te han propuesto un intercambio',
    getDescription: (metadata) => {
      const isNoReturn = metadata.swap_type === 'no_return';

      if (isNoReturn) {
        return `${metadata.requester_name} ${metadata.requester_surname} se ofrece a hacer tu turno del ${formatFriendlyDate(metadata.shift_date)} de ${shiftTypeLabels[metadata.shift_type]} sin necesidad de devolución.`;
      }

      return `${metadata.requester_name} ${metadata.requester_surname} te ha ofrecido su turno del ${formatFriendlyDate(metadata.offered_date)} de ${shiftTypeLabels[metadata.offered_type]} por tu turno del ${formatFriendlyDate(metadata.shift_date)} de ${shiftTypeLabels[metadata.shift_type]}.`;
    },
  },
  swap_accepted: {
    icon: CheckCircle,
    title: 'Tu intercambio ha sido aceptado',
    getDescription: (metadata) => {
      const isNoReturn = metadata.swap_type === 'no_return';

      if (isNoReturn) {
        return `Se ha aceptado que ${metadata.shift_date ? `cedas tu turno del ${formatFriendlyDate(metadata.shift_date)} de ${shiftTypeLabels[metadata.shift_type]}` : 'cedas tu turno'} sin necesidad de turno de vuelta.`;
      }

      return `Tu turno ofrecido del ${formatFriendlyDate(metadata.offered_date)} de ${shiftTypeLabels[metadata.offered_type]} ha sido aceptado. Recibirás el turno del ${formatFriendlyDate(metadata.shift_date)} de ${shiftTypeLabels[metadata.shift_type]}.`;
    },
  },
  swap_rejected: {
    icon: XCircle,
    title: 'Tu intercambio ha sido rechazado',
    getDescription: (metadata) =>
      `El turno que propusiste para el ${formatFriendlyDate(metadata.shift_date)} de ${shiftTypeLabels[metadata.shift_type]} ha sido rechazado.`,
  },
  swap_accepted_automatically_requester: {
    icon: ArrowClockwise,
    title: 'Intercambio automático realizado',
    getDescription: (metadata) =>
      `Tu turno ofrecido del ${formatFriendlyDate(metadata.offered_date)} de ${shiftTypeLabels[metadata.offered_type]} ha sido intercambiado automáticamente por el turno del ${formatFriendlyDate(metadata.shift_date)} de ${shiftTypeLabels[metadata.shift_type]}.`,
  },
  swap_accepted_automatically_owner: {
    icon: ArrowClockwise,
    title: 'Tu turno ha sido intercambiado automáticamente',
    getDescription: (metadata) =>
      `Tu turno del ${formatFriendlyDate(metadata.shift_date)} de ${shiftTypeLabels[metadata.shift_type]} ha sido intercambiado automáticamente por el turno del ${formatFriendlyDate(metadata.offered_date)} de ${shiftTypeLabels[metadata.offered_type]}.`,
  },
};
