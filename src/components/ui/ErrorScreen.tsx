import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { spacing } from '@/styles';
import { useNavigation } from '@react-navigation/native';


export default function ErrorScreen({ retry }: { retry: () => void }) {
  const navigation = useNavigation();

  const handleGoToLogin = () => {
    console.log('[ERROR SCREEN] Redirigiendo a Login');
    navigation.reset({
      index: 0,
      routes: [{ name: 'AuthNavigator' as never }] // o 'Login' si tienes esa screen directamente
    });
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
          onPress={retry} />
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
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  buttonGroup: {
    gap: spacing.sm,
    width: '100%',
    marginTop: spacing.sm,
  },
});