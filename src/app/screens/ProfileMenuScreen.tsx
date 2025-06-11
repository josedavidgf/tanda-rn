import React from 'react';
import { ScrollView, View, StyleSheet, Pressable, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SimpleLayout from '@/components/layout/SimpleLayout';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import { spacing, colors, typography } from '@/styles';
import {
    AddressBook,
    Briefcase,
    Bell,
    Gift,
    MessengerLogo,
    FileText,
    Book,
    ArrowRight,
    Lock,
} from 'phosphor-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { trackEvent } from '../hooks/useTrackPageView';
import { EVENTS } from '@/utils/amplitudeEvents';

export default function ProfileMenuScreen() {
    const navigation = useNavigation();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            trackEvent(EVENTS.LOGOUT_CLICKED);
            await logout();
        }
        catch (error) {
            console.error('Error tracking logout event:', error);
        }
    };

    const items = [
        {
            label: 'Información personal',
            route: 'ProfilePersonalInfo',
            Icon: AddressBook,
        },
        {
            label: 'Actualizar contraseña',
            route: 'ProfileResetPassword',
            Icon: Lock,
        },
        {
            label: 'Ajustes profesionales',
            route: 'ProfileWorkingInfo',
            Icon: Briefcase,
        },
        {
            label: 'Preferencias de comunicación',
            route: 'ProfilePreferences',
            Icon: Bell,
        },
        {
            label: 'Referir',
            route: 'ProfileReferral', // define esta ruta si la quieres
            Icon: Gift,
        },
        {
            label: 'Contacto',
            route: 'ProfileContactSupport',
            Icon: MessengerLogo,
        },
        {
            label: 'Términos y condiciones',
            external: true,
            url: 'https://apptanda.com/legal/terminos-y-condiciones',
            Icon: FileText,
        },
        {
            label: 'Política de privacidad',
            external: true,
            url: 'https://apptanda.com/legal/politica-privacidad',
            Icon: Book,
        },
    ];

    const handlePress = (item: any) => {
        if (item.external) {
            if (item.label === 'Términos y condiciones') {
                trackEvent(EVENTS.LEGAL_TERMS_CLICKED);
            }
            if (item.label === 'Política de privacidad') {
                trackEvent(EVENTS.LEGAL_PRIVACY_CLICKED);
            }
            Linking.openURL(item.url).catch(() =>
                Alert.alert('Error', 'No se pudo abrir el enlace.')
            );
        } else {
            navigation.navigate(item.route);
        }
    };

    return (
        <SimpleLayout title="Perfil" showBackButton onBack={() => navigation.goBack()}>
            <ScrollView contentContainerStyle={styles.container}>
                {items.map(({ label, Icon, ...item }) => (
                    <Pressable key={label} onPress={() => handlePress(item)} style={styles.item}>
                        <View style={styles.iconLabel}>
                            <Icon size={24} color={colors.gray[800]} />
                            <AppText variant='p'>{label}</AppText>
                        </View>
                        <ArrowRight size={16} color={colors.gray[500]} />
                    </Pressable>
                ))}

                <View style={styles.dangerZone}>
                    <View style={styles.buttonGroup}>
                        <Button
                            label="Cerrar sesión"
                            size="lg"
                            variant="outline"
                            onPress={handleLogout} />
                        <Button
                            label="Borrar cuenta"
                            size="lg"
                            variant="danger"
                            onPress={() => navigation.navigate('ProfileDeleteAccount')} />
                    </View>
                </View>
            </ScrollView>
        </SimpleLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.md,
        gap: spacing.md,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[200],
    },
    iconLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    dangerZone: {
        marginTop: spacing.xl,
    },
    buttonGroup: {
        gap: spacing.lg,
    },
});
