import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';

const LoadingSpinner = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bgDark,
    },
});

export default LoadingSpinner;
