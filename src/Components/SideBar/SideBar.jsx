import { Icon } from "@iconify/react/dist/iconify.js";
import { NavLink } from "react-router-dom"; 
import { BtnToggleTheme } from "../ui/Buttons/BtnToggleTheme.jsx";

export const SideBar = () => {
    const Links=[
        {label: "Home", Icon: "mdi:home", to: "/"},
        {label: "Notificaciones", Icon: "mdi:bell", to: "/notificaciones"},
        {label: "Mensajes", Icon: "mdi:message", to: "/mensajes"},
        {label: "Perfil", Icon: "mdi:account", to: "/perfil"},
        {label: "Colecciones", Icon: "mdi:collection", to: "/colecciones"},
        {label: "Añadir Tarjeta", Icon: "mdi:credit-card-plus", to: "/configuracion"},
        {label: "Mi perfil", Icon: "mdi:account", to: "/configuracion"},
        ]
    return (
        <div className="h-full p-2 bg-white dark:bg-bg-dark text-white transition-colors duration-300 flex flex-col">
            {/* LOGO */}
            <div className="h-8 w-8 rounded-full bg-blue-500 mb-4 flex items-center justify-center text-xs m-2">
                B hj
            </div>
            {/* NAV */}
            <nav className="flex-1 flex flex-col gap-2 items-center sm:justify-start">
                {Links.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center gap-2 p-2 rounded-md hover:bg-gray-400 dark:hover:bg-cyan-400/10 dark:hover:text-cyan-400 transition-all cursor-pointer w-full justify-center
                            ${isActive ? 'bg-gray-200 text-blue-500 dark:bg-bg-dark dark:text-blue-500 ' : 'text-gray-800 dark:text-white'}`
                        }
                    >
                        <Icon icon={item.Icon} width={24} height={24} className="text-xl" />
                        <span className="text-sm font-semibold hidden sm:block">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            <BtnToggleTheme />
        </div>
    );
}
