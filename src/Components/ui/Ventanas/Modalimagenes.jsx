import { motion , AnimatePresence } from 'framer-motion';

export const Modalimagenes = ({ isOpen, onClose, data }) => {

    const TilesVariants = {
        initial: { 
            y: -500,
            opacity: 0 
        },
        animate: { 
            y: 0,
            opacity: 1,
            transition: { duration: 2.0 }
        },
        exit: { 
            y: -500,
            opacity: 0,
            transition: { duration: 2.0 }
        }
    };

    const InputsVariants = {
        initial: { 
            y: -500,
            opacity: 0 
        },
        animate: { 
            y: 0,
            opacity: 1,
            transition: { duration: 3.5 }
        },
        exit: { 
            y: -500,
            opacity: 0,
            transition: { duration: 3.5 }
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence mode="wait">
                <motion.div 
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-90 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                <motion.div 
                    className="bg-bg-dark p-6 rounded-lg w-1/2"
                    variants={TilesVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                <motion.h1 className="font-bold text-5xl text-center mb-5 gap-1.5"
                initial={{  y: -500 }}
                animate={{ y: 0 }}
                exit={{ y: -500 }}
                transition={{ duration: 2.0 }}
                >
                    Editar Datos
                </motion.h1>
                <motion.label className="block mb-2"
                variants={InputsVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                >
                    Texto:
                    <input className="w-full border rounded px-2 py-1" />
                </motion.label>

                <motion.h2 
                    className="font-bold text-2xl mb-4 text-center"
                    variants={TilesVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    Imagenes
                </motion.h2>
                <section className='flex flex-row justify-center align-center items-center gap-6 mb-4'>
                    <label className="mb-2 justify-center items-center flex flex-col">
                        <h3 className="text-lg text-center">nueva: </h3>
                        <br />
                        <motion.button type="file" accept="image/*" className='border border-amber-50 rounded-3xl cursor-pointer' 
                        variants={InputsVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        >
                            Subir nuevo Archivo
                        </motion.button>
                    </label>
                    <label className="mb-2 justify-center items-center flex flex-col">
                        <h3 className="text-lg text-center">Actual: </h3>
                        <br />
                        <motion.button className='border border-amber-50 rounded-3xl cursor-pointer'
                        variants={InputsVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                            >
                            Previsualizar imagen
                        </motion.button>
                    </label>
                </section>

                <motion.h2 
                    className="font-bold text-2xl mb-4 text-center"
                    variants={TilesVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    Fechas:
                </motion.h2>
                <motion.label className="mb-9 flex justify-between gap-4"
                variants={InputsVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                >
                    de:
                    <input type="date" className="w-full border rounded px-2 py-1 text-white bg-blue-500 cursor-pointer" />
                    a:
                    <input type="date" className="w-full border rounded px-2 py-1 text-white bg-blue-500 cursor-pointer" />
                </motion.label>

                <motion.h2 
                    className="font-bold text-2xl mb-4 text-center"
                    variants={TilesVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    Fecha
                </motion.h2>
                <motion.label className="mb-9 flex justify-between gap-4"
                variants={InputsVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                >
                    <input type="date" className="w-full border rounded px-2 py-1 text-white bg-blue-500 cursor-pointer text-center mr-9 ml-9" />
                </motion.label>

                <div className="flex justify-between align-center items-center gap-2 mt-3">

                    <section>
                        <label className="mb-2 flex flex-row justify-center items-center gap-3">
                            <motion.h2 
                                className="font-bold text-2xl"
                                variants={TilesVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                Dia:
                            </motion.h2>
                            <motion.select name="Dia" id="day" className="bg-black w-full border rounded px-2 py-1 text-amber-400 cursor-pointer"
                            variants={InputsVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            >
                                <option value="Lunes">Lunes</option>
                                <option value="Martes">Martes</option>
                                <option value="Miércoles">Miércoles</option>
                                <option value="Jueves">Jueves</option>
                                <option value="Viernes">Viernes</option>
                                <option value="Sábado">Sábado</option>
                                <option value="Domingo">Domingo</option>
                            </motion.select>
                        </label>
                    </section>

                    <motion.section className="flex justify-between align-center items-center gap-4"
                    variants={InputsVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    >
                        <button 
                            onClick={onClose}
                            className="px-3 py-1 border rounded cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button 
                            className="px-3 py-1 bg-red-600 text-white rounded cursor-pointer"
                        >
                            Eliminar
                        </button>
                        <button 
                            className="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer"
                        >
                            Guardar cambios
                        </button>
                    </motion.section>

                </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}