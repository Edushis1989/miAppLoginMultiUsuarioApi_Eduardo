// app/home/profile.tsx
// Pantalla de perfil del usuario

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

// Alias corregido con Expo Router
import { getItem, removeItem } from "@src/storage/async";

// Componente de pantalla de perfil
export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);

  // Cargar usuario al montar el componente
  useEffect(() => {
    (async () => {
      const storedUser = await getItem("userEmail");

      if (!storedUser) {
        router.replace("/auth");
        return;
      }

      setUser(storedUser);
    })();
  }, [router]);

  // Función para cerrar sesión
  const logout = async () => {
    await removeItem("userEmail");
    router.replace("/auth");
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <Text style={styles.info}>Usuario: {user}</Text>

      <Button title="Cerrar Sesión" onPress={logout} color="#ef4444" />
    </View>
  );
}

// Estilos para la pantalla de perfil
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#3B82F6",
  },
  info: {
    fontSize: 20,
    marginBottom: 40,
    color: "gray",
  },
});
