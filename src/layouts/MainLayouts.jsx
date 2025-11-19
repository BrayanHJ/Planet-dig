import { Outlet, useLocation } from "react-router-dom";
import { SideBar } from "../Components/SideBar/SideBar.jsx";
import { AnimatePresence, motion } from "framer-motion";

export const MainLayouts = () => {
    const location = useLocation();

    return (
        <main className="flex h-screen justify-center overflow-hidden bg-white dark:bg-bg-dark text-black dark:text-white transition-colors duration-300">
            <section className="flex w-full justify-center max-w-[1300px]">

                <SideBar />

                <section className="flex-1 px-4 h-full overflow-auto justify-center relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            className="absolute inset-0"
                            initial={{ opacity: 0, y: -80 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 80 }}
                            transition={{ duration: 0.35 }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </section>

            </section>
        </main>
    );
};
