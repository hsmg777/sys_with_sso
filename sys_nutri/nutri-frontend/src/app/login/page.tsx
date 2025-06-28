'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { login } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Definimos el tipo para los datos del formulario de inicio de sesión
interface LoginData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>(''); // Estado para manejar errores
  const { register, handleSubmit } = useForm<LoginData>(); // Tipar el formulario con LoginData

  // Manejar el envío del formulario
  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      setError(''); // Reiniciar errores
      const response = await login(data); // Llamar a la función de login
      localStorage.setItem('token', response.access); // Guardar el token en localStorage
      router.push('/landing'); // Redirigir a la página de bienvenida
    } catch {
      setError('Error al iniciar sesión. Verifica tus credenciales.'); // Manejar errores de inicio de sesión
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              {...register('email', { required: 'El correo es obligatorio' })}
              type="email"
              className="w-full border p-2 rounded"
              placeholder="ejemplo@correo.com"
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
