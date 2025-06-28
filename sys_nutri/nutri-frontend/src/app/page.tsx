'use client';

import { tryGetSSOToken } from '@/lib/sso';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Solo intentar una vez
    const once = localStorage.getItem('sso_checked');
    if (once) return;

    localStorage.setItem('sso_checked', '1');

    const ok = confirm("¿Deseas iniciar sesión automáticamente con Keycloak?");
    if (ok) {
      tryGetSSOToken().then(success => {
        if (success) router.push('/landing');
      });
    }
  }, []);

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
