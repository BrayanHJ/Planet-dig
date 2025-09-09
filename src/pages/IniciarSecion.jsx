import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const IniciarSecion = () => {
    const [usuario, setUsuario] = useState("");
    const [edad, setEdad] = useState("");
    const [contrasena, setContrasena] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!usuario) {
            alert("El campo Usuario es obligatorio");
            return;
        }
        if (!edad) {
            alert("El campo Edad es obligatorio");
            return;
        }
        if (!contrasena) {
            alert("El campo Contraseña es obligatorio");
            return;
        }
        // Aquí envías los datos al servidor
        try {
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario, edad, contrasena }),
            });
            const data = await response.json();
            if (data.success) {
                alert(data.mensaje);
                navigate("/succes");
            }

            if (data.success) {
                navigate("/Succes"); // Redirige si la validación es exitosa
            } else {
                alert("Usuario incorrecto");
            }
        } catch (error) {
            alert("Error de conexión");
        }
    };

    return (
        <main className="flex items-center justify-center
            text-white bg-blue-950 dark:text-white min-h-screen w-full flex-col text-center">
            <h1 className="text-4xl font-bold mb-4">Iniciar Seción</h1>
            <div className="bg-white dark:bg-bg-dark p-8 rounded-lg shadow-md w-full max-w-md  flex justify-center align-center text-black dark:text-white text-center mb-2">
                <form onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium text-yellow-500">Usuario</label>
                    <br />
                    <input type="text" placeholder="Usuario" value={usuario} onChange={e => setUsuario(e.target.value)} name="usuario" />
                    <br />
                    <label className="block text-sm font-medium text-yellow-500">Edad</label>
                    <br />
                    <input type="date" placeholder="Edad" value={edad} onChange={e => setEdad(e.target.value)} name="edad" />
                    <br />
                    <label className="block text-sm font-medium text-yellow-500 ">Contraseña</label>
                    <br />
                    <input type="password" placeholder="Contraseña" value={contrasena} onChange={e => setContrasena(e.target.value)} name="contrasena" />
                    <br />
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4">Iniciar Seción</button>
                </form>
            </div>
            <br />
            <p>
                link de inicio exitoso , deve enviar mesaje por consola De momento
            </p>
            <Link to={`/succes`} className="text-blue-500 hover:underline"> succes</Link> <br />
        </main>
    );
}