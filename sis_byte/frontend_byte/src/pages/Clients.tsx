// src/pages/Clients.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import type { Cliente } from "../services/clients";
import { listClients, deleteClient } from "../services/clients";

export default function Clients() {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [error, setError]     = useState<string | null>(null);
  const [search, setSearch]   = useState("");

  const fetchClients = (q = "") => {
    setError(null);
    listClients({ nombre: q, email: q })
      .then(r => setClients(r.data))
      .catch(() => setError("No se pudieron cargar los clientes"));
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Eliminar cliente?",
      text: "¡No podrás revertirlo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar"
    });
    if (result.isConfirmed) {
      try {
        await deleteClient(id);
        Swal.fire("Borrado", "El cliente ha sido eliminado", "success");
        fetchClients(search);
      } catch {
        Swal.fire("Error", "No se pudo eliminar el cliente", "error");
      }
    }
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClients(search.trim());
  };
  const clearSearch = () => {
    setSearch("");
    fetchClients();
  };

  return (
      <div className="p-6">
        {/* Header + Nuevo */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h1 className="text-2xl font-semibold mb-2 sm:mb-0">Clientes</h1>
          <Link
            to="/homepage/clientes/nuevo"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            + Nuevo
          </Link>
        </div>

        {/* Buscador */}
        <form onSubmit={onSearch} className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre o email"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border px-3 py-2 rounded focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Buscar
          </button>
          <button
            type="button"
            onClick={clearSearch}
            disabled={!search}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded disabled:opacity-50"
          >
            Limpiar
          </button>
        </form>

        {/* Error */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-3 py-2 text-sm border-b">ID</th>
                <th className="px-3 py-2 text-sm border-b">Nombre</th>
                <th className="hidden sm:table-cell px-3 py-2 text-sm border-b">Email</th>
                <th className="hidden sm:table-cell px-3 py-2 text-sm border-b">Teléfono</th>
                <th className="px-3 py-2 text-sm border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-2 text-center text-gray-500">
                    No se encontraron clientes.
                  </td>
                </tr>
              )}
              {clients.map(c => (
                <tr key={c.id_cliente} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm border-b">{c.id_cliente}</td>
                  <td className="px-3 py-2 text-sm border-b">{c.nombre}</td>
                  <td className="hidden sm:table-cell px-3 py-2 text-sm border-b break-words">
                    {c.email}
                  </td>
                  <td className="hidden sm:table-cell px-3 py-2 text-sm border-b">
                    {c.telefono}
                  </td>
                  <td className="px-3 py-2 text-sm border-b space-x-2">
                    <Link
                      to={`/dashboard/clientes/${c.id_cliente}`}
                      className="text-blue-600 hover:text-blue-800"
                      aria-label="Editar"
                    >
                      ✏️
                    </Link>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(c.id_cliente)}
                      aria-label="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}
