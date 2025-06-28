import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listClients } from "../services/clients";
import { listStock } from "../services/stock";
import { createVenta } from "../services/ventas";
import { addPagoToVenta } from "../services/ventas";
import type { Cliente } from "../services/clients";
import type { Stock } from "../services/stock";
import type { DetalleVentaCreate } from "../services/ventas";
import Swal from 'sweetalert2';



export default function Ventas() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Stock[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<number | null>(null);
  const [detalleVenta, setDetalleVenta] = useState<DetalleVentaCreate[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formaPago, setFormaPago] = useState("");
  const [nroComprobante, setNroComprobante] = useState("");
  const [nroFactura, setNroFactura] = useState("");
  const [abono, setAbono] = useState(0);
  const [comentarios, setComentarios] = useState("");

  useEffect(() => {
    listClients().then(res => setClientes(res.data));
    listStock().then(res => setProductos(res.data));
  }, []);
    
  const valorTotal = detalleVenta.reduce((acc, item) => acc + parseFloat(item.kilos) * parseFloat(item.precio), 0);
  const saldo = valorTotal - abono;

  const agregarProducto = (producto: Stock) => {
    const precio = parseFloat(producto.precio_unitario);
    if (!detalleVenta.find(i => i.id_stock === producto.id_stock)) {
      setDetalleVenta([...
        detalleVenta,
        {
          id_stock: producto.id_stock,
          kilos: "1.00",
          precio: precio.toFixed(2),
          subtotal: precio.toFixed(2),
        },
      ]);
    }
  };

  const actualizarDetalle = (id: number, campo: keyof DetalleVentaCreate, valor: string) => {
    setDetalleVenta(detalleVenta.map(p => {
      if (p.id_stock === id) {
        const nuevo = { ...p, [campo]: valor };
        const kilos = parseFloat(nuevo.kilos);
        const precio = parseFloat(nuevo.precio);
        nuevo.subtotal = (kilos * precio).toFixed(2);
        return nuevo;
      }
      return p;
    }));
  };

  const eliminarProducto = (id: number) => {
    setDetalleVenta(detalleVenta.filter(p => p.id_stock !== id));
  };

  const guardarVenta = async () => {
    if (!clienteSeleccionado) {
      Swal.fire({
        icon: 'warning',
        title: 'Cliente no seleccionado',
        text: 'Por favor, selecciona un cliente.',
      });
      return;
    }

    if (detalleVenta.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin productos',
        text: 'Debes agregar al menos un producto.',
      });
      return;
    }

    if (!formaPago) {
      Swal.fire({
        icon: 'warning',
        title: 'Forma de pago requerida',
        text: 'Selecciona una forma de pago.',
      });
      return;
    }

    if (!abono || abono <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Abono no válido',
        text: 'Ingresa el valor abonado por el cliente',
      });
      return;
    }

    const data = {
      id_cliente: clienteSeleccionado!,
      fecha: new Date().toISOString().split("T")[0],
      forma_pago: formaPago,
      numero_documento: nroFactura,
      comentarios,
      detalles: detalleVenta,
    };

    for (const item of detalleVenta) {
    const producto = productos.find(p => p.id_stock === item.id_stock);
    const cantidadDisponible = parseFloat(producto?.cantidad_total || "0");
    const cantidadSolicitada = parseFloat(item.kilos);

    if (cantidadSolicitada > cantidadDisponible) {
      Swal.fire({
        icon: 'error',
        title: 'Stock insuficiente',
        text: `El producto "${producto?.producto}" solo tiene ${cantidadDisponible} kg disponibles.`,
      });
      return;
    }
  }


    try {
      const resp = await createVenta(data);
      const nuevaVenta = resp.data;

      if (abono > 0) {
        await addPagoToVenta(nuevaVenta.id_venta, {
          fecha_pago: data.fecha,
          monto: abono,
          nro_documento: nroComprobante,
          observaciones: comentarios || "Pago inicial",
        });
      }

      await Swal.fire({
        icon: 'success',
        title: 'Venta registrada',
        text: 'La venta se registró correctamente.',
      });

      setDetalleVenta([]);
      setMostrarModal(false);
      setClienteSeleccionado(null);
      setFormaPago("");
      setNroComprobante("");
      setNroFactura("");
      setAbono(0);
      setComentarios("");
      const nuevosProductos = await listStock();
      setProductos(nuevosProductos.data);
    } catch (error) {
      console.error("Error al registrar venta:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo registrar la venta.',
      });
    }
  };

  return (
    <div className="p-6 grid grid-cols-4 gap-6">
      <div className="col-span-3">
        <h2 className="text-xl font-semibold mb-2">Cliente</h2>
        <div className="flex gap-2 items-center">
          <select
            className="border rounded px-2 py-1 w-full"
            onChange={e => setClienteSeleccionado(Number(e.target.value))}
            value={clienteSeleccionado || ""}
          >
            <option value="">Selecciona un cliente</option>
            {[...clientes]
              .sort((a, b) => a.nombre.localeCompare(b.nombre))
              .map(cli => (
                <option key={cli.id_cliente} value={cli.id_cliente}>
                  {cli.nombre}
                </option>
            ))}
          </select>
          <button
            className="bg-purple-900 text-white px-3 py-1 rounded text-sm"
            onClick={() => navigate("/homepage/clientes/nuevo", { state: { fromVentas: true } })}
          >
            +
          </button>
        </div>
        <h2 className="text-xl font-semibold mt-4 mb-2">Productos seleccionados</h2>
        <table className="w-full text-sm text-left text-gray-300 bg-slate-800 rounded-md shadow overflow-hidden">
          <thead className="text-xs uppercase bg-slate-700 text-white">
            <tr>
              <th className="px-6 py-3">Producto</th>
              <th className="px-6 py-3">Kilos</th>
              <th className="px-6 py-3">Precio</th>
              <th className="px-6 py-3">Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {detalleVenta.map(item => {
              const producto = productos.find(p => p.id_stock === item.id_stock);
              return (
                <tr key={item.id_stock} className="bg-slate-800 border-b border-slate-700">
                  <td className="px-6 py-2">{producto?.producto}</td>
                  <td className="px-6 py-2">
                    <input
                      type="number"
                      value={item.kilos}
                      onChange={e => actualizarDetalle(item.id_stock, "kilos", e.target.value)}
                      className="w-16 border rounded bg-slate-900 text-white px-2"
                    />
                  </td>
                  <td className="px-6 py-2">${item.precio}</td>
                  <td className="px-6 py-2 font-semibold text-green-400">${item.subtotal}</td>
                  <td><button onClick={() => eliminarProducto(item.id_stock)} className="text-red-500">❌</button></td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-700 text-white font-bold">
              <td colSpan={3} className="px-6 py-2 text-right">TOTAL</td>
              <td className="px-6 py-2">${valorTotal.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded" onClick={() => setMostrarModal(true)}>
          Facturar
        </button>
      </div>

      <div className="col-span-1">
        <h2 className="text-xl font-semibold mb-2">Productos en stock</h2>
        <ul className="space-y-2">
          {productos.map(p => (
            <li key={p.id_stock} className="border rounded p-2 flex justify-between items-center bg-white">
              <span>{p.producto} - {p.cantidad_total} kg</span>
              <button className="bg-green-500 text-white px-2 rounded" onClick={() => agregarProducto(p)}>+</button>
            </li>
          ))}
        </ul>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-lg font-bold mb-4">Registrar Venta</h3>
            <div className="space-y-3">
              <p>Forma de pago</p>
              <select
                className="w-full border px-2 py-1"
                value={formaPago}
                onChange={e => setFormaPago(e.target.value)}
              >
                <option value="">Forma de pago</option>
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
              </select>
              <p>Nro. Factura (venta):</p>
              <input
                type="text"
                className="w-full border px-2 py-1"
                value={nroFactura}
                onChange={e => setNroFactura(e.target.value)}
              />

              <p>Comprobante de pago:</p>
              <input
                type="text"
                className="w-full border px-2 py-1"
                value={nroComprobante}
                onChange={e => setNroComprobante(e.target.value)}
              />

              <p>Abono:</p>
              <input
                type="number"
                className="w-full border px-2 py-1"
                value={abono}
                onChange={e => setAbono(Number(e.target.value))}
              />
              <p>Comentarios:</p>
              <textarea
                className="w-full border px-2 py-1"
                value={comentarios}
                onChange={e => setComentarios(e.target.value)}
              />
              <div className="text-sm">Saldo por cobrar: <strong>${saldo.toFixed(2)}</strong></div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setMostrarModal(false)} className="px-3 py-1 border rounded">Cancelar</button>
                <button onClick={guardarVenta} className="px-3 py-1 bg-green-600 text-white rounded">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
