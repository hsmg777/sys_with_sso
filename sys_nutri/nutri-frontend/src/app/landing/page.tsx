'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserData, updateUserData } from '@/lib/api';

export default function LandingPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({ altura: '', peso: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login'); // Si no hay token, redirigir al login
          return;
        }
        const data = await getUserData(token);
        setUserData(data);
        setUpdatedData({ altura: data.altura || '', peso: data.peso || '' });
      } catch (e: any) {
        setError(e.message || 'Error al cargar los datos');
      }
    };
    fetchData();
  }, [router]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      await updateUserData(token, updatedData);
      setUserData((prev: any) => ({
        ...prev,
        altura: updatedData.altura,
        peso: updatedData.peso,
      }));
      setIsEditing(false);
    } catch (e: any) {
      setError(e.message || 'Error al actualizar los datos');
    }
  };

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!userData) {
    return <p className="text-center text-gray-500">Cargando...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          ¡Bienvenido, {userData.nombres} {userData.apellidos}!
        </h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Tu Información Personal:</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>
              <b>Correo Electrónico:</b> {userData.email}
            </li>
            <li>
              <b>Nombre de Usuario:</b> {userData.username}
            </li>
            <li>
              <b>Altura:</b> {userData.altura ? `${userData.altura} m` : 'No especificado'}
            </li>
            <li>
              <b>Peso:</b> {userData.peso ? `${userData.peso} kg` : 'No especificado'}
            </li>
            <li>
              <b>IMC:</b> {userData.imc ? userData.imc : 'No calculado'}
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Tus Macronutrientes Recomendados:</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>
              <b>Proteínas:</b> {userData.macronutrientes.proteinas} g
            </li>
            <li>
              <b>Carbohidratos:</b> {userData.macronutrientes.carbohidratos} g
            </li>
            <li>
              <b>Grasas:</b> {userData.macronutrientes.grasas} g
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Preferencias Alimentarias:</h2>
          {userData.preferencias_alimentarias.length > 0 ? (
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              {userData.preferencias_alimentarias.map((pref: any) => (
                <li key={pref.id}>{pref.nombre}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No tienes preferencias alimentarias seleccionadas.</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push('/ingredientes')}
            className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Seleccionar Ingredientes
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-full px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
          >
            ¿Ya creciste y comiste la sopa?
          </button>
        </div>

        {isEditing && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Actualizar Altura y Peso</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Altura (m):</label>
                <input
                  type="number"
                  step="0.01"
                  value={updatedData.altura}
                  onChange={(e) => setUpdatedData({ ...updatedData, altura: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Peso (kg):</label>
                <input
                  type="number"
                  step="0.1"
                  value={updatedData.peso}
                  onChange={(e) => setUpdatedData({ ...updatedData, peso: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <button
                onClick={handleUpdate}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
