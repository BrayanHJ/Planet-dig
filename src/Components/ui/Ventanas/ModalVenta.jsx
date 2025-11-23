import { motion, AnimatePresence , useMotionValue, useSpring } from "framer-motion";
import { BoletosStore } from '../../../Store/BoletosStore.jsx';
import { useEffect, useState } from 'react';

function AnimatedNumber({ value = 0, precision = 0, prefix = '', className }) {
    const mv = useMotionValue(Number(value));
    const spring = useSpring(mv, { stiffness: 170, damping: 26 });
    const [display, setDisplay] = useState(Number(value));

    useEffect(() => {
        mv.set(Number(value));
    }, [value, mv]);

    useEffect(() => {
        const unsubscribe = spring.onChange((v) => {
            if (precision > 0) setDisplay(Number(v).toFixed(precision));
            else setDisplay(Math.round(v));
        });
        return () => unsubscribe();
    }, [spring, precision]);

    return (
        <span className={className}>{prefix}{display}</span>
    );
}

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
        <motion.main className="bg-black/50 fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0  }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{duration:0.3}}
        >
            <motion.div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl p-6"
                initial={{ opacity: 0 , y :-400 }}
                animate={{ opacity: 1 , y :0 }}
                exit={{ opacity: 0 , y :-800 }}
                transition={{duration:0.5}}
            >
                <div className="flex items-center justify-end mb-4">
                    <motion.h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100"
                    initial={{ opacity: 0 , y :400 }}
                    animate={{ opacity: 1 , y :0 }}
                    exit={{ opacity: 0 , y :-800 }}
                    >
                        Seleccione Sus Boletos
                    </motion.h2>
                </div>
                <div className="overflow-y-auto max-h-[70vh] px-4">
                    <section className="gap-6 flex flex-col">
                        <motion.h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4"
                        initial={{ opacity: 0, x: 50 , scale: 0.3 }}
                        animate={{ opacity: 1, x: 0 , scale: 1 }}
                        exit={{ opacity: 0, x: 10 , scale: 0.3 }}
                        transition={{ duration: 1.0 }}
                        >
                            Boletos Individuales
                            </motion.h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {Boletos && Boletos.length ? Boletos.filter(b => isNullPackage(b.Paquete)).map((b , i) => (
                                    <motion.div key={b.id_boleto} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 flex flex-col items-center select-none"
                                    initial={{ opacity: 0, y: -10, scale: 0.5 }}
                                    animate={{ opacity: 1, y: 0 , scale: 1 }}
                                    exit={{ opacity: 0, y: 10 , scale: 0.5 }}
                                    transition={{ duration: .8 , delay: i * 0.25 }}
                                    >

                                        <motion.div className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2"
                                        initial={{ opacity: 0, y: -50, scale: 0.3 }}
                                        animate={{ opacity: 1, y: 0 , scale: 1 }}
                                        exit={{ opacity: 0, y: 10 , scale: 0.3 }}
                                        transition={{ duration: 1.0 }}
                                        >
                                            ${b.Precio}
                                        </motion.div>

                                        <motion.h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2"
                                        initial={{ opacity: 0, y: 50 , scale: 0.3 }}
                                        animate={{ opacity: 1, y: 0 , scale: 1 }}
                                        exit={{ opacity: 0, y: 10 , scale: 0.3 }}
                                        transition={{ duration: 1.0 }}
                                        >
                                            {b.Boleto}
                                        </motion.h3>

                                        <motion.p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center"
                                        initial={{ opacity: 0, y: 90 , scale: 0.3 }}
                                        animate={{ opacity: 1, y: 0 , scale: 1 }}
                                        exit={{ opacity: 0, y: 40 , scale: 0.3 }}
                                        transition={{ duration: 0.8 }}
                                        >
                                            {b.Descripcion}
                                        </motion.p>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleChange(b.id_boleto, (cantidades[b.id_boleto] ?? 0) - 1)}
                                                className="px-3 py-1 bg-violet-500/70 text-white rounded-md hover:bg-violet-700/70 cursor-pointer transition-all duration-300 hover:scale-125 active:scale-50 active:text-amber-300 active:text-1xl"
                                            >
                                                -
                                            </button>
                                            <div className="relative w-16 border rounded">
                                                <AnimatePresence mode="popLayout">
                                                    <motion.input
                                                    key={cantidades[b.id_boleto] ?? 0}  // <– TRUCO IMPORTANTE
                                                    type="number"
                                                    min={0}
                                                    value={cantidades[b.id_boleto] ?? 0}
                                                    onChange={(e) => handleChange(b.id_boleto, e.target.value)}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="w-16 text-center px-2 py-1 justify-center bg-transparent text-gray-900 dark:text-white"
                                                    />
                                                </AnimatePresence>
                                            </div>
                                            <button 
                                                onClick={() => handleChange(b.id_boleto, (cantidades[b.id_boleto] ?? 0) + 1)}
                                                className="px-3 py-1 bg-violet-600/70 text-white rounded-md hover:bg-violet-700/70 cursor-pointer transition-all duration-300 hover:scale-125 active:scale-50 active:text-amber-300 active:text-1xl"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <AnimatePresence>
                                            {(cantidades[b.id_boleto] ?? 0) > 0 && (
                                                <motion.p className="mt-2 text-sm text-violet-600 dark:text-violet-400"
                                                initial={{ opacity: 0, y: -70, scale: 0.3 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -70, scale: 0.3 }}
                                                transition={{ duration: 0.5 }}
                                                >
                                                    Subtotal:
                                                    <AnimatedNumber value={subtotalFor(b)} prefix="$" precision={2}/>
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )) : null}
                            </AnimatePresence>
                        </div>

                        <motion.h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4"
                        initial={{ opacity: 0, x: 50 , scale: 0.3 }}
                        animate={{ opacity: 1, x: 0 , scale: 1 }}
                        exit={{ opacity: 0, x: 10 , scale: 0.3 }}
                        transition={{ duration: 1.0 }}
                        >
                            Paquetes de Boletos
                        </motion.h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {Boletos && Boletos.length ? Boletos.filter(b => !isNullPackage(b.Paquete)).map(b => (
                                    <motion.div key={b.id_boleto} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 flex flex-col items-center select-none"
                                    initial={{ opacity: 0, y: -10, scale: 0.5 }}
                                    animate={{ opacity: 1, y: 0 , scale: 1 }}
                                    exit={{ opacity: 0, y: 10 , scale: 0.5 }}
                                    transition={{ duration: 0.8 }}
                                    >
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
                                            <div className="relative w-16 border rounded">
                                                <AnimatePresence mode="popLayout">
                                                    <motion.input
                                                    key={cantidades[b.id_boleto] ?? 0}  // <– TRUCO IMPORTANTE
                                                    type="number"
                                                    min={0}
                                                    value={cantidades[b.id_boleto] ?? 0}
                                                    onChange={(e) => handleChange(b.id_boleto, e.target.value)}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="w-16 text-center px-2 py-1 justify-center bg-transparent text-gray-900 dark:text-white"
                                                    />
                                                </AnimatePresence>
                                            </div>
                                            <button 
                                                onClick={() => handleChange(b.id_boleto, (cantidades[b.id_boleto] ?? 0) + 1)}
                                                className="px-3 py-1 bg-violet-600/70 text-white rounded-md hover:bg-violet-700/70 cursor-pointer"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <AnimatePresence>
                                            {(cantidades[b.id_boleto] ?? 0) > 0 && (
                                                <motion.p className="mt-2 text-sm text-violet-600 dark:text-violet-400"
                                                initial={{ opacity: 0, y: -70, scale: 0.3 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -70, scale: 0.3 }}
                                                transition={{ duration: 0.5 }}
                                                >
                                                    Subtotal:
                                                    <AnimatedNumber value={subtotalFor(b)} prefix="$" precision={2}/>
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )) : null}
                            </AnimatePresence>

                        </div>
                    </section>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="text-2xl font-semibold gap-2 justify-center text-center flex flex-row">
                        <p>Total:</p>   
                        <AnimatedNumber value={total()} prefix="$" precision={2}/>
                    </div>
                    <div className="flex gap-4">
                        <motion.button onClick={onClose} className="text-xl px-4 py-2 rounded-xl border-2 border-white dark:bg-gray-700 cursor-pointer hover:bg-red-600 hover:scale-110 active:scale-100"
                        initial={{ opacity: 0, y: -70, scale: 0.3 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -70, scale: 0.3 }}
                        transition={{ duration: 0.8 }}
                        >
                            Cancelar
                            </motion.button>
                        <motion.button onClick={handleConfirm} className="text-xl px-4 py-2 rounded-xl border-2 border-white bg-blue-600/45 cursor-pointer hover:bg-blue-600 hover:scale-110 active:scale-100"
                        initial={{ opacity: 0, y: -70, scale: 0.3 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -70, scale: 0.3 }}
                        transition={{ duration: 0.8 }}
                        >
                            Confirmar
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.main>
    );
}