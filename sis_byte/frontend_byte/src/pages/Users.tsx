// src/pages/Users.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Usuario } from "../services/users";
import { listUsers, deleteUser } from "../services/users";
import Swal from "sweetalert2";

export default function Users() {
  const [users, setUsers]             = useState<Usuario[]>([]);
  const [error, setError]             = useState<string | null>(null);
  const [search, setSearch]           = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchUsers = (filters: { nombre?: string; email?: string } = {}) => {
    setError(null);
    listUsers(filters)
      .then(r => setUsers(r.data))
      .catch(() => setError("No se pudieron cargar los usuarios"));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id: number) => {
    const res = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
    });
    if (!res.isConfirmed) return;

    try {
      await deleteUser(id);
      Swal.fire("Eliminado", "El usuario ha sido eliminado", "success");
      doSearch();
    } catch {
      Swal.fire("Error", "No se pudo eliminar el usuario", "error");
    }
  };

  const doSearch = () => {
    setIsSearching(true);
    if (search.includes("@")) {
      fetchUsers({ email: search });
    } else if (search.trim()) {
      fetchUsers({ nombre: search });
    } else {
      fetchUsers();
    }
    setIsSearching(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch();
  };

  const clearSearch = () => {
    setSearch("");
    fetchUsers();
  };

  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      {/* Header + botón en móvil colapsado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-semibold">Usuarios</h1>
        <Link
            to="/homepage/usuarios/nuevo"
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-center"
        >
            + Nuevo
        </Link>
        </div>

        {/* Search: columna en móvil, fila en sm+ */}
        <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-y-2 sm:gap-y-0 sm:space-x-2 mb-4"
        >
        <input
            type="text"
            placeholder="Buscar por nombre o email"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:flex-1 border px-3 py-2 rounded focus:outline-none"
        />
        <div className="flex flex-col sm:flex-row sm:space-x-2 gap-y-2 sm:gap-y-0">
            <button
            type="submit"
            disabled={isSearching}
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
            Buscar
            </button>
            <button
            type="button"
            onClick={clearSearch}
            disabled={!search}
            className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
            Limpiar
            </button>
        </div>
        </form>
      {/* TABLE para md+ */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-auto bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-3 py-2 text-sm border-b">ID</th>
              <th className="px-3 py-2 text-sm border-b">Nombre</th>
              <th className="px-3 py-2 text-sm border-b">Email</th>
              <th className="px-3 py-2 text-sm border-b">Rol</th>
              <th className="px-3 py-2 text-sm border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-2 text-center text-gray-500">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
            {users.map(u => (
              <tr key={u.id_usuario} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-sm border-b">{u.id_usuario}</td>
                <td className="px-3 py-2 text-sm border-b">{u.nombre}</td>
                <td className="px-3 py-2 text-sm border-b break-words">{u.email}</td>
                <td className="px-3 py-2 text-sm border-b">{u.rol}</td>
                <td className="px-3 py-2 text-sm border-b space-x-2">
                  <Link to={`/homepage/usuarios/${u.id_usuario}`} className="text-blue-600 hover:text-blue-800">
                    ✏️
                  </Link>
                  <button
                    onClick={() => handleDelete(u.id_usuario)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LISTADO tipo tarjetas para móvil */}
      <div className="md:hidden space-y-4">
        {users.length === 0 && (
          <p className="text-center text-gray-500">No se encontraron usuarios.</p>
        )}
        {users.map(u => (
          <details key={u.id_usuario} className="bg-white border border-gray-200 rounded-lg">
            <summary className="cursor-pointer px-4 py-2 flex justify-between items-center">
              <span>
                <strong>{u.id_usuario}.</strong> {u.nombre}
              </span>
              <span className="text-xl">▸</span>
            </summary>
            <div className="px-4 py-2 border-t border-gray-100 space-y-1">
              <p><strong>Email:</strong> {u.email}</p>
              <p><strong>Rol:</strong> {u.rol}</p>
              <div className="pt-2 flex space-x-4">
                <Link
                  to={`/homepage/usuarios/${u.id_usuario}`}
                  className="text-blue-600 hover:underline"
                >
                  ✏️ Editar
                </Link>
                <button
                  onClick={() => handleDelete(u.id_usuario)}
                  className="text-red-600 hover:underline"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
