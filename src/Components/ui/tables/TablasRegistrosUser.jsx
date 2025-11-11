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
import { toast , Toaster } from 'sonner';

    function TablaRegistrosUser() {
    const registrosUser = useTablesStore((s) => s.registrosUser);
    const loading = useTablesStore((s) => s.loading);
    const error = useTablesStore((s) => s.error);
    const cargarRegistrosUser = useTablesStore((s) => s.cargarRegistrosUser);
    // selection and modal state
    const [selectedIds, setSelectedIds] = useState([]); // array of selected row ids (strings)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null); // 'edit' | 'delete'

    const {setTipoSelect} = useModalStore();


    const handleEdit = useCallback((id) => {
        // Open edit modal for single id
        setSelectedIds([String(id)]);
        setModalAction('edit');
        setIsModalOpen(true);
    }, []);

    const handleDelete = useCallback(async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
        try {
            const response = await fetch(`/api/RegistrosUser/${id}`, {
            method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
            cargarRegistrosUser(); // recargar lista
            } else {
            toast.error(data.mensaje || 'Error al eliminar usuario');
            }
        } catch (err) {
            console.error('Error:', err);
            toast.error('Error al intentar eliminar el usuario');
        }
        }
    }, [cargarRegistrosUser]);

    useEffect(() => {
        // Llamar DataTable.use aquí para evitar que el linter lo marque como Hook
        try {
        DataTable['use'](DT);
        } catch (err) {
        // Si ya se llamó anteriormente, ignorar el error
        void err;
        }

        cargarRegistrosUser();
    }, [cargarRegistrosUser]);

        const columns = useMemo(() => {
        if (!registrosUser || registrosUser.length === 0) return [{ title: 'Registros' }];
        const keys = Object.keys(registrosUser[0]);
        return [
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
                        class=" h-4 w-4 text-blue-600 bg-gray-800 border-gray-600 focus:ring-blue-600  cursor-pointer"
                    />
                </div>`;
            }
            },
            // Data columns
            ...keys.map((k) => ({ title: k.charAt(0).toUpperCase() + k.slice(1) })),
            // Actions column
        ];
        }, [registrosUser, selectedIds]);

    const data = useMemo(() => {
        if (!registrosUser || registrosUser.length === 0) return [];
        const keys = Object.keys(registrosUser[0]);
        return registrosUser.map((u) => [
        '', // placeholder for selection checkbox column
        ...keys.map((k) => (u[k] === null || u[k] === undefined ? '' : String(u[k]))),
        '' // Empty string for the actions column
        ]);
    }, [registrosUser]);

    // Exponer las funciones al window para que los botones puedan llamarlas
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
        return () => {
            delete window.handleEdit;
            delete window.handleDelete;
            delete window.handleSelectChange;
        };
    }, [handleEdit, handleDelete]);


    return (
        <div className="p-6 min-h-screen">
        <div className="shadow-md rounded-lg p-4 ">
            <section className="flex items-center gap-2 justify-center flex-col mb-5">
                <h2 className="text-3xl font-semibold text-white mb-4 text-center"> Registro de Usuarios </h2>
                <Icon icon="line-md:account" width="35" height="35"  style={{color:' #fff'}} />
            </section>

            <BtnExport
                data={registrosUser}
                fields={registrosUser && registrosUser.length ? Object.keys(registrosUser[0]) : []}
                filenameBase={`registros_usuarios_${new Date().toISOString().slice(0,10)}`}
                className="ml-auto hover:bg-green-600 bg-green-800 transition-all duration-300 text-white px-3 py-1 rounded text-sm cursor-pointer"
            >
                Exportar a Excel/CSV
            </BtnExport>
            <hr />
            <br />
            <div className="flex items-center mb-4">
                <div className="flex items-center bg-gray-300 dark:bg-gray-800 px-3 py-1 rounded mr-4 select-none">
                    <Icon icon="line-md:confirm-circle" width="20" height="20" className="mr-2" style={{color: selectedIds.length > 0 ? '#22c55e' : '#666'}} />
                    <span className="text-black dark:text-white">
                        {selectedIds.length > 0 ? `ID seleccionado: ${selectedIds[0]}` : 'Ningún registro seleccionado'}
                    </span>
                </div>
                <button
                className="hover:bg-red-600 bg-red-800 transition-all duration-300 text-white px-3 py-1 rounded text-sm mr-2 cursor-pointer"
                onClick={() => {
                    if (selectedIds.length > 0) {
                    setModalAction('delete');
                    setTipoSelect('Registro Usuario');
                    setIsModalOpen(true);
                    } else {
                    toast.error('Por favor, seleccione un registro para eliminar');
                    }
                }}
                >
                <Icon icon="line-md:account-delete" width="24" height="24"  style={{color: '#fff'}} />
                </button>
            </div>

            <div className="overflow-x-auto">
            {loading ? (
                <div className="text-white">Cargando usuarios...</div>
            ) : error ? (
                <div className="text-red-400">Error: {error}</div>
            ) : registrosUser && registrosUser.length > 0 ? (
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
                <div className="text-white">No hay usuarios para mostrar.</div>
            )}
            </div>
        </div>
        {isModalOpen && (
            <Modal
            action={modalAction}
            onClose={() => setIsModalOpen(false)}
            userId={selectedIds[0]}
            />
        )}
        {!isModalOpen && (
            <Toaster className='select-none cursor-pointer' />
        )}
        </div>
    );
    }

export default TablaRegistrosUser;
