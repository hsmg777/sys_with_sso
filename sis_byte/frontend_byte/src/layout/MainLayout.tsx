// src/layout/MainLayout.tsx
import type { ReactNode } from "react";
import { Link, Outlet }    from "react-router-dom";
import { useAuth }         from "../contexts/AuthContext";
import {
  HomeIcon, UsersIcon, BanknotesIcon,
  ShoppingCartIcon, CalendarIcon,
  FolderIcon, ChartBarIcon, Squares2X2Icon
} from "@heroicons/react/24/outline";

interface MenuItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];      // roles permitted (si no existe, cualquiera autenticado)
}

export default function MainLayout({ children }: { children?: ReactNode }) {
  const { user, logout } = useAuth();

  const menu: MenuItem[] = [
    { to: "/homepage",                label: "Home",         icon: HomeIcon},
    { to: "/homepage/dashboard",      label: "Dashboard",    icon: Squares2X2Icon, roles:["administrador"]},
    { to: "/homepage/presupuestos",   label: "Presupuestos", icon: ChartBarIcon, roles:["administrador", "contable"]},
    { to: "/homepage/ingresos",       label: "Ingresos",     icon: BanknotesIcon },
    { to: "/homepage/ventas",         label: "Ventas",       icon: ShoppingCartIcon, roles:["administrador", "contable"] },
    { to: "/homepage/gastos",         label: "Gastos",       icon: FolderIcon },
    { to: "/homepage/clientes",       label: "Clientes",     icon: UsersIcon, roles: ["administrador"] },
    { to: "/homepage/usuarios",       label: "Usuarios",     icon: UsersIcon, roles: ["administrador"] },
    { to: "/homepage/stock",          label: "Registrar Stock",   icon: CalendarIcon, roles: ["administrador", "cosecha"] },
  ];

  // Filtrar solo los menús permitidos al rol actual
  const filtered = menu.filter(item =>
    !item.roles || item.roles.includes(user!.rol)
  );

  return (
    <div className="flex h-screen">
      {/* sidebar simplify... */}
      <aside className="w-64 bg-purple-700 text-white">
        <div className="h-16 flex items-center px-6">Byte App</div>
        <nav>
          {filtered.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center px-6 py-3 hover:bg-purple-600"
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* header... */}
        <header className="h-16 bg-purple-900 flex items-center px-6 justify-end">
          <button onClick={logout} className="text-white underline">
            Salir
          </button>
        </header>
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
