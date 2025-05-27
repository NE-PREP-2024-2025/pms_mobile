import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export function withAuth<P>(WrappedComponent: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.replace("/(auth)");
      }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
