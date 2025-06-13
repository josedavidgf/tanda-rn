import { View, StyleSheet } from 'react-native';
import HeaderSecondLevel from '../header/HeaderSecondLevel';
import { SafeAreaView } from 'react-native-safe-area-context';

type SimpleLayoutProps = {
  title?: string;
  showBackButton?: boolean;
  rightAction?: {
    label: string;
    icon?: React.ReactNode;
    onPress: () => void;
  };
  onBack?: () => void;
  children: React.ReactNode;
};

export default function SimpleLayout({
  title,
  showBackButton = true,
  rightAction,
  children,
}: SimpleLayoutProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <HeaderSecondLevel
          title={title}
          showBackButton={showBackButton}
          rightAction={rightAction} // 👈 aquí lo pasamos
        />
        <View style={styles.content}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' }, // fondo para evitar flicker
  container: { flex: 1 },
  content: { flex: 1 },
});
