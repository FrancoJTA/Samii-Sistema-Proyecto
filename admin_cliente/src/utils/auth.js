const TOKEN_KEY = "authToken";

export const login = async (credentials) => {
    const response = await fetch("https://api.example.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        throw new Error("Login failed!");
    }

    const { token } = await response.json();
    localStorage.setItem(TOKEN_KEY, token);
    return token;
};

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
    return !!localStorage.getItem(TOKEN_KEY);
};
