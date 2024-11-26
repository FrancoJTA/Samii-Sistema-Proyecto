import React, { useState, useEffect } from "react";
import "../styles/SolicitudesStyles.css";
import { fetchData, postData } from "../utils/api";
import { useNavigate } from "react-router-dom"; // Para manejar la navegación

const Solicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [showReportForm, setShowReportForm] = useState(false);
    const [reportFormData, setReportFormData] = useState({
        tipo: "",
        descripcion: "",
    });
    const navigate = useNavigate();
    const reportTypes = ["Instalación", "Reparación", "Mantenimiento"]; // Tipos de reporte disponibles
    const [reportData, setReportData] = useState(null); // Reporte asociado si existe
    const [responseReportData, setResponseReportData] = useState(null);

    // Cargar solicitudes desde la API
    useEffect(() => {
        const loadSolicitudes = async () => {
            try {
                const data = await fetchData("/solicitud"); // GET solicitudes desde la API
                setSolicitudes(data);
            } catch (error) {
                console.error("Error loading solicitudes:", error);
            }
        };

        loadSolicitudes();
    }, []);

    // Manejar la selección de una solicitud
    const handleSelectSolicitud = async (id) => {
        const solicitud = solicitudes.find((s) => s.solicitud_id === id);
        setSelectedSolicitud(solicitud);
        setShowReportForm(false);

        // Si la solicitud tiene un reporte asociado, cargar su detalle
        if (solicitud.reporte_id) {
            try {
                const reportDetail = await fetchData(`/reporte/${solicitud.reporte_id}`);
                setReportData(reportDetail);

                // Si el reporte tiene una respuesta asociada, cargar los detalles de la respuesta
                if (reportDetail.respuesta_id) {
                    try {
                        const responseDetail = await fetchData(`/respuesta/${reportDetail.respuesta_id}`);
                        setResponseReportData(responseDetail);
                    } catch (error) {
                        console.error("Error fetching response detail:", error);
                        setResponseReportData(null);
                    }
                } else {
                    setResponseReportData(null);
                }
            } catch (error) {
                console.error("Error fetching report detail:", error);
                setReportData(null);
                setResponseReportData(null);
            }
        } else {
            setReportData(null);
            setResponseReportData(null);
        }
    };

    const handleCloseDetail = () => {
        setSelectedSolicitud(null);
        setReportData(null);
        setResponseReportData(null);
        setShowReportForm(false);
    };

    // Mostrar el formulario de reporte
    const handleShowReportForm = () => {
        setShowReportForm(true);
    };

    // Manejar cambios en el formulario de reporte
    const handleReportChange = (e) => {
        const { name, value } = e.target;
        setReportFormData({ ...reportFormData, [name]: value });
    };

    // Manejar el envío del formulario de reporte
    const handleReportSubmit = async (e) => {
        e.preventDefault();

        const newReport = {
            tipo: reportFormData.tipo,
            descripcion: reportFormData.descripcion,
            solicitud_id: selectedSolicitud.solicitud_id, // Vincular con la solicitud seleccionada
        };

        try {
            const createdReport = await postData("/reporte", newReport);

            setSolicitudes((prevSolicitudes) =>
                prevSolicitudes.map((s) =>
                    s.solicitud_id === selectedSolicitud.solicitud_id
                        ? { ...s, reporte_id: createdReport.reporte_id }
                        : s
                )
            );

            setReportFormData({ tipo: "", descripcion: "" });
            setShowReportForm(false);
            setReportData(createdReport);
        } catch (error) {
            console.error("Error creating report:", error);
        }
    };

    const handleNavigateToCreateClient = () => {
        if (selectedSolicitud && responseReportData) {
            navigate(`/crear-cliente/${selectedSolicitud.solicitud_id}/${responseReportData.respuesta_id}`);
        }
    };

    return (
        <div className="solicitudes-container">
            <div
                className={`solicitudes-list ${
                    selectedSolicitud ? "collapsed" : ""
                }`}
            >
                <h2>Solicitudes</h2>
                <ul>
                    {solicitudes.map((solicitud) => (
                        <li
                            key={solicitud.solicitud_id}
                            onClick={() => handleSelectSolicitud(solicitud.solicitud_id)}
                            className="solicitud-item"
                        >
                            {solicitud.tipo}
                        </li>
                    ))}
                </ul>
            </div>

            {selectedSolicitud && (
                <div className="solicitud-detail">
                    <h2>Detalle de Solicitud</h2>
                    <p>
                        <strong>Tipo:</strong> {selectedSolicitud.tipo}
                    </p>
                    <p>
                        <strong>Descripción:</strong> {selectedSolicitud.descripcion}
                    </p>
                    <p>
                        <strong>Fecha de Solicitud:</strong>{" "}
                        {new Date(selectedSolicitud.fechasolicitud).toLocaleString()}
                    </p>
                    <p>
                        <strong>Estado:</strong> {selectedSolicitud.estado}
                    </p>
                    <h3>Información del Usuario</h3>
                    <p>
                        <strong>Nombre:</strong> {selectedSolicitud.nombre}{" "}
                        {selectedSolicitud.apellido}
                    </p>
                    <p>
                        <strong>Correo:</strong> {selectedSolicitud.correo}
                    </p>
                    <p>
                        <strong>CI:</strong> {selectedSolicitud.ci}
                    </p>
                    <p>
                        <strong>Teléfono:</strong> {selectedSolicitud.telefono}
                    </p>
                    <h3>Ubicación</h3>
                    <p>
                        <strong>Latitud:</strong> {selectedSolicitud.latitud}
                    </p>
                    <p>
                        <strong>Longitud:</strong> {selectedSolicitud.longitud}
                    </p>

                    {/* Si tiene un reporte asociado, mostrar el detalle del reporte */}
                    {reportData ? (
                        <div className="report-detail">
                            <h3>Reporte Asociado</h3>
                            <p>
                                <strong>ID del Reporte:</strong> {reportData.reporte_id}
                            </p>
                            <p>
                                <strong>Tipo de Reporte:</strong> {reportData.tipo}
                            </p>
                            <p>
                                <strong>Descripción:</strong> {reportData.descripcion}
                            </p>
                            <p>
                                <strong>Fecha del Reporte:</strong>{" "}
                                {new Date(reportData.fechareporte).toLocaleString()}
                            </p>
                            <p>
                                <strong>Estado:</strong> {reportData.estado}
                            </p>

                            {responseReportData ? (
                                <div className="response-detail">
                                    <h3>Respuesta Asociada</h3>
                                    <p><strong>ID de la Respuesta:</strong> {responseReportData.response_id}</p>
                                    <p><strong>Detalles:</strong> {responseReportData.descripcion}</p>
                                    <p><strong>Respuesta:</strong> {responseReportData.respuesta}</p>
                                    <p><strong>Fecha de Respuesta:</strong> {new Date(responseReportData.fechaRespuesta).toLocaleString()}</p>
                                    {selectedSolicitud.estado !== "Completado" && responseReportData.respuesta === "Completado Óptimo" && (
                                        <button onClick={handleNavigateToCreateClient}>
                                            Crear Cliente
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <p>No hay respuesta asociada a este reporte.</p>
                            )}
                        </div>
                    ) : (
                        <>
                            <button onClick={handleShowReportForm}>Hacer Reporte</button>
                            {showReportForm && (
                                <div className="report-form">
                                    <h3>Crear Reporte</h3>
                                    <form onSubmit={handleReportSubmit}>
                                        <label>
                                            Tipo de Reporte:
                                            <select
                                                name="tipo"
                                                value={reportFormData.tipo}
                                                onChange={handleReportChange}
                                            >
                                                <option value="">Seleccione un tipo</option>
                                                {reportTypes.map((type) => (
                                                    <option key={type} value={type}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <label>
                                            Descripción:
                                            <textarea
                                                name="descripcion"
                                                value={reportFormData.descripcion}
                                                onChange={handleReportChange}
                                                required
                                            />
                                        </label>
                                        <button type="submit">Crear Reporte</button>
                                    </form>
                                </div>
                            )}
                        </>
                    )}

                    <button onClick={handleCloseDetail}>Cerrar Detalle</button>
                </div>
            )}
        </div>
    );
};

export default Solicitudes;
