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
        <motion.main className="bg-black/50 fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{duration:0.4}}
        >
            <motion.div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl p-6"
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
            >
                <div className="flex items-center justify-between mb-4">
                    <motion.h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100"
                    initial={{ x: 800, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 800, opacity: 0 }}
                    transition={{duration:0.7}}
                    >
                        Confirmar Venta de Boletos
                    </motion.h2>
                </div>

                <div className="overflow-y-auto max-h-[70vh]">
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {seleccionados.map((item ,i) => {
                                const meta = (Boletos || []).find(b => b.id_boleto === item.id_boleto) || {};
                                return (
                                    <motion.main key={item.id_boleto} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow"
                                    initial={{ x: -800, scale: 0.5 , opacity: 0 }}
                                    animate={{ x: 0, scale: 1, opacity: 1 }}
                                    exit={{ x: 800, scale: 0.5, opacity: 0 }}
                                    transition={{duration:0.5, delay: i * 0.2}}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-2xl font-semibold">{meta.Boleto || `Boleto #${item.id_boleto}`}</h3>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-2xl">${item.total}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Cantidad: {item.cantidad}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="font-medium text-sm">Folios asignados:</div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-sm text-gray-600 dark:text-gray-400">Folio inicial:</label>
                                                        <input
                                                            type="number"
                                                            value={folioEdits[item.id_boleto]?.[-1] ?? item.folios[0] ?? ''}
                                                            onChange={(e) => handleFolioChange(item.id_boleto, e.target.value, -1)}
                                                            onBlur={() => handleFolioBlur(item.id_boleto, -1)}
                                                            className="bg-gray-100 dark:bg-gray-700/45 px-2 py-1 rounded w-24 text-sm focus:ring-2 focus:ring-blue-700"
                                                        />
                                                    </div>
                                                    <button 
                                                        onClick={() => setEditingFolios(prev => ({
                                                            ...prev,
                                                            [item.id_boleto]: !prev[item.id_boleto]
                                                        }))}
                                                        className="px-3 py-1 text-sm bg-violet-700/45 hover:bg-violet-700 text-white rounded transition-colors shadow-sm cursor-pointer"
                                                    >
                                                        {editingFolios[item.id_boleto] ? 'Listo' : 'Editar'}
                                                    </button>
                                                </div>
                                            </div>
                                            <AnimatePresence mode="popLayout">
                                                {editingFolios[item.id_boleto] ? (
                                                    <motion.div
                                                        key="edit-mode"
                                                        className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border dark:border-gray-600 shadow-sm"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                    >
                                                        <div className="grid grid-cols-5 gap-2">
                                                            {item.folios.map((folio, idx) => (
                                                                <motion.div
                                                                    key={idx}
                                                                    className="flex items-center gap-2"
                                                                    initial={{ y: 150, opacity: 0 }}
                                                                    animate={{ y: 0, opacity: 1 }}
                                                                    exit={{ y: 150, opacity: 0 }}
                                                                    transition={{ duration: 0.2, delay: idx * 0.1, ease: "easeOut" }}
                                                                >
                                                                    <motion.label className="text-shadow-sm text-gray-600 dark:text-gray-400 min-w-[15px]"
                                                                    initial={{ opacity: 0, y: -10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: 10 }}
                                                                    transition={{ duration: 0.9 }}
                                                                    >
                                                                        {idx + 1} :
                                                                    </motion.label>

                                                                    <motion.input
                                                                        initial={{ opacity: 0, y: -10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        exit={{ opacity: 0, y: 10 }}
                                                                        transition={{ duration: 0.25 }}
                                                                        key={folioEdits[item.id_boleto]?.[idx]}     // clave dinámica para forzar animación  
                                                                        type="number"
                                                                        value={folioEdits[item.id_boleto]?.[idx] ?? folio}
                                                                        onChange={(e) => handleFolioChange(item.id_boleto, e.target.value, idx)}
                                                                        onBlur={() => handleFolioBlur(item.id_boleto, idx)}
                                                                        className="bg-white dark:bg-gray-800 px-2 py-1 rounded w-1/2 text-sm border dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                                                    />
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="view-mode"
                                                        className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border dark:border-gray-600"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                    >
                                                        {item.folios?.length ? (
                                                            <div className="text-gray-700 dark:text-gray-300">
                                                                {item.folios.join(" , ")}
                                                            </div>
                                                        ) : (
                                                            <span className="text-yellow-600 dark:text-yellow-400">
                                                                Pendiente de asignar folios
                                                            </span>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.main>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="flex justify-between gap-3">
                    <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg w-3/4">
                        <div className="flex justify-between items-center">
                            <motion.p className="text-2xl"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{duration:0.9}}
                            >
                                Total Final:
                            </motion.p>
                            <motion.div className="text-2xl font-semibold"
                            initial={{ x: -500, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -500, opacity: 0 }}
                            transition={{duration:0.5}}
                            >
                                ${seleccionados.reduce((sum, item) => sum + (item.total || 0), 0)}
                            </motion.div>
                        </div>
                    </div>
                    <section className="mt-6 flex justify-center gap-3">
                        <button 
                            onClick={onClose}
                            className="px-4 py-2 text-xl bg-gray-200 dark:bg-red-700/45 rounded-lg hover:dark:bg-red-700 transition-colors cursor-pointer hover:scale-110 active:scale-100"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleConfirm}
                            className="px-4 py-2 text-xl bg-blue-600/45 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer hover:scale-110 active:scale-100"
                        >
                            Confirmar
                        </button>
                    </section>
                </div>
            </motion.div>
        </motion.main>
    );
};