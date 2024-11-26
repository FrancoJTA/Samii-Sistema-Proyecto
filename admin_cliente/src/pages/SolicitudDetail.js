// SolicitudDetail.js
import React from "react";

const SolicitudDetail = ({ solicitud, reportData, responseReportData, onCloseDetail }) => {
    return (
        <div className="solicitud-detail">
            <h2>Detalle de Solicitud</h2>
            <p>
                <strong>Tipo:</strong> {solicitud.tipo}
            </p>
            <p>
                <strong>Descripción:</strong> {solicitud.descripcion}
            </p>
            <p>
                <strong>Fecha de Solicitud:</strong> {new Date(solicitud.fechasolicitud).toLocaleString()}
            </p>
            {reportData && (
                <div>
                    <h3>Reporte Asociado</h3>
                    <p><strong>Tipo:</strong> {reportData.tipo}</p>
                    <p><strong>Descripción:</strong> {reportData.descripcion}</p>
                    {responseReportData && (
                        <div>
                            <h4>Respuesta al Reporte</h4>
                            <p><strong>Estado:</strong> {responseReportData.estado}</p>
                        </div>
                    )}
                </div>
            )}
            <button onClick={onCloseDetail}>Cerrar</button>
        </div>
    );
};

export default SolicitudDetail;
