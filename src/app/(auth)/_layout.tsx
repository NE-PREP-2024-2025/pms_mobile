import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Login", headerShown: false }} />
      {/* <Stack.Screen name="register" options={{ title: "Create Account", headerShown: false }} /> */}
    </Stack>
  );
}