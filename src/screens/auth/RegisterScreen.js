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
import { register as registerApi } from '../../api/authApi';

const RegisterScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        shopName: '',
        ownerName: '',
        email: '',
        password: '',
        phone: '',
        gstin: '',
        address: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.shopName.trim()) newErrors.shopName = 'Shop name is required';
        if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await registerApi(formData);

            Alert.alert(
                'Success',
                'Account created successfully! Please login.',
                [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
            );
        } catch (error) {
            console.error('Registration error:', error);

            let errorMessage = 'Registration failed. Please try again.';

            if (error.response) {
                errorMessage = error.response.data?.message || errorMessage;
            } else if (error.message) {
                errorMessage = error.message;
            }

            Alert.alert('Registration Failed', errorMessage);
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
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join Vyapix to manage your shop</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Shop Name *"
                        value={formData.shopName}
                        onChangeText={(value) => handleChange('shopName', value)}
                        placeholder="Enter shop name"
                        error={errors.shopName}
                    />

                    <Input
                        label="Owner Name *"
                        value={formData.ownerName}
                        onChangeText={(value) => handleChange('ownerName', value)}
                        placeholder="Enter owner name"
                        error={errors.ownerName}
                    />

                    <Input
                        label="Email *"
                        value={formData.email}
                        onChangeText={(value) => handleChange('email', value)}
                        placeholder="Enter email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={errors.email}
                    />

                    <Input
                        label="Password *"
                        value={formData.password}
                        onChangeText={(value) => handleChange('password', value)}
                        placeholder="Enter password"
                        secureTextEntry
                        error={errors.password}
                    />

                    <Input
                        label="Phone"
                        value={formData.phone}
                        onChangeText={(value) => handleChange('phone', value)}
                        placeholder="Enter phone number"
                        keyboardType="phone-pad"
                    />

                    <Input
                        label="GSTIN"
                        value={formData.gstin}
                        onChangeText={(value) => handleChange('gstin', value)}
                        placeholder="Enter GSTIN (optional)"
                        autoCapitalize="characters"
                    />

                    <Input
                        label="Address"
                        value={formData.address}
                        onChangeText={(value) => handleChange('address', value)}
                        placeholder="Enter address (optional)"
                    />

                    <Button
                        title="Create Account"
                        onPress={handleRegister}
                        loading={loading}
                        style={styles.registerButton}
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Already have an account?{' '}
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.linkText}>Sign In</Text>
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
        padding: 24,
        paddingTop: 48,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    form: {
        marginBottom: 24,
    },
    registerButton: {
        marginTop: 8,
    },
    footer: {
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 32,
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

export default RegisterScreen;
