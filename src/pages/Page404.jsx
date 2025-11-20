import { motion } from "framer-motion";
import Stars from "../Components/ui/utils/Stars.jsx";
import AnimatedPage from "../Components/Animations/AnimatedPage";
import { useEffect } from "react";
import { showPermanent404Toast } from "../Components/ui/showPermanent404Toast.jsx";
import { Toaster } from "sonner";


export const Page404 = () => {

    useEffect(() => {
        showPermanent404Toast(); 
    }, []);

    return (
        <>
            <Toaster 
                position="bottom-right"
                richColors={false}
                closeButton={false}
            />

            <AnimatedPage>
                {/* Toaster rendered at app root to avoid transform issues */}

                <main className="relative bg-neutral-950 min-h-screen w-full overflow-hidden">

                    <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,_rgba(15,12,180,0.55),_transparent_50%)]"></div>
                    <Stars />

                    <div className="relative z-10 text-white text-center pt-32">
                        <h1 className="text-6xl font-bold text-amber-400">404 - Not Found</h1>
                        <br />
                        <p className="mt-4 text-xl">
                            Parece que la página se desvió de su órbita. <br />
                            Esta página no existe.
                        </p>

                        <motion.img
                            src="/cute-astronaut.png"
                            alt="404 - Not Found"
                            className="w-64 drop-shadow-xl mx-auto mt-10"
                            animate={{
                                y: [0, -40, 0, 40, 0],
                                x: [0, 10, 0, -10, 0],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    </div>
                </main>
            </AnimatedPage>
        </>
    );
};
