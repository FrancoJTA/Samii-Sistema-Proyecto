// src/components/ClientsList.js
import React from "react";

const ClientsList = ({ clients, onSelectClient }) => {
    return (
        <div className="clients-list">
            <h2>Lista de Clientes</h2>
            <ul>
                {clients.map((client) => (
                    <li
                        key={client.usuario_id}
                        className="client-item"
                        onClick={() => onSelectClient(client)}
                    >
                        <span className="client-name">
                            {client.nombre} {client.apellido}
                        </span>
                        <span className="client-email">{client.correo}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClientsList;
