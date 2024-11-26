import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { requestOtp, verifyOtp } from "../utils/api";
import "../styles/LogInStyle.css";

Modal.setAppElement("#root");

const Login = () => {
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await requestOtp(correo, password);
            alert(response); // Notifica al usuario
            setIsOtpModalOpen(true); // Abre el modal para OTP
        } catch (error) {
            alert("Error al solicitar OTP: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await verifyOtp(correo, otp);
            if (response === "Autenticación exitosa.") {
                localStorage.setItem("isAuthenticated", "true");
                alert("Login exitoso");
                setIsOtpModalOpen(false);
                navigate("/panel"); // Redirige al panel
            } else {
                alert("Error: " + response);
            }
        } catch (error) {
            alert("Error al verificar OTP: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <main>
                <div className="welcome-section">
                    <h1>Bienvenido</h1>
                    <p className="italic-text">
                        Por favor llena los datos de administrador para poder ingresar.
                    </p>
                </div>
                <div className="form-section">
                    <form className="login-form" onSubmit={handleLoginSubmit}>
                        <input
                            type="email"
                            placeholder="E-MAIL"
                            className="input-field"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="PASSWORD"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn-confirm" disabled={isLoading}>
                            {isLoading ? "Cargando..." : "CONFIRMAR"}
                        </button>
                    </form>
                </div>
                <div className="wave">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1440 320"
                        preserveAspectRatio="none"
                    >
                        <path
                            fill="#909090"
                            fill-opacity="1"
                            d="M0,160L48,144C96,128,192,96,288,101.3C384,107,480,149,576,181.3C672,213,768,235,864,229.3C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        ></path>
                    </svg>
                </div>
                <Modal
                    isOpen={isOtpModalOpen}
                    onRequestClose={() => setIsOtpModalOpen(false)}
                    contentLabel="OTP Verification"
                    className="otp-modal"
                    overlayClassName="otp-overlay"
                >
                    <h2>Verificar OTP</h2>
                    <form onSubmit={handleOtpSubmit}>
                        <input
                            type="text"
                            placeholder="Ingrese OTP"
                            className="input-field"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn-confirm" disabled={isLoading}>
                            {isLoading ? "Verificando..." : "VALIDAR OTP"}
                        </button>
                    </form>
                </Modal>
            </main>
        </div>
    );
};

export default Login;
