'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ENDPOINTS } from '@/lib/apiEndpoints';

// Definimos tipos para los datos manejados
interface Ingrediente {
  id: number;
  nombre: string;
}

interface Receta {
  id: number;
  receta: string;
  ingredientes_disponibles: string[];
  ingredientes_faltantes: string[];
  es_apta: boolean;
  razones_no_apta: string[];
}

interface RecetaDetalle {
  id: number;
  nombre: string;
  descripcion: string;
  tiempo_preparacion: number;
  porciones: number;
  valores_nutricionales: {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
  };
}

interface RecetaMasGuardada {
  receta__id: number;
  receta__nombre: string;
  total_guardadas: number;
}

const IngredientesPage = () => {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [selectedIngredientes, setSelectedIngredientes] = useState<number[]>([]);
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [error, setError] = useState<string>('');
  const [recetaModalData, setRecetaModalData] = useState<RecetaDetalle | null>(null);
  const [razonesNoApta, setRazonesNoApta] = useState<string[]>([]);
  const [isApta, setIsApta] = useState<boolean>(false);

  // Estados para filtrar recetas más guardadas
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [recetasMasGuardadas, setRecetasMasGuardadas] = useState<RecetaMasGuardada[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const router = useRouter();

  // Fetch de ingredientes
  useEffect(() => {
    const fetchIngredientes = async () => {
      try {
        const response = await fetch(ENDPOINTS.INGREDIENTES.LIST);
        if (!response.ok) {
          throw new Error('Error al cargar los ingredientes.');
        }
        const data: Ingrediente[] = await response.json();
        setIngredientes(data);
      } catch (err) {
        setError('Error al cargar los ingredientes.');
      }
    };

    fetchIngredientes();
  }, []);

  // Selección de ingredientes
  const toggleIngrediente = (id: number) => {
    setSelectedIngredientes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Fetch de recetas recomendadas
  const fetchRecetas = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Usuario no autenticado.');
        return;
      }

      const response = await fetch(ENDPOINTS.RECETAS.RECOMENDACIONES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ingredientes: selectedIngredientes }),
      });

      if (!response.ok) {
        throw new Error('Error al cargar las recetas.');
      }

      const data: Receta[] = await response.json();
      setRecetas(data);
    } catch (err) {
      setError('Error al cargar las recetas.');
    }
  };

  // Fetch de detalles de una receta
  const fetchRecetaDetails = async (id: number) => {
    try {
      const response = await fetch(ENDPOINTS.RECETAS.DETAILS(id));
      if (!response.ok) {
        throw new Error('Error al cargar los detalles de la receta.');
      }
      const data: RecetaDetalle = await response.json();

      const recetaApta = recetas.find((receta) => receta.id === id)?.es_apta || false;
      setIsApta(recetaApta);

      setRecetaModalData(data);
    } catch (err) {
      setError('Error al cargar los detalles de la receta.');
    }
  };

  // Guardar receta
  const guardarReceta = async () => {
    if (!recetaModalData) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Usuario no autenticado.');
        return;
      }

      const response = await fetch(ENDPOINTS.RECETAS.GUARDADAS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receta_id: recetaModalData.id }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la receta.');
      }

      alert('Receta guardada con éxito.');
      closeRecetaModal();
    } catch (err) {
      setError('Error al guardar la receta.');
    }
  };

  // Fetch de recetas más guardadas
  const fetchRecetasMasGuardadas = async () => {
    try {
      let url = ENDPOINTS.RECETAS.MAS_GUARDADAS;

      const params = new URLSearchParams();
      if (fechaInicio) params.append('fecha_inicio', fechaInicio);
      if (fechaFin) params.append('fecha_fin', fechaFin);
      if (params.toString()) url += `?${params.toString()}`;

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuario no autenticado.');
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener las recetas más guardadas.');
      }

      const data: RecetaMasGuardada[] = await response.json();
      setRecetasMasGuardadas(data);
    } catch (err) {
      setError('Error al cargar las recetas más guardadas.');
    }
  };

  // Mostrar razones de por qué no es apta
  const showRazonesNoApta = (razones: string[]) => {
    setRazonesNoApta(razones);
  };

  // Cerrar modales
  const closeRecetaModal = () => {
    setRecetaModalData(null);
    setIsApta(false);
  };
  const closeRazonesModal = () => {
    setRazonesNoApta([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Selección de ingredientes */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Selecciona tus Ingredientes</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-2 gap-4">
          {ingredientes.map((ingrediente) => (
            <div
              key={ingrediente.id}
              className={`p-4 border rounded-md ${
                selectedIngredientes.includes(ingrediente.id)
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-gray-50 border-gray-300'
              }`}
              onClick={() => toggleIngrediente(ingrediente.id)}
            >
              <h2 className="font-semibold">{ingrediente.nombre}</h2>
            </div>
          ))}
        </div>
        <button
          onClick={fetchRecetas}
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Ver Recetas Recomendadas
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600"
        >
          Ver Recetas Más Guardadas
        </button>
      </div>

      {/* Renderizar recetas recomendadas */}
      {recetas.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Recetas Recomendadas</h2>
          {recetas.map((receta) => (
            <div key={receta.id} className="p-4 border rounded-lg bg-white shadow-sm mb-4">
              <h3 className="font-semibold text-lg">{receta.receta}</h3>
              <p>
                Ingredientes disponibles: <b>{receta.ingredientes_disponibles.join(', ')}</b>
              </p>
              <p>
                Ingredientes faltantes: <b>{receta.ingredientes_faltantes.join(', ')}</b>
              </p>
              {receta.es_apta ? (
                <p className="text-green-500 font-bold mt-2">Esta receta es apta para ti.</p>
              ) : (
                <>
                  <p className="text-red-500 font-bold mt-2">
                    Debido a tus preferencias alimenticias, no te recomendamos esta receta.
                  </p>
                  <button
                    onClick={() => showRazonesNoApta(receta.razones_no_apta)}
                    className="mt-2 text-blue-500 underline"
                  >
                    ¿Por qué no te recomendamos esta receta?
                  </button>
                </>
              )}
              <button
                onClick={() => fetchRecetaDetails(receta.id)}
                className="mt-2 text-blue-500 underline"
              >
                Ver detalles
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalles de receta */}
      {recetaModalData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{recetaModalData.nombre}</h2>
            <p>{recetaModalData.descripcion}</p>
            <ul className="mt-4">
              <li>
                <b>Tiempo de preparación:</b> {recetaModalData.tiempo_preparacion} minutos
              </li>
              <li>
                <b>Porciones:</b> {recetaModalData.porciones}
              </li>
              <li>
                <b>Valores Nutricionales:</b>
                <ul className="list-disc pl-6">
                  <li>Calorías: {recetaModalData.valores_nutricionales.calorias}</li>
                  <li>Proteínas: {recetaModalData.valores_nutricionales.proteinas} g</li>
                  <li>Carbohidratos: {recetaModalData.valores_nutricionales.carbohidratos} g</li>
                  <li>Grasas: {recetaModalData.valores_nutricionales.grasas} g</li>
                </ul>
              </li>
            </ul>
            {isApta && (
              <button
                onClick={guardarReceta}
                className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              >
                Guardar Receta
              </button>
            )}
            <button
              onClick={closeRecetaModal}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal de razones por las que no es apta */}
      {razonesNoApta.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Razones por las que no es apta</h2>
            <ul className="list-disc pl-6">
              {razonesNoApta.map((razon, index) => (
                <li key={index}>{razon}</li>
              ))}
            </ul>
            <button
              onClick={closeRazonesModal}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal de recetas más guardadas */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Recetas Más Guardadas</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium">Fecha Inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full border p-2 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Fecha Fin</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full border p-2 rounded-md"
              />
            </div>
            <button
              onClick={fetchRecetasMasGuardadas}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 mb-4"
            >
              Buscar
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
            >
              Cerrar
            </button>
            <ul className="mt-4 list-disc pl-6">
              {recetasMasGuardadas.map((receta) => (
                <li key={receta.receta__id}>
                  {receta.receta__nombre} - Elegida por los usuarios {receta.total_guardadas} veces
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientesPage;
