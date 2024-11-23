import React, { useState, useEffect } from "react";
import "../styles/FormularioStyles.css";
import { fetchData, postData, putData } from "../utils/api";
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
        roles: ["USER"], // Valor predeterminado
        propietario_medidor: [
            {
                rol: "OWNER",
                corte_luz: true,
                ver_lectura: true,
                pagar_facturas: true,
                medidor_id: "", // Se completará después de crear el medidor
            },
        ],
    });
    const [medidorFormData, setMedidorFormData] = useState({
        numero_serie: "",
        modelo: "",
        tipo: "",
        latitud: "",
        longitud: "",
    });

    // Cargar datos de la solicitud y la respuesta del reporte
    useEffect(() => {
        const loadData = async () => {
            try {
                // Obtener datos de la solicitud
                const solicitudResponse = await fetchData(`/solicitud/${solicitudId}`);
                setSolicitudData(solicitudResponse);

                // Rellenar campos comunes en el formulario del usuario
                setFormData((prev) => ({
                    ...prev,
                    nombre: solicitudResponse.nombre || "",
                    correo: solicitudResponse.correo || "",
                    apellido: solicitudResponse.apellido || "",
                    ci: solicitudResponse.ci || "",
                    telefono: solicitudResponse.telefono || "",
                }));

                // Obtener datos de la respuesta del reporte
                const respuestaReporteResponse = await fetchData(`/respuesta/${respuestaId}`);
                setRespuestaReporteData(respuestaReporteResponse);

                // Rellenar latitud y longitud en el formulario del medidor
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

    // Manejar cambios en los formularios
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
            // Crear el medidor primero
            const medidorResponse = await postData("/medidores", medidorFormData);
            console.log("Medidor creado:", medidorResponse);

            // Verifica si `medidor_id` está presente en la respuesta
            if (!medidorResponse.medidor_id) {
                throw new Error("El medidor no devolvió un ID válido");
            }

            // Utilizar el medidor_id en propietario_medidor
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

            // Crear el usuario
            const usuarioResponse = await postData("/usuarios", updatedFormData);
            console.log("Usuario creado:", usuarioResponse);

            // Actualizar la solicitud asociada
            const updatedSolicitud = {
                solicitud_id: solicitudId,
                estado: "Completado",
            };

            const solicitudResponse = await putData(`/solicitud/${solicitudId}`, updatedSolicitud);
            console.log("Solicitud actualizada:", solicitudResponse);

            alert("Medidor, Usuario creados y Solicitud actualizada exitosamente");

            // Reiniciar formularios
            setMedidorFormData({
                numero_serie: "",
                modelo: "",
                tipo: "",
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
                {/* Mostrar datos de la solicitud */}
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

                {/* Mostrar datos de la respuesta del reporte */}
                {respuestaReporteData && (
                    <div className="data-card">
                        <h2>Datos de la Respuesta del Reporte</h2>
                        <p><strong>Respuesta:</strong> {respuestaReporteData.respuesta}</p>
                        <p><strong>Descripción:</strong> {respuestaReporteData.descripcion}</p>
                    </div>
                )}
            </div>

            <div className="form-section">
                {/* Formulario para datos del usuario y medidor */}
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
                        <input
                            type="text"
                            name="tipo"
                            value={medidorFormData.tipo}
                            onChange={handleMedidorFormChange}
                            required
                        />
                    </label>
                    <label>
                        Latitud:
                        <input
                            type="text"
                            name="Latitud"
                            value={medidorFormData.latitud}
                            onChange={handleMedidorFormChange}
                            required
                        />
                    </label>
                    <label>
                        Longitud:
                        <input
                            type="text"
                            name="Longitud"
                            value={medidorFormData.longitud}
                            onChange={handleMedidorFormChange}
                            required
                        />
                    </label>
                </div>

                <button onClick={handleCreate}>Crear Cliente y Medidor</button>
            </div>
        </div>
    );
};

export default CrearCliente;
