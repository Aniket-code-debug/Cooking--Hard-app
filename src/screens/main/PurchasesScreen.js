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
import { getAllPurchases, createPurchase } from '../../api/purchaseApi';
import { getAllSuppliers } from '../../api/supplierApi';
import { getAllInventory } from '../../api/inventoryApi';

const PurchasesScreen = () => {
    const [purchases, setPurchases] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState({
        supplierId: '',
        productId: '',
        quantity: '',
        rate: '',
        invoiceNumber: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [purchasesData, suppliersData, productsData] = await Promise.all([
                getAllPurchases(),
                getAllSuppliers(),
                getAllInventory(),
            ]);
            setPurchases(purchasesData);
            setSuppliers(suppliersData);
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
            supplierId: '',
            productId: '',
            quantity: '',
            rate: '',
            invoiceNumber: '',
        });
        setFormErrors({});
        setModalVisible(true);
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.productId) errors.productId = 'Product is required';
        if (!formData.quantity.trim()) errors.quantity = 'Quantity is required';
        if (isNaN(Number(formData.quantity))) errors.quantity = 'Must be a number';
        if (!formData.rate.trim()) errors.rate = 'Rate is required';
        if (isNaN(Number(formData.rate))) errors.rate = 'Must be a number';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setSaving(true);
        try {
            const selectedProduct = products.find(p => p._id === formData.productId);
            const quantity = Number(formData.quantity);
            const rate = Number(formData.rate);
            const amount = quantity * rate;

            const payload = {
                supplier: formData.supplierId || null,
                invoiceNumber: formData.invoiceNumber.trim() || `INV-${Date.now()}`,
                items: [{
                    product: formData.productId,
                    quantity,
                    rate,
                    amount,
                }],
                totalAmount: amount,
                date: new Date().toISOString(),
            };

            await createPurchase(payload);
            fetchData(); // Refresh all data
            Alert.alert('Success', 'Purchase recorded successfully');
            setModalVisible(false);
        } catch (error) {
            console.error('Save error:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to save purchase');
        } finally {
            setSaving(false);
        }
    };

    const renderItem = ({ item }) => {
        const date = new Date(item.date).toLocaleDateString();
        const supplierName = item.supplier?.name || 'Direct Purchase';

        return (
            <Card>
                <View style={styles.purchaseHeader}>
                    <View style={styles.purchaseInfo}>
                        <Text style={styles.invoiceNumber}>#{item.invoiceNumber}</Text>
                        <Text style={styles.purchaseDate}>{date}</Text>
                    </View>
                    <Text style={styles.totalAmount}>₹{item.totalAmount}</Text>
                </View>

                <Text style={styles.supplier}>🏭 {supplierName}</Text>

                {item.items && item.items.length > 0 && (
                    <View style={styles.items}>
                        {item.items.map((product, index) => (
                            <Text key={index} style={styles.itemDetail}>
                                📦 {product.product?.name || 'Product'} × {product.quantity} @ ₹{product.rate}
                            </Text>
                        ))}
                    </View>
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
                <Text style={styles.title}>Purchases</Text>
                <Text style={styles.subtitle}>{purchases.length} purchases</Text>
            </View>

            {purchases.length === 0 ? (
                <EmptyState
                    icon="📦"
                    title="No Purchases Yet"
                    message="Tap the + button to record your first purchase"
                />
            ) : (
                <FlatList
                    data={purchases}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                    }
                />
            )}

            <FAB onPress={handleAdd} icon="+" />

            {/* Add Purchase Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>Record Purchase</Text>

                            <Text style={styles.fieldLabel}>Supplier (Optional)</Text>
                            <ScrollView horizontal style={styles.optionsScroll}>
                                <Pressable
                                    style={[styles.optionChip, !formData.supplierId && styles.optionChipSelected]}
                                    onPress={() => setFormData({ ...formData, supplierId: '' })}
                                >
                                    <Text style={[styles.optionText, !formData.supplierId && styles.optionTextSelected]}>
                                        Direct
                                    </Text>
                                </Pressable>
                                {suppliers.map(supplier => (
                                    <Pressable
                                        key={supplier._id}
                                        style={[styles.optionChip, formData.supplierId === supplier._id && styles.optionChipSelected]}
                                        onPress={() => setFormData({ ...formData, supplierId: supplier._id })}
                                    >
                                        <Text style={[styles.optionText, formData.supplierId === supplier._id && styles.optionTextSelected]}>
                                            {supplier.name}
                                        </Text>
                                    </Pressable>
                                ))}
                            </ScrollView>

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
                                    </Pressable>
                                ))}
                            </ScrollView>
                            {formErrors.productId && <Text style={styles.errorText}>{formErrors.productId}</Text>}

                            <Input
                                label="Quantity *"
                                value={formData.quantity}
                                onChangeText={(value) => setFormData({ ...formData, quantity: value })}
                                placeholder="Enter quantity"
                                keyboardType="numeric"
                                error={formErrors.quantity}
                            />

                            <Input
                                label="Rate (per unit) *"
                                value={formData.rate}
                                onChangeText={(value) => setFormData({ ...formData, rate: value })}
                                placeholder="Enter rate"
                                keyboardType="numeric"
                                error={formErrors.rate}
                            />

                            <Input
                                label="Invoice Number"
                                value={formData.invoiceNumber}
                                onChangeText={(value) => setFormData({ ...formData, invoiceNumber: value })}
                                placeholder="Auto-generated if empty"
                            />

                            {formData.quantity && formData.rate && (
                                <View style={styles.totalBox}>
                                    <Text style={styles.totalLabel}>Total Amount:</Text>
                                    <Text style={styles.totalValue}>
                                        ₹{(Number(formData.quantity) * Number(formData.rate)).toFixed(2)}
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
    purchaseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    purchaseInfo: {
        flex: 1,
    },
    invoiceNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 4,
    },
    purchaseDate: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    supplier: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    items: {
        marginTop: 8,
    },
    itemDetail: {
        fontSize: 14,
        color: COLORS.text,
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
        color: COLORS.primary,
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

export default PurchasesScreen;
