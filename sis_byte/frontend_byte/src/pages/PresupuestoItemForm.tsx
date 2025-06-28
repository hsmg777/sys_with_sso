// src/pages/PresupuestoItemForm.tsx
import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import type { PresupuestoItem } from "../services/presupuestos";
import { getItem, createItem, updateItem } from "../services/presupuestos";

type RouteParams = { itemId?: string };

export default function PresupuestoItemForm() {
  const params = useParams();
  const { itemId } = params as RouteParams;
  const isEdit = Boolean(itemId);
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) {
      getItem(+itemId!)
        .then(res => {
          const item: PresupuestoItem = res.data;
          setNombre(item.nombre);
        })
        .catch(() => {
          setError("No se pudo cargar el ítem");
        });
    }
  }, [isEdit, itemId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEdit) {
        await updateItem(+itemId!, { nombre });
        await Swal.fire("¡Listo!", "Ítem actualizado correctamente.", "success");
      } else {
        await createItem({ nombre });
        await Swal.fire("¡Listo!", "Ítem creado correctamente.", "success");
      }
      navigate("/homepage/presupuestos");
    } catch (err: any) {
      const msg = err.response?.data?.mensaje || "Error al guardar el ítem";
      setError(msg);
      Swal.fire("Error", msg, "error");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Editar Ítem" : "Nuevo Ítem"}
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nombre del ítem</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        >
          Guardar
        </button>

        <button
          type="button"
          onClick={() => navigate("/homepage/presupuestos")}
          className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
        >
          Regresar
        </button>
      </form>
    </div>
  );
}
