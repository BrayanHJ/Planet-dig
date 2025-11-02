import { motion, AnimatePresence } from "framer-motion";
import { Icon } from '@iconify/react';
import { UserStore } from "../../../Store/UserStore";
import { useNavigate } from "react-router-dom";

export const ModalUsuario = ({onClose}) => {
    const { User: user } = UserStore.getState();
    const navigate = useNavigate();

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
                    <h1 className="font-semibold text-5xl">Cerrar Sesión</h1>
                    <br />
                    <p className="mt-4">¿Estás seguro de que deseas cerrar sesión, {user}?</p>
                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-500 transition"
                            onClick={() => {
                                UserStore.getState().reset();
                                onClose();
                                navigate('/');
                            }}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    </AnimatePresence>
    );
}; 