import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayouts } from './../layouts/MainLayouts.jsx'
import { HomePage } from './../pages/HomePage.jsx'

export function MyRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayouts />}>
                    <Route index element={<HomePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
