// src/pages/Presupuestos.tsx
import { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import type { PresupuestoItem } from "../services/presupuestos";
import {
  listItems,
  deleteItem
} from "../services/presupuestos";

export default function Presupuestos() {
  const [items, setItems] = useState<PresupuestoItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchItems = () => {
    setError(null);
    listItems()
      .then(res => setItems(res.data))
      .catch(() => setError("No se pudieron cargar los ítems"));
  };

  useEffect(fetchItems, []);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Eliminar ítem?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar"
    });
    if (result.isConfirmed) {
      try {
        await deleteItem(id);
        Swal.fire("Borrado", "Ítem eliminado", "success");
        fetchItems();
      } catch {
        Swal.fire("Error", "No se pudo eliminar el ítem", "error");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-2xl font-semibold mb-2 sm:mb-0">Presupuestos</h1>
        <button
          onClick={() => navigate("/homepage/presupuestos/nuevo")}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          + Nuevo Ítem
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Nombre</th>
              <th className="px-3 py-2 text-left">Total</th>
              <th className="px-3 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id_item} className="hover:bg-gray-50">
                <td className="px-3 py-2">{item.id_item}</td>
                <td className="px-3 py-2">{item.nombre}</td>
                <td className="px-3 py-2">{item.total}</td>
                <td className="px-3 py-2 space-x-2">
                  <button
                    onClick={() => navigate(`/homepage/presupuestos/${item.id_item}/subitems`)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    📋
                  </button>
                  <button
                    onClick={() => navigate(`/homepage/presupuestos/${item.id_item}`)}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(item.id_item)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-center text-gray-500">
                  No hay ítems registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
