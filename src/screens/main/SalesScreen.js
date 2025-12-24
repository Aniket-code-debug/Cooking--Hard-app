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
    Pressable,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import Card from '../../components/common/Card';
import FAB from '../../components/common/FAB';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { getAllSales, createSale } from '../../api/saleApi';
import { getAllInventory } from '../../api/inventoryApi';

const SalesScreen = () => {
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState({
        productId: '',
        quantity: '',
        customerName: '',
        customerPhone: '',
        paymentMode: 'CASH', // Add payment mode
    });
    const [formErrors, setFormErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [salesData, productsData] = await Promise.all([
                getAllSales(),
                getAllInventory(),
            ]);
            setSales(salesData);
            setProducts(productsData);
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Failed to load data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const handleAdd = () => {
        setFormData({
            productId: '',
            quantity: '',
            customerName: '',
            customerPhone: '',
            paymentMode: 'CASH',
        });
        setFormErrors({});
        setModalVisible(true);
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.productId) errors.productId = 'Product is required';
        if (!formData.quantity.trim()) errors.quantity = 'Quantity is required';
        if (isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0) {
            errors.quantity = 'Must be a positive number';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setSaving(true);
        try {
            const selectedProduct = products.find(p => p._id === formData.productId);
            const quantity = Number(formData.quantity);
            const rate = selectedProduct?.sellingPrice || 0;
            const amount = quantity * rate;

            const payload = {
                items: [{
                    product: formData.productId,
                    quantity,
                    rate,
                    amount,
                }],
                totalAmount: amount,
                paymentMode: formData.paymentMode,
                customerName: formData.customerName.trim() || undefined,
            };

            console.log('Creating sale with payload:', JSON.stringify(payload, null, 2));
            await createSale(payload);
            fetchData(); // Refresh all data
            Alert.alert('Success', 'Sale recorded successfully');
            setModalVisible(false);
        } catch (error) {
            console.error('Save error:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to save sale';
            Alert.alert('Error', errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const renderItem = ({ item }) => {
        const date = new Date(item.date).toLocaleDateString();

        return (
            <Card>
                <View style={styles.saleHeader}>
                    <View style={styles.saleInfo}>
                        <Text style={styles.saleDate}>{date}</Text>
                        {item.customerName && (
                            <Text style={styles.customer}>👤 {item.customerName}</Text>
                        )}
                    </View>
                    <Text style={styles.totalAmount}>₹{item.totalAmount}</Text>
                </View>

                {item.items && item.items.length > 0 && (
                    <View style={styles.items}>
                        {item.items.map((product, index) => (
                            <Text key={index} style={styles.itemDetail}>
                                📦 {product.product?.name || 'Product'} × {product.quantity} @ ₹{product.rate}
                            </Text>
                        ))}
                    </View>
                )}

                {item.customerPhone && (
                    <Text style={styles.phone}>📞 {item.customerPhone}</Text>
                )}
            </Card>
        );
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Sales</Text>
                <Text style={styles.subtitle}>{sales.length} sales</Text>
            </View>

            {sales.length === 0 ? (
                <EmptyState
                    icon="💰"
                    title="No Sales Yet"
                    message="Tap the + button to record your first sale"
                />
            ) : (
                <FlatList
                    data={sales}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                    }
                />
            )}

            <FAB onPress={handleAdd} icon="+" />

            {/* Add Sale Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>Record Sale</Text>

                            <Text style={styles.fieldLabel}>Product *</Text>
                            <ScrollView horizontal style={styles.optionsScroll}>
                                {products.map(product => (
                                    <Pressable
                                        key={product._id}
                                        style={[styles.optionChip, formData.productId === product._id && styles.optionChipSelected]}
                                        onPress={() => setFormData({ ...formData, productId: product._id })}
                                    >
                                        <Text style={[styles.optionText, formData.productId === product._id && styles.optionTextSelected]}>
                                            {product.name}
                                        </Text>
                                        <Text style={[styles.optionPrice, formData.productId === product._id && styles.optionTextSelected]}>
                                            ₹{product.sellingPrice || 0}
                                        </Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                            {formErrors.productId && <Text style={styles.errorText}>{formErrors.productId}</Text>}

                            <Text style={styles.fieldLabel}>Payment Mode *</Text>
                            <ScrollView horizontal style={styles.optionsScroll}>
                                {['CASH', 'ONLINE', 'UPI', 'CARD'].map(mode => (
                                    <Pressable
                                        key={mode}
                                        style={[styles.optionChip, formData.paymentMode === mode && styles.optionChipSelected]}
                                        onPress={() => setFormData({ ...formData, paymentMode: mode })}
                                    >
                                        <Text style={[styles.optionText, formData.paymentMode === mode && styles.optionTextSelected]}>
                                            {mode}
                                        </Text>
                                    </Pressable>
                                ))}
                            </ScrollView>

                            <Input
                                label="Quantity *"
                                value={formData.quantity}
                                onChangeText={(value) => setFormData({ ...formData, quantity: value })}
                                placeholder="Enter quantity"
                                keyboardType="numeric"
                                error={formErrors.quantity}
                            />

                            <Input
                                label="Customer Name (Optional)"
                                value={formData.customerName}
                                onChangeText={(value) => setFormData({ ...formData, customerName: value })}
                                placeholder="Enter customer name"
                            />

                            <Input
                                label="Customer Phone (Optional)"
                                value={formData.customerPhone}
                                onChangeText={(value) => setFormData({ ...formData, customerPhone: value })}
                                placeholder="Enter phone number"
                                keyboardType="phone-pad"
                            />

                            {formData.quantity && formData.productId && (
                                <View style={styles.totalBox}>
                                    <Text style={styles.totalLabel}>Total Amount:</Text>
                                    <Text style={styles.totalValue}>
                                        ₹{(Number(formData.quantity) * (products.find(p => p._id === formData.productId)?.sellingPrice || 0)).toFixed(2)}
                                    </Text>
                                </View>
                            )}

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
    saleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    saleInfo: {
        flex: 1,
    },
    saleDate: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    customer: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.success,
    },
    items: {
        marginTop: 8,
    },
    itemDetail: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 4,
    },
    phone: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 8,
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
    fieldLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.text,
        marginBottom: 8,
        marginTop: 8,
    },
    optionsScroll: {
        marginBottom: 16,
    },
    optionChip: {
        backgroundColor: COLORS.surfaceElevated,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    optionChipSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    optionText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    optionPrice: {
        color: COLORS.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
    optionTextSelected: {
        color: COLORS.white,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 12,
        marginTop: -12,
        marginBottom: 8,
    },
    totalBox: {
        backgroundColor: COLORS.surfaceElevated,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.success,
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

export default SalesScreen;
