import React from 'react';
import { View, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { spacing } from '@/styles';
import logo from '../../../assets/logo-tanda-light.png'; // ajusta path

export default function AppLoader() {
    return (
        <View style={styles.container}>
            <View style={{ flex: 1, backgroundColor: 'yellow' }} />

            {/* <Image source={require('../../../assets/logo-tanda-light.png')} style={styles.logo} resizeMode="contain" />
            <ActivityIndicator size="large" color="#111" style={styles.spinner} /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: spacing.md,
    },
    spinner: {
        marginTop: spacing.sm,
    },
});
