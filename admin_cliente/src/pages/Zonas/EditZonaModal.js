import React, { useRef, useCallback, useState, useEffect } from "react";
import Modal from "react-modal";

const EditZonaModal = ({
                           isOpen,
                           onRequestClose,
                           editZona,
                           handleEditChange,
                           handleUpdateZona,
                           isGoogleMapsLoaded,
                           initializeEditMap,
                       }) => {
    const mapRef = useRef(null);
    const [mapInitialized, setMapInitialized] = useState(false);

    const mapRefCallback = useCallback(
        (node) => {
            if (node !== null && !mapInitialized && editZona) {
                mapRef.current = node;
                if (isOpen && isGoogleMapsLoaded) {
                    initializeEditMap(
                        mapRef.current,
                        editZona.latitud,
                        editZona.longitud
                    );
                    setMapInitialized(true);
                }
            }
        },
        [
            isOpen,
            isGoogleMapsLoaded,
            initializeEditMap,
            mapInitialized,
            editZona,
        ]
    );


    useEffect(() => {
        if (!isOpen) {
            setMapInitialized(false);
        }
    }, [isOpen]);

    if (!editZona) {
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
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
                        value={editZona.name || ""}
                        onChange={handleEditChange}
                        required
                    />
                </label>
                <label>
                    Límite Inferior:
                    <input
                        type="number"
                        name="limiteInferior"
                        value={editZona.limiteInferior || ""}
                        onChange={handleEditChange}
                        required
                    />
                </label>
                <label>
                    Límite Superior:
                    <input
                        type="number"
                        name="limiteSuperior"
                        value={editZona.limiteSuperior || ""}
                        onChange={handleEditChange}
                        required
                    />
                </label>
                {/* ... resto del código ... */}
                <div
                    ref={mapRefCallback}
                    style={{ width: "100%", height: "400px", marginBottom: "1rem" }}
                ></div>
                <label>
                    Latitud:
                    <input type="text" name="latitud" value={editZona.latitud || ""} readOnly />
                </label>
                <label>
                    Longitud:
                    <input type="text" name="longitud" value={editZona.longitud || ""} readOnly />
                </label>
                <button onClick={handleUpdateZona}>Guardar</button>
                <button onClick={onRequestClose}>Cancelar</button>
            </div>
        </Modal>
    );
};

export default EditZonaModal;
