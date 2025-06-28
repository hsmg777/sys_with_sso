export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-indigo-600 mb-6">Bienvenido a NutriRec</h1>
      <div className="flex space-x-4">
        <a
          href="/login"
          className="bg-indigo-500 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-600"
        >
          Iniciar Sesión
        </a>
        <a
          href="/register"
          className="bg-gray-200 text-indigo-600 px-6 py-2 rounded-lg shadow hover:bg-gray-300"
        >
          Registrarse
        </a>
      </div>
    </main>
  );
}

