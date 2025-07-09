// src/router/AppRouter.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider }       from "../contexts/AuthContext";
import Login                  from "../pages/Login";
import HomePage               from "../pages/HomePage"; 
import Dashboard              from "../pages/Dashboard";
import NotFound               from "../pages/NotFound";
import NotAuthorized          from "../pages/NotAuthorized";
import MainLayout             from "../layout/MainLayout";
import Users                  from "../pages/Users";
import UserForm               from "../pages/UserForm";
import Clients                from "../pages/Clients";
import ClientForm             from "../pages/ClientForm";
import Presupuestos           from "../pages/Presupuestos";
import PresupuestoItemForm    from "../pages/PresupuestoItemForm";
import Subitems               from "../pages/Subitems";
import SubitemForm            from "../pages/SubitemForm";
import Stock                  from "../pages/Stock";
import StockForm              from "../pages/StockForm";
import { AuthenticatedRoute } from "../components/AuthenticatedRoute";
import { AdminRoute }         from "../components/AdminRoute";
import { SalesRoute }         from "../components/SalesRoute";
import { CosechaRoute }       from "../components/CosechaRoute";
import IngresoForm            from "../pages/IngresoForm";
import IngresoList            from "../pages/IngresoList";
import Ventas                 from "../pages/Ventas"; 
import LoginCallback          from "../components/LoginCallback";




export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/login/callback" element={<LoginCallback />} />


          {/* Cualquier usuario autenticado */}
          <Route path="/homepage" element={<AuthenticatedRoute />}>
            <Route element={<MainLayout />}>
              <Route index element={<HomePage />} />

              {/* Dashboard (solo admin) */}
              <Route element={<AdminRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
              </Route>

              {/* Usuarios (solo admin) */}
              <Route element={<AdminRoute />}>
                <Route path="usuarios"         element={<Users />} />
                <Route path="usuarios/nuevo"   element={<UserForm />} />
                <Route path="usuarios/:userId" element={<UserForm />} />
              </Route>             

              {/* Contable */}
              <Route path="presupuestos" element={<Presupuestos />} />
              <Route element={<SalesRoute />}>
                <Route path="presupuestos/nuevo"   element={<PresupuestoItemForm />} />
                <Route path="presupuestos/:itemId" element={<PresupuestoItemForm />} />
                <Route path="ventas" element={<Ventas />} />

              </Route>

              
              <Route element={<SalesRoute />}>

                 {/* Clientes */}
                <Route path="clientes" element={<Clients />} />
                <Route path="clientes/:clientId" element={<ClientForm />} />
                <Route path="clientes/nuevo" element={<ClientForm />} />

                {/* Presupuestos */}
                <Route path="presupuestos/:itemId/subitems/nuevo" element={<SubitemForm />} />
                <Route path="presupuestos/:itemId/subitems/:subId" element={<SubitemForm />} />
                <Route path="presupuestos/:itemId/subitems" element={<Subitems />} />

              </Route>

              {/* Stock*/}
              <Route path="stock" element={<Stock />} />
              
              <Route element={<CosechaRoute />}>
            
                <Route path="stock/nuevo"        element={<StockForm />} />
                <Route path="stock/:stockId"     element={<StockForm />} />
                <Route path="stock/:stockId/ingresos" element={<IngresoList />} />
                <Route path="stock/:stockId/ingresos/nuevo" element={<IngresoForm />} />

              </Route>

            </Route>
          </Route>

          {/* No autorizado y 404 */}
          <Route path="/not-authorized" element={<NotAuthorized />} />
          <Route path="*"               element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
