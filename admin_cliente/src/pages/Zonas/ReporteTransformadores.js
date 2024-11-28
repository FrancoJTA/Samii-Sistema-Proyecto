// src/components/ReporteTransformadores.js
import React from "react";

const ReporteTransformadores = ({ reportes }) => {
    if (!reportes || reportes.length === 0) {
        return <p>No hay reportes de transformadores disponibles para esta zona.</p>;
    }

    return (
        <div className="reporte-transformadores">
            <h3>Reportes de Transformadores</h3>
            <ul>
                {reportes.map((reporte, index) => (
                    <li key={index}>
                        <p><strong>Estado:</strong> {reporte.estado}</p>
                        <p><strong>Consumo Total:</strong> {reporte.incrementoPotencia}</p>
                        <p><strong>Fecha:</strong> {new Date(reporte.horaPico).toLocaleDateString()}</p>
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReporteTransformadores;
