import { motion, AnimatePresence } from "framer-motion";
import { useState } from 'react';
import { BoletosStore } from '../../../Store/BoletosStore.jsx';

export const ModalVentaBoletos = ({ onClose, onConfirm }) => {
    const { seleccionados, Boletos, setSeleccionados } = BoletosStore();
    const [folioEdits, setFolioEdits] = useState({});
    const [editingFolios, setEditingFolios] = useState({});

    const updateFolios = (id_boleto, startFolio, index = -1) => {
        const item = seleccionados.find(i => i.id_boleto === id_boleto);
        if (!item) return;

        const next = seleccionados.map(i => {
            if (i.id_boleto !== id_boleto) return i;
            
            let newFolios;
            if (index >= 0) {
                // Edit individual folio
                newFolios = [...i.folios];
                newFolios[index] = parseInt(startFolio);
            } else {
                // Edit starting folio and regenerate sequence
                const start = parseInt(startFolio);
                newFolios = Array.from({ length: i.cantidad }, (_, idx) => start + idx);
            }

            return {
                ...i,
                folios: newFolios
            };
        });

        setSeleccionados(next);
    };

    const handleFolioChange = (id_boleto, value, index = -1) => {
        setFolioEdits(prev => ({
            ...prev,
            [id_boleto]: {
                ...prev[id_boleto],
                [index]: value
            }
        }));
    };

    const handleFolioBlur = (id_boleto, index = -1) => {
        const edit = folioEdits[id_boleto]?.[index];
        if (edit === undefined) return;

        updateFolios(id_boleto, edit, index);
        
        // Clear the edit state
        setFolioEdits(prev => {
            const next = { ...prev };
            if (index >= 0) {
                delete next[id_boleto][index];
            } else {
                delete next[id_boleto];
            }
            return next;
        });
    };

    const handleConfirm = async () => {
        if (typeof onConfirm === 'function') {
            try {
                await onConfirm(seleccionados);
                onClose();
            } catch (err) {
                console.error('Error al confirmar venta:', err);
            }
        }
    };

    return (
        <AnimatePresence>
            <motion.div className="bg-black/50 fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl p-6"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Confirmar Venta de Boletos</h2>
                        <div className="flex gap-2">
                            <button onClick={onClose} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700">Cerrar</button>
                        </div>
                    </div>

                    <div className="overflow-y-auto max-h-[70vh]">
                        <div className="space-y-4">
                            {seleccionados.map(item => {
                                const meta = (Boletos || []).find(b => b.id_boleto === item.id_boleto) || {};
                                return (
                                    <div key={item.id_boleto} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold">{meta.Boleto || `Boleto #${item.id_boleto}`}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {meta.Descripcion || (meta.Paquete ? `Paquete ${meta.Paquete}` : 'Boleto Individual')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold">${item.total}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Cantidad: {item.cantidad}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="font-medium">Folios asignados:</div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-sm text-gray-600 dark:text-gray-400">Folio inicial:</label>
                                                        <input
                                                            type="number"
                                                            value={folioEdits[item.id_boleto]?.[-1] ?? item.folios[0] ?? ''}
                                                            onChange={(e) => handleFolioChange(item.id_boleto, e.target.value, -1)}
                                                            onBlur={() => handleFolioBlur(item.id_boleto, -1)}
                                                            className="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded w-24 text-sm focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <button 
                                                        onClick={() => setEditingFolios(prev => ({
                                                            ...prev,
                                                            [item.id_boleto]: !prev[item.id_boleto]
                                                        }))}
                                                        className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors shadow-sm"
                                                    >
                                                        {editingFolios[item.id_boleto] ? 'Listo' : 'Editar'}
                                                    </button>
                                                </div>
                                            </div>
                                            {editingFolios[item.id_boleto] ? (
                                                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border dark:border-gray-600 shadow-sm">
                                                    <div className="grid grid-cols-4 gap-3">
                                                        {item.folios.map((folio, idx) => (
                                                            <div key={idx} className="flex items-center gap-2">
                                                                <label className="text-xs text-gray-600 dark:text-gray-400 min-w-[20px]">{idx + 1}:</label>
                                                                <input
                                                                    type="number"
                                                                    value={folioEdits[item.id_boleto]?.[idx] ?? folio}
                                                                    onChange={(e) => handleFolioChange(item.id_boleto, e.target.value, idx)}
                                                                    onBlur={() => handleFolioBlur(item.id_boleto, idx)}
                                                                    className="bg-white dark:bg-gray-800 px-2 py-1 rounded w-full text-sm border dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border dark:border-gray-600">
                                                    {item.folios && item.folios.length > 0 ? (
                                                        <div className="text-gray-700 dark:text-gray-300">
                                                            {item.folios.join(', ')}
                                                        </div>
                                                    ) : (
                                                        <span className="text-yellow-600 dark:text-yellow-400">
                                                            Pendiente de asignar folios
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div className="text-lg font-semibold">Total Final:</div>
                                    <div className="text-2xl font-bold">
                                        ${seleccionados.reduce((sum, item) => sum + (item.total || 0), 0)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button 
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleConfirm}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Confirmar Venta
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};