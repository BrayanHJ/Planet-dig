import { useState } from 'react';
import { ModalVenta } from "../Components/ui/Ventanas/ModalVenta";
import { ModalVentaBoletos } from "../Components/ui/Ventanas/ModalVentaBoletos";
import { BoletosStore } from '../Store/BoletosStore.jsx';
import { toast , Toaster } from 'sonner';

export const VentaBoletos = () => {
    const [openModal, setOpenModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const { seleccionados, clearSeleccionados, Boletos, setSeleccionados } = BoletosStore();

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
                toast.success(
                    <div>
                        <p>Venta registrada correctamente</p>
                        <p className="font-bold">Folio: {data.folio_venta}</p>
                    </div>
                );
                return;
            }
            toast.error(data?.mensaje || `Error al registrar la venta (status ${res.status})`);
        } catch (err) {
            console.error(err);
            toast.error('Error al enviar la selección: ' + (err?.message || String(err)));
        }
    };

    return (
        <main className="dark:bg-bg-dark max-w-[1200px] mx-auto flex flex-col gap-4 p-4 h-full   items-center justify-center">
            <div className="flex flex-col justify-center items-center  bg-black/50 text-white rounded-3xl p-6 w-full ">
                <section className="mt-6 w-full ">
                    {(!seleccionados || seleccionados.length === 0) ? (
                        <div>
                            <h1 className="text-7xl justify-center text-center mb-15">Venta de Boletos</h1>
                            <p className="text-gray-600">No hay boletos seleccionados</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <h1 className="justify-center text-center mb-8 text-5xl">Boletos</h1>
                            {seleccionados.map(item => {
                                const meta = (Boletos || []).find(b => b.id_boleto === item.id_boleto) || {};
                                return (
                                    <div key={item.id_boleto} className="flex items-center justify-between p-3 border rounded">
                                        <section className="flex items-center justify-between w-9/12">
                                            <div className="flex gap-2 justify-center items-center">
                                                <div className='flex gap-2 transition-all duration-300'>
                                                    <button onClick={() => updateCantidad(item.id_boleto, -1)} className="px-3 py-1 bg-green-800 rounded cursor-pointer hover:bg-green-600 hover:scale-120">-</button>
                                                    <button onClick={() => updateCantidad(item.id_boleto, +1)} className="px-3 py-1 bg-green-800 rounded cursor-pointer hover:bg-green-600 hover:scale-120">+</button>
                                                </div>
                                                <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                                                {item.folios && item.folios.length > 0 && (
                                                    <p className="text-sm text-gray-500">Folios: {item.folios.join(', ')}</p>
                                                )}
                                            </div>
                                        </section>
                                        <div className="text-right flex flex-row items-end gap-10">
                                            <p className="font-semibold ml-3 flex justify-center items-center text-center">{item.cantidad} {meta.Boleto || `#${item.id_boleto}`}</p>
                                            <p className="font-medium">${item.total}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>

            <div className="mx-auto flex flex-row gap-4 p-4 justify-between w-full">
                <div className="flex gap-4 transition-all duration-500">
                    <button
                        className="text-2xl cursor-pointer bg-red-800 rounded-3xl font-bold px-6 py-2 hover:bg-red-500 hover:scale-120"
                        onClick={() => {
                            if (!seleccionados || seleccionados.length === 0) {
                                toast.error('No hay boletos seleccionados');
                                return;
                            }
                            clearSeleccionados();
                            toast.success('Selección cancelada');
                        }}
                    >
                        Cancelar
                    </button>
                    <button className="text-2xl cursor-pointer bg-purple-500 rounded-3xl font-bold px-6 py-2 hover:bg-purple-800 hover:scale-120" onClick={() => setOpenModal(true)}>Agregar</button>
                    <button 
                        className="text-2xl cursor-pointer bg-blue-500 rounded-3xl font-bold px-6 py-2 hover:bg-blue-800 hover:scale-120" 
                        onClick={() => {
                            if (!seleccionados || seleccionados.length === 0) {
                                toast.error('No hay boletos seleccionados');
                                return;
                            }
                            handleOpenConfirm();
                        }}
                    >
                        Aceptar
                    </button>
                </div>
                <section className="justify-center items-center text-center">
                    <h2 className="text-3xl">Total</h2>
                    <p className="text-2xl">${seleccionados && seleccionados.reduce((s, i) => s + (i.total || 0), 0)}</p>
                </section>
            </div>
            {openModal && (
                <ModalVenta onClose={() => setOpenModal(false)} onConfirm={() => setOpenModal(false)} />
            )}

            {openConfirmModal && (
                <ModalVentaBoletos 
                    onClose={() => setOpenConfirmModal(false)}
                    onConfirm={sendSeleccionados}
                />
            )}

            <Toaster position="top-right" richColors />
        </main>
    );
}