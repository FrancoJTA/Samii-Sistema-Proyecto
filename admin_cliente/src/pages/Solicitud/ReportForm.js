// ReportForm.js
import React from "react";

const ReportForm = ({ formData, onFormChange, onFormSubmit }) => {
    return (
        <div className="report-form">
            <h3>Crear Reporte</h3>
            <form onSubmit={onFormSubmit}>
                {/* Campo de tipo de reporte mostrado como un label */}
                <div>
                    <label>
                        <label>Tipo de Reporte:</label>
                        <p><strong>{formData.tipo}</strong></p>
                    </label>
                </div>
                <div>
                    <label>Descripción:</label>
                    <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={onFormChange}
                        required
                    />
                </div>
                <button type="submit">Crear Reporte</button>
            </form>
        </div>
    );
};

export default ReportForm;
