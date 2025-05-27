import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { X, SlidersHorizontal } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Button from './Button';
import { FilterOptions, FuelType, VehicleType } from '@/types';
import { fuelTypes, locations, vehicleTypes } from '@/mocks/vehicles';

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  currentFilters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
}

export default function FilterModal({
  isVisible,
  onClose,
  currentFilters,
  onApplyFilters
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(currentFilters);

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters, isVisible]);

  const handleReset = () => {
    setLocalFilters({});
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const selectVehicleType = (type: VehicleType | null) => {
    setLocalFilters(prev => ({
      ...prev,
      vehicleType: prev.vehicleType === type ? null : type
    }));
  };

  const selectFuelType = (type: FuelType | null) => {
    setLocalFilters(prev => ({
      ...prev,
      fuelType: prev.fuelType === type ? null : type
    }));
  };

  const selectLocation = (location: string | null) => {
    setLocalFilters(prev => ({
      ...prev,
      location: prev.location === location ? null : location
    }));
  };

  const selectSeating = (capacity: number | null) => {
    setLocalFilters(prev => ({
      ...prev,
      seatingCapacity: prev.seatingCapacity === capacity ? null : capacity
    }));
  };

  const selectSortOption = (sortBy: 'price' | 'rating' | 'availability' | null) => {
    setLocalFilters(prev => {
      // If selecting the same option, toggle sort order
      if (prev.sortBy === sortBy) {
        return {
          ...prev,
          sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
        };
      }
      // Otherwise, set new sort option with default ascending order
      return {
        ...prev,
        sortBy,
        sortOrder: 'asc'
      };
    });
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <SlidersHorizontal size={20} color={colors.text.primary} />
              <Text style={styles.headerTitle}>Filters</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Vehicle Type */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vehicle Type</Text>
              <View style={styles.optionsContainer}>
                {vehicleTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.optionButton,
                      localFilters.vehicleType === type && styles.selectedOption
                    ]}
                    onPress={() => selectVehicleType(type as VehicleType)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        localFilters.vehicleType === type && styles.selectedOptionText
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Fuel Type */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fuel Type</Text>
              <View style={styles.optionsContainer}>
                {fuelTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.optionButton,
                      localFilters.fuelType === type && styles.selectedOption
                    ]}
                    onPress={() => selectFuelType(type as FuelType)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        localFilters.fuelType === type && styles.selectedOptionText
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Seating Capacity */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Seating Capacity</Text>
              <View style={styles.optionsContainer}>
                {[2, 4, 5, 6].map((seats) => (
                  <TouchableOpacity
                    key={seats}
                    style={[
                      styles.optionButton,
                      localFilters.seatingCapacity === seats && styles.selectedOption
                    ]}
                    onPress={() => selectSeating(seats)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        localFilters.seatingCapacity === seats && styles.selectedOptionText
                      ]}
                    >
                      {seats}+ seats
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Location */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              <View style={styles.optionsContainer}>
                {locations.map((location) => (
                  <TouchableOpacity
                    key={location}
                    style={[
                      styles.optionButton,
                      localFilters.location === location && styles.selectedOption
                    ]}
                    onPress={() => selectLocation(location)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        localFilters.location === location && styles.selectedOptionText
                      ]}
                    >
                      {location}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort By */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    localFilters.sortBy === 'price' && styles.selectedOption
                  ]}
                  onPress={() => selectSortOption('price')}
                >
                  <Text
                    style={[
                      styles.optionText,
                      localFilters.sortBy === 'price' && styles.selectedOptionText
                    ]}
                  >
                    Price {localFilters.sortBy === 'price' && (localFilters.sortOrder === 'asc' ? '↑' : '↓')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    localFilters.sortBy === 'rating' && styles.selectedOption
                  ]}
                  onPress={() => selectSortOption('rating')}
                >
                  <Text
                    style={[
                      styles.optionText,
                      localFilters.sortBy === 'rating' && styles.selectedOptionText
                    ]}
                  >
                    Rating {localFilters.sortBy === 'rating' && (localFilters.sortOrder === 'asc' ? '↑' : '↓')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    localFilters.sortBy === 'availability' && styles.selectedOption
                  ]}
                  onPress={() => selectSortOption('availability')}
                >
                  <Text
                    style={[
                      styles.optionText,
                      localFilters.sortBy === 'availability' && styles.selectedOptionText
                    ]}
                  >
                    Availability {localFilters.sortBy === 'availability' && (localFilters.sortOrder === 'asc' ? '↑' : '↓')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.resetButtonContainer}>
              <Button
                title="Reset"
                onPress={handleReset}
                variant="outline"
                size="medium"
                fullWidth={false}
              />
            </View>
            <View style={styles.applyButtonContainer}>
              <Button
                title="Apply Filters"
                onPress={handleApply}
                variant="primary"
                size="medium"
                fullWidth={false}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: colors.text.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text.primary,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  resetButtonContainer: {
    flex: 1,
    marginRight: 10,
  },
  applyButtonContainer: {
    flex: 2,
  },
});