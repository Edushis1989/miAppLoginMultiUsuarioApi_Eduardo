// src/types/todo-list.ts
// Definiciones de tipos para la lista de tareas

export type LocationData = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

export type Task = {
  id: string;
  title: string;
  photoUri?: string | null;   // OPCIONAL
  location?: LocationData | null;  // OPCIONAL
  completed: boolean;
};

export type NewTaskData = {
  title: string;
  photoUri?: string | null;      // OPCIONAL
  location?: LocationData | null; // OPCIONAL
};

