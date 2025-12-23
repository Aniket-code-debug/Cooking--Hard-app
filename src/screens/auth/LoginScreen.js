import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { login as loginApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { login } = useAuth();

    const validateForm = () => {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const response = await loginApi(email.trim(), password);

            // Store auth data
            await login(response.user, response.token);

            // Navigation will happen automatically via AuthContext
        } catch (error) {
            console.error('Login error:', error);

            let errorMessage = 'Login failed. Please try again.';

            if (error.response) {
                // Server responded with error
                errorMessage = error.response.data?.message || errorMessage;
            } else if (error.message) {
                errorMessage = error.message;
            }

            Alert.alert('Login Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Vyapix</Text>
                    <Text style={styles.subtitle}>Sign in to manage your shop</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={errors.email}
                    />

                    <Input
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
                        secureTextEntry
                        error={errors.password}
                    />

                    <Button
                        title="Sign In"
                        onPress={handleLogin}
                        loading={loading}
                        style={styles.loginButton}
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Don't have an account?{' '}
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.linkText}>Register</Text>
                        </TouchableOpacity>
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgDark,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    form: {
        marginBottom: 24,
    },
    loginButton: {
        marginTop: 8,
    },
    footer: {
        alignItems: 'center',
        marginTop: 16,
    },
    footerText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    linkText: {
        color: COLORS.primary,
        fontWeight: '600',
        marginTop: 2,
    },
});

export default LoginScreen;
