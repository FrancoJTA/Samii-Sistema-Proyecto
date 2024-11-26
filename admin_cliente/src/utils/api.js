const API_BASE_URL = "http://localhost:8080";

export const fetchData = async (endpoint) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const postData = async (endpoint, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Verificar si la respuesta es texto o JSON
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json(); // Procesar como JSON
        } else {
            return await response.text(); // Procesar como texto
        }
    } catch (error) {
        console.error("Error posting data:", error);
        throw error;
    }
};

export const putData = async (endpoint, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error putting data:", error);
        throw error;
    }
};

export const deleteData = async (endpoint) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error deleting data:", error);
        throw error;
    }
};

// Método para solicitar OTP
export const requestOtp = async (correo, password) => {
    try {
        const response = await postData("/auth/login/admin", { correo, password });
        return response; // Respuesta del backend (puede incluir un mensaje o un ID de sesión)
    } catch (error) {
        console.error("Error requesting OTP:", error);
        throw error;
    }
};

// Método para verificar OTP
export const verifyOtp = async (correo, otp) => {
    try {
        const response = await postData("/auth/verify-otp   ", { correo, otp });
        return response; // Respuesta del backend (puede incluir un token de autenticación)
    } catch (error) {
        console.error("Error verifying OTP:", error);
        throw error;
    }
};