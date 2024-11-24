import { useEffect } from "react";
const GOOGLE_MAPS_API_KEY = "AIzaSyAOLAxz2wEyB03oqaPsL__WrVQvVCK8BDA";
export default function GoogleMapsLoader({ onLoad }) {
    useEffect(() => {
        // Verifica si Google Maps ya está cargado
        if (window.google) {
            if (onLoad) onLoad(); // Llama a la función de carga si ya está disponible
            return;
        }

        // Construir la URL del script de Google Maps con la API Key
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
        script.async = true; // Marca el script como asíncrono
        script.defer = true; // Asegura que se ejecute después de que la página esté lista
        script.setAttribute("loading", "async"); // Mejora el rendimiento, recomendado por Google

        // Configurar el callback para inicializar el mapa
        window.initMap = () => {
            if (onLoad) onLoad();
        };

        // Añadir el script al documento
        document.head.appendChild(script);

        // Cleanup: Eliminar el script si el componente se desmonta
        return () => {
            document.head.removeChild(script);
            delete window.initMap;
        };
    }, []);


    return null; //Este componente no renderiza nada
}
