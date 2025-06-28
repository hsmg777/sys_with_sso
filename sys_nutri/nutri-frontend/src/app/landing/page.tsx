'use client';

export default function LandingPageMock() {
  // Datos quemados
  const userData = {
    nombres: 'Hayland',
    apellidos: 'Montalvo',
    email: 'hayland.montalvo@example.com',
    username: 'haylandito123',
    altura: '1.75',
    peso: '68',
    imc: '22.2',
    macronutrientes: {
      proteinas: 120,
      carbohidratos: 250,
      grasas: 70,
    },
    preferencias_alimentarias: [
      { id: 1, nombre: 'Vegetariano' },
      { id: 2, nombre: 'Sin gluten' },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          ¡Bienvenido, {userData.nombres} {userData.apellidos}!
        </h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Tu Información Personal:</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li><b>Correo Electrónico:</b> {userData.email}</li>
            <li><b>Nombre de Usuario:</b> {userData.username}</li>
            <li><b>Altura:</b> {userData.altura} m</li>
            <li><b>Peso:</b> {userData.peso} kg</li>
            <li><b>IMC:</b> {userData.imc}</li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Tus Macronutrientes Recomendados:</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li><b>Proteínas:</b> {userData.macronutrientes.proteinas} g</li>
            <li><b>Carbohidratos:</b> {userData.macronutrientes.carbohidratos} g</li>
            <li><b>Grasas:</b> {userData.macronutrientes.grasas} g</li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Preferencias Alimentarias:</h2>
          {userData.preferencias_alimentarias.length > 0 ? (
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              {userData.preferencias_alimentarias.map((pref) => (
                <li key={pref.id}>{pref.nombre}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No tienes preferencias alimentarias seleccionadas.</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <button
            className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Seleccionar Ingredientes
          </button>

          <button
            className="w-full px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
          >
            ¿Ya creciste y comiste la sopa?
          </button>
        </div>
      </div>
    </div>
  );
}
