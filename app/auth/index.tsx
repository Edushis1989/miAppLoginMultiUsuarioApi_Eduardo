// app/auth/index.tsx

import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";


// Alias corregido
import { setItem } from "@src/storage/async";

const VALID_USERS = ["admin", "efren", "eduardo", "Daniel", "Jeremy"];
const VALID_PASSWORD = "1234";

// Logo en ruta para el logo
const logoSource = require("@assets/images/logo.png");

// Componente de Login
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    const inputUser = email.toLowerCase().trim();

    if (!VALID_USERS.includes(inputUser) || password !== VALID_PASSWORD) {
      Alert.alert(
        "Error",
        "Usuario o contraseña incorrectos\nUsuarios válidos: admin, efren, eduardo, Daniel, Jeremy\nContraseña: 1234"
      );
      return;
    }

    await setItem("userEmail", inputUser);
    router.replace("/home");
  };
// Renderizado del componente de Login
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mi App Login Multi-Usuario Lista App</Text>
      <Image source={logoSource} style={styles.logo} />
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario (admin, efren, eduardo, Daniel, Jeremy)"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña (1234)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Ingresar" onPress={handleLogin} />
    </View>
  );
}

// Estilos para el componente de Login
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 26,
    textAlign: "center",
    marginBottom: 12,
    color: "#3b82f6",
    fontWeight: "bold",
  },
  logo: {
    width: 180,
    height: 180,
    alignSelf: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#3b82f6",
  },
  input: {
    borderWidth: 1,
    borderColor: "#3b82f6",
    borderRadius: 8,
    padding: 15,
    marginBottom: 18,
    fontSize: 16,
  },
});
