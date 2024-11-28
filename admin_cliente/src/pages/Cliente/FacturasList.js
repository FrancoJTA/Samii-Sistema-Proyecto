// src/components/FacturasList.js
import React, { useEffect, useState } from "react";
import { fetchData } from "../../utils/api";

const FacturasList = ({ medidorId }) => {
    const [facturas, setFacturas] = useState([]);

    useEffect(() => {
        const fetchFacturas = async () => {
            if (medidorId) {
                try {
                    const facturasData = await fetchData(`/facturas/${medidorId}`);
                    setFacturas(facturasData);
                } catch (error) {
                    console.error("Error fetching facturas:", error);
                }
            }
        };

        fetchFacturas();
    }, [medidorId]);

    return (
        <div className="facturas-list">
            <h3>Facturas Asociadas</h3>
            {facturas.length > 0 ? (
                <table className="facturas-table">
                    <thead>
                    <tr>
                        <th>Factura ID</th>
                        <th>Consumo</th>
                        <th>Generado</th>
                        <th>SamiiCoins Generados</th>
                        <th>Costo Total</th>
                        <th>Pagada</th>
                        <th>Fecha Emisión</th>
                        <th>Fecha Vencimiento</th>
                        <th>Fecha Pago</th>
                    </tr>
                    </thead>
                    <tbody>
                    {facturas.map((factura) => (
                        <tr key={factura.factura_id}>
                            <td>{factura.factura_id}</td>
                            <td>{factura.consumo}</td>
                            <td>{factura.generado}</td>
                            <td>{factura.gen_samii_coin}</td>
                            <td>{factura.costoTotal}</td>
                            <td>{factura.pagada ? "Sí" : "No"}</td>
                            <td>{new Date(factura.fechaEmision).toLocaleString()}</td>
                            <td>{new Date(factura.fechaVencimiento).toLocaleString()}</td>
                            <td>
                                {factura.pagada
                                    ? new Date(factura.fechaPagado).toLocaleString()
                                    : "No pagada"}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay facturas asociadas a este medidor.</p>
            )}
        </div>
    );
};

export default FacturasList;
