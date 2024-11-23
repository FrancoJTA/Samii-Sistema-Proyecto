import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/NavbarStyle.css"; // Archivo CSS para el navbar

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Ocultar el navbar en la página de login
    if (location.pathname === "/") {
        return (
            <header className="navbar">
                <div className="navbar-container">
                    {/* Logo alineado a la izquierda */}
                    <div className="navbar-left">
                        <img src={`${process.env.PUBLIC_URL}/SAMIILOGO.png`} alt="SAMII Logo" className="logo-image" />
                        <span className="logo-text">SAMII</span>
                    </div>
                </div>
            </header>
        );
    }

    // Manejar cierre de sesión
    const handleLogout = () => {
        localStorage.removeItem("authToken"); // Eliminar token de autenticación
        navigate("/"); // Redirigir a la página de login
    };

    return (
        <header className="navbar">
            <div className="navbar-container">
                {/* Logo alineado a la izquierda */}
                <div className="navbar-left">
                    <Link to="/panel" className="logo-link">
                        <img src={`${process.env.PUBLIC_URL}/SAMIILOGO.png`} alt="SAMII Logo" className="logo-image" />
                        <span className="logo-text">SAMII</span>
                    </Link>
                </div>

                {/* Botón de cerrar sesión alineado a la derecha */}
                <div className="navbar-right">
                    <button className="logout-button" onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
