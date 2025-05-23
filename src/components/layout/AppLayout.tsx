import { View, StyleSheet } from 'react-native';
import HeaderFirstLevel from '../header/HeaderFirstLevel';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../../app/navigation/BottomNav'; // 🔁 componente real de navegación

export default function AppLayout({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <HeaderFirstLevel title={title} />
        <View style={styles.content}>{children}</View>
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' }, // fondo para evitar flicker
  container: { flex: 1 },
  content: { flex: 1}, // espacio para BottomNav
});
