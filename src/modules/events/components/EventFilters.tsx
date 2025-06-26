import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Colors from '../../../constants/Colors';

interface EventFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all', name: 'Todos', icon: 'grid-outline' },
    { id: 'cardiology', name: 'Cardiología', icon: 'heart-outline' },
    { id: 'neurology', name: 'Neurología', icon: 'pulse-outline' },
    { id: 'pediatrics', name: 'Pediatría', icon: 'happy-outline' },
    { id: 'oncology', name: 'Oncología', icon: 'medical-outline' },
  ];

  const renderCategory = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.activeCategoryButton
      ]}
      onPress={() => onCategoryChange(item.id)}
    >
      <Ionicons 
        name={item.icon} 
        size={20} 
        color={selectedCategory === item.id ? Colors.textLight : Colors.textSecondary} 
      />
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.activeCategoryText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoriesList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    gap: 6,
  },
  activeCategoryButton: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: Colors.textLight,
  },
});

export default EventFilters;
