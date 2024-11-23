import React, { useState } from "react";
import "../styles/LogInStyle.css"; // Archivo CSS simplificado

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email:", email, "Password:", password);
        // Aquí manejarás el proceso de autenticación
    };

    return (
        <div className="container">
            <main>
                <div className="welcome-section">
                    <h1>Bienvenido</h1>
                    <p className="italic-text">Por favor llena los datos de administrador para poder ingresar.</p>
                </div>
                <div className="form-section">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="E-MAIL"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        <button type="submit" className="btn-confirm">CONFIRMAR</button>
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
            </main>

        </div>
    );
};

export default Login;
