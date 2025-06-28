import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import type { Stock } from "../services/stock";
import { listStock, deleteStock } from "../services/stock";

export default function StockPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetch = () => {
    listStock()
      .then((r) => setStocks(r.data))
      .catch(() => setError("No se pudo cargar el stock"));
  };

  useEffect(fetch, []);

  const handleDelete = async (id: number) => {
    const res = await Swal.fire({
      title: "¿Eliminar este producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (res.isConfirmed) {
      try {
        await deleteStock(id);
        Swal.fire("Eliminado", "Producto eliminado del stock", "success");
        fetch();
      } catch {
        Swal.fire("Error", "No se pudo eliminar el producto", "error");
      }
    }
  };

  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Stock de Cosecha</h1>
        <button
          onClick={() => navigate("/homepage/stock/nuevo")}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          + Nuevo producto
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Producto</th>
              <th className="px-3 py-2 text-left">Cantidad Total (kg)</th>
              <th className="px-3 py-2 text-left">Precio Unitario ($/kg)</th>
              <th className="px-3 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((s) => (
              <tr key={s.id_stock} className="hover:bg-gray-50">
                <td className="px-3 py-2">{s.id_stock}</td>
                <td className="px-3 py-2">{s.producto}</td>
                <td className="px-3 py-2">{s.cantidad_total}</td>
                <td className="px-3 py-2">${s.precio_unitario}</td>
                <td className="px-3 py-2 space-x-2">
                  <button
                    onClick={() =>
                      navigate(`/homepage/stock/${s.id_stock}/ingresos/nuevo`)
                    }
                    className="text-green-600 hover:text-green-800"
                    title="Registrar ingreso"
                  >
                    📦
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/homepage/stock/${s.id_stock}/ingresos`)
                    }
                    className="text-indigo-600 hover:text-indigo-800"
                    title="Ver ingresos"
                  >
                    👁
                  </button>
                  <button
                    onClick={() => navigate(`/homepage/stock/${s.id_stock}`)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Editar producto"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(s.id_stock)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar producto"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {stocks.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-center text-gray-500">
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
