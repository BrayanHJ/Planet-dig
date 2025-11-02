import { motion } from "framer-motion";


export const  ModalVenta = () => {

    return (
        <motion.main className="bg-black/50 fixed top-0 left-0 right-0 bg-opacity-50 w-full h-full flex justify-center items-center backdrop-blur-lg"
            initial={{ opacity: 0, y:-1000 }}
            animate={{ opacity: 1 , y:0 }}
            exit={{ opacity: 0 , y:-1000 }}
            transition={{ duration: 2.0 , ease: "easeInOut" }}
        >
            <main className="bg-amber-300 dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-3xl mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">Seleccione Sus Boletos</h2>
                    {/* .Map */}
                    <section className="gap-6 flex flex-col justify-center">


                            <h2>Boletos Individuales</h2>

                        <div className="flex flex-row gap-11 justify-center">

                            <section>
                                <button className="bg-violet-600/70 text-white rounded-md px-4 py-2 text-7xl cursor-pointer">
                                    150
                                </button>
                                <p className="text-gray-600 dark:text-gray-400">Descripción del boleto</p>
                            </section>

                            <section>
                                <button className="bg-violet-600/70 text-white rounded-md px-4 py-2 text-7xl cursor-pointer">
                                    150
                                </button>
                                <p className="text-gray-600 dark:text-gray-400">Descripción del boleto</p>
                            </section>

                            <section>
                                <button className="bg-violet-600/70 text-white rounded-md px-4 py-2 text-7xl cursor-pointer">
                                    150
                                </button>
                                <p className="text-gray-600 dark:text-gray-400">Descripción del boleto</p>
                            </section>

                        </div>


                            <h2>Paquete de Boletos</h2>

                        <div  className="flex flex-row gap-11 justify-center">

                            <section>
                                <button className="bg-violet-600/70 text-white rounded-md px-4 py-2 text-7xl cursor-pointer">
                                    500
                                </button>
                                <p className="text-gray-600 dark:text-gray-400">Descripción del boleto</p>
                            </section>
                            
                            <section>
                                <button className="bg-violet-600/70 text-white rounded-md px-4 py-2 text-7xl cursor-pointer">
                                    500
                                </button>
                                <p className="text-gray-600 dark:text-gray-400">Descripción del boleto</p>
                            </section>
                            
                        </div>

                    </section>
                
            </main>
        </motion.main>
    );
}