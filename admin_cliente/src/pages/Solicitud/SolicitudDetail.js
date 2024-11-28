// SolicitudDetail.js
import React, { useEffect } from "react";
import ReportForm from "./ReportForm";
import { useNavigate } from "react-router-dom";

const SolicitudDetail = ({
                             solicitud,
                             reportData,
                             responseReportData,
                             onCloseDetail,
                             onShowReportForm,
                             showReportForm,
                             reportFormData,
                             handleReportChange,
                             handleReportSubmit,
                             setReportFormData,
                         }) => {

    const navigate = useNavigate();

    // Navegar a crear cliente
    const handleNavigateToCreateClient = () => {
        if (solicitud && responseReportData) {
            navigate(`/crear-cliente/${solicitud.solicitud_id}/${responseReportData.respuesta_id}`);
        }
    };

    // Configurar el tipo de reporte automáticamente según el tipo de solicitud
    useEffect(() => {
        if (solicitud && !reportData) {
            setReportFormData((prev) => ({
                ...prev,
                tipo: solicitud.tipo, // Asigna directamente el tipo de la solicitud
            }));
        }
    }, [solicitud, reportData, setReportFormData]);


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
                <strong>Fecha de Solicitud:</strong>{" "}
                {new Date(solicitud.fechasolicitud).toLocaleString()}
            </p>
            <p>
                <strong>Estado:</strong> {solicitud.estado}
            </p>

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
                            <p>
                                <strong>ID de la Respuesta:</strong> {responseReportData.response_id}
                            </p>
                            <p>
                                <strong>Detalles:</strong> {responseReportData.descripcion}
                            </p>
                            <p>
                                <strong>Respuesta:</strong> {responseReportData.respuesta}
                            </p>
                            <p>
                                <strong>Fecha de Respuesta:</strong>{" "}
                                {new Date(responseReportData.fechaRespuesta).toLocaleString()}
                            </p>
                            {solicitud.estado !== "Completado" &&
                                responseReportData.respuesta === "Completado Óptimo" && (
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
                    <button onClick={onShowReportForm}>Hacer Reporte</button>
                    {showReportForm && (
                        <ReportForm
                            formData={reportFormData}
                            onFormChange={handleReportChange}
                            onFormSubmit={handleReportSubmit}
                        />
                    )}
                </>
            )}


            <button onClick={onCloseDetail}>Cerrar Detalle</button>
        </div>
    );
};

export default SolicitudDetail;
