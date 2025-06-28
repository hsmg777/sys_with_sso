// src/services/users.ts
import api from "./api";
export interface Usuario {
  id_usuario: number;
  nombre:     string;
  email:      string;
  rol:        "administrador" | "cosecha" | "contable";
}
export interface ListFilters {
  nombre?: string;
  email?: string;
}

/** Listar */
export function listUsers(filters: ListFilters = {}) {
  return api.get<Usuario[]>("/users", { params: filters });
}
/** Obtener uno */
export function getUser(id: number) {
  return api.get<Usuario>(`/users/${id}`);
}
/** Actualizar */
export function updateUser(id: number, data: Partial<Omit<Usuario, "id_usuario"> & { contraseña?: string }>) {
  return api.put<Usuario>(`/users/${id}`, data);
}
/** Borrar */
export function deleteUser(id: number) {
  return api.delete<void>(`/users/${id}`);
}
