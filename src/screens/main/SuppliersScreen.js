import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    Alert,
    Modal,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import Card from '../../components/common/Card';
import FAB from '../../components/common/FAB';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { getAllSuppliers, createSupplier } from '../../api/supplierApi';

const SuppliersScreen = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        gstin: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const data = await getAllSuppliers();
            setSuppliers(data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            Alert.alert('Error', 'Failed to load suppliers');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchSuppliers();
    };

    const handleAdd = () => {
        setFormData({
            name: '',
            contactPerson: '',
            phone: '',
            email: '',
            address: '',
            gstin: '',
        });
        setFormErrors({});
        setModalVisible(true);
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Supplier name is required';
        if (formData.phone && !/^\d{10}$/.test(formData.phone.trim())) {
            errors.phone = 'Phone must be 10 digits';
        }
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Invalid email format';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setSaving(true);
        try {
            const payload = {
                name: formData.name.trim(),
                contactPerson: formData.contactPerson.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim(),
                address: formData.address.trim(),
                gstin: formData.gstin.trim(),
            };

            const created = await createSupplier(payload);
            setSuppliers([created, ...suppliers]);
            Alert.alert('Success', 'Supplier added successfully');
            setModalVisible(false);
        } catch (error) {
            console.error('Save error:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to save supplier');
        } finally {
            setSaving(false);
        }
    };

    const renderItem = ({ item }) => (
        <Card>
            <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.currentBalance !== undefined && (
                    <Text style={[
                        styles.balance,
                        item.currentBalance > 0 ? styles.balanceDue : styles.balancePaid
                    ]}>
                        ₹{Math.abs(item.currentBalance || 0)}
                        {item.currentBalance > 0 ? ' Due' : ' Paid'}
                    </Text>
                )}
            </View>

            {item.contactPerson && (
                <Text style={styles.itemDetail}>👤 {item.contactPerson}</Text>
            )}
            {item.phone && (
                <Text style={styles.itemDetail}>📞 {item.phone}</Text>
            )}
            {item.email && (
                <Text style={styles.itemDetail}>✉️ {item.email}</Text>
            )}
            {item.address && (
                <Text style={styles.itemDetail}>📍 {item.address}</Text>
            )}
        </Card>
    );

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Suppliers</Text>
                <Text style={styles.subtitle}>{suppliers.length} suppliers</Text>
            </View>

            {suppliers.length === 0 ? (
                <EmptyState
                    icon="🏭"
                    title="No Suppliers Yet"
                    message="Tap the + button to add your first supplier"
                />
            ) : (
                <FlatList
                    data={suppliers}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                    }
                />
            )}

            <FAB onPress={handleAdd} icon="+" />

            {/* Add Supplier Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>Add Supplier</Text>

                            <Input
                                label="Supplier Name *"
                                value={formData.name}
                                onChangeText={(value) => setFormData({ ...formData, name: value })}
                                placeholder="Enter supplier name"
                                error={formErrors.name}
                            />

                            <Input
                                label="Contact Person"
                                value={formData.contactPerson}
                                onChangeText={(value) => setFormData({ ...formData, contactPerson: value })}
                                placeholder="Enter contact person name"
                            />

                            <Input
                                label="Phone"
                                value={formData.phone}
                                onChangeText={(value) => setFormData({ ...formData, phone: value })}
                                placeholder="10-digit phone number"
                                keyboardType="phone-pad"
                                error={formErrors.phone}
                            />

                            <Input
                                label="Email"
                                value={formData.email}
                                onChangeText={(value) => setFormData({ ...formData, email: value })}
                                placeholder="Enter email address"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                error={formErrors.email}
                            />

                            <Input
                                label="Address"
                                value={formData.address}
                                onChangeText={(value) => setFormData({ ...formData, address: value })}
                                placeholder="Enter supplier address"
                            />

                            <Input
                                label="GSTIN"
                                value={formData.gstin}
                                onChangeText={(value) => setFormData({ ...formData, gstin: value })}
                                placeholder="Enter GSTIN (optional)"
                                autoCapitalize="characters"
                            />

                            <View style={styles.modalButtons}>
                                <Button
                                    title="Cancel"
                                    onPress={() => setModalVisible(false)}
                                    variant="secondary"
                                    style={styles.modalButton}
                                />
                                <Button
                                    title="Save"
                                    onPress={handleSave}
                                    loading={saving}
                                    style={styles.modalButton}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgDark,
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: COLORS.surfaceDark,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    list: {
        padding: 16,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemName: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        flex: 1,
    },
    balance: {
        fontSize: 14,
        fontWeight: '600',
    },
    balanceDue: {
        color: COLORS.error,
    },
    balancePaid: {
        color: COLORS.success,
    },
    itemDetail: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.surfaceDark,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '90%',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
        marginBottom: 20,
    },
    modalButton: {
        flex: 1,
    },
});

export default SuppliersScreen;
