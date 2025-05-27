import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { Calendar, Clock } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { Booking, Vehicle } from "@/types";
import Button from "./Button";

interface BookingCardProps {
  booking: Booking;
  vehicle: Vehicle;
  onCancel?: () => void;
  onPress?: () => void;
}

export default function BookingCard({
  booking,
  vehicle,
  onCancel,
  onPress,
}: BookingCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = () => {
    switch (booking.status) {
      case "confirmed":
        return colors.primary;
      case "completed":
        return colors.success;
      case "cancelled":
        return colors.error;
      default:
        return colors.text.secondary;
    }
  };

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: vehicle.image }}
            style={styles.image}
            contentFit="cover"
          />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.vehicleName} numberOfLines={1}>
            {vehicle.name}
          </Text>
          <Text style={styles.vehicleType}>{vehicle.type}</Text>
          <View
            style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
          >
            <Text style={styles.statusText}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.dateTimeRow}>
          <View style={styles.dateTimeItem}>
            <Calendar size={16} color={colors.text.secondary} />
            <Text style={styles.dateTimeLabel}>Start</Text>
            <Text style={styles.dateTimeValue}>
              {formatDate(new Date(booking.startTime))}
            </Text>
            <Text style={styles.dateTimeValue}>
              {formatTime(new Date(booking.startTime))}
            </Text>
          </View>
          <View style={styles.dateTimeItem}>
            <Calendar size={16} color={colors.text.secondary} />
            <Text style={styles.dateTimeLabel}>End</Text>
            <Text style={styles.dateTimeValue}>
              {formatDate(new Date(booking.endTime))}
            </Text>
            <Text style={styles.dateTimeValue}>
              {formatTime(new Date(booking.endTime))}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.footer}>
          <View>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ${booking.totalCost.toFixed(2)}
            </Text>
          </View>

          {booking.status === "confirmed" && onCancel && (
            <Button
              title="Cancel"
              onPress={onCancel}
              variant="outline"
              size="small"
            />
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 4,
  },
  vehicleType: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  detailsContainer: {
    padding: 16,
  },
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateTimeItem: {
    flex: 1,
    alignItems: "flex-start",
  },
  dateTimeLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
    marginBottom: 2,
  },
  dateTimeValue: {
    fontSize: 14,
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
  },
});
