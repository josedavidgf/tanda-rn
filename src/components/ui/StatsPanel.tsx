import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import AppText from '@/components/ui/AppText';
import { spacing, colors } from '@/styles';
import { ShiftStats as ShiftStatsType } from '@/utils/computeShiftStats';
import { shiftTypeIcons, shiftTypeLabels } from '@/utils/useLabelMap';
import { Clock, Calendar, MagnifyingGlass } from 'phosphor-react-native';
import Button from '@/components/ui/Button';
import { useNavigation } from '@react-navigation/native';

const shiftTypes = ['morning', 'evening', 'night', 'reinforcement'] as const;

type StatsPanelProps = {
    stats: ShiftStatsType;
    hoursPerShiftByType: {
        morning: number;
        evening: number;
        night: number;
        reinforcement: number;
    };
};

export default function StatsPanel({ stats, hoursPerShiftByType }: StatsPanelProps) {

    const navigation = useNavigation();
    const totalShifts = stats.total;
    const totalHours = shiftTypes.reduce(
        (sum, type) => sum + stats[type] * hoursPerShiftByType[type],
        0
    );

    return (
        <View>
            <View>
                {shiftTypes.map((type) => {
                    const Icon = shiftTypeIcons[type];
                    const count = stats[type];
                    return (
                        <View key={type} style={styles.item}>
                            <View style={[styles.iconBox, styles[`icon_${type}`]]}>
                                <Icon size={20} color={colors.black} />
                            </View>
                            <View style={styles.metaBox}>
                                <AppText style={styles.label}>{shiftTypeLabels[type]}</AppText>
                                <View style={styles.lineRow}>
                                    <Calendar size={14} color={colors.gray[700]} weight="regular" />
                                    <AppText style={styles.meta}>{count} turnos</AppText>
                                </View>
                            </View>
                            <View style={styles.hoursBox}>
                                <Clock size={14} color={colors.gray[700]} weight="regular" />
                                <AppText style={styles.meta}>{count * hoursPerShiftByType[type]} h</AppText>
                            </View>
                        </View>
                    );
                })}
            </View>

            <View style={styles.totalBox}>
                <View style={styles.lineRow}>
                    <AppText variant="h3" style={{ flex: 1 }}>Total</AppText>
                    <View style={styles.lineRow}>
                        <Clock size={16} color={colors.gray[900]} weight="fill" />
                        <AppText style={styles.total}>{totalHours} h</AppText>
                    </View>
                </View>
                <AppText style={styles.summaryText}>
                    Este mes tienes {totalShifts} turnos asignados y {totalHours} horas contabilizadas en total.
                </AppText>
            </View>

            <View style={styles.footer}>
                <AppText variant="h3">¿Quieres cambiar o hacer más turnos?</AppText>
                <AppText style={styles.summaryText}>
                    Echa un vistazo al buscador de turnos para proponer cambios o aceptar cambios sin devolución.
                </AppText>
                <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<MagnifyingGlass size={20} color={colors.black} />}
                    label="Ver turnos disponibles"
                    onPress={() => navigation.navigate('HospitalShifts')}
                />
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    list: {
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: colors.white,
        paddingVertical: spacing.md,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon_morning: {
        backgroundColor: colors.shift.morning,
    },
    icon_evening: {
        backgroundColor: colors.shift.evening,
    },
    icon_night: {
        backgroundColor: colors.shift.night,
    },
    icon_reinforcement: {
        backgroundColor: colors.shift.reinforcement,
    },
    metaBox: {
        flex: 1,
        gap: 2,
    },
    label: {
        fontWeight: '600',
        fontSize: 16,
    },
    meta: {
        color: colors.gray[700],
        fontSize: 13,
    },
    hoursBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    totalBox: {
        borderTopWidth: 1,
        borderTopColor: colors.gray[200],
        paddingTop: spacing.md,
        gap: spacing.sm,
    },
    lineRow: {
        flexDirection: 'row',
        gap: spacing.xs,
        alignItems: 'center',
    },
    total: {
        fontWeight: '700',
        fontSize: 16,
        color: colors.gray[900],
    },
    summaryText: {
        fontSize: 14,
        color: colors.gray[700],
    },
    footer: {
        paddingTop: spacing.md,
        gap: spacing.sm,
    },
});
