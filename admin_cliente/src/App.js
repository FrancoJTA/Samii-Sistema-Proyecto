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
import PrivateRoute from "./components/PrivateRoute"; // Importa el componente

import "./App.css";
import Clientes from "./pages/Clientes";
import Facturas from "./pages/Facturas";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route
                    path="/panel"
                    element={
                        <PrivateRoute>
                            <Panel />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/monitores"
                    element={
                        <PrivateRoute>
                            <Monitor />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/clientes"
                    element={
                        <PrivateRoute>
                            <Clientes />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/facturas"
                    element={
                        <PrivateRoute>
                            <Facturas />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/solicitudes"
                    element={
                        <PrivateRoute>
                            <Solicitudes />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/reportes"
                    element={
                        <PrivateRoute>
                            <Reportes />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/zona"
                    element={
                        <PrivateRoute>
                            <Zonas />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/crear-cliente/:solicitudId/:respuestaId"
                    element={
                        <PrivateRoute>
                            <CrearCliente />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
