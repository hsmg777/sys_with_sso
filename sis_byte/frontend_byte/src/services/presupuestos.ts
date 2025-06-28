// src/services/presupuestos.ts
import api from "./api";

export interface PresupuestoItem {
  id_item: number;
  nombre:  string;
  total:   number;
}

export interface PresupuestoSubitem {
  id_subitem:      number;
  item_id:         number;
  nombre:          string;
  cantidad:        number;
  unidad:          string;
  precio_unitario: number;
}

// --- Items ---

// Listar todos los ítems con total calculado
export function listItems() {
  return api.get<PresupuestoItem[]>('/presupuestos');
}

// Obtener un ítem por ID
export function getItem(itemId: number) {
  return api.get<PresupuestoItem>(`/presupuestos/${itemId}`);
}

// Crear un nuevo ítem
export function createItem(data: Omit<PresupuestoItem, 'id_item' | 'total'>) {
  return api.post<PresupuestoItem>('/presupuestos', data);
}

// Actualizar un ítem existente (solo nombre)
export function updateItem(itemId: number, data: Partial<Pick<PresupuestoItem, 'nombre'>>) {
  return api.put<PresupuestoItem>(`/presupuestos/${itemId}`, data);
}

// Eliminar un ítem
export function deleteItem(itemId: number) {
  return api.delete<void>(`/presupuestos/${itemId}`);
}

// --- Subitems ---

// Listar subítems de un ítem
export function listSubitems(itemId: number) {
  return api.get<PresupuestoSubitem[]>(`/presupuestos/${itemId}/subitems`);
}

// Obtener un subítem específico
export function getSubitem(itemId: number, subId: number) {
  return api.get<PresupuestoSubitem>(`/presupuestos/${itemId}/subitems/${subId}`);
}

// Crear un nuevo subítem para un ítem
export function createSubitem(
  itemId: number,
  data: Omit<PresupuestoSubitem, 'id_subitem' | 'item_id'>
) {
  return api.post<PresupuestoSubitem>(`/presupuestos/${itemId}/subitems`, data);
}

// Actualizar un subítem
export function updateSubitem(
  itemId: number,
  subId: number,
  data: Partial<Omit<PresupuestoSubitem, 'item_id' | 'id_subitem'>>
) {
  return api.put<PresupuestoSubitem>(
    `/presupuestos/${itemId}/subitems/${subId}`,
    data
  );
}

// Eliminar un subítem
export function deleteSubitem(itemId: number, subId: number) {
  return api.delete<void>(`/presupuestos/${itemId}/subitems/${subId}`);
}
