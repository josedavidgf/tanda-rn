import { View, StyleSheet } from 'react-native';
import HeaderSecondLevel from '../header/HeaderSecondLevel';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SimpleLayout({ title, showBackButton = true, children }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <HeaderSecondLevel title={title} showBackButton={showBackButton} />
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
