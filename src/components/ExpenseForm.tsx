import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Calendar,
  Check,
  DollarSign,
  Tag,
  MessageSquare,
  Wallet,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Colors from "@/constants/colors";
import { ExpenseFormData } from "@/types/expense";
import ErrorMessage from "./ErrorMessage";

const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Bills",
  "Health",
  "Other",
];

const categoryIcons = {
  Food: "🍔",
  Transport: "🚗",
  Entertainment: "🎉",
  Shopping: "🛍️",
  Bills: "📝",
  Health: "💊",
  Other: "💡",
};

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export default function ExpenseForm({
  onSubmit,
  isLoading,
  error,
}: ExpenseFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: "",
    category: "",
    description: "",
    expenseTitle: "",
    userId: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleChange = (field: keyof ExpenseFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationError(null);
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, date: formattedDate }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      setValidationError("Please enter a valid amount");
      return false;
    }
  
    if(parseFloat(formData.amount) <= 0){
      setValidationError("Amount cannot be negative");
      return false;
    }
    if (!formData.category) {
      setValidationError("Please select a category");
      return false;
    }

    if (!formData.description) {
      setValidationError("Please enter a description");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    await onSubmit(formData);
    setFormData({
      amount: "",
      category: "",
      description: "",
      expenseTitle: "",
      userId: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    return (
      Colors.categories[
        category.toLowerCase() as keyof typeof Colors.categories
      ] || Colors.categories.other
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formGroup}>
          <View
            style={[
              styles.inputContainer,
              focusedInput === "amount" && styles.inputFocused,
            ]}
          >
            <Wallet
              size={20}
              color={Colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="decimal-pad"
              value={formData.amount}
              onChangeText={(value) => handleChange("amount", value)}
              onFocus={() => setFocusedInput("amount")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {CATEGORIES.map((category) => (
              <Pressable
                key={category}
                style={({ pressed }) => [
                  styles.categoryButton,
                  formData.category === category &&
                    styles.categoryButtonSelected,
                  pressed && styles.categoryButtonPressed,
                ]}
                onPress={() => handleChange("category", category)}
              >
                <Text style={styles.categoryIcon}>
                  {categoryIcons[category as keyof typeof categoryIcons]}
                </Text>
                <Text
                  style={[
                    styles.categoryButtonText,
                    formData.category === category &&
                      styles.categoryButtonTextSelected,
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.formGroup}>
          <View
            style={[
              styles.inputContainer,
              focusedInput === "description" && styles.inputFocused,
            ]}
          >
            <MessageSquare
              size={20}
              color={Colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="What was this expense for?"
              placeholderTextColor={Colors.textSecondary}
              value={formData.description}
              onChangeText={(value) => handleChange("description", value)}
              onFocus={() => setFocusedInput("description")}
              onBlur={() => setFocusedInput(null)}
             
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Date</Text>
          <Pressable
            style={({ pressed }) => [
              styles.dateButton,
              pressed && styles.dateButtonPressed,
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar
              size={20}
              color={Colors.textSecondary}
              style={styles.dateIcon}
            />
            <Text style={styles.dateText}>{formatDate(formData.date)}</Text>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={new Date(formData.date)}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        {(validationError || error) && (
          <ErrorMessage message={validationError || error} />
        )}

        <View style={styles.buttonContainer}>
          

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading&&<ActivityIndicator size="small" color={"white"} />}
            {isLoading ? (
              <Text style={styles.submitButtonText}>Saving...</Text>
            ) : (
              <View style={styles.submitButtonContent}>
                <Text style={styles.submitButtonText}>Save Expense</Text>
                <Check size={18} color="white" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  inputFocused: {
    borderColor: Colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: "600",
    color: Colors.text,
    paddingVertical: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 16,
    
    textAlignVertical: "top",
  },
  categoriesContainer: {
    paddingHorizontal: 4,
    gap: 8,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  categoryButtonSelected: {
    backgroundColor: Colors.primary ,
    borderColor: Colors.primary,
    color:"#ffffff"
  },
  categoryButtonPressed: {
    opacity: 0.7,
    color:"#ffffff",
    transform: [{ scale: 0.98 }],
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  categoryButtonTextSelected: {
    color: "white",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  dateButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  dateIcon: {
    marginRight: 12,
  },
  dateText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    flex: 2,
    flexDirection: "row",
    gap:2,
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
});
