import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Heart, Star, MapPin, Users, Droplet, ArrowLeft, Share2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useVehicleStore } from '@/store/vehicleStore';
import BookingForm from '@/components/BookingForm';

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { vehicles, selectedVehicle, toggleBookmark, bookmarkedVehicles, createBooking } = useVehicleStore();
  
  // If no selected vehicle (e.g., direct navigation to URL), find it by ID
  const vehicle = selectedVehicle || vehicles.find(v => v.id === id);
  
  if (!vehicle) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Vehicle not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const isBookmarked = bookmarkedVehicles.includes(vehicle.id);

  const handleBookmarkPress = () => {
    toggleBookmark(vehicle.id);
  };

  const handleShare = () => {
    Alert.alert("Share", "Sharing functionality will be implemented in a future update.");
  };

  const handleBookingSubmit = (startTime: Date, endTime: Date, totalCost: number) => {
    createBooking({
      vehicleId: vehicle.id,
      userId: '1', // In a real app, this would be the current user's ID
      startTime,
      endTime,
      totalCost,
      status: 'confirmed'
    });
    
    router.push('/booking/confirmation');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: vehicle.image }}
          style={styles.image}
          contentFit="cover"
        />
        <View style={styles.imageOverlay}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.rightButtons}>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={handleShare}
            >
              <Share2 size={20} color={colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={handleBookmarkPress}
            >
              <Heart 
                size={20} 
                color={isBookmarked ? colors.error : colors.text.primary}
                fill={isBookmarked ? colors.error : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{vehicle.name}</Text>
            <Text style={styles.type}>{vehicle.type}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Star size={16} color={colors.accent} fill={colors.accent} />
            <Text style={styles.rating}>{vehicle.rating.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Droplet size={18} color={colors.text.secondary} />
            <Text style={styles.detailText}>{vehicle.fuelType}</Text>
          </View>
          <View style={styles.detailItem}>
            <Users size={18} color={colors.text.secondary} />
            <Text style={styles.detailText}>{vehicle.seatingCapacity} seats</Text>
          </View>
          <View style={styles.detailItem}>
            <MapPin size={18} color={colors.text.secondary} />
            <Text style={styles.detailText}>{vehicle.location}</Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Hourly Rate</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${vehicle.hourlyRate}</Text>
            <Text style={styles.priceUnit}>/hour</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{vehicle.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresContainer}>
            {vehicle.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <BookingForm 
            vehicle={vehicle} 
            onSubmit={handleBookingSubmit}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  backLink: {
    color: colors.primary,
    fontSize: 16,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  rightButtons: {
    flexDirection: 'row',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  type: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  detailText: {
    marginLeft: 6,
    fontSize: 14,
    color: colors.text.primary,
  },
  priceContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  priceUnit: {
    fontSize: 16,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.primary,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  featureItem: {
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureText: {
    fontSize: 14,
    color: colors.text.primary,
  },
});