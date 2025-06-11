import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import Button from '@/components/ui/Button';
import AppText from '@/components/ui/AppText';
import { shiftTypeLabels } from '@/utils/useLabelMap';
import { ShiftType } from '@/types/calendar';

type Props = {
  visible: boolean;
  currentType: ShiftType;
  selectedType: ShiftType;
  availableTypes: ShiftType[];
  onSelect: (type: ShiftType) => void;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string; // NUEVO
  disableIfUnchanged?: boolean;
};

export default function EditShiftTypeModal({
  visible,
  currentType,
  selectedType,
  availableTypes,
  onSelect,
  onCancel,
  onConfirm,
  disableIfUnchanged,
  title = 'Editar tipo de turno', // DEFAULT
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <AppText variant="h2" style={styles.title}>{title}</AppText>

          {availableTypes.map((type) => (
            <Button
              key={type}
              size="lg"
              label={shiftTypeLabels[type]}
              variant={selectedType === type ? 'primary' : 'outline'}
              onPress={() => onSelect(type)}
              style={{ marginVertical: 4 }}
            />
          ))}

          <View style={styles.actions}>
            <Button
              label="Cancelar"
              size="lg"
              variant="outline"
              onPress={onCancel}
              style={{ flex: 1 }}
            />
            <Button
              label="Guardar"
              size="lg"
              variant="primary"
              onPress={onConfirm}
              disabled={disableIfUnchanged && selectedType === currentType}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
});
