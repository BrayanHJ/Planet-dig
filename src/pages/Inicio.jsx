import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion , AnimatePresence } from "framer-motion";
import { Toaster , toast } from "sonner";
import { useInicioStore } from "../Store/InicioStore.jsx";
import {UserStore} from "../Store/UserStore.jsx";

// const { setUser , setRol } = UserStore.getState();

const inputVariants = {
    hidden: { x: -200, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: 200, opacity: 0 }
};

const labelVariants = {
    hidden: { y: -200, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 200, opacity: 0 }
};

export const Inicio = () => {
    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const navigate = useNavigate();

    const { setUsuarioform , setContrasenaform, login } = useInicioStore();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!usuario) {
            toast.error("El campo Usuario es obligatorio");
            return;
        }
        if (!contrasena) {
            toast.error("El campo Contraseña es obligatorio");
            return;
        }
        try {
            const data = await login(usuario, contrasena);
            if (data.success) {
                toast.success(data.mensaje || "Inicio de sesión correcto");
                setUsuarioform(usuario);
                setContrasenaform(contrasena);
                try {

                    const setUser = UserStore.getState().setUser;
                    const setRol = UserStore.getState().setRol;
                    const setIdUser = UserStore.getState().setIdUser;

                    if (typeof setUser === 'function') setUser(data.usuario || usuario);
                    if (typeof setRol === 'function') setRol(data.Rol || 'usuario');
                    if (typeof setIdUser === 'function') setIdUser(data.id || null);
                    
                } catch (storeErr) {
                    console.error('Error guardando en UserStore:', storeErr);
                }
                navigate("/Panel");
            } else {
                toast.error(data.mensaje || "Usuario incorrecto");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <main className="flex items-center justify-center
            text-white dark:text-white min-h-screen w-full flex-col text-center">

                <Toaster />

            <img src="src/assets/6458e18287853.webp" alt="nothing"  className="fixed top-0 left-0 w-full h-full object-cover" />

            <AnimatePresence>

                <motion.div className="fixed top-0 left-0 w-full h-full justify-between"
                initial={{ y:1000 }}
                animate={{ y:0 }}
                exit={{ y:0 }}
                transition={{ duration: 1.5 , ease: "easeInOut" }}
                >
                    <img src="../../public/unnamed.jpg" alt="Planetario Digital" className=" ml-5 mt-4  rounded-full h-20 w-20" />
                    <motion.h1 className="text-6xl text-white-outline font-bold text-violet-900  justify-center"
                        initial={{ y: 0, opacity: -5 }}
                        animate={{ y: -55, opacity: 1 }}
                        transition={{ duration: 3.0 , ease: "easeInOut" }}
                    >
                        Planetario Digital
                    </motion.h1>
                </motion.div>

                <motion.div className="bg-black/50 bg-opacity-50 w-1/2 h-1/2 flex justify-center items-center backdrop-blur-lg p-8 rounded-lg flex-col mt-18"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 1.5 , ease: "easeInOut" }}
                >

                    <motion.h1 className="text-5xl font-bold mt-3 mb-10 text-shadow-amber-50"
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 2.0 , ease: "easeInOut" }}
                    >
                        Iniciar Seción
                    </motion.h1>

                    <form onSubmit={handleSubmit}>
                        <motion.label className="block text-2xl font-bold text-violet-500"
                        variants={labelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 1.5 , ease: "easeInOut" }}
                        >Usuario</motion.label>

                        <br />

                        <motion.input type="text" placeholder="Usuario" className="align-center mb-4" value={usuario} onChange={e => setUsuario(e.target.value)} name="usuario" 
                        variants={inputVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 1.5 , ease: "easeInOut" }}
                            />

                        <br />

                        <motion.label className="block text-2xl font-bold text-violet-500"
                        variants={labelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 1.5 , ease: "easeInOut" }}
                        >Contraseña</motion.label>

                        <br />

                        <motion.input type="password" placeholder="Contraseña" className="mb-4" value={contrasena} onChange={e => setContrasena(e.target.value)} name="contrasena"
                        variants={inputVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 1.5 , ease: "easeInOut" }}
                        />

                        <br />

                        <motion.button type="submit" className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-6"
                        initial={{ opacity: 0, scale: 0.3 }}
                        animate={{opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.3 }}
                        transition={{ duration: 1.5 , ease: "easeInOut" }}
                        >Iniciar Seción</motion.button>
                    </form> 
                </motion.div>
            </AnimatePresence>
        </main>
    );
}