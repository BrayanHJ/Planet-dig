import { Icon } from "@iconify/react";
import { NavLink } from "react-router-dom"; 
import { BtnToggleTheme } from "../ui/Buttons/BtnToggleTheme.jsx";
import { UserButton } from "../ui/Buttons/UserButton.jsx";
import { motion , AnimatePresence } from "framer-motion";
import { UserStore } from "../../Store/UserStore.jsx";

// Obtener el estado actual del usuario y rol
const { User, Rol} = UserStore.getState();

export const SideBar = () => {
    const Links=[
        {label: "Home", Icon: "mdi:home", to: "/Panel", end: true},
        {label: "Venta", Icon: "mdi:local-activity", to: "/Panel/VentaBoletos", Permiso:""},
        {label: "Estadistica", Icon: "material-symbols:browse-activity-rounded", to: "/Panel/Graficas" , Permiso:""},
        {label: "Datos", Icon: "rivet-icons:data", to: "/Panel/Datos" , Permiso:""},
        {label: "Pagina Web", Icon: "fluent-mdl2:web-environment", to: "/Panel/ControlWeb",Permiso:"Admin"},
        {label: "Usuarios", Icon: "qlementine-icons:user-16", to: "/Panel/Usuarios", Permiso:"Admin"},
        {label: "Registros", Icon: "mdi:user-card-details-outline", to: "/Panel/RegistroUsuarios",Permiso:"Admin"},
        {label: "Actividad", Icon: "wpf:usershield", to: "/Panel/Actividad", Permiso:""},
        {label: "Boletos", Icon: "mdi:credit-card", to: "/Panel/Boletos", Permiso:""},
        ]
    // Si es Admin, muestra todos; si no, oculta los que tienen Permiso: 'Admin'
    const visibleLinks = Rol === "Admin"
        ? Links
        : Links.filter(item => !item.Permiso || item.Permiso !== "admin");
    return (
        <AnimatePresence>
            <motion.div className="h-full p-2 bg-white dark:bg-bg-dark text-white transition-colors duration-300 flex flex-col select-none"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}  
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 1.5 , ease: "easeInOut" }}
            >
                {/* LOGO */}
                <motion.div className="h-11 w-11 mb-4 flex items-center justify-center text-xs "
                    initial={{ opacity: 0 , scale:0.5 }}
                    animate={{ opacity: 1 , scale:1}}
                    exit={{ opacity: 0 , scale:0.5 }}
                    transition={{ duration: 1.5 , ease: "easeInOut" }}
                >
                    <img src="/public/unnamed.jpg" alt="" className="fit-cover rounded-full"/>
                </motion.div>
                {/* NAV */}
                <nav className="flex-1 flex flex-col gap-3 items-center sm:justify-start">
                    {visibleLinks.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center gap-2 hover:bg-gray-400 dark:hover:bg-cyan-400/10 dark:hover:text-cyan-400 transition-all border-2 rounded-md p-1 cursor-pointer w-full justify-center duration-300
                                hover:scale-125
                                ${isActive ? 'bg-gray-200 text-blue-500 dark:bg-bg-dark dark:text-blue-500 scale-110 ' : 'text-gray-800 dark:text-white'}`
                            }
                        >
                            <motion.span 
                            initial={{ opacity: 0 , x:-200 }}
                            animate={{ opacity: 1 , x:0}}
                            exit={{ opacity: 0 , x:0 }}
                            transition={{ duration: 2.5 }}
                            >
                                <Icon icon={item.Icon} width={24} height={24} className="text-xl"/>
                            </motion.span>

                            <motion.span className="text-sm font-semibold hidden sm:block"
                                initial={{ opacity: 0 , x:-100 }}
                                animate={{ opacity: 1 , x:0}}
                                exit={{ opacity: 0 , x:0 }}
                                transition={{ duration: 1.0 }}
                            >
                                { item.label }
                            </motion.span>
                        </NavLink>
                    ))}
                </nav>
                <div>
                    <UserButton />
                    <BtnToggleTheme />
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
