import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles';
import AppText from './AppText';

type Props = {
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
    label: React.ReactNode;
};

export default function Checkbox({ checked, onChange, label, disabled = false }: Props) {
    return (
        <Pressable onPress={onChange} disabled={disabled} style={styles.container}>
            <View style={[styles.box, checked && styles.boxChecked]}>
                {checked && <View style={styles.checkmark} />}
            </View>
            <View style={styles.labelWrapper}>
                <AppText variant='p'>{label}</AppText>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: spacing.sm,
        alignItems: 'flex-start',
        paddingVertical: spacing.sm,
    },
    box: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxChecked: {
        backgroundColor: colors.primary,
    },
    checkmark: {
        width: 6,
        height: 10,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: colors.white,
        transform: [{ rotate: '45deg' }],
    },
    labelWrapper: {
        flexShrink: 1,
    }
});
