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
import { getAllInventory, createInventory, quickAdjustStock } from '../../api/inventoryApi';

const InventoryScreen = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        unit: 'pcs',
        minStockLevel: '',
        sellingPrice: '',
        costPrice: '',
        initialStock: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const data = await getAllInventory();
            setInventory(data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
            Alert.alert('Error', 'Failed to load inventory');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchInventory();
    };

    const handleAdd = () => {
        setFormData({
            name: '',
            category: '',
            unit: 'pcs',
            minStockLevel: '',
            sellingPrice: '',
            costPrice: '',
            initialStock: '',
        });
        setFormErrors({});
        setModalVisible(true);
    };

    const handleStockAdjust = async (item, change) => {
        try {
            await quickAdjustStock(item._id, change);
            // Update local state
            setInventory(inventory.map(i =>
                i._id === item._id
                    ? { ...i, totalStock: (i.totalStock || 0) + change }
                    : i
            ));
            Alert.alert('Success', `Stock ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change)}`);
        } catch (error) {
            console.error('Stock adjust error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to adjust stock');
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Name is required';
        if (!formData.unit.trim()) errors.unit = 'Unit is required';
        if (formData.minStockLevel && isNaN(Number(formData.minStockLevel))) {
            errors.minStockLevel = 'Must be a number';
        }
        if (formData.sellingPrice && isNaN(Number(formData.sellingPrice))) {
            errors.sellingPrice = 'Must be a number';
        }
        if (formData.costPrice && isNaN(Number(formData.costPrice))) {
            errors.costPrice = 'Must be a number';
        }
        if (formData.initialStock && isNaN(Number(formData.initialStock))) {
            errors.initialStock = 'Must be a number';
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
                category: formData.category.trim() || 'General',
                unit: formData.unit.trim(),
                minStockLevel: formData.minStockLevel ? Number(formData.minStockLevel) : 0,
                sellingPrice: formData.sellingPrice ? Number(formData.sellingPrice) : 0,
                costPrice: formData.costPrice ? Number(formData.costPrice) : 0,
                initialStock: formData.initialStock ? Number(formData.initialStock) : 0,
            };

            const created = await createInventory(payload);
            // Refresh list to get latest data
            fetchInventory();
            Alert.alert('Success', 'Product added successfully');
            setModalVisible(false);
        } catch (error) {
            console.error('Save error:', error);
            Alert.alert('Error', error.response?.data?.error || error.response?.data?.message || 'Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    const renderItem = ({ item }) => (
        <Card>
            <View style={styles.itemHeader}>
                <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemCategory}>{item.category || 'General'}</Text>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.itemPrice}>₹{item.sellingPrice || 0}</Text>
                </View>
            </View>

            <View style={styles.stockRow}>
                <View style={styles.stockInfo}>
                    <Text style={styles.stockLabel}>Stock:</Text>
                    <Text style={[
                        styles.stockValue,
                        (item.totalStock || 0) <= (item.minStockLevel || 0) && styles.lowStock
                    ]}>
                        {item.totalStock || 0} {item.unit || 'pcs'}
                    </Text>
                </View>

                <View style={styles.adjustButtons}>
                    <Pressable
                        style={[styles.adjustButton, styles.decreaseButton]}
                        onPress={() => handleStockAdjust(item, -1)}
                    >
                        <Text style={styles.adjustButtonText}>-</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.adjustButton, styles.increaseButton]}
                        onPress={() => handleStockAdjust(item, +1)}
                    >
                        <Text style={styles.adjustButtonText}>+</Text>
                    </Pressable>
                </View>
            </View>

            {(item.totalStock || 0) <= (item.minStockLevel || 0) && (
                <Text style={styles.lowStockWarning}>⚠️ Low Stock Alert</Text>
            )}
        </Card>
    );

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Inventory</Text>
                <Text style={styles.subtitle}>{inventory.length} products</Text>
            </View>

            {inventory.length === 0 ? (
                <EmptyState
                    icon="📦"
                    title="No Products Yet"
                    message="Tap the + button to add your first product"
                />
            ) : (
                <FlatList
                    data={inventory}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                    }
                />
            )}

            <FAB onPress={handleAdd} icon="+" />

            {/* Add Product Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>Add Product</Text>

                            <Input
                                label="Product Name *"
                                value={formData.name}
                                onChangeText={(value) => setFormData({ ...formData, name: value })}
                                placeholder="Enter product name"
                                error={formErrors.name}
                            />

                            <Input
                                label="Category"
                                value={formData.category}
                                onChangeText={(value) => setFormData({ ...formData, category: value })}
                                placeholder="e.g., Vegetables, Dairy, etc."
                            />

                            <Input
                                label="Unit *"
                                value={formData.unit}
                                onChangeText={(value) => setFormData({ ...formData, unit: value })}
                                placeholder="e.g., kg, pcs, ltr"
                                error={formErrors.unit}
                            />

                            <Input
                                label="Selling Price"
                                value={formData.sellingPrice}
                                onChangeText={(value) => setFormData({ ...formData, sellingPrice: value })}
                                placeholder="Enter selling price"
                                keyboardType="numeric"
                                error={formErrors.sellingPrice}
                            />

                            <Input
                                label="Cost Price"
                                value={formData.costPrice}
                                onChangeText={(value) => setFormData({ ...formData, costPrice: value })}
                                placeholder="Enter cost price"
                                keyboardType="numeric"
                                error={formErrors.costPrice}
                            />

                            <Input
                                label="Initial Stock"
                                value={formData.initialStock}
                                onChangeText={(value) => setFormData({ ...formData, initialStock: value })}
                                placeholder="Starting quantity"
                                keyboardType="numeric"
                                error={formErrors.initialStock}
                            />

                            <Input
                                label="Min Stock Level"
                                value={formData.minStockLevel}
                                onChangeText={(value) => setFormData({ ...formData, minStockLevel: value })}
                                placeholder="Alert when stock falls below"
                                keyboardType="numeric"
                                error={formErrors.minStockLevel}
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
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 4,
    },
    itemCategory: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    itemPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    stockRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    stockInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stockLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginRight: 8,
    },
    stockValue: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    lowStock: {
        color: COLORS.error,
    },
    adjustButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    adjustButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    decreaseButton: {
        backgroundColor: COLORS.error,
    },
    increaseButton: {
        backgroundColor: COLORS.success,
    },
    adjustButtonText: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    lowStockWarning: {
        fontSize: 12,
        color: COLORS.error,
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

export default InventoryScreen;
