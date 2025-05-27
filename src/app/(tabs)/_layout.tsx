import React, { useEffect } from "react";
import { Tabs, useRouter, useSegments } from "expo-router";
import { Home, Plus, User, BarChart2, Wallet2 } from "lucide-react-native";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Text,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import useAuthStore from "@/store/authStore";
import { BlurView } from "expo-blur";

interface TabBarIconProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const TabBarIcon = ({
  icon,
  isActive,
  onPress,
}: Omit<TabBarIconProps, "label">) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isActive ? 1.1 : 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [isActive]);

  return (
    <TouchableOpacity
      style={styles.tabButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[styles.tabIconContainer, { transform: [{ scale: scaleAnim }] }]}
      >
        {icon}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function TabsLayout() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();
  const [activeTab, setActiveTab] = React.useState("index");

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to the login page if not authenticated
      router.replace("/(auth)");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to the main app if authenticated and trying to access auth pages
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, segments]);

  // Don't render tabs if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarStyle: { display: "none" },
          headerShown: false,
        }}
        tabBar={(props) => (
          <View style={styles.tabBarContainer}>
            <BlurView intensity={80} style={styles.tabBarBlur} />
            <View style={styles.tabBar}>
              <TabBarIcon
                icon={
                  <Home
                    size={24}
                    color={
                      activeTab === "index"
                        ? Colors.primary
                        : Colors.textSecondary
                    }
                  />
                }
                isActive={activeTab === "index"}
                onPress={() => {
                  setActiveTab("index");
                  props.navigation.navigate("index");
                }}
              />
             
              <TabBarIcon
                icon={
                  <Wallet2
                    size={24}
                    color={
                      activeTab === "expenses"
                        ? Colors.primary
                        : Colors.textSecondary
                    }
                  />
                }
                isActive={activeTab === "expenses"}
                onPress={() => {
                  setActiveTab("expenses");
                  props.navigation.navigate("expenses");
                }}
              />
              <TabBarIcon
                icon={
                  <User
                    size={24}
                    color={
                      activeTab === "profile"
                        ? Colors.primary
                        : Colors.textSecondary
                    }
                  />
                }
                isActive={activeTab === "profile"}
                onPress={() => {
                  setActiveTab("profile");
                  props.navigation.navigate("profile");
                }}
              />
            </View>
          </View>
        )}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="expenses" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
  },
  tabBarBlur: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    borderRadius: 40,
    borderTopWidth: 0,
    overflow: "hidden",
  },
  tabBar: {
    flexDirection: "row",
    height: 80,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    maxWidth: 80,
  },
  tabIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  fabContainer: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
