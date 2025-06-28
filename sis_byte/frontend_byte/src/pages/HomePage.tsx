// src/pages/HomePage.tsx
import { type FC } from "react";

const HomePage: FC = () => {
  return (
    <div className="bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Texto */}
        <div className="p-8 md:w-1/2 flex flex-col justify-center">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">Sys Byte</h1>
          <p className="text-gray-700 leading-relaxed">
            Sys Byte es un sistema de gestión integral para llevar el control
            de presupuestos, clientes, ventas, gastos e ingresos. Con una interfaz
            intuitiva y permisos basados en roles, permite a tu equipo colaborar
            de forma segura y eficiente.
          </p>
        </div>
        {/* Imagen */}
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
