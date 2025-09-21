import { motion } from "framer-motion";

export const Page404 = () => {
    return (
        <motion.div className="bg-gray-300 dark:bg-neutral-950 h-full w-full"
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            exit={{ x: -100 }}
            transition={{ duration: 1.5 , ease: "easeInOut" }}
        >
            <h1 className="flex justify-center aling-center text-7xl top-20"> 404 - Not Found </h1>
            <br />
            <p className="top-4 text-3xl flex justify-center">Esta Pagina no existe</p>
            <br/>
            <img src="https://http.cat/404" alt="404 - Not Found" />
        </motion.div>
    );
}