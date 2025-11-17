import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import 'datatables.net-select-dt';
import 'datatables.net-buttons';       
import 'datatables.net-buttons/js/buttons.html5.js'; 
import 'datatables.net-buttons-dt/css/buttons.dataTables.css'; 
import 'datatables.net-dt/css/dataTables.dataTables.css';
import { useTablesStore } from '../../../Store/TablesStore';
import { useModalStore } from '../../../Store/ModalStore';
import BtnExport from '../Buttons/BtnExport';
import { Modal } from '../Ventanas/Modal.jsx';
import ModalDetallesVenta from '../Ventanas/ModalDetallesVenta';
import { toast , Toaster } from 'sonner';

function TablaBoletos() {
  const registros = useTablesStore((s) => s.registrosVentas);
  const loading = useTablesStore((s) => s.loading);
  const error = useTablesStore((s) => s.error);
  const cargarRegistrosVentas = useTablesStore((s) => s.cargarRegistrosVentas);
  // selection and modal state
  const [selectedIds, setSelectedIds] = useState([]); // array of selected row ids (strings)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'edit' | 'delete'

  const {setTipoSelect} = useModalStore();

  // local UI state for filtering and sale detail modal
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'today'
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [detailData, setDetailData] = useState(null);

  const handleEdit = useCallback((id) => {
    // Open edit modal for single id
    setSelectedIds([String(id)]);
    setModalAction('edit');
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    // Eliminación de registros de ventas no implementada aquí.
    // Si tu API soporta borrar registros, reemplaza la ruta y llama a `cargarRegistrosVentas()`.
    toast.error('Eliminación de registros no disponible desde esta tabla');
  }, []);

  useEffect(() => {
    // Llamar DataTable.use aquí para evitar que el linter lo marque como Hook
    try {
      DataTable['use'](DT);
    } catch (err) {
      // Si ya se llamó anteriormente, ignorar el error
      void err;
    }

    cargarRegistrosVentas();
  }, [cargarRegistrosVentas]);

    useEffect(() => {
        // expose handlers
  window.handleEdit = handleEdit;
  window.handleDelete = handleDelete;

        window.handleSelectChange = (id) => {
            if (id) {
                setSelectedIds([id]);
            } else {
                setSelectedIds([]);
            }
        };
    // view sale detail handler used by the action buttons in the table
    window.viewVenta = async (folio) => {
      if (!folio) return toast.error('Folio inválido');
      try {
        setDetailLoading(true);
        setDetailError(null);
        setDetailModalOpen(true);
        const res = await fetch(`/api/boletos/Registros/${encodeURIComponent(folio)}`);
        const data = await res.json();
        if (!data.success) {
          setDetailError(data.mensaje || 'Error al obtener detalles');
          setDetailData(null);
        } else {
          // backend already enriches with Boleto, Precio, etc. Just use the data as-is
          setDetailData(data.detalles || data.boletos || data.registros || data.data || []);
        }
      } catch (err) {
        setDetailError(err.message || String(err));
        setDetailData(null);
      } finally {
        setDetailLoading(false);
      }
    };

    return () => {
      delete window.handleEdit;
      delete window.handleDelete;
      delete window.handleSelectChange;
      delete window.viewVenta;
    };
  }, [handleEdit, handleDelete]);

    const columns = useMemo(() => {
  if (!registros || registros.length === 0) return [{ title: 'Registros' }];
  const keys = Object.keys(registros[0]);
    // detect id-like key
    const idKey = keys.find((k) => /(^id$|\bid\b|_id$|^id_|id_user|idReg|id_registro_user|iduser)/i.test(k)) || keys[0];
    // detect common columns
    const fechaKey = keys.find((k) => /fecha|date|created_at/i.test(k));
    const totalKey = keys.find((k) => /total|monto|amount/i.test(k));
    const folioKey = keys.find((k) => /folio/i.test(k));

    // build ordered keys: fecha, total, folio, then the rest (excluding id)
    const remaining = keys.filter((k) => k !== idKey && k !== fechaKey && k !== totalKey && k !== folioKey);
    const orderedKeys = [fechaKey, totalKey, folioKey].filter(Boolean).concat(remaining);

    const idLabel = idKey.charAt(0).toUpperCase() + idKey.slice(1);

    // selection + id columns first
    const cols = [
      {
        title: '',
        orderable: false,
        searchable: false,
        render: (data, type, row) => {
          const id = String(row[1] ?? '');
          return `
              <div class="flex items-center justify-center">
                  <input 
                      type="radio" 
                      name="selectedRow" 
                      value="${id}" 
                      onchange="window.handleSelectChange(this.value)"
                      ${selectedIds.includes(id) ? 'checked' : ''}
                      class="h-4 w-4 text-blue-600 bg-gray-800 border-gray-600 focus:ring-blue-600 cursor-pointer"
                  />
              </div>`;
        }
      },
      { title: idLabel },
    ];

    // add ordered data columns
    orderedKeys.forEach((k) => {
      cols.push({ title: k.charAt(0).toUpperCase() + k.slice(1) });
    });

    // actions column (Ver Venta)
    cols.push({ title: 'Ver Ventas', orderable: false, searchable: false, render: (data, type, row) => {
      // the folio value will be included as the last element in the data array
      const folio = String(row[row.length - 1] ?? '');
      // escape single quotes
      const safe = folio.replace(/'/g, "\\'");
      return `
        <div class="flex items-center gap-2 justify-center">
          <button onclick="window.viewVenta('${safe}')" class="cursor-pointer px-2 py-1 rounded bg-blue-600 text-white text-sm">Mas Detalles</button>
        </div>`;
    }});

    return cols;
  }, [registros, selectedIds]);

  // filtered records according to filterMode
  const displayedRecords = useMemo(() => {
    if (!registros) return [];
    if (filterMode === 'today') {
      const today = new Date().toDateString();
      return registros.filter(r => {
        const k = Object.keys(r).find(k => /fecha|date|created_at/i.test(k));
        if (!k) return false;
        const d = new Date(r[k]);
        return d.toDateString() === today;
      });
    }
    return registros;
  }, [registros, filterMode]);

  const data = useMemo(() => {
    if (!displayedRecords || displayedRecords.length === 0) return [];
    const keys = Object.keys(displayedRecords[0]);
    const idKey = keys.find((k) => /(^id$|\bid\b|_id$|^id_|id_user|idReg|id_registro_user|iduser)/i.test(k)) || keys[0];
    const fechaKey = keys.find((k) => /fecha|date|created_at/i.test(k));
    const totalKey = keys.find((k) => /total|monto|amount/i.test(k));
    const folioKey = keys.find((k) => /folio/i.test(k));

    const remaining = keys.filter((k) => k !== idKey && k !== fechaKey && k !== totalKey && k !== folioKey);
    const orderedKeys = [fechaKey, totalKey, folioKey].filter(Boolean).concat(remaining);

    return displayedRecords.map((u) => {
      const row = [];
      row.push('');
      row.push(String(u[idKey] ?? ''));
      orderedKeys.forEach(k => {
        const v = u[k];
        row.push(v === null || v === undefined ? '' : String(v));
      });
      // append folio raw as last element for actions renderer to read
      row.push(String(u[folioKey] ?? ''));
      return row;
    });
  }, [displayedRecords]);

  // compute total sum of displayed records
  const sumTotal = useMemo(() => {
    if (!displayedRecords || displayedRecords.length === 0) return 0;
    return displayedRecords.reduce((acc, r) => {
      const k = Object.keys(r).find(k => /total|monto|amount/i.test(k));
      if (!k) return acc;
      const raw = String(r[k] ?? '');
      // strip non numeric except dot and minus
      const num = parseFloat(raw.replace(/[^0-9.-]+/g, '')) || 0;
      return acc + num;
    }, 0);
  }, [displayedRecords]);


  return (
    <div className="p-6 min-h-screen">
      <div className="shadow-md rounded-lg p-4">
        <section className="flex items-center gap-2 justify-center flex-col">
          <h2 className="text-3xl font-semibold text-white mb-4 text-center"> Venta de Boletos </h2>
          <Icon icon="mdi:local-activity" width="35" height="35"  style={{color:' #fff'}} />
        </section>

          <BtnExport
            data={displayedRecords}
            fields={displayedRecords && displayedRecords.length ? Object.keys(displayedRecords[0]) : []}
            filenameBase={`registros_export_${new Date().toISOString().slice(0,10)}`}
            className="ml-auto hover:bg-green-600 bg-green-800 transition-all duration-300 text-white px-3 py-1 rounded text-sm cursor-pointer"
          >
            Exportar a Excel/CSV
          </BtnExport>
        
          <hr />
          <br />
          <div className="flex items-center justify-between mb-4">

            <section className="flex items-center">

              <div className="flex items-center bg-gray-300 dark:bg-gray-800 px-3 py-1 rounded mr-4 select-none">
                  <Icon icon="line-md:confirm-circle" width="20" height="20" className="mr-2" style={{color: selectedIds.length > 0 ? '#22c55e' : '#6666'}} />
                  <span className="text-black dark:text-white">
                      {selectedIds.length > 0 ? `ID seleccionado: ${selectedIds[0]}` : 'Ningún registro seleccionado'}
                  </span>
              </div>

              <button
                className="hover:bg-red-600 bg-red-800 transition-all duration-300 text-white px-3 py-1 rounded text-sm mr-2 cursor-pointer"
                onClick={() => {
                  if (selectedIds.length > 0) {
                    setModalAction('delete');
                    setTipoSelect('usuario');
                    setIsModalOpen(true);
                  } else {
                    toast.error('Por favor, seleccione un Registro para Eliminar.');
                  }
                }}
              >
                <Icon icon="line-md:document-delete-twotone" width="24" height="24"  style={{color: '#fff'}} />
              </button>

            </section>

            <div className="ml-4 flex items-center gap-3">
              <div className="text-sm text-white">Mostrar:</div>
              <button className={`px-2 py-1 rounded text-sm cursor-pointer ${filterMode==='today' ? 'bg-blue-700' : 'bg-gray-600'}`} onClick={() => setFilterMode('today')}>Hoy</button>
              <button className={`px-2 py-1 rounded text-sm cursor-pointer ${filterMode==='all' ? 'bg-blue-700' : 'bg-gray-600'}`} onClick={() => setFilterMode('all')}>Todos</button>
              <div className="ml-4 text-white text-sm">Total: <strong>{Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 }).format(sumTotal)}</strong></div>
            </div>
          </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="dark:text-white">Cargando registros...</div>
          ) : error ? (
            <div className="text-red-400">Error: {error}</div>
          ) : registros && registros.length > 0 ? (
            <DataTable
              data={data}
              columns={columns}
              className="display w-full text-sm border-gray-800 dark:text-white rounded-md"
              options={{
                responsive: true,
                pagingType: 'simple_numbers',
                language: {
                  search:'🔎 Buscar :',
                  lengthMenu: 'Mostrar _MENU_ entradas',
                  info: 'Mostrando _START_ a _END_ de _TOTAL_ entradas',
                },
              }}
            />
          ) : registros && registros.length > 0 ? (
            <DataTable
              data={data}
              columns={columns}
              className="display w-full text-sm border-gray-800 dark:text-white rounded-md"
              options={{
                responsive: true,
                pagingType: 'simple_numbers',
                language: {
                  search:'🔎 Buscar :',
                  lengthMenu: 'Mostrar _MENU_ entradas',
                  info: 'Mostrando _START_ a _END_ de _TOTAL_ entradas',
                },
              }}
            />
          ) : (
            <div className="text-white">No hay registros para mostrar.</div>
          )}
        </div>
      </div>
      {isModalOpen && (modalAction === 'agregar' || selectedIds[0]) && (
        <Modal
          key={`modal-${modalAction === 'agregar' ? 'agregar' : selectedIds[0]}`}
          action={modalAction}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedIds([]); 
            // Desmarcar el radio button
            const radios = document.getElementsByName('selectedRow');
            radios.forEach(radio => radio.checked = false);
          }}
          userId={selectedIds[0]}
        />
      )}
      <ModalDetallesVenta
        isOpen={detailModalOpen}
        onClose={() => { setDetailModalOpen(false); setDetailData(null); setDetailError(null); }}
        loading={detailLoading}
        error={detailError}
        data={detailData}
      />
      {!isModalOpen && (
        <Toaster className='select-none cursor-pointer' />
      )}
    </div>
  );
}

export default TablaBoletos;
