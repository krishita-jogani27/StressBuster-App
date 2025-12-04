// Resource Hub Screen
// Educational resources with videos, PDFs, and audio
// Author: StressBuster Team

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import colors from '../constants/colors';
import { resourceAPI } from '../services/api';

const ResourceHubScreen = () => {
    const [resources, setResources] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
        loadResources();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await resourceAPI.getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const loadResources = async (categoryId = null) => {
        setLoading(true);
        try {
            const filters = categoryId ? { category: categoryId } : {};
            const response = await resourceAPI.getResources(filters);
            setResources(response.data);
        } catch (error) {
            console.error('Error loading resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const selectCategory = (categoryId) => {
        setSelectedCategory(categoryId);
        loadResources(categoryId);
    };

    const getResourceIcon = (type) => {
        switch (type) {
            case 'video': return 'play-circle';
            case 'audio': return 'musical-notes';
            case 'pdf': return 'document-text';
            case 'article': return 'newspaper';
            default: return 'document';
        }
    };

    const renderResource = ({ item }) => (
        <Card style={styles.resourceCard}>
            <View style={styles.resourceHeader}>
                <Icon name={getResourceIcon(item.resource_type)} size={32} color={colors.primary} />
                <View style={styles.resourceInfo}>
                    <Text style={styles.resourceTitle}>{item.title}</Text>
                    <Text style={styles.resourceCategory}>{item.category_name}</Text>
                </View>
            </View>
            <Text style={styles.resourceDescription} numberOfLines={2}>
                {item.description}
            </Text>
            <View style={styles.resourceFooter}>
                <View style={styles.resourceMeta}>
                    <Icon name="eye-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.metaText}>{item.view_count} views</Text>
                </View>
                <Text style={styles.resourceType}>{item.resource_type.toUpperCase()}</Text>
            </View>
        </Card>
    );

    if (loading && resources.length === 0) {
        return <Loading message="Loading resources..." />;
    }

    return (
        <View style={styles.container}>
            {/* Category Filter */}
            <View style={styles.categoriesContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={[{ id: null, name: 'All' }, ...categories]}
                    keyExtractor={item => item.id?.toString() || 'all'}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.categoryChip,
                                selectedCategory === item.id && styles.selectedChip
                            ]}
                            onPress={() => selectCategory(item.id)}
                        >
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === item.id && styles.selectedChipText
                            ]}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Resources List */}
            <FlatList
                data={resources}
                renderItem={renderResource}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.resourcesList}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No resources found</Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    categoriesContainer: {
        backgroundColor: colors.surface,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colors.background,
        marginHorizontal: 6,
    },
    selectedChip: {
        backgroundColor: colors.primary,
    },
    categoryText: {
        fontSize: 14,
        color: colors.text,
    },
    selectedChipText: {
        color: colors.textInverse,
        fontWeight: '600',
    },
    resourcesList: {
        padding: 16,
    },
    resourceCard: {
        marginBottom: 12,
    },
    resourceHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    resourceInfo: {
        flex: 1,
        marginLeft: 12,
    },
    resourceTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    resourceCategory: {
        fontSize: 13,
        color: colors.primary,
    },
    resourceDescription: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
        marginBottom: 12,
    },
    resourceFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    resourceMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 13,
        color: colors.textSecondary,
        marginLeft: 4,
    },
    resourceType: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.accent,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 40,
    },
});

export default ResourceHubScreen;
