import { motion } from "framer-motion";
import productos from "../../backend/data/Data.json";
import { UserStore } from "../Store/UserStore.jsx";
import { UserButton } from "../Components/ui/Buttons/UserButton.jsx";
import { BtnToggleTheme } from "../Components/ui/Buttons/BtnToggleTheme.jsx";

/* ===== VARIANTES ===== */
const fadeDown = {
hidden: { opacity: 0, y: -30 },
show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeUp = {
hidden: { opacity: 0, y: 40 },
show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
show: { transition: { staggerChildren: 0.15 } },
};

const card = {
hidden: { opacity: 0, y: 30, scale: 0.95 },
show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

export function Inicio() {
    const user = UserStore((state) => state.User);
return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-800 dark:text-slate-100 scroll-smooth">

    {/* ===== NAVBAR ===== */}
    <motion.nav
        variants={fadeDown}
        initial="hidden"
        animate="show"
        className="
        sticky top-0 z-50
        bg-white/80 dark:bg-neutral-900/80
        backdrop-blur
        border-b border-slate-200 dark:border-neutral-800
        "
    >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
                <img src="../../public/Nova_Events.png" alt="Logo" className="h-10 w-10" />
                <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    Nova Events
                </span>
            </div>

            <div className="flex-1 flex justify-center">
                <nav className="flex gap-6">
                    <div className="px-2">
                        <a href="#inicio" className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                            Inicio
                        </a>
                    </div>
                    <div className="px-2">
                        <a href="#detalles" className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                            Detalles
                        </a>
                    </div>
                    <div className="px-2">
                        <a href="#productos" className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                            Productos
                        </a>
                    </div>
                    <div className="px-2">
                        <a href="#contacto" className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                            Contáctanos
                        </a>
                    </div>
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <BtnToggleTheme />
                {user && user !== "Null" && user !== "" ? (
                    <UserButton />
                ) : (
                    <a
                        href="/login"
                        className="
                            bg-indigo-600 hover:bg-indigo-500
                            dark:bg-indigo-500 dark:hover:bg-indigo-400
                            text-white px-4 py-2 rounded-xl transition
                        "
                    >
                        Iniciar sesión
                    </a>
                )}
            </div>
        </div>
    </motion.nav>

    {/* ===== HERO ===== */}
    <motion.header id="inicio"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="
        text-center py-20
        bg-gradient-to-b
        from-indigo-100 to-slate-50
        dark:from-neutral-900 dark:to-neutral-950
        rounded-b-[3rem]
        "
    >
        <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-5xl font-extrabold mb-4"
        >
        Renta de Inflables y Artículos de Fiesta
        </motion.h1>

        <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{ delay: 0.35 }}
        className="text-lg max-w-xl mx-auto"
        >
        Reserva fácil, rápida y segura con Nova Events
        </motion.p>
    </motion.header>

    {/* ===== DETALLES ===== */}
    <section id="detalles" className="max-w-7xl mx-auto px-6 py-12">
        <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-2xl font-bold mb-6 text-center"
        >
        ✨ Detalles de Servicio
        </motion.h2>

        <div className="max-w-4xl mx-auto text-center text-slate-700 dark:text-slate-300">
        <p className="mb-4">Ofrecemos renta de inflables, mobiliario y entretenimiento para eventos infantiles y familiares. Atención personalizada, entrega e instalación en la zona metropolitana.</p>
        <p className="mb-2 font-medium">Horarios de atención: Lun–Dom 9:00 — 18:00</p>
        </div>
    </section>

    {/* ===== CONTACTO ===== */}
    <section id="contacto" className="max-w-7xl mx-auto px-6 py-12">
        <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-2xl font-bold mb-6 text-center"
        >
        📍 Contáctanos
        </motion.h2>

        <div className="max-w-3xl mx-auto text-center text-slate-700 dark:text-slate-300">
        <p className="mb-2">Dirección: Av. Principal 123, Col. Centro, Ciudad — CP 12345</p>
        <p className="mb-2">Teléfono: (55) 1234 5678</p>
        <p className="mb-2">Email: contacto@novaevents.mx</p>
        <p className="mt-4">Para reservar, selecciona el inflable y pulsa "Reservar" o envíanos un mensaje al WhatsApp indicado.</p>
        </div>
    </section>

    {/* ===== PRODUCTOS ===== */}
    <section id="productos" className="max-w-7xl mx-auto px-6 py-16">
        <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-2xl font-bold mb-12 text-center"
        >
        🎈 Inflables Disponibles
        </motion.h2>

        <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-10"
        >
        {productos.map((item) => (
            <motion.div
            key={item.id}
            variants={card}
            whileHover={{ y: -8 }}
            className="
                w-[280px] rounded-3xl overflow-hidden
                bg-white dark:bg-neutral-900
                shadow-xl dark:shadow-black/40
            "
            >
            <motion.img
                src={item.img}
                alt={item.nombre}
                className="h-44 w-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
            />

            <div className="p-5 flex flex-col gap-2">
                <h3 className="font-bold text-lg">{item.nombre}</h3>

                <p className="text-sm text-slate-600 dark:text-slate-400">
                {item.dimensiones}
                </p>

                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-lg">
                ${item.precio} MXN
                </span>

                <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="
                    mt-4 py-2 rounded-xl font-semibold text-white
                    bg-indigo-600 hover:bg-indigo-500
                    dark:bg-indigo-500 dark:hover:bg-indigo-400
                    transition cursor-pointer
                "
                >
                Reservar
                </motion.button>
            </div>
            </motion.div>
        ))}
        </motion.div>
    </section>

    {/* ===== FOOTER ===== */}
    <footer className="text-center py-10 text-sm text-slate-500 dark:text-slate-400">
        © 2026 Nova Events · Reservas de fiesta
    </footer>
    </div>
);
}
