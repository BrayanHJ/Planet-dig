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
            className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm text-center"
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
                    <section className="font-semibold text-5xl text-center flex-col flex justify-center items-center mt-4">
                        <h1 className="">Cerrar Sesión</h1>
                        <motion.span
                        initial={{ opacity: 0, scale: 0.5, y: -300 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        transition={{ duration: 2.5 }}
                        >
                            <Icon icon="quill:userhappy" className="text-yellow-500  align-center flex justify-center " />
                        </motion.span>
                    </section>
                    <br />
                    <p className="mt-4 text-2xl">¿Estás seguro de que deseas cerrar sesión {user}?</p>
                    <br />
                    <div className="mt-6 mb-4 flex justify-center-safe gap-4">
                        <motion.button
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                            onClick={onClose}
                            whileHover={{ scale: 1.2 }}
                            initial={{ scale: 1 , x:-500 }}
                            animate={{ scale: 1 , x:0 }}
                            transition={{ duration: 1.5 , ease: "easeInOut" }}

                        >
                            Cancelar
                        </motion.button>
                        <motion.button
                            className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-500 transition"
                            onClick={() => {
                                UserStore.getState().reset();
                                onClose();
                                navigate('/');
                            }}
                            whileHover={{ scale: 1.2 }}
                            initial={{ scale: 1 , x:500 }}
                            animate={{ scale: 1 , x:0 }}
                            transition={{ duration: 1.0 , ease: "easeInOut" }}

                        >
                            Cerrar Sesión
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    </AnimatePresence>
    );
}; 