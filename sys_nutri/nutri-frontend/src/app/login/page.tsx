'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { login } from '@/lib/api';
import { tryGetSSOToken } from '@/lib/sso';
import Swal from 'sweetalert2';

interface LoginData {
  username: string;
  password: string;
}

function decodeJWT(token: string): any {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (e) {
    console.warn('Error decodificando token:', e);
    return null;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const { register, handleSubmit } = useForm<LoginData>();

  // ✅ Detectar sesión activa con Keycloak desde sysbyte
  useEffect(() => {
    const checkSSO = async () => {
      const ok = await tryGetSSOToken();
      if (ok) {
        const token = localStorage.getItem('token');
        const decoded = token ? decodeJWT(token) : null;

        const nombre = decoded?.name || decoded?.given_name || decoded?.preferred_username || 'usuario';

        // 🎉 Mostrar SweetAlert
        Swal.fire({
          icon: 'success',
          title: `¡Hola, ${nombre}!`,
          text: 'Se detectó sesión activa desde SysByte. Redirigiendo...',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        // Redirigir después del tiempo del SweetAlert
        setTimeout(() => {
          router.push('/landing');
        }, 1000);
      }
    };
    checkSSO();
  }, []);

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      setError('');
      const response = await login(data);
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      router.push('/landing');
    } catch {
      setError('Credenciales incorrectas. Intenta nuevamente.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Iniciar Sesión</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Usuario</label>
            <input
              {...register('username', { required: 'El usuario es obligatorio' })}
              type="text"
              className="w-full border p-2 rounded"
              placeholder="usuario"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              {...register('password', { required: 'La contraseña es obligatoria' })}
              type="password"
              className="w-full border p-2 rounded"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
          >
            Iniciar Sesión
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
