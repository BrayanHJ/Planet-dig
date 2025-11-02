import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayouts } from './../layouts/MainLayouts.jsx'
import { HomePage } from './../pages/HomePage.jsx'
import { Page404 } from "../pages/Page404.jsx";
import { Inicio } from "../pages/Inicio.jsx"; 
import { VentaBoletos } from "../pages/VentaBoletos.jsx";
import {Datos} from "../pages/Datos.jsx";
import {ControlWeb} from "../pages/ControlWeb.jsx";
import {Graficas} from "../pages/Graficas.jsx";
import {Usuarios} from "../pages/Usuarios.jsx";
import { RegistroUsuarios } from "../pages/RegistroUsuarios.jsx";

export function MyRouter() {
    return (
        <BrowserRouter>
            <Routes>


                <Route index element={<Inicio />} />
                <Route path="/" element={<Inicio />} />
                <Route path="/Panel" element={<MainLayouts />}>
                    <Route index element={<HomePage />} />
                    <Route path="VentaBoletos" element={<VentaBoletos />} />
                    <Route path="Datos" element={<Datos />} />
                    <Route path="ControlWeb" element={<ControlWeb />} />
                    <Route path="Graficas" element={<Graficas />} />
                    <Route path="Usuarios" element={<Usuarios />} />
                    <Route path="RegistroUsuarios" element={<RegistroUsuarios />} />

                    <Route path="*" element={<Page404 />} />


                </Route>
                <Route path="*" element={<Page404 />} /> 
            </Routes>
        </BrowserRouter>
    );
}
