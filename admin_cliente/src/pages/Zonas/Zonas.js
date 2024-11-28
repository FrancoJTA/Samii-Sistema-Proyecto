// src/components/Zonas.js
import React, { useState, useEffect, useCallback } from "react";
import "../../styles/ZonasStyles.css";
import { fetchData, postData, putData } from "../../utils/api";
import ZonasList from "./ZoneList";
import ZonaDetail from "./ZoneDetail";
import CreateZonaModal from "./CreateZonaModal";
import EditZonaModal from "./EditZonaModal";
import GoogleMapsLoader from "../../components/GoogleMapsLoader";

const Zonas = () => {
    const [zonas, setZonas] = useState([]);
    const [selectedZona, setSelectedZona] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
    const [editZona, setEditZona] = useState(null);
    const [reportesTransformadores, setReportesTransformadores] = useState([]);
    const [newZona, setNewZona] = useState({
        name: "",
        latitud: "",
        longitud: "",
        limiteInferior: "",
        limiteSuperior: "",
        estado: "estable",
        potenciaIncrementada: 0,
        horaPico: null,
    });

    const fetchReportesTransformadores = async (zonaId) => {
        try {
            const reportes = await fetchData(`/transformer/zona/${zonaId}`);
            setReportesTransformadores(reportes);
        } catch (error) {
            console.error("Error al obtener reportes de transformadores:", error);
            setReportesTransformadores([]);
        }
    };


    // Cargar zonas desde la API
    useEffect(() => {
        const loadZonas = async () => {
            try {
                const zonasData = await fetchData("/zona");
                // Mapear 'name' a 'name' y asegurar que los demás campos estén presentes
                const mappedZonas = zonasData.map(zona => ({
                    ...zona,
                    name: zona.name,
                    limiteInferior: zona.limiteInferior,
                    limiteSuperior: zona.limiteSuperior,
                    estado: zona.estado,
                    potenciaIncrementada: zona.potenciaIncrementada,
                    horaPico: zona.horaPico,
                }));
                setZonas(mappedZonas);
            } catch (error) {
                console.error("Error fetching zonas:", error);
            }
        };

        loadZonas();
    }, []);


    // Manejar la carga de Google Maps
    const handleGoogleMapsLoaded = () => {
        setIsGoogleMapsLoaded(true);
    };

    // Seleccionar una zona para ver detalles
    const handleSelectZona = (zona) => {
        setSelectedZona(zona);
        fetchReportesTransformadores(zona.zona_id);
    };

    // Abrir modal para editar una zona
    const handleOpenEditModal = (zona) => {
        setEditZona(zona);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditZona(null);
    };

    // Abrir modal para crear una nueva zona
    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setNewZona({
            name: "",
            latitud: "",
            longitud: "",
        });
    };

    // Manejar cambios en el formulario de edición
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditZona({ ...editZona, [name]: value });
    };

    // Manejar cambios en el formulario de creación
    const handleNewZonaChange = (e) => {
        const { name, value } = e.target;
        setNewZona((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Crear una nueva zona
    const handleCreateZona = async () => {
        try {
            // Crear una copia del objeto para evitar mutaciones
            const zonaToCreate = {
                ...newZona,
                name: newZona.name,
                limiteInferior: parseFloat(newZona.limiteInferior),
                limiteSuperior: parseFloat(newZona.limiteSuperior),
                estado: "estable",
                potenciaIncrementada: 0, // Establece un valor por defecto si es necesario
                horaPico: null, // Establece un valor por defecto si es necesario
            };

            const createdZona = await postData("/zona", zonaToCreate);
            const mappedZona = { ...createdZona, name: createdZona.name };
            setZonas((prev) => [...prev, mappedZona]);
            handleCloseCreateModal();
        } catch (error) {
            console.error("Error creating zona:", error);
        }
    };

    // Actualizar una zona existente
    const handleUpdateZona = async () => {
        try {
            const zonaToUpdate = {
                ...editZona,
                name: editZona.name,
                limiteInferior: parseFloat(editZona.limiteInferior),
                limiteSuperior: parseFloat(editZona.limiteSuperior),
                // Mantener 'estado' y otros campos como están
            };
            const updatedZona = await putData(`/zona/${editZona.zona_id}`, zonaToUpdate);
            const mappedZona = { ...updatedZona, name: updatedZona.name };
            setZonas((prev) =>
                prev.map((zona) => (zona.zona_id === mappedZona.zona_id ? mappedZona : zona))
            );
            handleCloseEditModal();
        } catch (error) {
            console.error("Error updating zona:", error);
        }
    };
    const updateNewZonaCoordinates = (lat, lng) => {
        setNewZona((prev) => ({
            ...prev,
            latitud: lat.toFixed(6),
            longitud: lng.toFixed(6),
        }));
    };

// Función para actualizar las coordenadas de editZona
    const updateEditZonaCoordinates = (lat, lng) => {
        setEditZona((prev) => ({
            ...prev,
            latitud: lat.toFixed(6),
            longitud: lng.toFixed(6),
        }));
    };
    // Inicializar el mapa en el modal de creación
    const initializeCreateMap = useCallback((mapElement) => {
        if (!mapElement) return;

        const google = window.google;

        const map = new google.maps.Map(mapElement, {
            center: { lat: -17.783327, lng: -63.182140 },
            zoom: 12,
        });

        const marker = new google.maps.Marker({
            position: { lat: -17.783327, lng: -63.182140 },
            map,
            draggable: true,
        });

        // Actualizar las coordenadas iniciales
        const initialPosition = marker.getPosition();
        updateNewZonaCoordinates(initialPosition.lat(), initialPosition.lng());

        marker.addListener("dragend", () => {
            const position = marker.getPosition();
            console.log('Marker moved to:', position.lat(), position.lng());
            updateNewZonaCoordinates(position.lat(), position.lng());
        });
    }, [updateNewZonaCoordinates]);

    // Inicializar el mapa en el modal de edición
    const initializeEditMap = useCallback((mapElement, lat, lng) => {
        if (!mapElement) return;

        const google = window.google;

        const map = new google.maps.Map(mapElement, {
            center: { lat: parseFloat(lat), lng: parseFloat(lng) },
            zoom: 12,
        });

        const marker = new google.maps.Marker({
            position: { lat: parseFloat(lat), lng: parseFloat(lng) },
            map,
            draggable: true,
        });

        // Actualizar las coordenadas iniciales
        updateEditZonaCoordinates(marker.getPosition().lat(), marker.getPosition().lng());

        marker.addListener("dragend", () => {
            const position = marker.getPosition();
            console.log('Marker moved to:', position.lat(), position.lng());
            updateNewZonaCoordinates(position.lat(), position.lng());
        });
    }, [updateEditZonaCoordinates]);

    return (
        <div className="zonas-container">
            <ZonasList
                zonas={zonas}
                onSelectZona={handleSelectZona}
                onEditZona={handleOpenEditModal}
                onCreateZona={handleOpenCreateModal}
            />
            <div className={`zona-detail ${selectedZona ? 'visible' : ''}`}>
                {selectedZona && (
                    <ZonaDetail
                        zona={selectedZona}
                        reportes={reportesTransformadores}
                        isGoogleMapsLoaded={isGoogleMapsLoaded}
                    />
                )}
            </div>
            <CreateZonaModal
                isOpen={isCreateModalOpen}
                onRequestClose={handleCloseCreateModal}
                newZona={newZona}
                handleNewZonaChange={handleNewZonaChange}
                handleCreateZona={handleCreateZona}
                isGoogleMapsLoaded={isGoogleMapsLoaded}
                initializeCreateMap={initializeCreateMap}
            />
            <EditZonaModal
                isOpen={isEditModalOpen}
                onRequestClose={handleCloseEditModal}
                editZona={editZona}
                handleEditChange={handleEditChange}
                handleUpdateZona={handleUpdateZona}
                isGoogleMapsLoaded={isGoogleMapsLoaded}
                initializeEditMap={initializeEditMap}
            />
            <GoogleMapsLoader onLoad={handleGoogleMapsLoaded}/>
        </div>
    );
};

export default Zonas;
