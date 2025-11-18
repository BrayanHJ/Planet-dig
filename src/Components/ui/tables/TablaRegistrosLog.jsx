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
import ModalRegistrosLog from '../Ventanas/ModalRegistrosLog';
import BtnExport from '../Buttons/BtnExport';
import { Toaster , toast } from 'sonner';

function TablaRegistrosLog() {
    const [activityLogs, setActivityLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [logsShown, setLogsShown] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLogId, setSelectedLogId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const cargarLogs = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/Activity_Log');
            if (!response.ok) throw new Error('Error al cargar logs');
            const data = await response.json();
            console.log('TablaRegistrosLog: response', response.status, data);
            if (data && data.success) {
                setActivityLogs(data.registros || []);
                setError(null);
                setLogsShown(true);
            } else {
                setError('No se pudieron cargar los logs');
            }
        } catch (err) {
            console.error('cargarLogs error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Abrir modal pasando solo el ID
    const handleVerDetalle = useCallback((logId) => {
        setSelectedLogId(logId);
        setModalOpen(true);
    }, []);

    // Eliminar un log específico
    const handleDeleteLog = useCallback(async (logId) => {
        setDeleting(true);
        try {
            const response = await fetch(`/api/Activity_Log/${logId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Error al eliminar log');
            const data = await response.json();
            if (data && data.success) {
                toast.success('Log eliminado correctamente');
                setModalOpen(false);
                setSelectedLogId(null);
                cargarLogs();
            } else {
                toast.error(data.mensaje || 'No se pudo eliminar el log');
            }
        } catch (err) {
            console.error('handleDeleteLog error:', err);
            toast.error('Error al eliminar: ' + err.message);
        } finally {
            setDeleting(false);
        }
    }, []);

    useEffect(() => {
        try {
            DataTable['use'](DT);
        } catch (err) {
            void err;
        }
    }, []);

    // Cargar logs al montar el componente
    useEffect(() => {
        cargarLogs();
    }, []);

    // Columnas sin el "detalle" (mostrar solo básico)
    const columns = useMemo(() => {
        return [
            { title: 'ID', data: 'id' },
            { title: 'Acción', data: 'accion' },
            { title: 'ID Usuario', data: 'id_usuario' },
            { title: 'Usuario', data: 'usuario' },
            { title: 'Permiso', data: 'permiso' },
            { title: 'Fecha', data: 'fecha' },
            { 
                title: 'Detalle', 
                data: 'id', 
                render: (data) => `<button class="btn-detalle cursor-pointer px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm" data-id="${data}">Ver Detalle</button>` 
            }
        ];
    }, []);

    // Formatear datos para la tabla
    const data = useMemo(() => {
        if (!activityLogs || activityLogs.length === 0) return [];
        return activityLogs.map((log) => ({
            id: log.id || '',
            accion: log.accion || '',
            id_usuario: log.id_usuario || '',
            usuario: log.usuario || '',
            permiso: log.permiso || '',
            fecha: log.fecha ? new Date(log.fecha).toLocaleString('es-ES') : ''
        }));
    }, [activityLogs]);

    // Delegación de eventos para botones de la tabla
    useEffect(() => {
        if (activityLogs && activityLogs.length > 0) {
            // Esperar a que la tabla se renderice
            const timer = setTimeout(() => {
                const buttons = document.querySelectorAll('.btn-detalle');
                
                buttons.forEach((btn) => {
                    const logId = btn.getAttribute('data-id');
                    
                    // Crear un handler con closure para capturar correctamente el ID
                    const handler = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleVerDetalle(logId);
                    };
                    
                    // Remover listeners anteriores
                    btn.removeEventListener('click', handler);
                    // Añadir nuevo listener
                    btn.addEventListener('click', handler);
                });
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [activityLogs, handleVerDetalle]);

    return (
        <div className="p-6 min-h-screen">
            <div className="shadow-md rounded-lg p-4">
                <section className="flex items-center gap-2 justify-center flex-col mb-5">
                    <h2 className="text-3xl font-semibold text-white mb-4 text-center">Registro de Actividades</h2>
                    <Icon icon="fa-solid:user-shield" className='text-4xl' style={{ color: '#fff' }} />
                </section>

                <div className="flex justify-between items-center mb-4">
                    {logsShown && (
                        <span className="text-gray-400 text-sm">
                            Total: {activityLogs.length} registros
                        </span>
                    )}
                    <BtnExport
                        data={activityLogs}
                        fields={activityLogs && activityLogs.length ? Object.keys(activityLogs[0]) : []}
                        filenameBase={`registros_export_${new Date().toISOString().slice(0,10)}`}
                        className="ml-auto hover:bg-green-600 bg-green-800 transition-all duration-300 text-white px-3 py-1 rounded text-sm cursor-pointer"
                    >
                        Exportar a Excel/CSV
                    </BtnExport>
                </div>

                {logsShown && (
                    <>
                        <hr />
                        <br />
                        <div className="overflow-x-auto">
                            {error ? (
                                <div className="text-red-400">Error: {error}</div>
                            ) : activityLogs && activityLogs.length > 0 ? (
                                <DataTable
                                    data={data}
                                    columns={columns}
                                    className="display w-full text-sm border-gray-800 dark:text-white rounded-md"
                                    options={{
                                        responsive: true,
                                        pagingType: 'simple_numbers',
                                        pageLength: 25,
                                        order: [[0, 'desc']], // Ordena por la primera columna (ID) descendente
                                        language: {
                                            search: '🔎 Buscar :',
                                            lengthMenu: 'Mostrar _MENU_ entradas',
                                            info: 'Mostrando _START_ a _END_ de _TOTAL_ entradas',
                                        },
                                    }}
                                />
                            ) : (
                                <div className="text-white">No hay registros de actividad para mostrar.</div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <ModalRegistrosLog
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedLogId(null);
                }}
                logId={selectedLogId}
                onDelete={handleDeleteLog}
                deleting={deleting}
            />

            <Toaster className='select-none cursor-pointer' />
        </div>
    );
}

export default TablaRegistrosLog;
