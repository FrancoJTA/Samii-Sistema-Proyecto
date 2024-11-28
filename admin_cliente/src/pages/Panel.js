import React from "react";
import "../styles/PanelStyle.css"; // Archivo CSS simple para el panel


const Panel = () => {
    const actions = [
        { label: "MONITOREADORES", link: "/monitores", image: "/Images/monitor.png" },
        { label: "CLIENTES", link: "/clientes", image: "/Images/cliente.png" },
        { label: "MAPA", link: "/mapa", image: "/Images/mapa.png" },
        { label: "SOLICITUDES", link: "/solicitudes", image: "/Images/solicitud.png" },
        { label: "REPORTES", link: "/reportes", image: "/Images/reporte.png" },
        { label: "ZONAS", link: "/nucleos", image: "/Images/zona.png" },
    ];

    return (
        <div className="panel-container">
            <h1>Bienvenido</h1>
            <p>Como administrador puedes realizar diversas acciones.</p>
            <div className="actions-container">
                {actions.map((action, index) => (
                    <a key={index} href={action.link} className="action-button">
                        <img
                            src={action.image}
                            alt={action.label}
                            className="button-icon"
                        />
                        <span>{action.label}</span>
                    </a>
                ))}
            </div>
            <div className="wave">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                >
                    <path
                        fill="#909090"
                        fillOpacity="1"
                        d="M0,160L48,144C96,128,192,96,288,101.3C384,107,480,149,576,181.3C672,213,768,235,864,229.3C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    ></path>
                </svg>
            </div>
        </div>
    );
};

export default Panel;
