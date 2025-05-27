import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Heart, Star, MapPin, Users, Droplet } from 'lucide-react-native';
import { useVehicleStore } from '@/store/vehicleStore';
import { Vehicle } from '@/types';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';

interface VehicleCardProps {
  vehicle: Vehicle;
  showBookmarkButton?: boolean;
}

export default function VehicleCard({ vehicle, showBookmarkButton = true }: VehicleCardProps) {
  const router = useRouter();
  const { toggleBookmark, bookmarkedVehicles, selectVehicle } = useVehicleStore();
  const isBookmarked = bookmarkedVehicles.includes(vehicle.id);

  const handlePress = () => {
    selectVehicle(vehicle.id);
    router.push(`/vehicle/${vehicle.id}`);
  };

  const handleBookmarkPress = (e: any) => {
    e.stopPropagation();
    toggleBookmark(vehicle.id);
  };

  return (
    <Pressable 
      style={styles.container} 
      onPress={handlePress}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: vehicle.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        {showBookmarkButton && (
          <Pressable 
            style={styles.bookmarkButton} 
            onPress={handleBookmarkPress}
            hitSlop={10}
          >
            <Heart 
              size={20} 
              color={isBookmarked ? colors.error : colors.text.light}
              fill={isBookmarked ? colors.error : 'transparent'}
            />
          </Pressable>
        )}
        <View style={[styles.badge, vehicle.available ? styles.availableBadge : styles.unavailableBadge]}>
          <Text style={styles.badgeText}>
            {vehicle.available ? 'Available' : 'Unavailable'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{vehicle.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color={colors.accent} fill={colors.accent} />
            <Text style={styles.rating}>{vehicle.rating.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.typeContainer}>
          <Text style={styles.type}>{vehicle.type}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Droplet size={14} color={colors.text.secondary} />
            <Text style={styles.detailText}>{vehicle.fuelType}</Text>
          </View>
          <View style={styles.detailItem}>
            <Users size={14} color={colors.text.secondary} />
            <Text style={styles.detailText}>{vehicle.seatingCapacity} seats</Text>
          </View>
          <View style={styles.detailItem}>
            <MapPin size={14} color={colors.text.secondary} />
            <Text style={styles.detailText} numberOfLines={1}>{vehicle.location}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>${vehicle.hourlyRate}</Text>
          <Text style={styles.priceUnit}>/hour</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  badge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  availableBadge: {
    backgroundColor: 'rgba(72, 187, 120, 0.9)',
  },
  unavailableBadge: {
    backgroundColor: 'rgba(245, 101, 101, 0.9)',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  typeContainer: {
    marginBottom: 12,
  },
  type: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 4,
    fontSize: 13,
    color: colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  priceUnit: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 2,
  },
});