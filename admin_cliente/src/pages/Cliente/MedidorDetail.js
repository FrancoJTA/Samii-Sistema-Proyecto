// src/components/MedidorDetail.js
import React, { useEffect, useState } from "react";
import { fetchData } from "../../utils/api";
import FacturasList from "./FacturasList";

const MedidorDetail = ({ medidor }) => {
    const [zonaName, setZonaName] = useState("");

    useEffect(() => {
        const fetchZonaName = async () => {
            if (medidor.zonaid) {
                try {
                    const zonaData = await fetchData(`/zona/${medidor.zonaid}`);
                    setZonaName(zonaData.name); // Asumiendo que 'name' es el nombre de la zona
                } catch (error) {
                    console.error("Error fetching zona data:", error);
                    setZonaName("Desconocida");
                }
            } else {
                setZonaName("Sin zona asignada");
            }
        };

        fetchZonaName();
    }, [medidor.zonaid]);

    if (!medidor) {
        return null;
    }
    return (
        <div className="medidor-detail">
            <h3>Detalles del Medidor</h3>
            <p><strong>Número de Serie:</strong> {medidor.numero_serie}</p>
            <p><strong>Modelo:</strong> {medidor.modelo}</p>
            <p><strong>Tipo:</strong> {medidor.tipo}</p>
            <p><strong>Nombre:</strong> {medidor.name}</p>
            <p><strong>Lectura Actual:</strong> {medidor.lectura}</p>
            <p><strong>Estado:</strong> {medidor.activo ? "Activo" : "Inactivo"}</p>
            <p><strong>Fecha de Instalación:</strong> {new Date(medidor.fechaInstalacion).toLocaleString()}</p>
            <p><strong>Latitud:</strong> {medidor.Latitud}</p>
            <p><strong>Longitud:</strong> {medidor.Longitud}</p>
            <p><strong>Zona:</strong> {medidor.zonaid}</p>

            {/* Facturas Component */}
            <FacturasList medidorId={medidor.medidor_id} />
        </div>
    );
};

export default MedidorDetail;
