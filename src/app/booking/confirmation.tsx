import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { useVehicleStore } from '@/store/vehicleStore';

export default function BookingConfirmationScreen() {
  const router = useRouter();
  const { bookings, vehicles } = useVehicleStore();
  
  // Get the most recent booking
  const latestBooking = bookings.length > 0 ? bookings[0] : null;
  const vehicle = latestBooking 
    ? vehicles.find(v => v.id === latestBooking.vehicleId) 
    : null;

  const handleViewBookings = () => {
    router.push('/history');
  };

  const handleContinueBrowsing = () => {
    router.push('/');
  };

  if (!latestBooking || !vehicle) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Booking information not found</Text>
        <Button
          title="Go to Home"
          onPress={() => router.push('/')}
          variant="primary"
        />
      </View>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <CheckCircle size={60} color={colors.success} />
        </View>
        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>Your vehicle has been successfully booked.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Booking Details</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Booking ID</Text>
          <Text style={styles.detailValue}>#{latestBooking.id.slice(0, 8)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Vehicle</Text>
          <Text style={styles.detailValue}>{vehicle.name}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Start Date</Text>
          <Text style={styles.detailValue}>{formatDate(latestBooking.startTime)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Start Time</Text>
          <Text style={styles.detailValue}>{formatTime(latestBooking.startTime)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>End Date</Text>
          <Text style={styles.detailValue}>{formatDate(latestBooking.endTime)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>End Time</Text>
          <Text style={styles.detailValue}>{formatTime(latestBooking.endTime)}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>${latestBooking.totalCost.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>What's Next?</Text>
        <Text style={styles.instructionsText}>
          You will receive a confirmation email with all the details of your booking.
          Please arrive at the pickup location 15 minutes before your scheduled time.
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          title="View My Bookings"
          onPress={handleViewBookings}
          variant="primary"
          size="large"
          fullWidth
        />
        <View style={styles.buttonSpacer} />
        <Button
          title="Continue Browsing"
          onPress={handleContinueBrowsing}
          variant="outline"
          size="large"
          fullWidth
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.text.primary,
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(72, 187, 120, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  instructionsContainer: {
    marginBottom: 30,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.text.secondary,
  },
  buttonsContainer: {
    marginBottom: 20,
  },
  buttonSpacer: {
    height: 12,
  },
});