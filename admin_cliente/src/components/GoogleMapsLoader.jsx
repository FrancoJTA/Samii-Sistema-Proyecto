// src/components/GoogleMapsLoader.js
import React, { useEffect } from "react";

const GoogleMapsLoader = ({ onLoad }) => {
    useEffect(() => {
        const existingScript = document.getElementById("googleMaps");

        if (!existingScript) {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAOLAxz2wEyB03oqaPsL__WrVQvVCK8BDA&libraries=places`;
            script.id = "googleMaps";
            script.onload = () => {
                if (onLoad) onLoad();
            };
            document.body.appendChild(script);
        } else {
            if (onLoad) onLoad();
        }
    }, [onLoad]);

    return null;
};

export default GoogleMapsLoader;
