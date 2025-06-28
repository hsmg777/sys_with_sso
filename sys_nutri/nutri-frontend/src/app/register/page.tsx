'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { registerUser } from '@/lib/api';
import { useRouter } from 'next/navigation';

// Esquema de validación con yup
const schema = yup.object().shape({
  username: yup.string().required('Nombre de usuario es requerido'),
  email: yup.string().email('Correo inválido').required('Correo es requerido'),
  password: yup.string().min(6, 'Contraseña muy corta').required('Contraseña es requerida'),
  nombres: yup.string().required('Nombre es requerido'),
  apellidos: yup.string().required('Apellido es requerido'),
  altura: yup.number().positive('Altura inválida').required('Altura es requerida'),
  peso: yup.number().positive('Peso inválido').required('Peso es requerido'),
  preferencias_ids: yup.array().of(yup.number().nullable()).optional(), // Cambiado a `nullable` para permitir valores opcionales
});

// Interfaz para los datos del formulario
interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  nombres: string;
  apellidos: string;
  altura: number;
  peso: number;
  preferencias_ids?: (number | null)[]; // Cambiado para aceptar valores opcionales
}

// Opciones de preferencias
const preferencias = [
  { id: 1, nombre: 'Vegetariano' },
  { id: 2, nombre: 'Vegano' },
  { id: 3, nombre: 'Sin Gluten' },
  { id: 4, nombre: 'Sin Lactosa' },
  { id: 5, nombre: 'Keto' },
  { id: 6, nombre: 'Paleo' },
  { id: 7, nombre: 'Diabético' },
  { id: 8, nombre: 'Bajo en sodio' },
  { id: 9, nombre: 'Alto en proteínas' },
  { id: 10, nombre: 'Sin Azúcar' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema) as any,
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      setError('');
      await registerUser(data);
      router.push('/login');
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message || 'Error al registrarse');
      } else {
        setError('Ocurrió un error desconocido.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Crear Cuenta</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre de Usuario */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Nombre de Usuario
            </label>
            <input {...register('username')} className="w-full border p-2 rounded" />
            {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
          </div>

          {/* Correo Electrónico */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Correo Electrónico
            </label>
            <input {...register('email')} className="w-full border p-2 rounded" />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Contraseña
            </label>
            <input {...register('password')} type="password" className="w-full border p-2 rounded" />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>

          {/* Nombres */}
          <div>
            <label htmlFor="nombres" className="block text-sm font-medium">
              Nombre
            </label>
            <input {...register('nombres')} className="w-full border p-2 rounded" />
            {errors.nombres && <p className="text-red-500 text-xs">{errors.nombres.message}</p>}
          </div>

          {/* Apellidos */}
          <div>
            <label htmlFor="apellidos" className="block text-sm font-medium">
              Apellido
            </label>
            <input {...register('apellidos')} className="w-full border p-2 rounded" />
            {errors.apellidos && <p className="text-red-500 text-xs">{errors.apellidos.message}</p>}
          </div>

          {/* Altura */}
          <div>
            <label htmlFor="altura" className="block text-sm font-medium">
              Altura (en metros)
            </label>
            <input {...register('altura')} type="number" step="0.01" className="w-full border p-2 rounded" />
            {errors.altura && <p className="text-red-500 text-xs">{errors.altura.message}</p>}
          </div>

          {/* Peso */}
          <div>
            <label htmlFor="peso" className="block text-sm font-medium">
              Peso (en kilogramos)
            </label>
            <input {...register('peso')} type="number" className="w-full border p-2 rounded" />
            {errors.peso && <p className="text-red-500 text-xs">{errors.peso.message}</p>}
          </div>

          {/* Preferencias Alimentarias */}
          <div className="col-span-2">
            <label htmlFor="preferencias_ids" className="block text-sm font-medium">
              Preferencias Alimentarias
            </label>
            <select
              multiple
              {...register('preferencias_ids')}
              className="w-full border p-2 rounded"
            >
              {preferencias.map((pref) => (
                <option key={pref.id} value={pref.id}>
                  {pref.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Botón de Registro */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Registrarse
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
