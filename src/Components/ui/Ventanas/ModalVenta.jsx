import { motion, AnimatePresence } from "framer-motion";
import { BoletosStore } from '../../../Store/BoletosStore.jsx';
import { useEffect, useState } from 'react';

// Modal para selección de boletos
export const ModalVenta = ({ onClose, onConfirm }) => {
    const { Boletos, cargarBoletos, setSeleccionados, seleccionados } = BoletosStore();
    // cantidades seleccionadas por boleto id
    const [cantidades, setCantidades] = useState({});

    useEffect(() => {
        // cargar boletos desde el store al montar
        if (typeof cargarBoletos === 'function') cargarBoletos();
    }, [cargarBoletos]);

    // helper para identificar paquetes nulos/invalidos
    const isNullPackage = (p) => {
        if (p === null || p === undefined) return true;
        const s = String(p).trim().toUpperCase();
        return s === '' || s === 'NULL' || s === 'NUUL' || s === 'NONE';
    };

    useEffect(() => {
        // inicializar cantidades desde el store y rellenar el resto con 0
        if (Boletos && Boletos.length) {
            const inicial = {};
            // Primero poner todo a 0
            Boletos.forEach(b => {
                inicial[b.id_boleto] = 0;
            });
            // Luego restaurar cantidades guardadas
            if (seleccionados && seleccionados.length > 0) {
                seleccionados.forEach(s => {
                    inicial[s.id_boleto] = s.cantidad;
                });
            }
            setCantidades(inicial);
        }
    }, [Boletos, seleccionados]);

    const handleChange = (id, value) => {
        const v = Math.max(0, parseInt(value || 0, 10));
        setCantidades(prev => ({ ...prev, [id]: isNaN(v) ? 0 : v }));
    };

    const subtotalFor = (b) => {
        const qty = cantidades[b.id_boleto] || 0;
        const price = Number(b.Precio || b.precio || 0);
        return qty * price;
    };

    const total = () => {
        if (!Boletos) return 0;
        return Boletos.reduce((acc, b) => acc + subtotalFor(b), 0);
    };

    const handleConfirm = () => {
        // pasar selección al padre si es necesario
        const selected = (Boletos || []).filter(b => (cantidades[b.id_boleto] || 0) > 0).map(b => ({
            ...b,
            cantidad: cantidades[b.id_boleto] || 0,
            subtotal: subtotalFor(b)
        }));
        // Guardar sólo id, cantidad, total y folios en el store para uso en la página principal
        const generateFolios = (b, cantidad) => {
            const base = Number(b.Folio || b.folio || 0);
            if (!base || cantidad <= 0) return [];
            const arr = [];
            for (let i = 0; i < cantidad; i++) arr.push(base + i);
            return arr;
        };

        const simplified = selected.map(s => ({
            id_boleto: s.id_boleto,
            cantidad: s.cantidad,
            total: s.subtotal,
            folios: generateFolios(s, s.cantidad)
        }));
        if (typeof setSeleccionados === 'function') setSeleccionados(simplified);
        if (typeof onConfirm === 'function') onConfirm(selected);
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
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Seleccione Sus Boletos</h2>
                        <div className="flex gap-2">
                            <button onClick={onClose} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700">Cerrar</button>
                        </div>
                    </div>
                    <div className="overflow-y-auto max-h-[70vh] px-4">
                        <section className="gap-6 flex flex-col">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Boletos Individuales</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Boletos && Boletos.length ? Boletos.filter(b => isNullPackage(b.Paquete)).map(b => (
                                    <div key={b.id_boleto} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 flex flex-col items-center select-none">
                                        <div className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">
                                            ${b.Precio}
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                                            {b.Boleto}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                                            {b.Descripcion}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleChange(b.id_boleto, (cantidades[b.id_boleto] ?? 0) - 1)}
                                                className="px-3 py-1 bg-violet-600/70 text-white rounded-md hover:bg-violet-700/70 cursor-pointer"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min={0}
                                                value={cantidades[b.id_boleto] ?? 0}
                                                onChange={(e) => handleChange(b.id_boleto, e.target.value)}
                                                className="w-16 text-center border rounded px-2 py-1 bg-transparent text-gray-900 dark:text-white cursor-pointer"
                                            />
                                            <button 
                                                onClick={() => handleChange(b.id_boleto, (cantidades[b.id_boleto] ?? 0) + 1)}
                                                className="px-3 py-1 bg-violet-600/70 text-white rounded-md hover:bg-violet-700/70 cursor-pointer"
                                            >
                                                +
                                            </button>
                                        </div>
                                        {(cantidades[b.id_boleto] ?? 0) > 0 && (
                                            <p className="mt-2 text-sm text-violet-600 dark:text-violet-400">
                                                Subtotal: ${subtotalFor(b)}
                                            </p>
                                        )}
                                    </div>
                                )) : null}
                            </div>

                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">Paquetes de Boletos</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Boletos && Boletos.length ? Boletos.filter(b => !isNullPackage(b.Paquete)).map(b => (
                                    <div key={b.id_boleto} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 flex flex-col items-center select-none">
                                        <div className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">
                                            ${b.Precio}
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                                            {b.Boleto}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                                            {b.Descripcion}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleChange(b.id_boleto, (cantidades[b.id_boleto] ?? 0) - 1)}
                                                className="px-3 py-1 bg-violet-600/70 text-white rounded-md hover:bg-violet-700/70 cursor-pointer"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min={0}
                                                value={cantidades[b.id_boleto] ?? 0}
                                                onChange={(e) => handleChange(b.id_boleto, e.target.value)}
                                                className="w-16 text-center border rounded px-2 py-1 bg-transparent text-gray-900 dark:text-white cursor-pointer"
                                            />
                                            <button 
                                                onClick={() => handleChange(b.id_boleto, (cantidades[b.id_boleto] ?? 0) + 1)}
                                                className="px-3 py-1 bg-violet-600/70 text-white rounded-md hover:bg-violet-700/70 cursor-pointer"
                                            >
                                                +
                                            </button>
                                        </div>
                                        {(cantidades[b.id_boleto] ?? 0) > 0 && (
                                            <p className="mt-2 text-sm text-violet-600 dark:text-violet-400">
                                                Subtotal: ${subtotalFor(b)}
                                            </p>
                                        )}
                                    </div>
                                )) : null}
                            </div>
                        </section>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-lg font-semibold">Total: ${total()}</div>
                        <div className="flex gap-2">
                            <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700">Cancelar</button>
                            <button onClick={handleConfirm} className="px-4 py-2 rounded bg-green-600 text-white">Confirmar</button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}