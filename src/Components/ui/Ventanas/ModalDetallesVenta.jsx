import { motion , AnimatePresence } from 'framer-motion';
import React from 'react';
import { toast } from 'sonner';

export const ModalDetallesVenta = ({ isOpen, onClose, loading, error, data }) => {
  const [showDetails, setShowDetails] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  if (!isOpen) return null;

  // columns (labels only)
  const cols = ['folio_venta','Boleto','cantidad','folios','Precio','fecha'];

  // normalize incoming rows to lowercase keys for consistent access
  const rows = Array.isArray(data) ? data : [];
  const normalized = rows.map(r => {
    const out = {};
    Object.keys(r || {}).forEach(k => { out[k.toLowerCase()] = r[k]; });
    return out;
  });

  // summary grouped by boleto type
  const summaryMap = normalized.reduce((acc, row) => {
    const boleto = String(row['boleto'] ?? row['Boleto'] ?? 'Desconocido');
    const cantidad = Number(row['cantidad'] ?? 0);
    const precio = Number(row['precio'] ?? row['Precio'] ?? 0);
    const folios = String(row['folios'] ?? '');

    if (!acc[boleto]) acc[boleto] = { boleto, cantidad: 0, priceSum: 0, foliosSet: new Set() };
    acc[boleto].cantidad += cantidad;
    // priceSum: sum Precio * cantidad (subtotal per row)
    acc[boleto].priceSum += isNaN(precio) ? 0 : precio * cantidad;
    if (folios) folios.split(',').map(f => f.trim()).forEach(f => f && acc[boleto].foliosSet.add(f));
    return acc;
  }, {});

  const summary = Object.values(summaryMap).map(s => ({
    boleto: s.boleto,
    cantidad: s.cantidad,
    subtotal: s.priceSum,
    folios: Array.from(s.foliosSet).slice(0, 10) // limit list for display
  }));

  const totalBoletos = summary.reduce((a, b) => a + (Number(b.cantidad) || 0), 0);
  const totalPrecio = summary.reduce((a, b) => a + (Number(b.subtotal) || 0), 0);

  const uniqueFolios = Array.from(new Set(normalized.flatMap(r => (String(r['folios'] || '')).split(',').map(f => f.trim()).filter(Boolean)))).slice(0, 20);

  const folio_venta = normalized[0]?.['folio_venta'] ?? normalized[0]?.['folio'] ?? null;

  const handleDeleteVenta = async () => {
    if (!folio_venta) {
      toast.error('Folio no encontrado');
      return;
    }

    if (!window.confirm('¿Está seguro de que desea eliminar esta venta completa?')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/boletos/Registros/${encodeURIComponent(folio_venta)}`, {
        method: 'DELETE'
      });
      const result = await response.json();

      if (result.success) {
        toast.success('Venta eliminada correctamente');
        onClose?.();
        // Recargar la tabla de ventas
        window.location.reload();
      } else {
        toast.error(result.mensaje || 'Error al eliminar la venta');
      }
    } catch (err) {
      toast.error('Error al eliminar: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2.0 }}
      >
        {/* overlay: clicking closes modal */}
        <div className="absolute inset-0 bg-black opacity-70" onClick={() => onClose && onClose()} 
          />

      <AnimatePresence>
        <motion.aside
            role="dialog"
            aria-modal="true"
          className="fixed inset-y-0 right-0 z-10 w-full sm:w-9/12 md:w-1/2 lg:w-7/12 bg-white dark:bg-gray-900 text-black dark:text-white shadow-lg p-6 transform transition-transform duration-300 translate-x-0 rounded-l-lg overflow-auto"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: 900 }}
            animate={{ x: 0 }}
            exit={{ x: 900 }}
            transition={{ duration: 1.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-3xl font-semibold">Detalle de Venta</h3>
              <section className="flex flex-col">
                <div className="flex gap-2 mb-2">
                  <button
                    className="px-3 py-1 bg-red-700 hover:bg-red-600 disabled:bg-red-900 disabled:cursor-not-allowed text-white rounded cursor-pointer font-medium transition-colors"
                    onClick={handleDeleteVenta}
                    disabled={deleting}
                  >
                    {deleting ? 'Eliminando...' : 'Eliminar Venta'}
                  </button>
                  <button className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded cursor-pointer" onClick={() => onClose && onClose()}>Cerrar</button>
                </div>
                <div className='flex gap-2 justify-center'>
                  <button
                  className="px-2 py-1 bg-blue-500 dark:text-gray-200 rounded cursor-pointer"
                  onClick={() => setShowDetails(s => !s)}
                  >
                    {showDetails ? 'Mostrar resumen' : 'Ocultar detalles'}
                  </button>
                </div>
              </section>
            </div>

            {loading ? (
              <div>Cargando...</div>
            ) : error ? (
              <div className="text-red-500">Error: {String(error)}</div>
            ) : normalized.length === 0 ? (
              <div>No hay detalles para mostrar.</div>
            ) : (
              <div className="space-y-4">
                {/* Header: folio (first) and totals */}
                <div className=" text-gray-600 dark:text-gray-300 text-1xl">
                  <div><strong>Folio:</strong> {normalized[0]['folio_venta'] ?? normalized[0]['folio'] ?? 'N/A'}</div>
                  <div className="mt-1"><strong>Total boletos: </strong> {totalBoletos} &nbsp; <strong>Precio Total: </strong> ${Number(totalPrecio).toFixed(2)}</div>
                  <div className="mt-1"><strong>Folios: </strong> {uniqueFolios.slice(0,5).join(', ')}{uniqueFolios.length > 5 ? '...' : ''}</div>
                  <div className="mt-1"><strong>Fecha: </strong> {normalized[0]['fecha'] ? new Date(normalized[0]['fecha']).toLocaleString() : 'N/A'}</div>
                </div>

                {/* Summary list */}
                {!showDetails && (
                  <div className="mt-7">
                    <h4 className="font-medium mb-2">Resumen por tipo de boleto</h4>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded p-2 text-1xl space-y-3">
                      {summary.map(s => (
                        <div key={s.boleto} className="border-b last:border-b-0 py-3 px-2 bg-white dark:bg-gray-700 rounded">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-lg">{s.boleto}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">Cantidad: {s.cantidad}</div>
                              <div className="text-blue-600 dark:text-blue-400 font-semibold">Precio: ${s.subtotal.toFixed(2)}</div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Folios:</div>
                            <div className="flex flex-wrap gap-1">
                              {s.folios.map((folio, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-white rounded text-xs font-medium">
                                  {folio}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional: full details table */}
                {showDetails && (
                  <div className="overflow-auto max-h-72">
                    <table className="w-full text-sm mt-2">
                      <thead>
                        <tr className="text-left">
                          {cols.map((col) => (
                            <th key={col} className="px-2 py-1">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, i) => (
                          <tr key={i} className="border-t">
                            {cols.map((col) => {
                              const colLower = col.toLowerCase();
                              const matchingKey = Object.keys(row).find(k => k.toLowerCase() === colLower) || Object.keys(row).find(k => k.toLowerCase().includes(colLower));
                              const val = matchingKey ? row[matchingKey] : '';
                              const display = (col === 'fecha' && val) ? new Date(val).toLocaleString() : String(val ?? '');
                              return <td key={col} className="px-2 py-1">{display}</td>;
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            )}
          </motion.aside>
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalDetallesVenta;