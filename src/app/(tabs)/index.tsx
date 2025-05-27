import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Plus, TrendingUp, TrendingDown, Calendar } from "lucide-react-native";
import Colors from "@/constants/colors";
import useExpensesStore from "@/store/expenseStore";
import ExpenseCard from "@/components/ExpenseCard";
import ErrorMessage from "@/components/ErrorMessage";
import { LinearGradient } from "expo-linear-gradient";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import useAuthStore from "@/store/authStore";

const { width } = Dimensions.get("window");

export default function ExpensesScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { expenses, fetchExpenses, deleteExpense, isLoading, error } =
    useExpensesStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("month");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    await fetchExpenses();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchExpenses();
    setRefreshing(false);
  };

  const handleAddExpense = () => {
    router.push("/(tabs)/add");
  };

  const handleDeleteExpense = (id: string) => {
    setExpenseToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;
    setShowDeleteModal(false);
    await deleteExpense(expenseToDelete);
    setExpenseToDelete(null);
  };

  const getFilteredExpenses = () => {
    const now = new Date();
    const filtered = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      switch (selectedPeriod) {
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return expenseDate >= weekAgo;
        case "month":
          return (
            expenseDate.getMonth() === now.getMonth() &&
            expenseDate.getFullYear() === now.getFullYear()
          );
        case "year":
          return expenseDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
    // Sort by date (newest first) and take only first 5
    return filtered
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  const calculateTotal = () => {
    return getFilteredExpenses().reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
  };

  const calculateAverage = () => {
    const filtered = getFilteredExpenses();
    if (filtered.length === 0) return 0;
    return calculateTotal() / filtered.length;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "RWF",
    }).format(amount);
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "week":
        return "This Week";
      case "month":
        return "This Month";
      case "year":
        return "This Year";
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.headerGradient}
      >

        <View style={styles.header}>
          <View>
            <Text style={styles.periodLabel}>{getPeriodLabel()}</Text>
            <Text style={styles.totalAmount}>
              {formatAmount(calculateTotal())}
            </Text>
            <Text style={styles.averageLabel}>
              Avg. {formatAmount(calculateAverage())} per expense
            </Text>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === "week" && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod("week")}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === "week" && styles.periodButtonTextActive,
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === "month" && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod("month")}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === "month" && styles.periodButtonTextActive,
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === "year" && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod("year")}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === "year" && styles.periodButtonTextActive,
              ]}
            >
              Year
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <TrendingUp size={24} color={Colors.success} />
          <Text style={styles.statValue}>{getFilteredExpenses().length}</Text>
          <Text style={styles.statLabel}>Expenses</Text>
        </View>
        <View style={styles.statCard}>
          <Calendar size={24} color={Colors.primary} />
          <Text style={styles.statValue}>
            {formatAmount(
              calculateTotal() /
                (selectedPeriod === "week"
                  ? 7
                  : selectedPeriod === "month"
                  ? 30
                  : 365)
            )}
          </Text>
          <Text style={styles.statLabel}>Daily Avg.</Text>
        </View>
      </View>

      {error && <ErrorMessage message={error} />}

      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : expenses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No expenses yet</Text>
          <Text style={styles.emptySubtext}>
            Tap the + button to add your first expense
          </Text>
        </View>
      ) : (
        <View style={styles.expensesContainer}>
          <View style={styles.expensesHeader}>
            <Text style={styles.expensesTitle}>Recent Expenses</Text>
            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={() => router.push("/(tabs)/expenses")}
            >
              <Text style={styles.viewMoreText}>View More</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={getFilteredExpenses()}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExpenseCard expense={item} onDelete={handleDeleteExpense} />
            )}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[Colors.primary]}
                tintColor={Colors.primary}
              />
            }
          />
        </View>
      )}

      <DeleteConfirmationModal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setExpenseToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerGradient: {
    paddingTop: 30,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  periodLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  averageLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  periodSelector: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 10,
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  periodButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  periodButtonText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "600",
  },
  periodButtonTextActive: {
    color: "white",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: -16,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  expensesContainer: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  expensesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  expensesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  viewMoreButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: Colors.primary + "15",
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  listContent: {
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
