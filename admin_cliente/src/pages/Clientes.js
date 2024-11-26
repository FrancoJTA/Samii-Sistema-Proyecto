import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "../styles/ClientesStyles.css";
import { fetchData, putData, deleteData } from "../utils/api";

Modal.setAppElement("#root");

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editCliente, setEditCliente] = useState(null);

    // Fetch Clientes
    useEffect(() => {
        const loadClientes = async () => {
            try {
                const data = await fetchData("/usuarios/clientes");
                setClientes(data);
            } catch (error) {
                console.error("Error fetching clientes:", error);
            }
        };

        loadClientes();
    }, []);

    // Open Edit Modal
    const handleOpenEditModal = (cliente) => {
        setEditCliente(cliente);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditCliente(null);
    };

    // Handle Input Changes
    const handleEditClienteChange = (e) => {
        const { name, value } = e.target;
        setEditCliente({ ...editCliente, [name]: value });
    };

    // Update Cliente
    const handleUpdateCliente = async () => {
        try {
            const updatedCliente = await putData(`/usuarios/${editCliente.usuario_id}`, editCliente);
            setClientes((prev) =>
                prev.map((cliente) =>
                    cliente.usuario_id === updatedCliente.usuario_id ? updatedCliente : cliente
                )
            );
            handleCloseEditModal();
        } catch (error) {
            console.error("Error updating cliente:", error);
        }
    };

    // Delete Cliente
    const handleDeleteCliente = async (clienteId) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
            try {
                await deleteData(`/usuarios/${clienteId}`);
                setClientes((prev) => prev.filter((cliente) => cliente.usuario_id !== clienteId));
            } catch (error) {
                console.error("Error deleting cliente:", error);
            }
        }
    };

    return (
        <div className="clientes-container">
            <h1>Gestión de Clientes</h1>
            <table className="clientes-table">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>CI</th>
                    <th>Teléfono</th>
                    <th>Samii Coins</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {clientes.map((cliente) => (
                    <tr key={cliente.usuario_id}>
                        <td>{`${cliente.nombre} ${cliente.apellido}`}</td>
                        <td>{cliente.correo}</td>
                        <td>{cliente.ci}</td>
                        <td>{cliente.telefono}</td>
                        <td>{cliente.samii_coin}</td>
                        <td>
                            <button onClick={() => handleOpenEditModal(cliente)}>Editar</button>
                            <button onClick={() => handleDeleteCliente(cliente.usuario_id)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Modal Editar Cliente */}
            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={handleCloseEditModal}
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2>Editar Cliente</h2>
                <div className="form-container">
                    <label>
                        Nombre:
                        <input
                            type="text"
                            name="nombre"
                            value={editCliente?.nombre || ""}
                            onChange={handleEditClienteChange}
                        />
                    </label>
                    <label>
                        Apellido:
                        <input
                            type="text"
                            name="apellido"
                            value={editCliente?.apellido || ""}
                            onChange={handleEditClienteChange}
                        />
                    </label>
                    <label>
                        Correo:
                        <input
                            type="email"
                            name="correo"
                            value={editCliente?.correo || ""}
                            readOnly
                        />
                    </label>
                    <label>
                        CI:
                        <input
                            type="text"
                            name="ci"
                            value={editCliente?.ci || ""}
                            readOnly
                        />
                    </label>
                    <label>
                        Teléfono:
                        <input
                            type="text"
                            name="telefono"
                            value={editCliente?.telefono || ""}
                            onChange={handleEditClienteChange}
                        />
                    </label>
                    <label>
                        Samii Coins:
                        <input
                            type="number"
                            name="samii_coin"
                            value={editCliente?.samii_coin || 0}
                            onChange={handleEditClienteChange}
                        />
                    </label>
                    <button onClick={handleUpdateCliente}>Guardar</button>
                    <button onClick={handleCloseEditModal}>Cancelar</button>
                </div>
            </Modal>
        </div>
    );
};

export default Clientes;
