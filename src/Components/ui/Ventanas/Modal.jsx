import { motion, AnimatePresence } from "framer-motion";
import { useModalStore } from "../../../Store/ModalStore";
import { useTablesStore } from '../../../Store/TablesStore';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';

export const Modal = ({ action, onClose, userId }) => {
    const { tipoSelect, editarUsuario, eliminarUsuario } = useModalStore();
    const cargarUsuarios = useTablesStore((s) => s.cargarUsuarios);
    const [formData, setFormData] = useState({
        id: "",
        usuario: "",
        nombre: "",
        contrasena: "",
        Rol: "usuario"  // Valor por defecto
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if ((action === 'edit' || action === 'delete') && userId) {
                console.log('Modal fetchUserData userId:', userId);
                try {
                    const response = await fetch(`/api/usuarios/${userId}`);
                    
                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }

                    const responseClone = response.clone();
                    let data;
                    try {
                        data = await response.json();
                    } catch (parseErr) {
                        const text = await responseClone.text();
                        console.error('Modal fetchUserData: response not JSON, body:', text);
                        console.error('Response status:', response.status);
                        console.error('Response headers:', Object.fromEntries(response.headers));
                        throw new Error('Error al procesar respuesta del servidor');
                    }
                    console.log('Modal fetchUserData response:', response.status, data);
                    if (data && data.success) {
                        setFormData({
                            id: data.usuario.id || "",
                            usuario: data.usuario.usuario || "",
                            nombre: data.usuario.nombre || "",
                            contrasena: "",  // Por seguridad, no mostramos la contraseña actual
                            Rol: data.usuario.Rol || "usuario"  // Usar el rol existente o el valor por defecto
                        });
                    }
                } catch (error) {
                    toast.error('Error al cargar datos del usuario');
                    console.error(error);
                    return;
                }
            }
        };
        fetchUserData();
    }, [action, userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (action === 'delete') {
                try {
                    await eliminarUsuario(userId);
                    toast.success('Usuario eliminado correctamente');
                    await cargarUsuarios();
                    // Limpiamos la selección y cerramos el modal
                    onClose();
                    // Asegurarnos de que los radio buttons se desmarquen
                    const radios = document.getElementsByName('selectedRow');
                    radios.forEach(radio => radio.checked = false);
                } catch (err) {
                    console.error(err);
                    toast.error(err.message || 'Error al eliminar usuario');
                }
            } else if (action === 'edit') {
                try {
                    console.log('Modal submit - editar payload:', { id: userId, ...formData });
                    const result = await editarUsuario({ id: userId, ...formData });
                    console.log('Modal submit - editar result:', result);
                    toast.success('Usuario actualizado correctamente');
                    await cargarUsuarios();
                    // Limpiamos la selección y cerramos el modal
                    onClose();
                    // Asegurarnos de que los radio buttons se desmarquen
                    const radios = document.getElementsByName('selectedRow');
                    radios.forEach(radio => radio.checked = false);
                } catch (err) {
                    console.error(err);
                    toast.error(err.message || 'Error al actualizar usuario');
                }
            } else if (action === 'agregar') {
                // crear nuevo usuario (no hay función en el modal store para crear)
                try {
                    const response = await fetch('/api/usuarios', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                    const data = await response.json();
                    if (data.success) {
                        toast.success('Usuario creado correctamente');
                        await cargarUsuarios();
                        onClose();
                    } else {
                        toast.error(data.mensaje || 'Error al crear usuario');
                    }
                } catch (err) {
                    console.error(err);
                    toast.error('Error al crear usuario');
                }
            }
            
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error en la operación');
        }
    };

    let titulo = "";
    if (action === "edit") titulo = "Editar " + (tipoSelect || "Usuario");
    else if (action === "delete") titulo = "Eliminar " + (tipoSelect || "Usuario");
    else titulo = "Agregar " + (tipoSelect || "Usuario");

return (
    <AnimatePresence>
        <motion.div
            key="modal-backdrop"
            className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="flex min-h-screen items-center justify-center p-4">
                <motion.div
                    key="modal-content"
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl relative"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <Icon icon="line-md:close" width="24" height="24" />
                    </button>
                    
                    <div className="p-6">
                        <div className="flex items-center justify-center mb-6">
                            <Icon
                                icon={action === 'delete' ? "line-md:account-delete" : action === 'edit' ? "line-md:account-edit" : "line-md:account-add"}
                                width="32"
                                height="32"
                                className="mr-2"
                                style={{color: action === 'delete' ? '#ef4444' : '#3b82f6'}}
                            />
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{titulo}</h2>
                        </div>

                        {action === 'delete' ? (
                            <div className="text-center">
                                <Icon icon="line-md:alert-circle" className="mx-auto mb-4" width="48" height="48" style={{color: '#ef4444'}} />
                                <p className="text-gray-700 dark:text-gray-300 mb-6">
                                    ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
                                </p>

                                <span className="text-amber-300">Datos del Usuario:</span>

                                <br />

                                <p className="text-center mb-5 mt-3">{`${formData.id} ${formData.usuario}`}</p>
                                
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={onClose}
                                        className="bg-gray-500 hover:bg-gray-600 text-white rounded-md px-4 py-2 flex items-center gap-2"
                                    >
                                        <Icon icon="line-md:close" width="20" height="20" />
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2 flex items-center gap-2"
                                    >
                                        <Icon icon="line-md:confirm" width="20" height="20" />
                                        Eliminar 
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Usuario
                                    </label>
                                    <input
                                        type="text"
                                        id="usuario"
                                        value={formData.usuario}
                                        onChange={(e) => setFormData({...formData, usuario: e.target.value})}
                                        className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                        className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="rol" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Rol
                                    </label>
                                    <select
                                        id="rol"
                                        value={formData.Rol || 'usuario'}
                                        onChange={(e) => setFormData({...formData, Rol: e.target.value})}
                                        className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="usuario">Usuario</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {action === 'edit' ? 'Nueva Contraseña (dejar en blanco para mantener la actual)' : 'Contraseña'}
                                    </label>
                                    <input
                                        type="password"
                                        id="contrasena"
                                        value={formData.contrasena}
                                        onChange={(e) => setFormData({...formData, contrasena: e.target.value})}
                                        className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required={action !== 'edit'}
                                    />
                                </div>
                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="bg-gray-500 hover:bg-gray-600 text-white rounded-md px-4 py-2 flex items-center gap-2"
                                    >
                                        <Icon icon="line-md:close" width="20" height="20" />
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2 flex items-center gap-2"
                                    >
                                        <Icon icon={action === 'edit' ? "line-md:confirm" : "line-md:confirm"} width="20" height="20" />
                                        {action === 'edit' ? 'Guardar Cambios' : 'Crear Usuario'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    </AnimatePresence>
    );
}; 