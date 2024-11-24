import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Panel from "./pages/Panel";
import Zonas from "./pages/Zonas";
import Solicitudes from "./pages/Solicitudes";
import CrearCliente from "./pages/CrearCliente";
import Reportes from "./pages/Reporte";
import Monitor from "./pages/Monitores";
import Navbar from "./components/Navbar";
import  "./App.css";

function App() {
    return (
        <Router>
            {/* El Navbar se muestra dinámicamente basado en la ruta */}
            <Navbar />
            <Routes>
                {/* Ruta para la página de inicio de sesión */}
                <Route path="/" element={<Login />} />

                {/* Ruta protegida para el panel */}
                <Route path="/panel" element={<Panel />} />
                <Route path="/monitores" element={<Monitor />} />
                <Route path="/solicitudes" element={<Solicitudes />} />
                <Route path="/reportes" element={<Reportes />} />
                <Route path="/zona" element={<Zonas />} />
                <Route path="/crear-cliente/:solicitudId/:respuestaId" element={<CrearCliente />} />

                {/* Si decides habilitar PrivateRoute en el futuro */}
                {/* <Route
                path="/panel"
                element={
                <PrivateRoute>
                    <Panel />
                </PrivateRoute>}/> */}
            </Routes>
        </Router>
    );
}

export default App;
