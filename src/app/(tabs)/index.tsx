import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text } from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';
import { useVehicleStore } from '@/store/vehicleStore';
import { colors } from '@/constants/colors';
import VehicleCard from '@/components/VehicleCard';
import SearchBar from '@/components/SearchBar';
import FilterModal from '@/components/FilterModal';
import EmptyState from '@/components/EmptyState';
import { Car } from 'lucide-react-native';
import { FilterOptions } from '@/types';

export default function BrowseScreen() {
  const { 
    filteredVehicles, 
    searchQuery, 
    setSearchQuery, 
    filterOptions,
    setFilterOptions,
    resetFilters
  } = useVehicleStore();
  
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilterOptions(newFilters);
  };

  const renderEmptyState = () => (
    <EmptyState
      icon={<Car size={50} color={colors.text.light} />}
      title="No vehicles found"
      message="Try adjusting your search or filters to find what you're looking for."
      buttonTitle="Reset Filters"
      onButtonPress={resetFilters}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClearSearch}
          placeholder="Search by name or type..."
        />
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setIsFilterModalVisible(true)}
        >
          <SlidersHorizontal size={20} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {Object.keys(filterOptions).length > 0 && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersText}>
            Active filters: {Object.keys(filterOptions).filter(key => {
              const keyTyped = key as keyof FilterOptions;
              return filterOptions[keyTyped] !== null && filterOptions[keyTyped] !== undefined;
            }).length}
          </Text>
          <TouchableOpacity onPress={resetFilters}>
            <Text style={styles.clearFiltersText}>Clear all</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredVehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VehicleCard vehicle={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      <FilterModal
        isVisible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        currentFilters={filterOptions}
        onApplyFilters={handleApplyFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.card,
    borderRadius: 10,
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  activeFiltersText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  clearFiltersText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
});