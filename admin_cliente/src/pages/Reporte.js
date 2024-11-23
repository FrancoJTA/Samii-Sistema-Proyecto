import React, { useState, useEffect } from "react";
import "../styles/ReportesStyles.css";
import { fetchData } from "../utils/api";

const Reportes = () => {
    const [reportes, setReportes] = useState([]);
    const [selectedReporte, setSelectedReporte] = useState(null);
    const [respuestaReporte, setRespuestaReporte] = useState(null);

    useEffect(() => {
        const loadReportes = async () => {
            try {
                const data = await fetchData("/reporte");
                setReportes(data);
            } catch (error) {
                console.error("Error fetching reportes:", error);
            }
        };

        loadReportes();
    }, []);

    const handleSelectReporte = async (reporte) => {
        setSelectedReporte(reporte);

        if (reporte.respuesta_id) {
            try {
                const respuesta = await fetchData(`/respuesta/${reporte.respuesta_id}`);
                setRespuestaReporte(respuesta);
            } catch (error) {
                console.error("Error fetching respuesta reporte:", error);
                setRespuestaReporte(null);
            }
        } else {
            setRespuestaReporte(null);
        }
    };

    const handleCloseDetail = () => {
        setSelectedReporte(null);
        setRespuestaReporte(null);
    };

    return (
        <div className="reportes-container">
            <div className={`reportes-list ${selectedReporte ? "collapsed" : ""}`}>
                <h2>Lista de Reportes</h2>
                <ul>
                    {reportes.map((reporte) => (
                        <li
                            key={reporte.reporte_id}
                            onClick={() => handleSelectReporte(reporte)}
                            className="reporte-item"
                        >
                            <span>{reporte.tipo}</span>
                            <span>{reporte.estado === "Completado" ? "✔ Completado" : "Pendiente"}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {selectedReporte && (
                <div className="reporte-detail">
                    <h2>Detalle del Reporte</h2>
                    <p><strong>ID:</strong> {selectedReporte.reporte_id}</p>
                    <p><strong>Tipo:</strong> {selectedReporte.tipo}</p>
                    <p><strong>Descripción:</strong> {selectedReporte.descripcion}</p>
                    <p><strong>Estado:</strong> {selectedReporte.estado}</p>
                    <p><strong>Fecha:</strong> {new Date(selectedReporte.fechareporte).toLocaleString()}</p>

                    {respuestaReporte && (
                        <div className="respuesta-detail">
                            <h3>Respuesta Asociada</h3>
                            <p><strong>ID de la Respuesta:</strong> {respuestaReporte.response_id}</p>
                            <p><strong>Descripción:</strong> {respuestaReporte.descripcion}</p>
                            <p><strong>Respuesta:</strong> {respuestaReporte.respuesta}</p>
                            <p><strong>Fecha de Respuesta:</strong> {new Date(respuestaReporte.fechaRespuesta).toLocaleString()}</p>
                        </div>
                    )}
                    <button onClick={handleCloseDetail}>Cerrar Detalle</button>
                </div>
            )}
        </div>
    );
};

export default Reportes;
