import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getStock, createStock, updateStock } from "../services/stock";

type RouteParams = { stockId?: string };

export default function StockForm() {
  const { stockId } = useParams() as RouteParams;
  const isEdit = Boolean(stockId);
  const navigate = useNavigate();

  const [producto, setProducto] = useState("");
  const [precio, setPrecio] = useState<string>("0.00");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    getStock(+stockId!)
      .then((r) => {
        const stock = r.data;
        setProducto(stock.producto);
        setPrecio("0.00"); // No actualizamos precio desde el backend por seguridad, solo edición manual
      })
      .catch(() => setError("No se pudo cargar el registro"));
  }, [isEdit, stockId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEdit) {
        await updateStock(+stockId!, { producto });
        Swal.fire("¡Actualizado!", "Producto actualizado.", "success");
      } else {
        await createStock({ producto: producto.trim(), precio_unitario: precio });
        Swal.fire("¡Hecho!", "Producto creado en el stock.", "success");
      }
      navigate("/homepage/stock");
    } catch (err: any) {
      const msg = err.response?.data?.mensaje || "Error guardando";
      setError(msg);
      Swal.fire("Error", msg, "error");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Editar producto" : "Nuevo producto"}
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Producto</label>
          <input
            type="text"
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>

        {!isEdit && (
          <div>
            <label className="block mb-1">Precio Unitario ($ por kg)</label>
            <input
              type="number"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full border px-2 py-1 rounded"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={() => navigate("/homepage/stock")}
          className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
        >
          Regresar
        </button>
      </form>
    </div>
  );
}
