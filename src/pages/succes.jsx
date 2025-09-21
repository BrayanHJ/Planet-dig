import React, { useEffect, useState } from "react";
import { motion , AnimatePresence } from "framer-motion";

export const Succes = () => {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/usuarios")
            .then(res => res.json())
            .then(data => {
                if (data.success) setUsuarios(data.usuarios);
            });
    }, []);

    return (
        <motion.main className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 flex flex-col items-center py-10"
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            exit={{ x: -100 }}
            transition={{ duration: 1.5 , ease: "easeInOut" }}
        >
            <AnimatePresence>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-3xl mb-8">
                    <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-6 text-center">
                        Usuarios Registrados
                    </h1>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded-lg">
                            <thead>
                                <tr className="bg-blue-100 dark:bg-blue-900">
                                    <th className="py-2 px-4 border-b">ID</th>
                                    <th className="py-2 px-4 border-b">Usuario</th>
                                    <th className="py-2 px-4 border-b">Password</th>
                                    <th className="py-2 px-4 border-b">Rol</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(u => (
                                    <tr key={u.id} className="hover:bg-blue-50 dark:hover:bg-black/30">
                                        <td className="py-2 px-4 border-b">{u.id}</td>
                                        <td className="py-2 px-4 border-b">{u.Nombre}</td>
                                        <td className="py-2 px-4 border-b">{u.Password}</td>
                                        <td className="py-2 px-4 border-b">{u.Rol}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </AnimatePresence>
        </motion.main>
    );
}