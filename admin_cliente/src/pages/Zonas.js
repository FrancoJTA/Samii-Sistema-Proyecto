import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import GoogleMapsLoader from "../components/GoogleMapsLoader";
import "../styles/ZonasStyles.css";
import { fetchData, postData, putData } from "../utils/api";

const GOOGLE_MAPS_API_KEY = "AIzaSyAOLAxz2wEyB03oqaPsL__WrVQvVCK8BDA";

Modal.setAppElement("#root");

const Zonas = () => {
    const [zonas, setZonas] = useState([]);
    const [selectedZona, setSelectedZona] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
    const [editZona, setEditZona] = useState(null);
    const [newZona, setNewZona] = useState({
        name: "",
        latitud: "",
        longitud: "",
    });

    const mapRef = useRef(null);
    const markerRef = useRef(null);

    const detailMapRef = useRef(null);
    const detailMarkerRef = useRef(null);

    useEffect(() => {
        const loadZonas = async () => {
            try {
                const data = await fetchData("/zona");
                setZonas(data);
            } catch (error) {
                console.error("Error fetching zonas:", error);
            }
        };

        loadZonas();
    }, []);

    const handleGoogleMapsLoaded = () => {
        setIsGoogleMapsLoaded(true);
    };

    const handleSelectZona = (zona) => {
        setSelectedZona(zona);
        setTimeout(() => {
            if (isGoogleMapsLoaded) {
                initializeDetailMap(zona.latitud, zona.longitud);
            }
        }, 0);
    };

    const handleOpenEditModal = (zona) => {
        setEditZona(zona);
        setIsEditModalOpen(true);
        setTimeout(() => {
            if (isGoogleMapsLoaded) {
                initializeEditMap(zona.latitud, zona.longitud);
            }
        }, 0);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditZona(null);
    };

    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
        setTimeout(() => {
            if (isGoogleMapsLoaded) {
                initializeCreateMap();
            }
        }, 0);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setNewZona({
            name: "",
            latitud: "",
            longitud: "",
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditZona({ ...editZona, [name]: value });
    };

    const handleNewZonaChange = (e) => {
        const { name, value } = e.target;
        setNewZona({ ...newZona, [name]: value });
    };

    const handleUpdateZona = async () => {
        try {
            const updatedZona = await putData(`/zona/${editZona.zona_id}`, editZona);
            setZonas((prev) =>
                prev.map((zona) => (zona.zona_id === updatedZona.zona_id ? updatedZona : zona))
            );
            handleCloseEditModal();
        } catch (error) {
            console.error("Error updating zona:", error);
        }
    };

    const handleCreateZona = async () => {
        try {
            const createdZona = await postData("/zona", newZona);
            setZonas((prev) => [...prev, createdZona]);
            handleCloseCreateModal();
        } catch (error) {
            console.error("Error creating zona:", error);
        }
    };

    const initializeCreateMap = () => {
        const google = window.google;

        const map = new google.maps.Map(mapRef.current, {
            center: { lat: -17.783327, lng: -63.182140 },
            zoom: 12,
        });

        const marker = new google.maps.Marker({
            position: { lat: -17.783327, lng: -63.182140 },
            map,
            draggable: true,
        });

        marker.addListener("dragend", () => {
            const position = marker.getPosition();
            setNewZona((prev) => ({
                ...prev,
                latitud: position.lat().toFixed(6),
                longitud: position.lng().toFixed(6),
            }));
        });

        markerRef.current = marker;
    };

    const initializeEditMap = (lat, lng) => {
        const google = window.google;

        const map = new google.maps.Map(mapRef.current, {
            center: { lat: parseFloat(lat), lng: parseFloat(lng) },
            zoom: 12,
        });

        const marker = new google.maps.Marker({
            position: { lat: parseFloat(lat), lng: parseFloat(lng) },
            map,
            draggable: true,
        });

        marker.addListener("dragend", () => {
            const position = marker.getPosition();
            setEditZona((prev) => ({
                ...prev,
                latitud: position.lat().toFixed(6),
                longitud: position.lng().toFixed(6),
            }));
        });

        markerRef.current = marker;
    };

    const initializeDetailMap = (lat, lng) => {
        const google = window.google;

        const map = new google.maps.Map(detailMapRef.current, {
            center: { lat: parseFloat(lat), lng: parseFloat(lng) },
            zoom: 12,
        });

        const marker = new google.maps.Marker({
            position: { lat: parseFloat(lat), lng: parseFloat(lng) },
            map,
        });

        detailMarkerRef.current = marker;
    };

    return (
        <div className="zonas-container">
            <div className={`zonas-list ${selectedZona ? "collapsed" : ""}`}>
                <h2>Lista de Zonas</h2>
                <button onClick={handleOpenCreateModal} className="create-zona-button">
                    Crear Nueva Zona
                </button>
                <ul>
                    {zonas.map((zona) => (
                        <li key={zona.zona_id} className="zona-item">
                            <span onClick={() => handleSelectZona(zona)}>{zona.name}</span>
                            <button onClick={() => handleOpenEditModal(zona)}>Editar</button>
                        </li>
                    ))}
                </ul>
            </div>

            {selectedZona && (
                <div className="zona-detail">
                    <h2>Detalle de la Zona</h2>
                    <p><strong>Nombre:</strong> {selectedZona.name}</p>
                    <p><strong>Latitud:</strong> {selectedZona.latitud}</p>
                    <p><strong>Longitud:</strong> {selectedZona.longitud}</p>
                    <div ref={detailMapRef} style={{ width: "100%", height: "400px" }}></div>
                </div>
            )}

            <Modal
                isOpen={isCreateModalOpen}
                onRequestClose={handleCloseCreateModal}
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2>Crear Nueva Zona</h2>
                <div className="form-container">
                    <label>
                        Nombre:
                        <input
                            type="text"
                            name="name"
                            value={newZona.name}
                            onChange={handleNewZonaChange}
                        />
                    </label>
                    <div
                        ref={mapRef}
                        style={{ width: "100%", height: "400px", marginBottom: "1rem" }}
                    ></div>
                    <label>
                        Latitud:
                        <input type="text" name="latitud" value={newZona.latitud} readOnly />
                    </label>
                    <label>
                        Longitud:
                        <input type="text" name="longitud" value={newZona.longitud} readOnly />
                    </label>
                    <button onClick={handleCreateZona}>Crear</button>
                    <button onClick={handleCloseCreateModal}>Cancelar</button>
                </div>
                <GoogleMapsLoader onLoad={handleGoogleMapsLoaded} />
            </Modal>

            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={handleCloseEditModal}
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2>Editar Zona</h2>
                <div className="form-container">
                    <label>
                        Nombre:
                        <input
                            type="text"
                            name="name"
                            value={editZona?.name || ""}
                            onChange={handleEditChange}
                        />
                    </label>
                    <div
                        ref={mapRef}
                        style={{ width: "100%", height: "400px", marginBottom: "1rem" }}
                    ></div>
                    <label>
                        Latitud:
                        <input type="text" name="latitud" value={editZona?.latitud || ""} readOnly />
                    </label>
                    <label>
                        Longitud:
                        <input type="text" name="longitud" value={editZona?.longitud || ""} readOnly />
                    </label>
                    <button onClick={handleUpdateZona}>Actualizar</button>
                    <button onClick={handleCloseEditModal}>Cancelar</button>
                </div>
                <GoogleMapsLoader onLoad={handleGoogleMapsLoaded} />
            </Modal>
        </div>
    );
};

export default Zonas;
