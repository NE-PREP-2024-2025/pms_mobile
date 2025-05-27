import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { Trash2, ChevronRight } from "lucide-react-native";
import Colors from "@/constants/colors";
import { Expense } from "@/types/expense";

interface ExpenseCardProps {
  expense: Expense;
  onDelete: (id: string) => void;
}
const categoryIcons = {
  food: "🍔",
  transport: "🚗",
  entertainment: "🎉",
  shopping: "🛍️",
  bills: "📝",
  other: "💡",
};

export default function ExpenseCard({ expense, onDelete }: ExpenseCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/(tabs)/${expense.id}`);
  };

  const handleDelete = (e: any) => {
    e.stopPropagation();
    onDelete(expense.id);
  };

  const getCategoryColor = (category: string) => {
    return (
      Colors.categories[
        category.toLowerCase() as keyof typeof Colors.categories
      ] || Colors.categories.other
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  const getIconByCategory = (category: string) => {
    return (
      categoryIcons[category.toLowerCase() as keyof typeof categoryIcons] ||
      "💡"
    );
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "RWF",
    }).format(amount);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={handlePress}
    >
      <View style={styles.leftContent}>
        <View
          style={[
            styles.categoryIndicator,
            { backgroundColor: getCategoryColor(expense.category) + "15" },
          ]}
        >
          <Text style={styles.categoryIcon}>
            {getIconByCategory(expense.category)}
          </Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.description} numberOfLines={1}>
            {expense.description}
          </Text>
          <View style={styles.metaContainer}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: getCategoryColor(expense.category) + "15" },
              ]}
            >
              <Text
                style={[
                  styles.category,
                  { color: getCategoryColor(expense.category) },
                ]}
              >
                {expense.category}
              </Text>
            </View>
            <Text style={styles.date}>{formatDate(expense.date)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.rightContent}>
        <Text style={styles.amount}>{formatAmount(expense.amount)}</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Trash2 size={18} color={Colors.error} />
          </TouchableOpacity>
          <ChevronRight size={18} color={Colors.textSecondary} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIndicator: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIcon: {
    fontSize: 20,
  },
  details: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 6,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  category: {
    fontSize: 12,
    fontWeight: "600",
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  rightContent: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deleteButton: {
    padding: 4,
  },
});
