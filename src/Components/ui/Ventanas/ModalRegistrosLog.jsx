import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

const ModalRegistrosLog = ({ isOpen, onClose, logId, onDelete, deleting }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    // Cargar detalles cuando se recibe un logId
    useEffect(() => {
        if (isOpen && logId) {
            const fetchDetails = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`/api/Activity_Log/${logId}`);
                    if (!response.ok) throw new Error('Error al cargar detalle');
                    const result = await response.json();
                    if (result && result.success) {
                        setData(result.registro);
                    } else {
                        toast.error('No se pudo cargar el detalle del log');
                    }
                } catch (err) {
                    toast.error('Error al cargar el detalle: ' + err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetails();
        }
    }, [isOpen, logId]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="relative bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Icon icon="line-md:info-circle" width="28" height="28" />
                                Detalles del Registro
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Icon icon="line-md:close" width="24" height="24" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin">
                                        <Icon icon="line-md:loading-loop" width="48" height="48" style={{ color: '#3b82f6' }} />
                                    </div>
                                </div>
                            ) : data ? (
                                <div className="space-y-4">
                                    {/* Acción */}
                                    <div className="bg-gray-700 rounded-lg p-4">
                                        <label className="block text-sm font-semibold text-gray-300 mb-1">Acción</label>
                                        <div className="flex items-center justify-between">

                                            <div className="flex items-center justify-center gap-2">
                                                <Icon icon="line-md:cog-loop" width="20" height="20" style={{ color: '#10b981' }} />
                                                <p className="text-white text-lg font-semibold text-center">{data.accion || '-'}</p>
                                            </div>

                                            <div className="bg-gray-700 rounded-lg p-4">
                                                <label className="block text-sm font-semibold text-gray-300 mb-1">Fecha</label>
                                                <p className="text-white">
                                                    {data.fecha ? new Date(data.fecha).toLocaleString('es-ES') : '-'}
                                                </p>
                                            </div>

                                        </div>
                                    </div>

                                    {/* Detalles */}
                                    <div className="bg-gray-700 rounded-lg p-4">
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Detalle</label>
                                        <section className="flex items-center justify-between">
                                            <div className="bg-gray-800 rounded p-3 max-h-48 overflow-y-auto">
                                                <p className="text-gray-100 whitespace-pre-wrap font-mono text-sm">
                                                    {data.detalle ? (
                                                        typeof data.detalle === 'string' ? (
                                                            data.detalle.length > 500 ? (
                                                                <>
                                                                    {data.detalle.substring(0, 500)}
                                                                    <span className="text-gray-500">... (truncado)</span>
                                                                </>
                                                            ) : (
                                                                data.detalle
                                                            )
                                                        ) : (
                                                            JSON.stringify(data.detalle, null, 2)
                                                        )
                                                    ) : '-'}
                                                </p>
                                            </div>
                                        </section>
                                    </div>
                                    <div className='bg-gray-700 rounded-lg'>
                                        <h2 className='text-md font-medium m-1 mt-2 text-center text-blue-200'>Usuario Responsable</h2>    
                                        <section className="gap-4 flex items-center justify-between">

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-300 mb-1">ID Usuario</label>
                                                <p className="text-white">{data.id_usuario || '-'}</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-300 mb-1">Usuario</label>
                                                <p className="text-white">{data.usuario || '-'}</p>
                                            </div>

                                            <div >
                                                <label className="block text-sm font-semibold text-gray-300 mb-1">Permiso</label>
                                                <span className="inline-block text-white px-3 py-1 rounded text-sm font-semibold">
                                                    {data.permiso || '-'} 
                                                </span>
                                            </div>

                                        </section>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Icon icon="line-md:alert-circle-loop" width="48" height="48" style={{ color: '#ef4444', margin: '0 auto 16px' }} />
                                    <p className="text-gray-400">No hay datos disponibles</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-4 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    if (onDelete && data?.id) {
                                        if (window.confirm('¿Está seguro de que desea eliminar este registro?')) {
                                            onDelete(data.id);
                                        }
                                    }
                                }}
                                disabled={deleting || !onDelete}
                                className="bg-red-700 hover:bg-red-600 disabled:bg-red-900 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                            >
                                <Icon icon="line-md:document-delete-twotone" width="20" height="20" />
                                {deleting ? 'Eliminando...' : 'Eliminar'}
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalRegistrosLog;
