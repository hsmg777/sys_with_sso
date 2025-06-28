// src/pages/IngresoForm.tsx
import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createIngreso } from "../services/stock";
import { getStock } from "../services/stock";

export default function IngresoForm() {
  const { stockId } = useParams();
  const id_stock = Number(stockId);
  const navigate = useNavigate();
  const [producto, setProducto] = useState("(cargando...)");
  const [kilos, setKilos] = useState<string>("");
  const [sala, setSala] = useState<string>("");
  const [breakNumber, setBreakNumber] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id_stock) {
      getStock(+id_stock)
        .then((res) => setProducto(res.data.producto))
        .catch(() => setProducto("(no encontrado)"));
    }
  }, [id_stock]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!id_stock) {
      setError("No se ha definido el producto a ingresar");
      return;
    }

    try {
      await createIngreso({
        id_stock: +id_stock,
        kilos,
        sala: sala.trim() || undefined,
        break_number: breakNumber.trim() || undefined,
      });
      Swal.fire("Ingreso registrado", "Se ha registrado el ingreso de stock", "success");
      navigate("/homepage/stock");
    } catch (err: any) {
      const msg = err.response?.data?.mensaje || "Error registrando ingreso";
      setError(msg);
      Swal.fire("Error", msg, "error");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Nuevo Ingreso para: {producto}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Cantidad de kilos</label>
          <input
            type="number"
            step="0.01"
            value={kilos}
            onChange={(e) => setKilos(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Sala (opcional)</label>
          <input
            type="text"
            value={sala}
            onChange={(e) => setSala(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Break Number (opcional)</label>
          <input
            type="text"
            value={breakNumber}
            onChange={(e) => setBreakNumber(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Registrar Ingreso
        </button>
        <button
          type="button"
          onClick={() => navigate("/homepage/stock")}
          className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
