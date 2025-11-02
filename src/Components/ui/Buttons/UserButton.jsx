import { UserStore } from "../../../Store/UserStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import {ModalUsuario} from "../Ventanas/ModalUsuario";

export const UserButton = () => {
    // Usar el hook de Zustand para suscribirse a los cambios
    const user = UserStore(state => state.User);
    const modal = UserStore(state => state.modal);
    const setModal = UserStore(state => state.setModal);
    
    return (
        <main>
            <button 
                className="text-sm font-semibold flex items-center justify-baseline gap-3 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-blue-500/10 transition-all cursor-pointer mb-4 w-full text-black dark:text-white border-2 border-gray-500 dark:border-amber-50 hover:border-violet-500"
                onClick={() => setModal(true)}
            >
                <Icon icon="quill:userhappy" width={24} height={24} className="text-xl" />
                <span className="text-center h-full aling-center flex">{user}</span>
            </button>

            {modal && <ModalUsuario onClose={() => setModal(false)} />}
            
        </main>
    );
}