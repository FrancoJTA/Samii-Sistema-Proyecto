// src/components/Clients.js
import React, { useState, useEffect } from "react";
import ClientsList from "./ClientsList";
import ClientDetail from "./ClientDetail";
import EditClientModal from "./EditClientModal";
import { fetchData, putData } from "../../utils/api";
import "../../styles/ClientesStyles.css";

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editClient, setEditClient] = useState(null);

    // Cargar clientes desde la API
    useEffect(() => {
        const loadClients = async () => {
            try {
                const clientsData = await fetchData("/usuarios/clientes");
                setClients(clientsData);
            } catch (error) {
                console.error("Error fetching clients:", error);
                setError("Hubo un error al cargar los clientes.");
            }
        };

        loadClients();
    }, []);

    const handleSelectClient = (client) => {
        setSelectedClient(client);
    };

    const handleEditClient = (client) => {
        setEditClient(client);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditClient(null);
    };

    const handleUpdateClient = async (updatedClient) => {
        try {
            const response = await putData(`/usuarios/${updatedClient.usuario_id}`, updatedClient);
            // Actualizar la lista de clientes
            setClients((prevClients) =>
                prevClients.map((client) =>
                    client.usuario_id === response.usuario_id ? response : client
                )
            );
            // Si el cliente actualizado es el seleccionado, actualizar selectedClient
            if (selectedClient && selectedClient.usuario_id === response.usuario_id) {
                setSelectedClient(response);
            }
            handleCloseEditModal();
        } catch (error) {
            console.error("Error updating client:", error);
            setError("Hubo un error al actualizar el cliente.");
        }
    };

    return (
        <div className="clients-container">
            {error && <div className="error-message">{error}</div>}
            <ClientsList clients={clients} onSelectClient={handleSelectClient} />
            <ClientDetail client={selectedClient} onEditClient={handleEditClient} />
            {isEditModalOpen && editClient && (
                <EditClientModal
                    isOpen={isEditModalOpen}
                    onRequestClose={handleCloseEditModal}
                    client={editClient}
                    onUpdateClient={handleUpdateClient}
                />
            )}
        </div>
    );
};

export default Clients;
