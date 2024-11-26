// Solicitudes.js
import React, { useState, useEffect } from "react";
import { fetchData, postData } from "../utils/api";
import SolicitudesList from "./SolicitudesList";
import SolicitudDetail from "./SolicitudDetail";
import ReportForm from "./ReportForm";
import { useNavigate } from "react-router-dom";
import "../styles/SolicitudesStyles.css";

const Solicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [showReportForm, setShowReportForm] = useState(false);
    const [reportFormData, setReportFormData] = useState({
        tipo: "",
        descripcion: "",
    });
    const [reportData, setReportData] = useState(null);
    const [responseReportData, setResponseReportData] = useState(null);
    const navigate = useNavigate();
    const reportTypes = ["Instalación", "Reparación", "Mantenimiento"];

    // Cargar solicitudes desde la API
    useEffect(() => {
        const loadSolicitudes = async () => {
            try {
                const data = await fetchData("/solicitud");
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

        if (solicitud.reporte_id) {
            try {
                const reportDetail = await fetchData(`/reporte/${solicitud.reporte_id}`);
                setReportData(reportDetail);

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

    const handleShowReportForm = () => {
        setShowReportForm(true);
    };

    const handleReportChange = (e) => {
        const { name, value } = e.target;
        setReportFormData({ ...reportFormData, [name]: value });
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault();

        const newReport = {
            tipo: reportFormData.tipo,
            descripcion: reportFormData.descripcion,
            solicitud_id: selectedSolicitud.solicitud_id,
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

    return (
        <div className="solicitudes-container">
            <SolicitudesList solicitudes={solicitudes} onSelectSolicitud={handleSelectSolicitud} />
            {selectedSolicitud && (
                <SolicitudDetail
                    solicitud={selectedSolicitud}
                    reportData={reportData}
                    responseReportData={responseReportData}
                    onCloseDetail={handleCloseDetail}
                />
            )}
            {showReportForm && (
                <ReportForm
                    formData={reportFormData}
                    onFormChange={handleReportChange}
                    onFormSubmit={handleReportSubmit}
                    reportTypes={reportTypes}
                />
            )}
        </div>
    );
};

export default Solicitudes;
