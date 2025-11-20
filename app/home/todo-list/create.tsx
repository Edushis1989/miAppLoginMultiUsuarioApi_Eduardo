// app/home/todo-list/create.tsx
// Pantalla para crear una nueva tarea (solo ADMIN)
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { createTask } from "@/src/storage/todolist";
import { LocationData } from "@/src/types/todolist";
import { getItem } from "@src/storage/async";
// importaciones necesarias para la funcionalidad de la pantalla

// Constante para el usuario ADMIN
const ADMIN_USER = "admin";
export default function CreateTodoScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      // 📸 Permisos cámara
      await ImagePicker.requestCameraPermissionsAsync();

      // 📍 Permisos ubicación
      await Location.requestForegroundPermissionsAsync();

      const currentUser = await getItem("userEmail");

      if ((currentUser ?? "").toLowerCase().trim() !== ADMIN_USER) {
        Alert.alert("Acceso Denegado", "Solo ADMIN puede crear tareas");
        router.replace("/home");
      }
    })();
  }, [router]);

  // 📸 Tomar foto
  const handlePickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  // 📍 Obtener ubicación
  const handleGetLocation = async () => {
    setIsLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocationData({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: location.timestamp,
      });
      Alert.alert("Éxito", "Ubicación registrada");
    } catch (error) {
      console.error("Error al obtener la ubicación:", error);
      Alert.alert("Error", "No se pudo obtener ubicación");
    } finally {
      setIsLoading(false);
    }
  };

// 💾 Guardar tarea
const handleSaveTask = async () => {
  if (!title.trim()) {
    return Alert.alert("Error", "El título es obligatorio");
  }

  setIsLoading(true);
  try {
    await createTask({
      title,
      photoUri: photoUri ?? null,      // OPCIONAL
      location: locationData ?? null,  // OPCIONAL
    });

    Alert.alert("Éxito", "Tarea creada");
    router.back();
  } catch (e: any) {
    Alert.alert("Error", e.message);
  } finally {
    setIsLoading(false);
  }
};

//
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Crear Tarea (Solo ADMIN)</Text>

      <TextInput
        style={styles.input}
        placeholder="Título de la tarea *(obligatorio)"
        value={title}
        onChangeText={setTitle}
      />

      {/* FOTO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📷 Foto </Text>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.placeholder}>No hay foto</Text>
        )}
        <Button title="Tomar Foto" onPress={handlePickImage} />
      </View>

      {/* UBICACIÓN */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 Ubicación </Text>
        {locationData ? (
          <Text>
            Lat: {locationData.latitude.toFixed(4)}{"\n"}
            Long: {locationData.longitude.toFixed(4)}
          </Text>
        ) : (
          <Text style={styles.placeholder}>No hay ubicación</Text>
        )}

        <Button
          title={isLoading ? "Obteniendo..." : "Obtener Ubicación"}
          onPress={handleGetLocation}
          disabled={isLoading}
        />

        {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
      </View>

      {/* GUARDAR */}
      <Button
        title="Guardar Tarea"
        onPress={handleSaveTask}
        disabled={isLoading}

      />
    </ScrollView>
  );
}

// Estilos para la pantalla de creación de tareas
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 30,
    textAlign: "center",
  },

  section: { marginVertical: 20 },

  sectionTitle: { fontSize: 18, marginBottom: 10 },

  imagePreview: {
    width: "100%",
    height: 300,
    marginVertical: 10,
    borderRadius: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },

  placeholder: { color: "#888", marginBottom: 10 },
});
