// src/pages/Subitems.tsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import type { PresupuestoSubitem as Subitem } from "../services/presupuestos";
import {
  listSubitems,
  deleteSubitem,
} from "../services/presupuestos";

type RouteParams = { itemId?: string };

export default function Subitems() {
  const params = useParams();
  const { itemId } = params as RouteParams;

  const [subitems, setSubitems] = useState<Subitem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchSubitems = () => {
    if (!itemId) return;
    setError(null);
    listSubitems(+itemId)
      .then(r => setSubitems(r.data))
      .catch(() => setError("No se pudieron cargar los subítems"));
  };

  useEffect(fetchSubitems, [itemId]);

  const handleDelete = async (subId: number) => {
    const result = await Swal.fire({
      title: "¿Eliminar subítem?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed && itemId) {
      try {
        await deleteSubitem(+itemId, subId);
        Swal.fire("Borrado", "El subítem ha sido eliminado", "success");
        fetchSubitems();
      } catch {
        Swal.fire("Error", "No se pudo eliminar el subítem", "error");
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header + Nuevo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-2xl font-semibold mb-2 sm:mb-0">
          Subítems del Presupuesto {itemId}
        </h1>
        <div className="space-x-2">
          <Link
            to={`/homepage/presupuestos/${itemId}/subitems/nuevo`}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            + Nuevo Subítem
          </Link>
          <Link
            to={`/homepage/presupuestos`}
           className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
             ← Volver
          </Link>
          
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Tabla de subítems */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Nombre</th>
              <th className="px-3 py-2 text-left">Cantidad</th>
              <th className="px-3 py-2 text-left">Unidad</th>
              <th className="px-3 py-2 text-left">Precio Unitario</th>
              <th className="px-3 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {subitems.map(s => (
              <tr key={s.id_subitem} className="hover:bg-gray-50">
                <td className="px-3 py-2">{s.id_subitem}</td>
                <td className="px-3 py-2">{s.nombre}</td>
                <td className="px-3 py-2">{s.cantidad}</td>
                <td className="px-3 py-2">{s.unidad}</td>
                <td className="px-3 py-2">{s.precio_unitario}</td>
                <td className="px-3 py-2 space-x-2">
                  <Link
                    to={`/homepage/presupuestos/${itemId}/subitems/${s.id_subitem}`}
                    className="text-blue-600 hover:text-blue-800"
                    aria-label="Editar"
                  >
                    ✏️
                  </Link>
                  <button
                    onClick={() => handleDelete(s.id_subitem)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Eliminar"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {subitems.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-4 text-center text-gray-500"
                >
                  No hay subítems registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
