import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayouts } from './../layouts/MainLayouts.jsx'
import { HomePage } from './../pages/HomePage.jsx'
import { Succes } from "../pages/Succes.jsx";
import {Page404} from "../pages/Page404.jsx";
import { TaskPage } from "../pages/TaskPage.jsx";


export function MyRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayouts />}>
                    <Route index element={<HomePage />} />
                    <Route path="Succes" element={<Succes />} />

                    <Route path="Task" element={<TaskPage />} />
                    
                    <Route path="*" element={<Page404 />} />
                </Route>

                <Route path="*" element={<Page404 />} />

            </Routes>
        </BrowserRouter>
    );
}
