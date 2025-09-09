import {UseThemStore} from "../../../store/ThemStore.jsx";
import { Icon } from "@iconify/react/dist/iconify.js";

export const BtnToggleTheme = () => {
    const {theme, setTheme } = UseThemStore();
    return (
        <button onClick={setTheme} className="text-sm font-semibold flex items-center justify-baseline gap-3 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-blue-500/10 transition-all cursor-pointer ">
            <span>
                {theme === "light" ? 
                <Icon icon="line-md:moon-to-sunny-outline-loop-transition" width="24" height="24"  style={{color: "#111"}} /> 
                : 
                <Icon icon="line-md:moon-rising-twotone-alt-loop" width="24" height="24"  style={{color: "#fffafa"}} />}
            </span>

            <span className="hidden sm:block  text-black dark:text-white">{theme === "light" ? "Light Mode" : "Dark Mode"}</span>
        </button>
    );
}