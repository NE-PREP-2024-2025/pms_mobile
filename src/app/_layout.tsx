import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function Layout() {
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to the sign-in page if not authenticated
      router.replace("/(auth)");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to the home page if authenticated and trying to access auth pages
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
