import React from "react";

const SolicitudesList = ({ solicitudes, onSelectSolicitud }) => {
    return (
        <div className="solicitudes-list">
            <h2>Solicitudes</h2>
            <ul>
                {solicitudes.map((solicitud) => (
                    <li
                        key={solicitud.solicitud_id}
                        onClick={() => onSelectSolicitud(solicitud.solicitud_id)}
                        className="solicitud-item"
                    >
                        {solicitud.tipo}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SolicitudesList;
