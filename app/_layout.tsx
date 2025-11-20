// app/_layout.tsx
// Layout raíz de la aplicación con Stack Navigator
import { Stack } from "expo-router";

// Componente de layout raíz
export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#3B82F6" },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Mi App Login",
        }}
      />

      {/* Ruta correcta: auth/index, no "auth" */}
      <Stack.Screen
        name="auth/index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="home"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}