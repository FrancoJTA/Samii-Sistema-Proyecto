import React, { useEffect, useRef } from "react";
import ReporteTransformadores from "./ReporteTransformadores";

const ZonaDetail = ({ zona,reportes, isGoogleMapsLoaded }) => {
    const detailMapRef = useRef(null);
    const detailMarkerRef = useRef(null);

    useEffect(() => {
        if (zona && isGoogleMapsLoaded && detailMapRef.current) {
            const google = window.google;

            const map = new google.maps.Map(detailMapRef.current, {
                center: { lat: parseFloat(zona.latitud), lng: parseFloat(zona.longitud) },
                zoom: 12,
            });

            const marker = new google.maps.Marker({
                position: { lat: parseFloat(zona.latitud), lng: parseFloat(zona.longitud) },
                map,
            });

            detailMarkerRef.current = marker;
        }
    }, [zona, isGoogleMapsLoaded]);

    if (!zona) {
        return <p>Seleccione una zona para ver los detalles.</p>;
    }

    return (
        <div className="zona-detail">
            <h2>Detalle de la Zona</h2>
            <p><strong>Nombre:</strong> {zona.name}</p>
            <p><strong>Límite Inferior:</strong> {zona.limiteInferior}</p>
            <p><strong>Límite Superior:</strong> {zona.limiteSuperior}</p>
            <p><strong>Estado:</strong> {zona.estado}</p>
            <p><strong>Latitud:</strong> {zona.latitud}</p>
            <p><strong>Longitud:</strong> {zona.longitud}</p>
            <div ref={detailMapRef} style={{width: "100%", height: "300px"}}></div>

            {/* Mostrar los reportes debajo del mapa */}
            <ReporteTransformadores reportes={reportes}/>
        </div>
    );
};

export default ZonaDetail;
