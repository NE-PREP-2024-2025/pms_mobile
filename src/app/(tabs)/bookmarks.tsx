import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useVehicleStore } from '@/store/vehicleStore';
import { colors } from '@/constants/colors';
import VehicleCard from '@/components/VehicleCard';
import EmptyState from '@/components/EmptyState';
import { Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function BookmarksScreen() {
  const router = useRouter();
  const { vehicles, bookmarkedVehicles } = useVehicleStore();
  
  // Filter vehicles to only show bookmarked ones
  const bookmarkedVehiclesList = vehicles.filter(vehicle => 
    bookmarkedVehicles.includes(vehicle.id)
  );

  const navigateToBrowse = () => {
    router.navigate('/');
  };

  const renderEmptyState = () => (
    <EmptyState
      icon={<Heart size={50} color={colors.text.light} />}
      title="No bookmarks yet"
      message="Save your favorite vehicles for quick access later."
      buttonTitle="Browse Vehicles"
      onButtonPress={navigateToBrowse}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarkedVehiclesList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VehicleCard vehicle={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
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
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
});