import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ModalVenta } from "../Ventanas/ModalVenta.jsx";
import { ModalVentaBoletos } from "../Ventanas/ModalVentaBoletos.jsx";
import { BoletosStore } from '../../../Store/BoletosStore.jsx';
import { showToast } from "../toastService.jsx";
import { motion , AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

// reference motion to satisfy linters that don't detect JSX usage
void motion;

// AnimatedNumber: smooth numeric transitions using a spring
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

export const VentaBoletos = () => {
    const [openModal, setOpenModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const { seleccionados, clearSeleccionados, Boletos, setSeleccionados } = BoletosStore();
    const totalSum = (seleccionados && seleccionados.reduce((s, i) => s + (i.total || 0), 0)) || 0;
    const location = useLocation();

    const updateCantidad = (id_boleto, delta) => {
        const meta = (Boletos || []).find(b => b.id_boleto === id_boleto) || {};
        const price = Number(meta.Precio || meta.precio || 0);
        const baseFolio = Number(meta.Folio || meta.folio || 0);

        const next = (seleccionados || []).map(i => ({ ...i }));
        const idx = next.findIndex(i => i.id_boleto === id_boleto);
        if (idx === -1) {
            if (delta > 0) {
                const cantidad = delta;
                const folios = baseFolio ? Array.from({ length: cantidad }, (_, i) => baseFolio + i) : [];
                next.push({ id_boleto, cantidad, total: price * cantidad, folios });
            }
        } else {
            const newQty = Math.max(0, (next[idx].cantidad || 0) + delta);
            if (newQty <= 0) {
                next.splice(idx, 1);
            } else {
                next[idx].cantidad = newQty;
                next[idx].total = price * newQty;
                next[idx].folios = baseFolio ? Array.from({ length: newQty }, (_, i) => baseFolio + i) : [];
            }
        }
        if (typeof setSeleccionados === 'function') setSeleccionados(next);
    };

    const handleOpenConfirm = () => {
        if (!seleccionados || seleccionados.length === 0) return;
        setOpenConfirmModal(true);
    };

    const sendSeleccionados = async () => {
        if (!seleccionados || seleccionados.length === 0) return;
        try {
            const res = await fetch('/api/Boletos/venta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: seleccionados })
            });
            const data = await res.json();
            console.log('venta response', res.status, data);
            if (res.ok) {
                clearSeleccionados();
                setOpenConfirmModal(false);
                showToast({
                    severity: 'success',
                    summary: 'Éxito',
                    life:7000,
                    detail: (
                        <div>
                            <p>Venta registrada correctamente</p>
                            <p className="font-bold">Folio: <motion.span
                                key={data.folio_venta}
                                initial={{ opacity: 0, y: -10, scale: 0.5 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.5 }}
                                transition={{ duration: 0.4 }}
                                style={{ display: 'inline-block', marginLeft: 4 }}
                            >{data.folio_venta}</motion.span></p>
                        </div>
                    )
                });
                return;
            }
            showToast({ severity: 'error', summary: 'Error', detail: data?.mensaje || `Error al registrar la venta (status ${res.status})` });
        } catch (err) {
            console.error(err);
            showToast({ severity: 'error', summary: 'Error', detail: 'Error al enviar la selección: ' + (err?.message || String(err)) });
        }
    };

    const pageVariants = {
        initial: { opacity: 0, y: 700, scale: 0.4 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 700, scale: 0.4 }
    }; 

    const listVariants = {
        animate: { transition: { staggerChildren: 0.06 } },
        exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } }
    };

    const itemVariants = {
        initial: { opacity: 0, y: 140, scale: 0.3 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 140, scale: 0.3 }
    };

    return (
        <motion.main key={location.pathname} className="dark:bg-bg-dark flex flex-col gap-4 p-4 h-full w-full items-center justify-center select-none overflow-hidden"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
                <div className="flex flex-col justify-center items-center  bg-black/50 text-white rounded-3xl p-6 w-full">
                    <section className="mt-6 w-full ">
                        {(!seleccionados || seleccionados.length === 0) ? (
                            <div>
                                <motion.h1 className="text-6xl font-extrabold justify-center text-center mb-15"
                                    variants={itemVariants}
                                    initial="initial"
                                    animate="animate"
                                    transition={{ duration: 1.8 }}
                                >
                                    Venta de Boletos
                                </motion.h1>
                                <motion.p className="text-gray-600 text-2xl"
                                    variants={itemVariants}
                                    initial="initial"
                                    animate="animate"
                                    transition={{ duration: 1.8 }}
                                >
                                    No hay boletos seleccionados
                                </motion.p>
                            </div>
                        ) : (
                            <motion.div className="space-y-2" variants={listVariants} initial="initial" animate="animate" exit="exit">
                                <motion.h1 className="justify-center text-center mb-8 font-bold text-5xl" variants={itemVariants}>Boletos</motion.h1>
                                    <AnimatePresence initial={true} mode="popLayout">
                                    {seleccionados.map(item => {
                                        const meta = (Boletos || []).find(b => b.id_boleto === item.id_boleto) || {};
                                        return (
                                            <motion.div key={item.id_boleto} className="flex items-center justify-between p-3 border rounded"
                                                layout
                                                variants={itemVariants}
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                                transition={{ duration: 0.35 }}
                                            >
                                                <section className="flex items-center justify-between w-9/12">
                                                    <div className="flex gap-2 justify-center items-center">
                                                        <div className='flex gap-2'>
                                                            <motion.button onClick={() => updateCantidad(item.id_boleto, -1)} className="px-3 py-1 bg-green-800 rounded cursor-pointer hover:scale-110 active:scale-100 active:bg-green-700">-</motion.button>
                                                            <motion.button  onClick={() => updateCantidad(item.id_boleto, +1)} className="px-3 py-1 bg-green-800 rounded cursor-pointer hover:scale-110 active:scale-100 active:bg-green-700 ">+</motion.button>
                                                        </div>
                                                        <p className="text-sm text-gray-600">Cantidad: <motion.span
                                                                key={item.cantidad}
                                                                initial={{ opacity: 0, y: 10, scale: 0.5 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 10, scale: 0.5 }}
                                                                transition={{ duration: 0.4 }}
                                                                style={{ display: 'inline-block', marginLeft: 4 }}
                                                        >{item.cantidad}</motion.span></p>
                                                        {item.folios && item.folios.length > 0 && (
                                                            <p className="text-sm text-gray-500">Folios: {item.folios.join(', ')}</p>
                                                        )}
                                                    </div>
                                                </section>
                                                <div className="text-right flex flex-row items-end gap-10">
                                                    <section className="flex flex-row gap-2 items-center">
                                                        <p className="font-bold ml-3 flex justify-center items-center text-center">
                                                            <motion.span
                                                            key={item.cantidad}
                                                            initial={{ opacity: 0, y: -10, scale: 0.5 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 10, scale: 0.5 }}
                                                            transition={{ duration: 0.4 }}
                                                            style={{ display: 'inline-block', marginLeft: 2 }}
                                                            >
                                                                {item.cantidad}
                                                            </motion.span> 
                                                        </p>
                                                        <p>
                                                            {meta.Boleto || `#${item.id_boleto}`}
                                                        </p>
                                                    </section>
                                                    <p className="font-medium"><motion.span
                                                        key={item.total}
                                                        initial={{ opacity: 0, y: -10, scale: 0.5 }}
                                                        animate={{ opacity: 1, y: 0 , scale: 1 }}
                                                        exit={{ opacity: 0, y: 10 , scale: 0.5 }}
                                                        transition={{ duration: 0.4 }}
                                                        style={{ display: 'inline-block', marginLeft: 4 }}
                                                    >${item.total}</motion.span></p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </section>
                </div>

                <div className="mx-auto flex flex-row gap-4 p-4 justify-between w-full">
                    <div className="flex gap-5">
                        <AnimatePresence mode="wait">
                            <motion.button 
                                style={{ display: 'inline-block transform 0.3s, background-color 0.3s ' , marginLeft: 4 }}
                                className="text-white text-2xl bg-red-800 rounded-3xl font-bold px-6 py-2 cursor-pointer hover:bg-red-500 hover:scale-110 active:scale-100"
                                initial={{ opacity: 0, x: 1700 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 1700 }}
                                transition={{ duration: 1.3 }}
                                onClick={() => {
                                    if (!seleccionados || seleccionados.length === 0) {
                                        showToast({ severity: 'error', summary: 'Error', detail: 'No hay boletos seleccionados' });
                                        return;
                                    }
                                    clearSeleccionados();
                                    showToast({ severity: 'warn', summary: 'Advertencia', detail: 'Selección cancelada' });
                                }}>Cancelar</motion.button>

                            <motion.button className="text-white text-2xl bg-purple-800 rounded-3xl font-bold px-6 py-2 cursor-pointer hover:bg-purple-500 hover:scale-110 active:scale-100" 
                            style={{ display: 'inline-block transform 0.3s, background-color 0.3s' , marginLeft: 4 }}
                            initial={{ opacity: 0, x: 1600 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 1600 }}
                            transition={{ duration: 1.3 }}
                            onClick={() => setOpenModal(true)}>
                                Agregar
                            </motion.button>

                            <motion.button className="text-white text-2xl bg-blue-800 rounded-3xl font-bold px-6 py-2 cursor-pointer hover:bg-blue-500 hover:scale-110 active:scale-100" 
                            style={{ display: 'inline-block transform 0.3s, background-color 0.3s' , marginLeft: 4 }}
                            initial={{ opacity: 0, x: 1500 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 1500 }}
                            transition={{ duration: 1.3 }}
                            onClick={() => {
                                    if (!seleccionados || seleccionados.length === 0) {
                                        showToast({ severity: 'error', summary: 'Error', detail: 'No hay boletos seleccionados' });
                                        return;
                                    }
                                    handleOpenConfirm();
                                }}>Aceptar</motion.button>
                        </AnimatePresence>
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.section className="justify-center items-center text-center"
                            initial={{ opacity: 0, y: 800 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 800 }}
                            transition={{ duration: 1.7 }}
                        >
                            <h2 className="text-5xl font-medium">Total</h2>
                            <AnimatePresence mode="wait">
                                    <AnimatedNumber value={totalSum} prefix="$" precision={2} className="text-4xl font-light" />
                            </AnimatePresence>
                            
                        </motion.section>
                    </AnimatePresence>
                </div>
                <AnimatePresence>
                    {openModal && (
                        <ModalVenta onClose={() => setOpenModal(false)} onConfirm={() => setOpenModal(false)} />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {openConfirmModal && (
                        <ModalVentaBoletos 
                            onClose={() => setOpenConfirmModal(false)}
                            onConfirm={sendSeleccionados}
                        />
                    )}
                </AnimatePresence>
        </motion.main>
    );
}