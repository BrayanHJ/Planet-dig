import {UseThemStore} from "../../../store/ThemStore.jsx";
import { Icon } from "@iconify/react";
import { motion  } from "framer-motion";

export const BtnToggleTheme = () => {
    const {theme, setTheme } = UseThemStore();
    return (
        
            <button onClick={setTheme} className="text-sm font-semibold flex items-center
            justify-baseline gap-3 p-2 rounded-lg hover:bg-gray-400 dark:hover:bg-blue-950 transition-all cursor-pointer hover:scale-125 duration-300 ">
                    {theme === "light" ?
                        <Icon icon="line-md:moon-to-sunny-outline-loop-transition" width="24" height="24"  style={{color: "#111"}} /> 
                    : 
                        <Icon icon="line-md:moon-rising-twotone-alt-loop" width="24" height="24"  style={{color: "#fffafa"}} />
                    }
                <span className="hidden sm:block text-black dark:text-white">{theme === "light" ? "Light Mode" : "Dark Mode"}</span>
            </button>
        
    );
}