// src/services/clients.ts
import api from "./api";

export interface Cliente {
  id_cliente: number;
  nombre:     string;
  email:      string;
  telefono?:  string;
  direccion?: string;
}

export interface ListFilters {
  nombre?:  string;
  email?:   string;
}

// Listar
export function listClients(filters: ListFilters = {}) {
  return api.get<Cliente[]>("/clientes", { params: filters });
}

// Obtener uno
export function getClient(id: number) {
  return api.get<Cliente>(`/clientes/${id}`);
}

// Crear
export function createClient(data: Omit<Cliente, "id_cliente">) {
  return api.post<Cliente>("/clientes", data);
}

// Actualizar
export function updateClient(id: number, data: Partial<Omit<Cliente, "id_cliente">>) {
  return api.put<Cliente>(`/clientes/${id}`, data);
}

// Borrar
export function deleteClient(id: number) {
  return api.delete<void>(`/clientes/${id}`);
}
