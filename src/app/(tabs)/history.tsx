import React, { useMemo } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { useVehicleStore } from '@/store/vehicleStore';
import { colors } from '@/constants/colors';
import BookingCard from '@/components/BookingCard';
import EmptyState from '@/components/EmptyState';
import { Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Booking } from '@/types';

export default function HistoryScreen() {
  const router = useRouter();
  const { bookings, vehicles, cancelBooking } = useVehicleStore();
  
  // Sort bookings by date (newest first)
  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [bookings]);

  const navigateToBrowse = () => {
    router.navigate('/');
  };

  const handleCancelBooking = (bookingId: string) => {
    cancelBooking(bookingId);
  };

  const renderEmptyState = () => (
    <EmptyState
      icon={<Clock size={50} color={colors.text.light} />}
      title="No booking history"
      message="Your booking history will appear here once you book a vehicle."
      buttonTitle="Browse Vehicles"
      onButtonPress={navigateToBrowse}
    />
  );

  const getVehicleById = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId) || null;
  };

  const renderBookingItem = ({ item }: { item: Booking }) => {
    const vehicle = getVehicleById(item.vehicleId);
    if (!vehicle) return null;
    
    return (
      <BookingCard
        booking={item}
        vehicle={vehicle}
        onCancel={() => handleCancelBooking(item.id)}
        onPress={() => router.push(`/vehicle/${vehicle.id}`)}
      />
    );
  };

  return (
    <View style={styles.container}>
      {sortedBookings.length > 0 && (
        <Text style={styles.sectionTitle}>Your Booking History</Text>
      )}
      
      <FlatList
        data={sortedBookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBookingItem}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
});