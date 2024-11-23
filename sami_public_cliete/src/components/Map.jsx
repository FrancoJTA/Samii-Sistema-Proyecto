import { useRef, useEffect, useState } from "react";
import GoogleMapsLoader from "./GoogleMapsLoader";

export default function Map({ onCoordinatesSelect }) {
    const mapRef = useRef(null);
    const markerRef = useRef(null); // Referencia al marcador
    const [map, setMap] = useState(null); // Estado para el mapa
    const geocoder = useRef(null); // Referencia al servicio Geocoder
    const [address, setAddress] = useState(""); // Dirección actual
    const [searchQuery, setSearchQuery] = useState(""); // Dirección ingresada por el usuario

    useEffect(() => {
        if (!map) return;

        // Crear un marcador draggable si el mapa ya está cargado
        const marker = new window.google.maps.Marker({
            position: { lat: -17.783327, lng: -63.182140 }, // Centro en Santa Cruz
            map,
            draggable: true,
        });

        // Manejar evento: mover el marcador
        marker.addListener("dragend", () => {
            const position = marker.getPosition();
            onCoordinatesSelect({
                lat: position.lat(),
                lng: position.lng(),
            });
            updateAddress(position); // Actualizar la dirección basada en las coordenadas
        });

        markerRef.current = marker; // Almacenar referencia
    }, [map]); // Solo ejecutar cuando `map` esté definido

    const handleMapLoad = () => {
        const google = window.google;

        // Inicializar el geocoder
        geocoder.current = new google.maps.Geocoder();

        // Crear el mapa centrado en Santa Cruz
        const newMap = new google.maps.Map(mapRef.current, {
            center: { lat: -17.783327, lng: -63.182140 }, // Centro en Santa Cruz
            zoom: 12,
        });

        setMap(newMap); // Guardar el mapa en el estado
    };

    const searchAddress = () => {
        if (!searchQuery.trim()) {
            alert("Por favor, ingresa una dirección válida.");
            return;
        }

        if (!geocoder.current) return;

        // Agregar "Santa Cruz, Bolivia" al texto ingresado
        const fullAddress = `${searchQuery}, Santa Cruz, Bolivia`;

        geocoder.current.geocode(
            {
                address: fullAddress,
                region: "bo", // Prioriza Bolivia
            },
            (results, status) => {
                if (status === "OK" && results.length > 0) {
                    const location = results[0].geometry.location;
                    map.setCenter(location); // Centrar el mapa
                    map.setZoom(16); // Zoom a nivel de calles
                    markerRef.current.setPosition(location); // Mover el marcador
                    onCoordinatesSelect({
                        lat: location.lat(),
                        lng: location.lng(),
                    });
                    setAddress(results[0].formatted_address); // Actualizar dirección
                } else {
                    alert("No se pudo encontrar la dirección. Por favor, verifica e intenta nuevamente.");
                }
            }
        );
    };

    const updateAddress = (position) => {
        if (!geocoder.current) return;

        geocoder.current.geocode({ location: position }, (results, status) => {
            if (status === "OK" && results[0]) {
                setAddress(results[0].formatted_address);
            } else {
                setAddress("No se pudo obtener la dirección");
            }
        });
    };

    return (
        <div>
            <GoogleMapsLoader onLoad={handleMapLoad} />
            <div style={{ display: "flex", marginBottom: "1rem", gap: "0.5rem" }}>
                <input
                    type="text"
                    placeholder="Buscar dirección"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ flex: 1, padding: "0.5rem" }}
                />
                <button
                    onClick={searchAddress}
                    style={{
                        padding: "0.5rem",
                        background: "#007BFF",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Buscar
                </button>
            </div>
            <div
                ref={mapRef}
                style={{ width: "100%", height: "400px", margin: "1rem 0" }}
            ></div>
            <p><strong>Dirección Actual:</strong> {address}</p>
        </div>
    );
}
