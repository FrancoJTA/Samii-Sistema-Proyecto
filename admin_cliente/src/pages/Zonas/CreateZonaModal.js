// src/components/CreateZonaModal.js
import React, { useRef, useCallback, useState, useEffect } from "react";
import Modal from "react-modal";

const CreateZonaModal = ({
                             isOpen,
                             onRequestClose,
                             newZona,
                             handleNewZonaChange,
                             handleCreateZona,
                             isGoogleMapsLoaded,
                             initializeCreateMap,
                         }) => {
    const mapRef = useRef(null);
    const [mapInitialized, setMapInitialized] = useState(false);

    const mapRefCallback = useCallback(
        (node) => {
            if (node !== null && !mapInitialized) {
                mapRef.current = node;
                if (isOpen && isGoogleMapsLoaded) {
                    initializeCreateMap(mapRef.current);
                    setMapInitialized(true);
                }
            }
        },
        [
            isOpen,
            isGoogleMapsLoaded,
            initializeCreateMap,
            mapInitialized,
        ]
    );


    // Resetear el estado cuando se cierra el modal
    useEffect(() => {
        if (!isOpen) {
            setMapInitialized(false);
        }
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
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
                        required
                    />
                </label>
                <label>
                    Límite Inferior:
                    <input
                        type="number"
                        name="limiteInferior"
                        value={newZona.limiteInferior}
                        onChange={handleNewZonaChange}
                        required
                    />
                </label>
                <label>
                    Límite Superior:
                    <input
                        type="number"
                        name="limiteSuperior"
                        value={newZona.limiteSuperior}
                        onChange={handleNewZonaChange}
                        required
                    />
                </label>
                <div
                    ref={mapRefCallback}
                    style={{ width: "100%", height: "400px", marginBottom: "1rem" }}
                ></div>
                <label>
                    Latitud:
                    <input type="text" name="latitud" value={newZona.latitud || ""} readOnly />
                </label>
                <label>
                    Longitud:
                    <input type="text" name="longitud" value={newZona.longitud || ""} readOnly />
                </label>
                <button onClick={handleCreateZona}>Crear</button>
                <button onClick={onRequestClose}>Cancelar</button>
            </div>
        </Modal>
    );
};

export default CreateZonaModal;
