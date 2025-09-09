import { Outlet } from "react-router-dom";
import { SideBar } from "../Components/SideBar/SideBar";

export const MainLayouts = () => {
    return (
        <div>
            <h1>MainLayouts</h1>

            <SideBar />
            <br />
            <Outlet />
            
        </div>
    );
}
