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

    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpValid, setIsOtpValid] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMapSelect = (coordinates) => {
        setFormData((prev) => ({
            ...prev,
            latitud: coordinates.lat.toFixed(6),
            longitud: coordinates.lng.toFixed(6),
        }));
    };

    const handleSendOtp = async () => {
        const apiUrl = "http://localhost:8080/solicitud/send-otp";
        setIsLoading(true); // Mostrar pantalla de carga
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo: formData.correo }),
            });
            setIsLoading(false); // Ocultar pantalla de carga
            if (response.ok) {
                setIsOtpSent(true);
                setShowOtpModal(true);
            } else {
                alert("Error al enviar OTP.");
            }
        } catch (error) {
            setIsLoading(false); // Ocultar pantalla de carga en caso de error
            alert("Error al enviar OTP.");
            console.error(error);
        }
    };

    const handleValidateOtp = async () => {
        const apiUrl = "http://localhost:8080/solicitud/validate-otp";
        setIsLoading(true); // Mostrar pantalla de carga
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo: formData.correo, otp }),
            });
            setIsLoading(false); // Ocultar pantalla de carga
            if (response.ok) {
                setIsOtpValid(true);
                setShowOtpModal(false);
                handleSubmit();
            } else {
                alert("OTP inválido.");
            }
        } catch (error) {
            setIsLoading(false); // Ocultar pantalla de carga en caso de error
            alert("Error al validar OTP.");
            console.error(error);
        }
    };

    const handleSubmit = async () => {
        const apiUrl = "http://localhost:8080/solicitud";
        setIsLoading(true); // Mostrar pantalla de carga
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            setIsLoading(false); // Ocultar pantalla de carga
            if (response.ok) {
                const data = await response.json();
                alert("Solicitud enviada con éxito.");
                console.log("Respuesta del servidor:", data);
                setFormData({
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
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || "Intenta nuevamente."}`);
            }
        } catch (error) {
            setIsLoading(false); // Ocultar pantalla de carga en caso de error
            alert("Ocurrió un error. Intenta nuevamente.");
            console.error(error);
        }
    };

    return (
        <div className="container">
            {isLoading && ( // Pantalla de carga circular sin ocultar contenido
                <div className="spinner-overlay">
                    <div className="spinner"></div>
                </div>
            )}
                <>
                    <h1>Solicitud de Instalación</h1>
                    <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
                        <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} required />
                        <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} rows="4" required />
                        <input type="email" name="correo" placeholder="Correo electrónico" value={formData.correo} onChange={handleChange} required />
                        <input type="text" name="ci" placeholder="Cédula de identidad" value={formData.ci} onChange={handleChange} required />
                        <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} required />
                        <Map onCoordinatesSelect={handleMapSelect} />
                        <input type="text" name="latitud" placeholder="Latitud" value={formData.latitud} readOnly />
                        <input type="text" name="longitud" placeholder="Longitud" value={formData.longitud} readOnly />
                        <button type="button" onClick={handleSendOtp}>
                            Enviar Solicitud
                        </button>
                    </form>
                </>
            {showOtpModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Ingresa el Código OTP</h2>
                        <div className="otp-inputs">
                            <input
                                type="text"
                                maxLength="6"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="000000"
                                required
                            />
                        </div>
                        <button onClick={handleValidateOtp}>Validar OTP</button>
                        <button onClick={() => setShowOtpModal(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}
