// src/services/stock.ts
import api from "./api";

// Interfaces

export interface Stock {
  id_stock:       number;
  producto:       string;
  cantidad_total: string;   // Devuelto como string decimal
  precio_unitario: string;
  fecha_registro: string;
}

export interface IngresoStock {
  id_ingreso:     number;
  id_stock:       number;
  kilos:          string;
  fecha_ingreso:  string;
  sala?:          string;
  break_number?:  string;
}

// Crear nuevo stock (sin kilos)
export function createStock(data: { producto: string; precio_unitario: string }) {
  return api.post<Stock>("/stock", data);
}

// Listar todos los stocks
export function listStock() {
  return api.get<Stock[]>("/stock");
}

// Obtener un producto por ID
export function getStock(id: number) {
  return api.get<Stock>(`/stock/${id}`);
}

// Actualizar nombre o precio unitario
export function updateStock(
  id: number,
  data: Partial<Pick<Stock, "producto" | "precio_unitario">>
) {
  return api.put<Stock>(`/stock/${id}`, data);
}

// Eliminar un stock
export function deleteStock(id: number) {
  return api.delete<void>(`/stock/${id}`);
}

// ==============================
// Ingresos de stock (cosecha)
// ==============================

// Listar ingresos (opcional: podrías agregar filtros)
export function listIngresos() {
  return api.get<IngresoStock[]>("/ingresos");
}

// Crear ingreso (registra kilos para un stock)
export function createIngreso(data: {
  id_stock: number;
  kilos: string;
  fecha_ingreso?: string;
  sala?: string;
  break_number?: string;
}) {
  return api.post<IngresoStock>("/ingresos", data);
}

// Obtener ingreso específico
export function getIngreso(id: number) {
  return api.get<IngresoStock>(`/ingresos/${id}`);
}

// Eliminar ingreso
export function deleteIngreso(id: number) {
  return api.delete<void>(`/ingresos/${id}`);
}
// Listar ingresos por producto específico
export function listIngresosByStock(id_stock: number) {
  return api.get<IngresoStock[]>(`/ingresos?stock_id=${id_stock}`);
}


