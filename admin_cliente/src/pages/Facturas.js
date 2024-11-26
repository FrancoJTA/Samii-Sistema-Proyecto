import React, { useState, useEffect } from "react";
import "../styles/FacturasStyles.css";
import { fetchData } from "../utils/api";

const Facturas = () => {
    const [facturas, setFacturas] = useState([]);

    useEffect(() => {
        const loadFacturas = async () => {
            try {
                const data = await fetchData("/facturas");
                setFacturas(data);
            } catch (error) {
                console.error("Error fetching facturas:", error);
            }
        };

        loadFacturas();
    }, []);

    return (
        <div className="facturas-container">
            <h1>Listado de Facturas</h1>
            <table className="facturas-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Medidor</th>
                    <th>Consumo</th>
                    <th>Costo Total</th>
                    <th>Fecha Emisión</th>
                    <th>Fecha Vencimiento</th>
                    <th>Estado</th>
                </tr>
                </thead>
                <tbody>
                {facturas.map((factura) => (
                    <tr key={factura.factura_id}>
                        <td>{factura.factura_id}</td>
                        <td>{factura.usuarioId || "No asignado"}</td>
                        <td>{factura.medidorId}</td>
                        <td>{factura.consumo} kWh</td>
                        <td>${factura.costoTotal}</td>
                        <td>{new Date(factura.fechaEmision).toLocaleString()}</td>
                        <td>{new Date(factura.fechaVencimiento).toLocaleString()}</td>
                        <td>{factura.pagada ? "Pagada" : "Pendiente"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Facturas;
