import { View } from 'react-native';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';

export default function ErrorScreen({ retry }: { retry: () => void }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <AppText variant="h2">Algo salió mal</AppText>
      <AppText style={{ marginVertical: 12 }}>No pudimos restaurar tu sesión.</AppText>
      <Button 
        label="Reintentar" 
        size='lg'
        variant="primary"
        onPress={retry} />
    </View>
  );
}
