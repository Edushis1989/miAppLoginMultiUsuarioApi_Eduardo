// app/home/todo-list/index.tsx
// Pantalla para ver la lista de tareas (solo ADMIN)

import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  deleteTask,
  loadTasks,
  toggleTaskCompleted,
} from "@/src/storage/todolist";
import { Task } from "@/src/types/todolist";
import { getItem } from "@src/storage/async";

const ADMIN_USER = "admin";

export default function TodoListScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Recargar tareas cuando la pantalla obtenga foco
  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        setIsLoading(true);

        const user = await getItem("userEmail");
        const normalized = user?.toLowerCase().trim() ?? null;
        setCurrentUser(normalized);

        if (normalized === ADMIN_USER) {
          const data = await loadTasks();
          setTasks(data);
        } else {
          setTasks([]);
        }

        setIsLoading(false);
      }

      loadData();
    }, [])
  );

  // Alternar estado completado
  const handleToggle = async (id: string) => {
    await toggleTaskCompleted(id);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Eliminar tarea
  const handleDelete = (id: string) => {
    Alert.alert("Eliminar tarea", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await deleteTask(id);
          setTasks((prev) => prev.filter((t) => t.id !== id));
        },
      },
    ]);
  };

  if (currentUser !== ADMIN_USER) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Acceso Restringido</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ textAlign: "center", color: "blue" }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tareas de ADMIN</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("./todo-list/create")}
      >
        <Text style={styles.addButtonText}>➕ Crear Nueva Tarea</Text>
      </TouchableOpacity>

      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 50 }}>No hay tareas</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              {/* FOTO OPCIONAL */}
              {item.photoUri ? (
                <Image source={{ uri: item.photoUri }} style={styles.taskImage} />
              ) : (
                <View style={styles.noImageBox}>
                  <Text style={{ color: "#888" }}>Sin foto</Text>
                </View>
              )}

              <View style={styles.taskInfo}>
                <Text style={item.completed ? styles.completed : styles.title}>
                  {item.title}
                </Text>

                {/* UBICACIÓN OPCIONAL */}
                {item.location ? (
                  <Text>
                    Lat: {item.location.latitude.toFixed(4)}, Lon:{" "}
                    {item.location.longitude.toFixed(4)}
                  </Text>
                ) : (
                  <Text style={{ color: "#888" }}>Sin ubicación</Text>
                )}

                {item.location && (
                  <Text>
                    Creada:{" "}
                    {new Date(item.location.timestamp).toLocaleString()}
                  </Text>
                )}

                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => handleToggle(item.id)}>
                    <FontAwesome
                      name={item.completed ? "check-square" : "square-o"}
                      size={28}
                      color={item.completed ? "green" : "gray"}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <FontAwesome
                      name="trash"
                      size={28}
                      color="red"
                      style={{ marginLeft: 20 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
// Estilos para la pantalla de lista de tareas
const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  header: { fontSize: 26, fontWeight: "bold", marginVertical: 20, textAlign: "center" },
  taskItem: { flexDirection: "row", padding: 15, borderBottomWidth: 1, borderColor: "#ddd" },
  taskImage: { width: 90, height: 90, borderRadius: 8 },
  noImageBox: {
    width: 90,
    height: 90,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  taskInfo: { flex: 1, marginLeft: 12, justifyContent: "center" },
  title: { fontSize: 18 },
  completed: { fontSize: 18, textDecorationLine: "line-through", color: "gray" },
  actions: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  addButton: { backgroundColor: "#3b82f6", padding: 12, borderRadius: 10, marginBottom: 20 },
  addButtonText: { color: "white", textAlign: "center", fontSize: 16 },
});
