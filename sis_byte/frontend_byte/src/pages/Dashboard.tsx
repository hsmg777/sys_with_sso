// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import api from "../services/api";

interface DashboardData {
  ingresos_vs_gastos: any[];
  presupuesto_ejecutado_vs_estimado: any[];
  pendientes_por_cobrar: any[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<DashboardData>("/dashboard")
       .then(resp => setData(resp.data))
       .catch(err => {
         console.error(err);
         setError("Error al cargar datos");
       });
  }, []);

  if (error) return <p className="text-red-500 p-4">{error}</p>;
  if (!data)  return <p className="p-4">Cargando dashboard…</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Administrador</h1>

      <section className="mb-8">
        <h2 className="font-semibold">Ingresos vs Gastos</h2>
        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data.ingresos_vs_gastos, null, 2)}</pre>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold">Presupuesto ejecutado vs estimado</h2>
        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data.presupuesto_ejecutado_vs_estimado, null, 2)}</pre>
      </section>

      <section>
        <h2 className="font-semibold">Pendientes por cobrar</h2>
        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data.pendientes_por_cobrar, null, 2)}</pre>
      </section>
    </div>
  );
}
