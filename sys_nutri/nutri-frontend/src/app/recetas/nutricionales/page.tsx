'use client';

import { useEffect, useState } from 'react';
import { ENDPOINTS } from '@/lib/apiEndpoints';

// Tipos para los datos de macronutrientes
interface Macronutrientes {
  minimos: {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
  };
  maximos: {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
  };
}

// Tipo para las recetas
interface Receta {
  receta: string;
  valores_nutricionales: {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
  };
  es_apta_por_macronutrientes: boolean;
  razones_no_apta: string[];
}

export default function RecetasNutricionalesPage() {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [macronutrientes, setMacronutrientes] = useState<Macronutrientes | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch de necesidades de macronutrientes
        const macronutrientesResponse = await fetch(ENDPOINTS.AUTH.MACRONUTRIENTES, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!macronutrientesResponse.ok) {
          throw new Error('Error al obtener las necesidades de macronutrientes');
        }

        const macronutrientesData: Macronutrientes = await macronutrientesResponse.json();
        setMacronutrientes(macronutrientesData);

        // Fetch de recetas nutricionales
        const recetasResponse = await fetch(ENDPOINTS.RECETAS.NUTRICIONALES, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!recetasResponse.ok) {
          throw new Error('Error al obtener las recetas');
        }

        const recetasData: Receta[] = await recetasResponse.json();
        setRecetas(recetasData);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Ocurrió un error desconocido.');
        }
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!macronutrientes) {
    return <p className="text-gray-600 text-center">Cargando necesidades nutricionales...</p>;
  }

  if (recetas.length === 0) {
    return <p className="text-gray-600 text-center">No hay recetas recomendadas disponibles.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Recetas Nutricionales</h1>

        {/* Mostrar necesidades de macronutrientes */}
        <div className="mb-6 p-4 border rounded-lg bg-blue-50">
          <h2 className="text-lg font-semibold">Tus necesidades nutricionales:</h2>
          <p>
            <b>Calorías mínimas:</b> {macronutrientes.minimos.calorias} kcal | <b>máximas:</b>{' '}
            {macronutrientes.maximos.calorias} kcal
          </p>
          <p>
            <b>Proteínas mínimas:</b> {macronutrientes.minimos.proteinas} g | <b>máximas:</b>{' '}
            {macronutrientes.maximos.proteinas} g
          </p>
          <p>
            <b>Carbohidratos mínimos:</b> {macronutrientes.minimos.carbohidratos} g |{' '}
            <b>máximos:</b> {macronutrientes.maximos.carbohidratos} g
          </p>
          <p>
            <b>Grasas mínimas:</b> {macronutrientes.minimos.grasas} g | <b>máximas:</b>{' '}
            {macronutrientes.maximos.grasas} g
          </p>
        </div>

        {/* Mostrar recetas */}
        {recetas.map((receta) => (
          <div
            key={receta.receta}
            className="p-4 border rounded-lg bg-white shadow-sm mb-4"
          >
            <h3 className="font-semibold text-lg">{receta.receta}</h3>
            <p>
              <b>Calorías:</b> {receta.valores_nutricionales.calorias.toFixed(1)} kcal
            </p>
            <p>
              <b>Proteínas:</b> {receta.valores_nutricionales.proteinas.toFixed(1)} g
            </p>
            <p>
              <b>Carbohidratos:</b> {receta.valores_nutricionales.carbohidratos.toFixed(1)} g
            </p>
            <p>
              <b>Grasas:</b> {receta.valores_nutricionales.grasas.toFixed(1)} g
            </p>
            {receta.es_apta_por_macronutrientes ? (
              <p className="text-green-500 font-bold mt-2">
                Esta receta es apta para tus necesidades nutricionales.
              </p>
            ) : (
              <div className="text-red-500 font-bold mt-2">
                <p>Esta receta no se ajusta a tus necesidades nutricionales por las siguientes razones:</p>
                <ul className="list-disc ml-6">
                  {receta.razones_no_apta.map((razon, index) => (
                    <li key={index}>{razon}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
