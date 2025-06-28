// src/pages/UserForm.tsx
import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Usuario } from "../services/users";
import { useAuth, type RegisterData } from "../contexts/AuthContext";
import { getUser, updateUser } from "../services/users";
import Swal from "sweetalert2";


type RouteParams = { userId?: string };

export default function UserForm() {
  const { register } = useAuth();                
  const params = useParams();
  const { userId } = params as RouteParams;
  const isEdit     = Boolean(userId);
  const navigate   = useNavigate();

  const [nombre, setNombre]         = useState("");
  const [email, setEmail]           = useState("");
  const [rol, setRol]               = useState<Usuario["rol"]>("administrador");
  const [contraseña, setContraseña] = useState("");
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) {
      getUser(+userId!)
        .then(r => {
          const u = r.data;
          setNombre(u.nombre);
          setEmail(u.email);
          setRol(u.rol);
        })
        .catch(() => setError("No se pudo cargar el usuario"));
    }
  }, [isEdit, userId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEdit) {
        await updateUser(+userId!, {
          nombre, email, rol,
          ...(contraseña ? { contraseña } : {}),
        });
        await Swal.fire("¡Hecho!", "Usuario actualizado correctamente.", "success");
      } else {
        const payload: RegisterData = { nombre, email, contraseña, rol };
        await register(payload);
        await Swal.fire("¡Hecho!", "Usuario creado correctamente.", "success");
      }
      navigate("/homepage/usuarios");
    } catch (err: any) {
      const msg = err.response?.data?.mensaje || "Error al guardar usuario";
      setError(msg);
      Swal.fire("Error", msg, "error");
    }
  };



  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Editar usuario" : "Nuevo usuario"}
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nombre</label>
          <input
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Rol</label>
          <select
            value={rol}
            onChange={e => setRol(e.target.value as Usuario["rol"])}
            className="w-full border px-2 py-1 rounded"
            required
          >
            <option value="administrador">Administrador</option>
            <option value="cosecha">Cosecha</option>
            <option value="contable">Contable</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">
            Contraseña{" "}
            {isEdit && (
              <span className="text-sm text-gray-500">(si quieres cambiarla)</span>
            )}
          </label>
          <input
            type="password"
            value={contraseña}
            onChange={e => setContraseña(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            minLength={isEdit ? undefined : 8}
            required={!isEdit}
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
            onClick={() => navigate("/homepage/usuarios")}
            className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-700 transition"
          >
            Regresar
          </button>
      </form>
    </div>
  );
}
