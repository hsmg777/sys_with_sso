// src/pages/ClientForm.tsx
import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useParams }        from "react-router-dom";
import { useLocation } from "react-router-dom";
import Swal                                from "sweetalert2";
import type { Cliente }                    from "../services/clients";
import { getClient, createClient, updateClient } from "../services/clients";

type RouteParams = { clientId?: string };

export default function ClientForm() {
  const params    = useParams();
  const { clientId } = params as RouteParams;
  const isEdit    = Boolean(clientId);
  const navigate  = useNavigate();
  const location = useLocation();
  const fromVentas = location.state?.fromVentas;
  const [nombre, setNombre]       = useState("");
  const [email, setEmail]         = useState("");
  const [telefono, setTelefono]   = useState("");
  const [direccion, setDireccion] = useState("");
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) {
      getClient(+clientId!)
        .then(r => {
          const c: Cliente = r.data;
          setNombre(c.nombre);
          setEmail(c.email);
          setTelefono(c.telefono || "");
          setDireccion(c.direccion || "");
        })
        .catch(() => setError("No se pudo cargar el cliente"));
    }
  }, [isEdit, clientId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEdit) {
        await updateClient(+clientId!, { nombre, email, telefono, direccion });
        await Swal.fire("¡Hecho!", "Cliente actualizado correctamente.", "success");
      } else {
        await createClient({ nombre, email, telefono, direccion });
        await Swal.fire("¡Hecho!", "Cliente creado correctamente.", "success");
      }
      if (fromVentas) {
        navigate("/homepage/ventas");
      } else {
        navigate("/homepage/clientes");
      }
    } catch (err: any) {
      const msg = err.response?.data?.mensaje || "Error al guardar cliente";
      setError(msg);
      Swal.fire("Error", msg, "error");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Editar Cliente" : "Nuevo Cliente"}
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Teléfono</label>
          <input
            type="text"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Dirección</label>
          <textarea
            value={direccion}
            onChange={e => setDireccion(e.target.value)}
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
          onClick={() => navigate("/homepage/clientes")}
          className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
        >
          Regresar
        </button>
      </form>
    </div>
  );
}
