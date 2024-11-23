import React, { useState } from "react";
import "../styles/MonitorStyle.css"

const UserManagement = () => {
    const [users, setUsers] = useState([
        { id: 1, name: "Usuario 1", email: "usuario1@example.com", role: "Admin" },
        { id: 2, name: "Usuario 2", email: "usuario2@example.com", role: "User" },
        { id: 3, name: "Usuario 3", email: "usuario3@example.com", role: "Guest" },
    ]); // Lista inicial de usuarios
    const [roles, setRoles] = useState(["All", "Admin", "User", "Guest"]); // Valores dinámicos del combo box
    const [selectedRole, setSelectedRole] = useState("All"); // Filtro seleccionado
    const [formData, setFormData] = useState({ name: "", email: "", role: "User" });
    const [editId, setEditId] = useState(null); // Identifica el usuario que se está editando
    const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Manejar cambios en el buscador
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Manejar cambios en el combo box
    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    // Agregar un nuevo usuario
    const handleAddUser = () => {
        if (formData.name && formData.email) {
            const newUser = {
                id: Date.now(), // Genera un ID único
                ...formData,
            };
            setUsers([...users, newUser]); // Actualiza la lista
            setFormData({ name: "", email: "", role: "User" }); // Limpia el formulario
        }
    };

    // Editar un usuario
    const handleEditUser = (id) => {
        const userToEdit = users.find((user) => user.id === id);
        setFormData(userToEdit);
        setEditId(id); // Marca el usuario en edición
    };

    // Guardar los cambios del usuario editado
    const handleSaveUser = () => {
        setUsers(
            users.map((user) =>
                user.id === editId ? { ...user, ...formData } : user
            )
        );
        setEditId(null); // Limpia el estado de edición
        setFormData({ name: "", email: "", role: "User" }); // Limpia el formulario
    };

    // Eliminar un usuario
    const handleDeleteUser = (id) => {
        setUsers(users.filter((user) => user.id !== id));
    };

    // Filtrar usuarios por nombre y rol seleccionado
    const filteredUsers = users
        .filter((user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((user) => {
            if (selectedRole === "All") return true;
            return user.role === selectedRole;
        });

    return (
        <div className="user-management">
            <h1>Gestión de Usuarios</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <select value={selectedRole} onChange={handleRoleChange}>
                    {roles.map((role) => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form">
                <input
                    type="text"
                    name="name"
                    placeholder="Nombre"
                    value={formData.name}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Correo Electrónico"
                    value={formData.email}
                    onChange={handleChange}
                />
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                >
                    {roles
                        .filter((role) => role !== "All") // Excluye "All" del formulario
                        .map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                </select>
                {editId ? (
                    <button onClick={handleSaveUser}>Guardar Cambios</button>
                ) : (
                    <button onClick={handleAddUser}>Agregar Usuario</button>
                )}
            </div>

            <ul className="user-list">
                {filteredUsers.map((user) => (
                    <li key={user.id} className="user-item">
                        <span>{user.name}</span>
                        <span>{user.email}</span>
                        <span>{user.role}</span>
                        <div>
                            <button onClick={() => handleEditUser(user.id)}>
                                Editar
                            </button>
                            <button onClick={() => handleDeleteUser(user.id)}>
                                Eliminar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserManagement;
