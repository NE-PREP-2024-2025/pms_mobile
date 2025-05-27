import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Calendar, Clock } from "lucide-react-native";
import { colors } from "@/constants/colors";
import Button from "./Button";
import { Vehicle } from "@/types";

interface BookingFormProps {
  vehicle: Vehicle;
  onSubmit: (startTime: Date, endTime: Date, totalCost: number) => void;
}

export default function BookingForm({ vehicle, onSubmit }: BookingFormProps) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() + 2 * 60 * 60 * 1000)
  ); // Default 2 hours later
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");

  // Calculate total hours and cost
  const hoursDiff = Math.max(
    1,
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60))
  );
  const totalCost = hoursDiff * vehicle.hourlyRate;

  const handleStartChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === "android") {
      setShowStartPicker(false);
    }

    if (selectedDate) {
      setStartDate(selectedDate);

      // If end date is before new start date, adjust it
      if (endDate < selectedDate) {
        setEndDate(new Date(selectedDate.getTime() + 2 * 60 * 60 * 1000));
      }
    }
  };

  const handleEndChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowEndPicker(false);
    }

    if (selectedDate) {
      // Ensure end date is after start date
      if (selectedDate > startDate) {
        setEndDate(selectedDate);
      } else {
        setEndDate(new Date(startDate.getTime() + 1 * 60 * 60 * 1000));
      }
    }
  };

  const showDateTimePicker = (isStart: boolean, mode: "date" | "time") => {
    setPickerMode(mode);
    if (isStart) {
      setShowStartPicker(true);
    } else {
      setShowEndPicker(true);
    }
  };

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

  const handleSubmit = () => {
    onSubmit(startDate, endDate, totalCost);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Your Vehicle</Text>

      <View style={styles.dateTimeContainer}>
        <View style={styles.dateTimeSection}>
          <Text style={styles.sectionTitle}>Start Date & Time</Text>

          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => showDateTimePicker(true, "date")}
          >
            <Calendar size={18} color={colors.text.secondary} />
            <Text style={styles.dateTimeText}>{formatDate(startDate)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => showDateTimePicker(true, "time")}
          >
            <Clock size={18} color={colors.text.secondary} />
            <Text style={styles.dateTimeText}>{formatTime(startDate)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dateTimeSection}>
          <Text style={styles.sectionTitle}>End Date & Time</Text>

          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => showDateTimePicker(false, "date")}
          >
            <Calendar size={18} color={colors.text.secondary} />
            <Text style={styles.dateTimeText}>{formatDate(endDate)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => showDateTimePicker(false, "time")}
          >
            <Clock size={18} color={colors.text.secondary} />
            <Text style={styles.dateTimeText}>{formatTime(endDate)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Time Pickers */}
      {(showStartPicker || showEndPicker) && Platform.OS === "ios" && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={showStartPicker ? startDate : endDate}
            mode={pickerMode}
            display="spinner"
            onChange={showStartPicker ? handleStartChange : handleEndChange}
            minimumDate={showStartPicker ? new Date() : startDate}
          />
          <Button
            title="Done"
            onPress={() => {
              setShowStartPicker(false);
              setShowEndPicker(false);
            }}
            variant="primary"
            size="small"
          />
        </View>
      )}

      {showStartPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={startDate}
          mode={pickerMode}
          display="default"
          onChange={handleStartChange}
          minimumDate={new Date()}
        />
      )}

      {showEndPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={endDate}
          mode={pickerMode}
          display="default"
          onChange={handleEndChange}
          minimumDate={startDate}
        />
      )}

      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Duration</Text>
          <Text style={styles.summaryValue}>
            {hoursDiff} hour{hoursDiff !== 1 ? "s" : ""}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Rate</Text>
          <Text style={styles.summaryValue}>${vehicle.hourlyRate}/hour</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${totalCost.toFixed(2)}</Text>
        </View>
      </View>

      <Button
        title="Confirm Booking"
        onPress={handleSubmit}
        variant="primary"
        size="large"
        fullWidth
        disabled={!vehicle.available}
      />

      {!vehicle.available && (
        <Text style={styles.unavailableText}>
          This vehicle is currently unavailable for booking.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 20,
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateTimeSection: {
    flex: 1,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.primary,
    marginBottom: 8,
  },
  dateTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 10,
  },
  dateTimeText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text.primary,
  },
  pickerContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
  },
  unavailableText: {
    color: colors.error,
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
  },
});
