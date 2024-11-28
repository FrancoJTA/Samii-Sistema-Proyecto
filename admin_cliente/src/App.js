import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Panel from "./pages/Panel";
import Zonas from "./pages/Zonas/Zonas";
import Solicitudes from "./pages/Solicitud/Solicitudes";
import CrearCliente from "./pages/Solicitud/CrearCliente";
import Reportes from "./pages/Reporte";
import Mapa from "./pages/Mapa";
import Monitor from "./pages/Monitores";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute"; // Importa el componente
import "./App.css";
import Clientes from "./pages/Cliente/Clientes";

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
                    path="/nucleos"
                    element={
                        <PrivateRoute>
                            <Zonas />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/mapa"
                    element={
                        <PrivateRoute>
                            <Mapa />
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
