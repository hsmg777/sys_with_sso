// src/pages/IngresoList.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { listIngresosByStock, type IngresoStock } from "../services/stock";

export default function IngresoList() {
  const { stockId } = useParams();
  const id_stock = Number(stockId);
  const navigate = useNavigate();
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroBreak, setFiltroBreak] = useState("");


  const [ingresos, setIngresos] = useState<IngresoStock[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetch = () => {
    listIngresosByStock(id_stock)
      .then(r => setIngresos(r.data))
      .catch(() => setError("No se pudo cargar los ingresos"));
  };

  useEffect(() => {
    if (!id_stock) {
      setError("ID de producto inválido");
    } else {
      fetch();
    }
  }, [id_stock]);

  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-6">
      <div className="mb-4 space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Ingresos registrados</h2>
            <button
            onClick={() => navigate(`/homepage/stock/${id_stock}/ingresos/nuevo`)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
            + Nuevo ingreso
            </button>
        </div>
        <div className="flex space-x-4">
            <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="border px-2 py-1 rounded w-48"
            placeholder="Filtrar por fecha"
            />
            <input
            type="text"
            value={filtroBreak}
            onChange={(e) => setFiltroBreak(e.target.value)}
            className="border px-2 py-1 rounded w-48"
            placeholder="Filtrar por break #"
            />
        </div>
        </div>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Fecha</th>
              <th className="px-3 py-2 text-left">Kilos</th>
              <th className="px-3 py-2 text-left">Sala</th>
              <th className="px-3 py-2 text-left">Break #</th>
            </tr>
          </thead>
          <tbody>
            {ingresos.filter(i =>
                    (!filtroFecha || i.fecha_ingreso === filtroFecha) &&
                    (!filtroBreak || i.break_number?.toLowerCase().includes(filtroBreak.toLowerCase()))
                ).map(i => (
              <tr key={i.id_ingreso} className="hover:bg-gray-50">
                <td className="px-3 py-2">{i.fecha_ingreso}</td>
                <td className="px-3 py-2">{i.kilos}</td>
                <td className="px-3 py-2">{i.sala || "-"}</td>
                <td className="px-3 py-2">{i.break_number || "-"}</td>
              </tr>
            ))}
            {ingresos.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-center text-gray-500">
                  Sin ingresos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
