import React from "react";
import { StyleSheet, View, SafeAreaView, StatusBar, Text } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import useExpensesStore from "@/store/expenseStore";
import ExpenseForm from "@/components/ExpenseForm";
import { ExpenseFormData } from "@/types/expense";

export default function AddExpenseTab() {
  const router = useRouter();
  const { addExpense, isLoading, error, clearError } = useExpensesStore();

  const handleSubmit = async (data: ExpenseFormData) => {
    clearError();
    const result = await addExpense(data);
    

    if (result) {
      // Navigate to the expenses tab
      router.push("/(tabs)");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Add New Expense</Text>
          <Text style={styles.headerSubtitle}>Track your spending</Text>
        </View>
      </LinearGradient>

      <View style={styles.formContainer}>
        <ExpenseForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  formContainer: {
    flex: 1,
    marginTop: -20,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
});
