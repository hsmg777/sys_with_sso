// src/pages/SubitemForm.tsx
import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import type { PresupuestoSubitem as Subitem } from "../services/presupuestos";
import {
  getSubitem,
  createSubitem,
  updateSubitem,
} from "../services/presupuestos";

type RouteParams = {
  itemId?: string;
  subId?: string;
};

export default function SubitemForm() {
  const params = useParams();
  const { itemId, subId } = params as RouteParams;
  const isEdit = Boolean(itemId && subId);
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [unidad, setUnidad] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) {
      // cargar el subitem existente
      getSubitem(+itemId!, +subId!)
        .then((r) => {
          const s: Subitem = r.data;
          setNombre(s.nombre);
          setCantidad(s.cantidad.toString());
          setUnidad(s.unidad);
          setPrecioUnitario(s.precio_unitario.toString());
        })
        .catch(() => {
          setError("No se pudo cargar el subítem");
        });
    }
  }, [isEdit, itemId, subId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones básicas
    if (!nombre || !cantidad || !unidad || !precioUnitario) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const payload = {
      nombre,
      cantidad: Number(cantidad),
      unidad,
      precio_unitario: Number(precioUnitario),
    };

    try {
      if (isEdit) {
        await updateSubitem(+itemId!, +subId!, payload);
        await Swal.fire("¡Hecho!", "Subítem actualizado correctamente.", "success");
      } else {
        await createSubitem(+itemId!, payload);
        await Swal.fire("¡Hecho!", "Subítem creado correctamente.", "success");
      }
      navigate(`/homepage/presupuestos/${itemId}/subitems`);
    } catch (err: any) {
      const msg = err.response?.data?.mensaje || "Error al guardar subítem";
      setError(msg);
      Swal.fire("Error", msg, "error");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Editar Subítem" : "Nuevo Subítem"}
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Cantidad</label>
          <input
            type="number"
            step="any"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Unidad</label>
          <input
            type="text"
            value={unidad}
            onChange={(e) => setUnidad(e.target.value)}
            required
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Precio Unitario</label>
          <input
            type="number"
            step="any"
            value={precioUnitario}
            onChange={(e) => setPrecioUnitario(e.target.value)}
            required
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          Guardar
        </button>

        <button
          type="button"
          onClick={() => navigate(`/homepage/presupuestos/${itemId}/subitems`)}
          className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
        >
          Regresar
        </button>
      </form>
    </div>
  );
}
