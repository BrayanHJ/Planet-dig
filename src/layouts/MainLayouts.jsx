import { Outlet } from "react-router-dom";
import { SideBar } from "../Components/SideBar/SideBar.jsx";

export const MainLayouts = () => {
    return (
        <main className='flex h-screen justify-center overflow-hidden bg-white dark:bg-bg-dark text-black dark:text-white transition-colors duration-300 '>

            <section className="flex w-full justify-center  max-w-[1300px]">
                    <SideBar/>
                <section className="flex-1 px-4 h-full overflow-auto justify-center">
                    <Outlet/>
                </section>

            </section>


        </main>
    );
}
