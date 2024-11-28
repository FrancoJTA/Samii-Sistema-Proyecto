// src/components/EditClientModal.js
import React, { useState } from "react";
import Modal from "react-modal";
import "../../styles/ClientesStyles.css"; // Asegúrate de tener estilos para el modal

Modal.setAppElement("#root");

const EditClientModal = ({ isOpen, onRequestClose, client, onUpdateClient }) => {
    const [formData, setFormData] = useState({
        nombre: client.nombre || "",
        apellido: client.apellido || "",
        correo: client.correo || "",
        ci: client.ci || "",
        telefono: client.telefono || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Preparar los datos actualizados del cliente
        const updatedClient = {
            ...client,
            nombre: formData.nombre,
            apellido: formData.apellido,
            correo: formData.correo,
            ci: formData.ci,
            telefono: formData.telefono,
        };
        onUpdateClient(updatedClient);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Editar Cliente"
            className="modal"
            overlayClassName="modal-overlay"
        >
            <h2>Editar Cliente</h2>
            <form onSubmit={handleSubmit} className="form-container">
                <label>
                    Nombre:
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Apellido:
                    <input
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Correo:
                    <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    CI:
                    <input
                        type="text"
                        name="ci"
                        value={formData.ci}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Teléfono:
                    <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                    />
                </label>
                <div className="modal-buttons">
                    <button type="submit">Guardar</button>
                    <button type="button" onClick={onRequestClose}>
                        Cancelar
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditClientModal;
