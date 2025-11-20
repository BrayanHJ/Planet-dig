import { VentaBoletos } from "../Components/ui/Ventanas/VentaBoletos";
import { motion } from "framer-motion";

export const Venta = () => {
    return (
            <motion.main className="h-full justify-center flex w-full"
                initial={{ opacity: 0, x: -1000, scale: 0.3 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 1.2 , ease: "easeInOut" }}
            >
                <VentaBoletos />
            </motion.main>
    );
}