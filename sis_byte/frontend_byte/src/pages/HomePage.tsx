'use client';

import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const HomePage: React.FC = () => {
  // Guarda el último mensaje mostrado
  let ultimoMensajeMostrado: string | null = null;

  // Función para revisar si hay un nuevo mensaje
  const revisarNuevoMensaje = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/trama/ultimo');
      const data = await res.json();

      if (data.mensaje && data.mensaje !== ultimoMensajeMostrado) {
        // Muestra el SweetAlert
        Swal.fire({
          icon: 'info',
          title: 'Nuevo Mensaje',
          text: data.mensaje,
        });
        ultimoMensajeMostrado = data.mensaje;
      }
    } catch (err) {
      console.error('Error al consultar el backend', err);
    }
  };

  useEffect(() => {
    // Consulta cada 3 segundos
    const interval = setInterval(revisarNuevoMensaje, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        <div className="p-8 md:w-1/2 flex flex-col justify-center">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">Sys Byte</h1>
          <p className="text-gray-700 leading-relaxed">
            Este sistema mostrará automáticamente los mensajes recibidos desde Sys Nutri como notificaciones.
          </p>
        </div>
        <div className="md:w-1/2 flex items-center justify-center p-6">
          <img
            src="/logo.png"
            alt="Logotipo de Sys Byte"
            className="w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
