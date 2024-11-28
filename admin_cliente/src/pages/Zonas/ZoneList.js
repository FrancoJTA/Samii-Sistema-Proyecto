import React from "react";

const ZonasList = ({ zonas, onSelectZona, onEditZona, onCreateZona }) => {
    return (
        <div className="zonas-list">
            <h2>Lista de Zonas</h2>
            <button onClick={onCreateZona} className="create-zona-button">
                Crear Nueva Zona
            </button>
            <div className="zonas-items-container">
                {zonas.map((zona) => (
                    <div
                        key={zona.zona_id}
                        className="zona-item"
                        onClick={() => onSelectZona(zona)}
                    >
                        <span className="zona-name">{zona.name}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEditZona(zona);
                            }}
                            className="edit-zona-button"
                        >
                            Editar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ZonasList;
