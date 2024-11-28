import React, { useEffect } from "react";

const GoogleMapsLoader = ({ onLoad }) => {
    useEffect(() => {
        // Verificar si el script ya está cargado
        const existingScript = document.getElementById("googleMapsScript");

        if (!existingScript) {
            // Crear un nuevo script si no está cargado
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAOLAxz2wEyB03oqaPsL__WrVQvVCK8BDA&libraries=places`;
            script.id = "googleMapsScript";
            script.async = true;
            script.defer = true;

            // Ejecutar la función `onLoad` cuando el script se cargue
            script.onload = () => {
                if (onLoad) onLoad();
            };

            // Añadir el script al documento
            document.body.appendChild(script);
        } else {
            // Si el script ya está cargado, ejecuta `onLoad` directamente
            if (typeof window.google !== "undefined" && onLoad) {
                onLoad();
            } else {
                existingScript.onload = () => {
                    if (onLoad) onLoad();
                };
            }
        }
    }, [onLoad]);

    return null;
};

export default GoogleMapsLoader;
