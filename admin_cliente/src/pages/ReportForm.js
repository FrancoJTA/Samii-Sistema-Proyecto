// ReportForm.js
import React from "react";

const ReportForm = ({ formData, onFormChange, onFormSubmit, reportTypes }) => {
    return (
        <div className="report-form">
            <h3>Crear Reporte</h3>
            <form onSubmit={onFormSubmit}>
                <div>
                    <label>Tipo de Reporte:</label>
                    <select
                        name="tipo"
                        value={formData.tipo}
                        onChange={onFormChange}
                    >
                        {reportTypes.map((type, index) => (
                            <option key={index} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Descripción:</label>
                    <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={onFormChange}
                    />
                </div>
                <button type="submit">Crear Reporte</button>
            </form>
        </div>
    );
};

export default ReportForm;
