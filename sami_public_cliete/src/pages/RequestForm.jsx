import { useState } from "react";
import Map from "../components/Map.jsx";

export default function RequestForm() {
    const [formData, setFormData] = useState({
        tipo: "Instalacion",
        descripcion: "",
        estado: "",
        nombre: "",
        apellido: "",
        correo: "",
        ci: "",
        telefono: "",
        latitud: "",
        longitud: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMapSelect = (coordinates) => {
        setFormData({
            ...formData,
            latitud: coordinates.lat.toFixed(6),
            longitud: coordinates.lng.toFixed(6),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // URL de la API donde se enviará el POST
        const apiUrl = "http://localhost:8080/solicitud "; // Reemplaza con tu URL real

        try {
            // Realiza el POST a la API
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Especifica que estás enviando JSON
                },
                body: JSON.stringify(formData), // Convierte los datos del formulario a JSON
            });

            // Verifica si la respuesta fue exitosa
            if (response.ok) {
                const data = await response.json(); // Opcional: procesa la respuesta del servidor
                alert("Solicitud enviada con éxito.");
                console.log("Respuesta del servidor:", data);
            } else {
                const errorData = await response.json();
                alert(`Error al enviar la solicitud: ${errorData.message || "Intenta nuevamente."}`);
            }
        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
            alert("Ocurrió un error al enviar la solicitud. Por favor, intenta nuevamente.");
        }
    };


    return (
        <div className="container">
            <h1>Solicitud de Instalación</h1>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="apellido"
                    placeholder="Apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="descripcion"
                    placeholder="Descripción"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows="4"
                    required
                ></textarea>
                <input
                    type="email"
                    name="correo"
                    placeholder="Correo electrónico"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="ci"
                    placeholder="Cédula de identidad"
                    value={formData.ci}
                    onChange={handleChange}
                    required
                />
                <input
                    type="tel"
                    name="telefono"
                    placeholder="Teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                />
                {/* Mapa */}
                <Map onCoordinatesSelect={handleMapSelect} />
                {/* Coordenadas */}
                <input
                    type="text"
                    name="latitud"
                    placeholder="Latitud"
                    value={formData.latitud}
                    onChange={handleChange}
                    readOnly
                />
                <input
                    type="text"
                    name="longitud"
                    placeholder="Longitud"
                    value={formData.longitud}
                    onChange={handleChange}
                    readOnly
                />
                <button type="submit">Enviar Solicitud</button>
            </form>
        </div>
    );
}
