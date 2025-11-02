import { Icon } from "@iconify/react/dist/iconify.js";
import { NavLink } from "react-router-dom"; 
import { BtnToggleTheme } from "../ui/Buttons/BtnToggleTheme.jsx";
import { UserButton } from "../ui/Buttons/UserButton.jsx";
import { motion } from "framer-motion";
import { UserStore } from "../../Store/UserStore.jsx";


const { User, Rol, idUser } = UserStore.getState();

export const SideBar = () => {
    const Links=[
        {label: "Home", Icon: "mdi:home", to: "/Panel", end: true},
        {label: "Venta", Icon: "mdi:local-activity", to: "/Panel/VentaBoletos"},
        // {label: "Venta", Icon: "mdi:credit-card-plus", to: "/Panel/VentaBoletos"},
        // quill:userhappy
        {label: "Estadistica", Icon: "material-symbols:browse-activity-rounded", to: "/Panel/Graficas"},
        {label: "Datos", Icon: "rivet-icons:data", to: "/Panel/Datos"},
        {label: "Pagina Web", Icon: "fluent-mdl2:web-environment", to: "/Panel/ControlWeb"},
        {label: "Usuarios", Icon: "qlementine-icons:user-16", to: "/Panel/Usuarios"},
        {label: "Registros", Icon: "mdi:user-card-details-outline", to: "/Panel/RegistroUsuarios"},
        {label: "Actividad", Icon: "wpf:usershield", to: "/Panel/Actividad"},
        {label: "Configuracion", Icon: "mdi:credit-card", to: "/Panel/configuracion"},
        ]
    return (
        <motion.div className="h-full p-2 bg-white dark:bg-bg-dark text-white transition-colors duration-300 flex flex-col"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}  
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 1.5 , ease: "easeInOut" }}
        >
            {/* LOGO */}
            <div className="h-11 w-11 mb-4 flex items-center justify-center text-xs ">
                <img src="/public/unnamed.jpg" alt="" className="fit-cover rounded-full"/>
            </div>
            {/* NAV */}
            <nav className="flex-1 flex flex-col gap-3 items-center sm:justify-start">
                {Links.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                            `flex items-center gap-2 hover:bg-gray-400 dark:hover:bg-cyan-400/10 dark:hover:text-cyan-400 transition-all border-2 rounded-md p-1 cursor-pointer w-full justify-center
                            ${isActive ? 'bg-gray-200 text-blue-500 dark:bg-bg-dark dark:text-blue-500 ' : 'text-gray-800 dark:text-white'}`
                        }
                    >
                        <Icon icon={item.Icon} width={24} height={24} className="text-xl" />
                        <span className="text-sm font-semibold hidden sm:block">{ item.label }</span>
                    </NavLink>
                ))}
            </nav>
            <div>
            <UserButton />
            <BtnToggleTheme />
            </div>
        </motion.div>
    );
}
