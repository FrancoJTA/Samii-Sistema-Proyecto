import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "../styles/MonitorStyle.css";
import { fetchData, postData, putData, deleteData } from "../utils/api";

Modal.setAppElement("#root");

const Monitores = () => {
    const [monitores, setMonitores] = useState([]);
    const [zonas, setZonas] = useState([]); // Nuevo estado para las zonas
    const [selectedMonitor, setSelectedMonitor] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newMonitor, setNewMonitor] = useState({
        nombre: "",
        apellido: "",
        correo: "",
        ci: "",
        telefono: "",
        zonaid: "",
        estado: "Libre",
        roles: ["MONITOR"],
    });

    const [editMonitor, setEditMonitor] = useState(null);

    // Fetch Monitors
    useEffect(() => {
        const loadMonitores = async () => {
            try {
                const data = await fetchData("/usuarios/monitores");
                console.log(data);
                setMonitores(data);
            } catch (error) {
                console.error("Error fetching monitores:", error);
            }
        };

        loadMonitores();
    }, []);

    useEffect(() => {
        const loadMonitores = async () => {
            try {
                const data = await fetchData("/usuarios/monitores");
                console.log(data);
                setMonitores(data);
            } catch (error) {
                console.error("Error fetching monitores:", error);
            }
        };

        const loadZonas = async () => {
            try {
                const zonasData = await fetchData("/zona");
                setZonas(zonasData);
            } catch (error) {
                console.error("Error fetching zonas:", error);
            }
        };

        loadMonitores();
        loadZonas();
    }, []);

    // Open Create Modal
    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setNewMonitor({
            nombre: "",
            apellido: "",
            correo: "",
            ci: "",
            telefono: "",
            zonaid: "",
            estado: "Libre",
            roles: ["Monitor"],
        });
    };

    // Open Edit Modal
    const handleOpenEditModal = (monitor) => {
        setEditMonitor(monitor);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditMonitor(null);
    };

    // Handle Input Changes
    const handleNewMonitorChange = (e) => {
        const { name, value } = e.target;
        setNewMonitor({ ...newMonitor, [name]: value });
    };

    const handleEditMonitorChange = (e) => {
        const { name, value } = e.target;
        setEditMonitor({ ...editMonitor, [name]: value });
    };

    // Create Monitor
    const handleCreateMonitor = async () => {
        try {
            const createdMonitor = await postData("/usuarios", newMonitor);
            setMonitores((prev) => [...prev, createdMonitor]);
            handleCloseCreateModal();
        } catch (error) {
            console.error("Error creating monitor:", error);
        }
    };

    // Update Monitor
    const handleUpdateMonitor = async () => {
        try {
            const updatedMonitor = await putData(`/usuarios/${editMonitor.usuario_id}`, editMonitor);
            setMonitores((prev) =>
                prev.map((monitor) =>
                    monitor.usuario_id === updatedMonitor.usuario_id ? updatedMonitor : monitor
                )
            );
            handleCloseEditModal();
        } catch (error) {
            console.error("Error updating monitor:", error);
        }
    };

    // Delete Monitor
    const handleDeleteMonitor = async (monitorId) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este monitor?")) {
            try {
                await deleteData(`/usuarios/${monitorId}`);
                setMonitores((prev) => prev.filter((monitor) => monitor.usuario_id !== monitorId));
            } catch (error) {
                console.error("Error deleting monitor:", error);
            }
        }
    };

    return (
        <div className="monitores-container">
            <h1>Gestión de Monitores</h1>
            <button onClick={handleOpenCreateModal} className="create-monitor-button">
                Crear Nuevo Monitor
            </button>
            <table className="monitores-table">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Zona</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {monitores.map((monitor) => {
                    // Encontrar la zona correspondiente al monitor
                    const zona = zonas.find((z) => z.zona_id === monitor.zonaid);

                    return (
                        <tr key={monitor.usuario_id}>
                            <td>{`${monitor.nombre} ${monitor.apellido}`}</td>
                            <td>{monitor.correo}</td>
                            <td>{zona ? zona.name : "Sin Asignar"}</td>
                            <td>{monitor.estado}</td>
                            <td>
                                <button onClick={() => handleOpenEditModal(monitor)}>Editar</button>
                                <button onClick={() => handleDeleteMonitor(monitor.usuario_id)}>Eliminar</button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            {/* Modal Crear Monitor */}
            <Modal
                isOpen={isCreateModalOpen}
                onRequestClose={handleCloseCreateModal}
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2>Crear Monitor</h2>
                <div className="form-container">
                    <label>
                        Nombre:
                        <input
                            type="text"
                            name="nombre"
                            value={newMonitor.nombre}
                            onChange={handleNewMonitorChange}
                        />
                    </label>
                    <label>
                        Apellido:
                        <input
                            type="text"
                            name="apellido"
                            value={newMonitor.apellido}
                            onChange={handleNewMonitorChange}
                        />
                    </label>
                    <label>
                        Correo:
                        <input
                            type="email"
                            name="correo"
                            value={newMonitor.correo}
                            onChange={handleNewMonitorChange}
                        />
                    </label>
                    <label>
                        CI:
                        <input
                            type="text"
                            name="ci"
                            value={newMonitor.ci}
                            onChange={handleNewMonitorChange}
                        />
                    </label>
                    <label>
                        Teléfono:
                        <input
                            type="text"
                            name="telefono"
                            value={newMonitor.telefono}
                            onChange={handleNewMonitorChange}
                        />
                    </label>
                    <label>
                        Zona:
                        <select
                            name="zonaid"
                            value={newMonitor.zonaid || ""}
                            onChange={handleNewMonitorChange}
                        >
                            <option value="">Seleccione una zona</option>
                            {zonas.map((zona) => (
                                <option key={zona.zona_id} value={zona.zona_id}>
                                    {zona.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button onClick={handleCreateMonitor}>Crear</button>
                    <button onClick={handleCloseCreateModal}>Cancelar</button>
                </div>
            </Modal>

            {/* Modal Editar Monitor */}
            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={handleCloseEditModal}
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2>Editar Monitor</h2>
                <div className="form-container">
                    <label>
                        Nombre:
                        <input
                            type="text"
                            name="nombre"
                            value={editMonitor?.nombre || ""}
                            onChange={handleEditMonitorChange}
                        />
                    </label>
                    <label>
                        Apellido:
                        <input
                            type="text"
                            name="apellido"
                            value={editMonitor?.apellido || ""}
                            onChange={handleEditMonitorChange}
                        />
                    </label>
                    <label>
                        Correo:
                        <input
                            type="email"
                            name="correo"
                            value={editMonitor?.correo || ""}
                            readOnly
                        />
                    </label>
                    <label>
                        CI:
                        <input
                            type="text"
                            name="ci"
                            value={editMonitor?.ci || ""}
                            readOnly
                        />
                    </label>
                    <label>
                        Teléfono:
                        <input
                            type="text"
                            name="telefono"
                            value={editMonitor?.telefono || ""}
                            onChange={handleEditMonitorChange}
                        />
                    </label>
                    <label>
                        <label>
                            Zona:
                            <select
                                name="zonaid"
                                value={editMonitor?.zonaid || ""}
                                onChange={handleEditMonitorChange}
                            >
                                <option value="">Seleccione una zona</option>
                                {zonas.map((zona) => (
                                    <option key={zona.zona_id} value={zona.zona_id}>
                                        {zona.Name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </label>
                    <button onClick={handleUpdateMonitor}>Guardar</button>
                    <button onClick={handleCloseEditModal}>Cancelar</button>
                </div>
            </Modal>
        </div>
    );
};

export default Monitores;
