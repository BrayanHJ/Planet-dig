import { motion } from "framer-motion";
import Stars from "../Components/ui/utils/Stars.jsx";

export const Page404 = () => {
    return (
        <motion.div
            className="relative bg-neutral-950 min-h-screen w-full overflow-hidden"
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            exit={{ x: -100 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >

            <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,_rgba(15,12,180,0.55),_transparent_50%)]"></div>

            <Stars />

            {/* Contenido principal */}
            <div className="relative z-10 text-white text-center pt-32">
                <h1 className="text-6xl font-bold text-amber-400">404 - Not Found</h1>
                <br />
                <p className="mt-4 text-xl">Parece que la página se desvió de su órbita. <br /> Esta página no existe.</p>

                {/* Imagen animada del astronauta */}
                <motion.img
                    src="/cute-astronaut.png"
                    alt="404 - Not Found"
                    className="w-64 drop-shadow-xl mx-auto mt-10"
                    animate={{
                        y: [0, -40, 0, 40, 0],    // Subir y bajar suavemente
                        x: [0, 10, 0, -10, 0],    // Moverse lateralmente
                    }}
                    transition={{
                        duration: 8,            // Tiempo total para ciclo completo
                        repeat: Infinity,       // Repetir indefinidamente
                        ease: "easeInOut",      // Movimiento suave
                    }}
                />
            </div>
        </motion.div>
    );
};
