import React, { useState, useEffect } from "react";
import "../../styles/FormularioStyles.css";
import { fetchData, postData, putData } from "../../utils/api";
import { useParams } from "react-router-dom";

const CrearCliente = () => {
    const { solicitudId, respuestaId } = useParams();
    const [solicitudData, setSolicitudData] = useState(null);
    const [respuestaReporteData, setRespuestaReporteData] = useState(null);
    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        apellido: "",
        ci: "",
        telefono: "",
        roles: ["USER"],
        propietario_medidor: [
            {
                rol: "OWNER",
                corte_luz: true,
                ver_lectura: true,
                pagar_facturas: true,
                medidor_id: "",
            },
        ],
    });
    const [medidorFormData, setMedidorFormData] = useState({
        numero_serie: "",
        modelo: "",
        tipo: "",
        name: generateMedidorName(), // Generar automáticamente
        latitud: "",
        longitud: "",
    });

    // Función para generar el nombre del medidor
    function generateMedidorName() {
        const randomString = Math.random().toString(36).substring(2, 6).toUpperCase(); // Genera 4 caracteres aleatorios
        return `Medidor-${randomString}`;
    }

    // Cargar datos de la solicitud y la respuesta del reporte
    useEffect(() => {
        const loadData = async () => {
            try {
                const solicitudResponse = await fetchData(`/solicitud/${solicitudId}`);
                setSolicitudData(solicitudResponse);

                setFormData((prev) => ({
                    ...prev,
                    nombre: solicitudResponse.nombre || "",
                    correo: solicitudResponse.correo || "",
                    apellido: solicitudResponse.apellido || "",
                    ci: solicitudResponse.ci || "",
                    telefono: solicitudResponse.telefono || "",
                }));

                const respuestaReporteResponse = await fetchData(`/respuesta/${respuestaId}`);
                setRespuestaReporteData(respuestaReporteResponse);

                setMedidorFormData((prev) => ({
                    ...prev,
                    latitud: solicitudResponse.latitud || "",
                    longitud: solicitudResponse.longitud || "",
                }));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        loadData();
    }, [solicitudId, respuestaId]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMedidorFormChange = (e) => {
        const { name, value } = e.target;
        setMedidorFormData({ ...medidorFormData, [name]: value });
    };

    const handleCreate = async () => {
        try {
            const medidorResponse = await postData("/medidores", medidorFormData);
            console.log("Medidor creado:", medidorResponse);

            if (!medidorResponse.medidor_id) {
                throw new Error("El medidor no devolvió un ID válido");
            }

            const updatedFormData = {
                ...formData,
                propietario_medidor: [
                    {
                        ...formData.propietario_medidor[0],
                        medidor_id: medidorResponse.medidor_id,
                    },
                ],
            };

            console.log("Usuario a enviar:", JSON.stringify(updatedFormData));

            const usuarioResponse = await postData("/usuarios", updatedFormData);
            console.log("Usuario creado:", usuarioResponse);

            const updatedSolicitud = {
                solicitud_id: solicitudId,
                estado: "Completado",
            };

            const solicitudResponse = await putData(`/solicitud/${solicitudId}`, updatedSolicitud);
            console.log("Solicitud actualizada:", solicitudResponse);

            alert("Medidor, Usuario creados y Solicitud actualizada exitosamente");

            setMedidorFormData({
                numero_serie: "",
                modelo: "",
                tipo: "",
                name: generateMedidorName(),
                latitud: "",
                longitud: "",
            });

            setFormData({
                nombre: "",
                correo: "",
                apellido: "",
                ci: "",
                telefono: "",
                roles: ["USER"],
                propietario_medidor: [
                    {
                        rol: "OWNER",
                        corte_luz: "1",
                        ver_lectura: "1",
                        pagar_facturas: "1",
                        medidor_id: "",
                    },
                ],
            });
        } catch (error) {
            console.error("Error creating medidor, usuario, or updating solicitud:", error);
            alert("Error al crear el medidor, usuario o actualizar la solicitud");
        }
    };

    return (
        <div className="crear-cliente-container">
            <h1>Crear Cliente</h1>

            <div className="data-section">
                {solicitudData && (
                    <div className="data-card">
                        <h2>Datos de la Solicitud</h2>
                        <p><strong>Nombre:</strong> {solicitudData.nombre}</p>
                        <p><strong>Correo:</strong> {solicitudData.correo}</p>
                        <p><strong>Apellido:</strong> {solicitudData.apellido}</p>
                        <p><strong>CI:</strong> {solicitudData.ci}</p>
                        <p><strong>Teléfono:</strong> {solicitudData.telefono}</p>
                        <p><strong>Latitud:</strong> {solicitudData.latitud}</p>
                        <p><strong>Longitud:</strong> {solicitudData.longitud}</p>
                    </div>
                )}
                {respuestaReporteData && (
                    <div className="data-card">
                        <h2>Datos de la Respuesta del Reporte</h2>
                        <p><strong>Respuesta:</strong> {respuestaReporteData.respuesta}</p>
                        <p><strong>Descripción:</strong> {respuestaReporteData.descripcion}</p>
                    </div>
                )}
            </div>

            <div className="form-section">
                <div className="form-card">
                    <h2>Datos del Usuario</h2>
                    <label>
                        Nombre:
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleFormChange}
                            required
                        />
                    </label>
                    <label>
                        Correo:
                        <input
                            type="email"
                            name="correo"
                            value={formData.correo}
                            onChange={handleFormChange}
                            required
                        />
                    </label>
                    <label>
                        Apellido:
                        <input
                            type="text"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleFormChange}
                            required
                        />
                    </label>
                    <label>
                        CI:
                        <input
                            type="text"
                            name="ci"
                            value={formData.ci}
                            onChange={handleFormChange}
                            required
                        />
                    </label>
                    <label>
                        Teléfono:
                        <input
                            type="text"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleFormChange}
                            required
                        />
                    </label>
                </div>

                <div className="form-card">
                    <h2>Datos del Medidor</h2>
                    <label>
                        Nombre del Medidor:
                        <label style={{ display: "block", fontWeight: "bold", padding: "5px" }}>
                            {medidorFormData.name}
                        </label>
                    </label>
                    <label>
                        Número de Serie:
                        <input
                            type="text"
                            name="numero_serie"
                            value={medidorFormData.numero_serie}
                            onChange={handleMedidorFormChange}
                            required
                        />
                    </label>
                    <label>
                        Modelo:
                        <input
                            type="text"
                            name="modelo"
                            value={medidorFormData.modelo}
                            onChange={handleMedidorFormChange}
                            required
                        />
                    </label>
                    <label>
                        Tipo:
                        <select
                            name="tipo"
                            value={medidorFormData.tipo}
                            onChange={handleMedidorFormChange}
                            required
                        >
                            <option value="" disabled>
                                Seleccionar tipo
                            </option>
                            <option value="bidireccional">Bidireccional</option>
                            <option value="unidireccional">Unidireccional</option>
                        </select>
                    </label>
                </div>

                <button onClick={handleCreate}>Crear Cliente y Medidor</button>
            </div>
        </div>
    );
};

export default CrearCliente;
