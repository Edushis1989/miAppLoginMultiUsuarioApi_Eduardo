// app/index.tsx
// Punto de entrada de la aplicación que redirige al login
import Login from "./auth/index";

// Componente de entrada que muestra la pantalla de login
export default function Index() {
  return <Login />;
}