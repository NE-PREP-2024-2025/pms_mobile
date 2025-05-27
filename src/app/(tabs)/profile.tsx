import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { LogOut, User, Clock, Heart, Settings, Shield, HelpCircle, Info } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: () => logout(),
          style: "destructive"
        }
      ]
    );
  };

  const menuItems = [
    {
      icon: <User size={22} color={colors.text.primary} />,
      title: "Personal Information",
      onPress: () => Alert.alert("Feature", "This feature is coming soon!")
    },
    {
      icon: <Clock size={22} color={colors.text.primary} />,
      title: "Booking History",
      onPress: () => Alert.alert("Feature", "This feature is coming soon!")
    },
    {
      icon: <Heart size={22} color={colors.text.primary} />,
      title: "Saved Vehicles",
      onPress: () => Alert.alert("Feature", "This feature is coming soon!")
    },
    {
      icon: <Settings size={22} color={colors.text.primary} />,
      title: "Settings",
      onPress: () => Alert.alert("Feature", "This feature is coming soon!")
    },
    {
      icon: <Shield size={22} color={colors.text.primary} />,
      title: "Privacy & Security",
      onPress: () => Alert.alert("Feature", "This feature is coming soon!")
    },
    {
      icon: <HelpCircle size={22} color={colors.text.primary} />,
      title: "Help & Support",
      onPress: () => Alert.alert("Feature", "This feature is coming soon!")
    },
    {
      icon: <Info size={22} color={colors.text.primary} />,
      title: "About",
      onPress: () => Alert.alert("Feature", "This feature is coming soon!")
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{user?.name.charAt(0)}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuIconContainer}>
              {item.icon}
            </View>
            <Text style={styles.menuTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.logoutContainer}>
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          size="large"
          fullWidth
          icon={<LogOut size={20} color={colors.primary} />}
        />
      </View>

      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '600',
    color: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  menuContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    color: colors.text.primary,
  },
  logoutContainer: {
    marginBottom: 24,
  },
  versionText: {
    textAlign: 'center',
    color: colors.text.light,
    marginBottom: 20,
  },
});