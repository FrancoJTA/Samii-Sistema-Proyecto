import React, { useState } from "react";
import "../styles/SolicitudesStyles.css"
import { fetchData, postData } from "../utils/api";

const Solicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([
        {
            solicitud_id: "1",
            tipo: "Instalación",
            descripcion: "Solicitud para instalar un nuevo medidor.",
            fechasolicitud: "2024-11-23T10:00:00",
            estado: "Pendiente",
            reporte_id: null, // No tiene reporte asociado
            nombre: "Juan",
            apellido: "Pérez",
            correo: "juan.perez@example.com",
            ci: "12345678",
            telefono: "987654321",
            Latitud: "-17.7833",
            Longitud: "-63.1821",
        },
        {
            solicitud_id: "2",
            tipo: "Reparación",
            descripcion: "Reparación de un medidor existente.",
            fechasolicitud: "2024-11-22T15:30:00",
            estado: "En Proceso",
            reporte_id: "101", // Tiene reporte asociado
            nombre: "María",
            apellido: "Gómez",
            correo: "maria.gomez@example.com",
            ci: "87654321",
            telefono: "123456789",
            Latitud: "-17.7834",
            Longitud: "-63.1822",
        },
    ]);

    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [showReportForm, setShowReportForm] = useState(false);
    const [reportFormData, setReportFormData] = useState({
        tipo: "",
        descripcion: "",
    });

    const reportTypes = ["Instalación", "Reparación", "Mantenimiento"]; // Tipos de reporte disponibles

    const reportData = {
        reporte_id: "101",
        tipo: "Reparación",
        descripcion: "El medidor requiere mantenimiento por averías.",
        fechareporte: "2024-11-22T16:00:00",
        estado: "Finalizado",
    };

    // Manejar la selección de una solicitud
    const handleSelectSolicitud = (id) => {
        const solicitud = solicitudes.find((s) => s.solicitud_id === id);
        setSelectedSolicitud(solicitud);
        setShowReportForm(false); // Cierra el formulario al seleccionar una nueva solicitud
    };

    // Manejar el cierre del detalle
    const handleCloseDetail = () => {
        setSelectedSolicitud(null);
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
    const handleReportSubmit = (e) => {
        e.preventDefault();

        const newReport = {
            reporte_id: Date.now().toString(), // Generar un ID único
            tipo: reportFormData.tipo,
            descripcion: reportFormData.descripcion,
            fechareporte: new Date().toISOString(),
            estado: "Creado",
            solicitud_id: selectedSolicitud.solicitud_id, // Vincular con la solicitud seleccionada
        };

        console.log("Nuevo Reporte Creado:", newReport);

        // Limpia el formulario
        setReportFormData({ tipo: "", descripcion: "" });
        setShowReportForm(false);
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
                        <strong>Latitud:</strong> {selectedSolicitud.Latitud}
                    </p>
                    <p>
                        <strong>Longitud:</strong> {selectedSolicitud.Longitud}
                    </p>

                    {/* Si tiene un reporte asociado, mostrar el detalle del reporte */}
                    {selectedSolicitud.reporte_id ? (
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
