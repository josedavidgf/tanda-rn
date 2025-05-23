import Toast, { BaseToast, ToastConfig } from 'react-native-toast-message';
import { Text, View, StyleSheet } from 'react-native';

const toastConfig: ToastConfig = {
  custom: ({ text1 }) => (
    <View style={styles.toast}>
      <Text style={styles.text}>{text1}</Text>
    </View>
  ),
};

export const ToastProvider = () => <Toast config={toastConfig} />;

const styles = StyleSheet.create({
  toast: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    minWidth: 200,
    maxWidth: '90%',
    alignSelf: 'center',
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'HostGrotesk-Regular',
  },
});
