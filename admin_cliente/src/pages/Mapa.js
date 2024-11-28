import React, { useState, useEffect, useRef } from "react";
import GoogleMapsLoader from "../components/GoogleMapsLoader2";
import { fetchData } from "../utils/api";
import "../styles/MapStyle.css";

const Mapa = () => {
    const mapRef = useRef(null); // Referencia para el contenedor del mapa
    const [isGoogleMapsLoaded, setGoogleMapsLoaded] = useState(false); // Verifica si Google Maps se cargó
    const [map, setMap] = useState(null); // Almacena el objeto del mapa
    const [zonas, setZonas] = useState([]); // Almacena los datos de las zonas
    const [medidores, setMedidores] = useState([]); // Almacena los datos de los medidores

    // Manejar la carga de Google Maps
    const handleGoogleMapsLoaded = () => {
        setGoogleMapsLoaded(true);
    };

    // Inicializar el mapa
    useEffect(() => {
        if (isGoogleMapsLoaded && mapRef.current && !map) {
            const google = window.google;

            const mapInstance = new google.maps.Map(mapRef.current, {
                center: { lat: -17.783327, lng: -63.182140 },
                zoom: 16,
            });

            setMap(mapInstance);
        }
    }, [isGoogleMapsLoaded, mapRef, map]);

    // Obtener datos de zonas y medidores desde la API
    useEffect(() => {
        const loadData = async () => {
            try {
                const zonasData = await fetchData("/zona");
                const medidoresData = await fetchData("/medidores");
                setZonas(zonasData);
                setMedidores(medidoresData);
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        };

        loadData();
    }, []);

    // Añadir marcadores al mapa
    useEffect(() => {
        if (map) {
            const google = window.google;

            // Añadir marcadores de zonas
            zonas.forEach((zona) => {
                const marker = new google.maps.Marker({
                    position: { lat: parseFloat(zona.latitud), lng: parseFloat(zona.longitud) },
                    map,
                    title: zona.name,
                    icon:{
                        url: "/Images/generador-electrico.png",
                        scaledSize: new google.maps.Size(32, 32), // Tamaño ajustado del ícono
                    },  // Ícono personalizado para zonas
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `
                        <div>
                            <h3>${zona.name}</h3>
                            <p><strong>Estado:</strong> ${zona.estado}</p>
                            <p><strong>Límite Inferior:</strong> ${zona.limiteInferior}</p>
                            <p><strong>Límite Superior:</strong> ${zona.limiteSuperior}</p>
                        </div>
                    `,
                });

                marker.addListener("click", () => {
                    infoWindow.open(map, marker);
                });
            });

            // Añadir marcadores de medidores
            medidores.forEach((medidor) => {
                const marker = new google.maps.Marker({
                    position: { lat: parseFloat(medidor.latitud), lng: parseFloat(medidor.longitud) },
                    map,
                    title: medidor.name,
                    icon:{
                        url: "/Images/medidor-de-luz.png",
                        scaledSize: new google.maps.Size(32, 32), // Tamaño ajustado del ícono
                    },
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `    
                        <div>
                            <h3>${medidor.name}</h3>
                            <p><strong>Modelo:</strong> ${medidor.modelo}</p>
                            <p><strong>Lectura:</strong> ${medidor.lectura}</p>
                            <p><strong>Última Lectura:</strong> ${medidor.ultimaLectura}</p>
                            <p><strong>Activo:</strong> ${medidor.activo ? "Sí" : "No"}</p>
                        </div>
                    `,
                });

                marker.addListener("click", () => {
                    infoWindow.open(map, marker);
                });
            });
        }
    }, [map, zonas, medidores]);

    return (
        <div className="map-container">
            <GoogleMapsLoader onLoad={handleGoogleMapsLoaded} />
            <div ref={mapRef} className="map" style={{ width: "100%", height: "100%x" }}></div>
        </div>
    );
};

export default Mapa;
