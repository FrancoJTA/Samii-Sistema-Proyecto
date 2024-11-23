import React from "react";
import "../styles/PanelStyle.css"; // Archivo CSS simple para el panel

const Panel = () => {
    // Puedes agregar más botones en este arreglo
    const actions = [
        { label: "MONITOREADORES", link: "/monitores" },
        { label: "FACTURAS", link: "/facturas" },
        { label: "MEDIDORES", link: "/medidores" },
        { label: "CLIENTES", link: "/clientes" },
        { label: "MAPA", link: "/mapa" },
        { label: "SOLICITUDES", link: "/solicitudes" },
        { label: "REPORTES", link: "/reportes" },
    ];

    return (
        <div className="panel-container">
            <h1>Bienvenido</h1>
            <p>Como administrador puedes realizar diversas acciones.</p>
            <div className="actions-container">
                {actions.map((action, index) => (
                    <a key={index} href={action.link} className="action-button">
                        {action.label}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Panel;
