// src/components/ClientDetail.js
import React, { useState, useEffect } from "react";
import MedidorDetail from "./MedidorDetail";
import { fetchData } from "../../utils/api";

const ClientDetail = ({ client, onEditClient }) => {
    const [selectedMedidorId, setSelectedMedidorId] = useState("");
    const [medidorDetails, setMedidorDetails] = useState(null);
    const [clientRole, setClientRole] = useState("");
    const [medidoresData, setMedidoresData] = useState([]);

    useEffect(() => {
        if (client && client.propietario_medidor && client.propietario_medidor.length > 0) {
            // Cargar datos de los medidores asociados
            const loadMedidoresData = async () => {
                try {
                    const medidores = await Promise.all(
                        client.propietario_medidor.map(async (pm) => {
                            const medidor = await fetchData(`/medidores/${pm.medidor_id}`);
                            return medidor;
                        })
                    );
                    setMedidoresData(medidores);

                    // Seleccionar el primer medidor por defecto
                    setSelectedMedidorId(medidores[0].medidor_id);
                } catch (error) {
                    console.error("Error fetching medidores data:", error);
                }
            };
            loadMedidoresData();
        } else {
            setSelectedMedidorId("");
            setMedidorDetails(null);
            setClientRole("");
            setMedidoresData([]);
        }
    }, [client]);

    useEffect(() => {
        const fetchMedidorDetails = async () => {
            if (selectedMedidorId) {
                try {
                    const medidorData = await fetchData(`/medidores/${selectedMedidorId}`);
                    setMedidorDetails(medidorData);

                    // Obtener el rol del cliente para este medidor
                    const propMedidor = client.propietario_medidor.find(
                        (pm) => pm.medidor_id === selectedMedidorId
                    );
                    const role = propMedidor && propMedidor.rol ? propMedidor.rol : "USER";
                    setClientRole(role);
                } catch (error) {
                    console.error("Error fetching medidor details:", error);
                    setMedidorDetails(null);
                    setClientRole("");
                }
            }
        };

        if (client && selectedMedidorId) {
            fetchMedidorDetails();
        }
    }, [client, selectedMedidorId]);

    const handleMedidorChange = (e) => {
        setSelectedMedidorId(e.target.value);
    };

    if (!client) {
        return (
            <div className="client-detail">
                <h2>Detalles del Cliente</h2>
                <p>Selecciona un cliente para ver sus detalles.</p>
            </div>
        );
    }

    return (
        <div className="client-detail">
            <h2>Detalles del Cliente</h2>
            <p>
                <strong>Nombre:</strong> {client.nombre} {client.apellido}
            </p>
            <p>
                <strong>Correo:</strong> {client.correo}
            </p>
            <p>
                <strong>CI:</strong> {client.ci}
            </p>
            <p>
                <strong>Teléfono:</strong> {client.telefono}
            </p>
            <p>
                <strong>Samii Coin:</strong> {client.samii_coin}
            </p>
            <button onClick={() => onEditClient(client)}>Editar</button>

            {/* Combo Box para seleccionar Medidor */}
            {medidoresData && medidoresData.length > 0 ? (
                <div className="medidor-selection">
                    <h3>Medidores Asociados</h3>
                    <label>
                        Selecciona un Medidor:
                        <select value={selectedMedidorId} onChange={handleMedidorChange}>
                            {medidoresData.map((medidor) => (
                                <option key={medidor.medidor_id} value={medidor.medidor_id}>
                                    {medidor.name} {/* Mostrar el nombre de la calle */}
                                </option>
                            ))}
                        </select>
                    </label>
                    {/* Mostrar el rol del cliente para el medidor seleccionado */}
                    <p>
                        <strong>Rol en este medidor:</strong> {clientRole}
                    </p>
                    {/* Mostrar detalles del medidor */}
                    {medidorDetails ? (
                        <MedidorDetail medidor={medidorDetails} />
                    ) : (
                        <p>Cargando detalles del medidor...</p>
                    )}
                </div>
            ) : (
                <p>El cliente no tiene medidores asociados.</p>
            )}
        </div>
    );
};

export default ClientDetail;
