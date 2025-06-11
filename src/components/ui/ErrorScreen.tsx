import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import { spacing, colors } from '@/styles';
import { navigationRef } from '@/app/navigation/navigationRef';

export default function ErrorScreen({ retry }: { retry: () => void }) {
  const handleGoToLogin = () => {
    console.log('[ERROR SCREEN] Redirigiendo a Login');
    if (navigationRef.isReady()) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'AuthNavigator' }],
      });
    } else {
      console.warn('[ERROR SCREEN] navigationRef no está listo');
    }
  };

  return (
    <View style={styles.container}>
      <AppText variant="h2">Algo salió mal</AppText>
      <AppText style={{ marginVertical: 12 }}>No pudimos restaurar tu sesión.</AppText>
      <View style={styles.buttonGroup}>
        <Button
          label="Reintentar"
          size='lg'
          variant="primary"
          onPress={retry}
        />
        <Button
          label="Volver al login"
          size='lg'
          variant="primary"
          onPress={handleGoToLogin}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.white,
    justifyContent: 'flex-start',
  },
  buttonGroup: {
    gap: spacing.sm,
  },
});
