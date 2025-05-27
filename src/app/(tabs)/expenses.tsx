import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { Search, Plus, Filter, X, Loader2 } from "lucide-react-native";
import Colors from "@/constants/colors";
import useExpensesStore from "@/store/expenseStore";
import ExpenseCard from "@/components/ExpenseCard";
import ErrorMessage from "@/components/ErrorMessage";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import FilterModal from "@/components/FilterModal";
import { LinearGradient } from "expo-linear-gradient";

const CATEGORIES = [
  "All",
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Other",
] as const;

type Category = (typeof CATEGORIES)[number];

export default function AllExpensesScreen() {
  const router = useRouter();
  const { expenses, fetchExpenses, deleteExpense, isLoading, error } =
    useExpensesStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  const loadExpenses = async () => {
    await fetchExpenses();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchExpenses();
    setRefreshing(false);
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

  const handleAddExpense = () => {
    router.push("/(tabs)/add");
  };

  const getFilteredExpenses = useCallback(() => {
    let filtered = [...expenses];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (expense) =>
          expense.description.toLowerCase().includes(query) ||
          expense.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (expense) => expense.category === selectedCategory
      );
    }

    // Sort by date (newest first)
    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [expenses, searchQuery, selectedCategory]);

  const renderCategoryButton = (category: Category) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.categoryButtonActive,
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text
        style={[
          styles.categoryButtonText,
          selectedCategory === category && styles.categoryButtonTextActive,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Expenses</Text>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color="white" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search expenses..."
                placeholderTextColor="white"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <X size={20} color="white" />
                </TouchableOpacity>
              ) : null}
            </View>
            <TouchableOpacity
              style={[
                styles.iconButton,
                selectedCategory !== "All" && styles.iconButtonActive,
              ]}
              onPress={() => setShowFilterModal(true)}
              activeOpacity={0.8}
            >
              <Filter
                size={24}
                color={
                  selectedCategory !== "All"
                    ? "white"
                    : "rgba(255, 255, 255, 0.8)"
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddExpense}
              activeOpacity={0.8}
            >
              <Plus size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="w-fit">
          {selectedCategory !== "All" && (
            <View className="w-fit" style={styles.activeFilterContainer}>
              <Text style={styles.activeFilterText}>{selectedCategory}</Text>
              <TouchableOpacity
                onPress={() => setSelectedCategory("All")}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={16} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>

      {error && <ErrorMessage message={error} />}

      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <Loader2
              size={32}
              color={Colors.primary}
              style={styles.loadingIcon}
            />
            <Text style={styles.loadingText}>Loading expenses...</Text>
          </View>
        </View>
      ) : getFilteredExpenses().length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No expenses found</Text>
          <Text style={styles.emptySubtext}>
            {searchQuery || selectedCategory !== "All"
              ? "Try adjusting your search or filters"
              : "Add your first expense to get started"}
          </Text>
          <TouchableOpacity
            style={styles.emptyActionButton}
            onPress={handleAddExpense}
          >
            <Plus size={20} color="white" style={styles.emptyActionIcon} />
            <Text style={styles.emptyActionText}>Add New Expense</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={getFilteredExpenses()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExpenseCard expense={item} onDelete={handleDeleteExpense} />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
        />
      )}

      <DeleteConfirmationModal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setExpenseToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
    marginLeft: 8,
    marginRight: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonActive: {
    backgroundColor: Colors.primary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  activeFilterContainer: {
    flexDirection: "row",
    width: "auto",
    maxWidth: 130,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  activeFilterText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  listContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingContent: {
    alignItems: "center",
    gap: 12,
  },
  loadingIcon: {
    opacity: 0.8,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: "500",
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
    marginBottom: 24,
  },
  emptyActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyActionIcon: {
    marginRight: 8,
  },
  emptyActionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  categoryButtonText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "600",
  },
  categoryButtonTextActive: {
    color: "white",
  },
});
