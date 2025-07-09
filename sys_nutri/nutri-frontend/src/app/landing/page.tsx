'use client';

import { useState } from 'react';
// @ts-ignore
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'clave-super-secreta-32bytes-!!!!'; 

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

  const [mensaje, setMensaje] = useState('');
  const [estado, setEstado] = useState('');

  const IV = CryptoJS.enc.Utf8.parse('iv-para-encriptacion'); // 16 bytes

  const encryptPayload = (data: any) => {
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      key,
      {
        iv: IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  };

  const handleEnviarTrama = async () => {
    if (!mensaje) {
      setEstado('❌ Escribe un mensaje antes de enviar');
      return;
    }

    const tramaCifrada = encryptPayload({ mensaje });

    try {
      const res = await fetch('http://localhost:5000/api/trama/recibir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trama: tramaCifrada }),
      });


      if (res.ok) {
        const data = await res.json();
        console.log('✅ Trama enviada:', data);
        setEstado(`✅ Trama enviada correctamente: "${mensaje}"`);
        setMensaje(''); // limpia input
      } else {
        setEstado('❌ Error al enviar la trama');
      }
    } catch (err) {
      console.error('❌ Error al enviar la trama:', err);
      setEstado('❌ Error al enviar la trama');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          ¡Bienvenido, {userData.nombres} {userData.apellidos}!
        </h1>

        {/* Sección de información */}
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

        {/* NUEVO: Enviar Trama */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Enviar Trama a SYS BYTE:</h2>
          <input
            type="text"
            placeholder="Escribe un mensaje"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={handleEnviarTrama}
            className="w-full px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Enviar Trama
          </button>
          {estado && (
            <p className="mt-2 text-sm text-gray-600">{estado}</p>
          )}
        </div>

        {/* Botones anteriores */}
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
