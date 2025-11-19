import { toast } from "sonner";
import { Icon } from "@iconify/react";

export function showPermanent404Toast() {
    return toast.custom((t) => (
        <div
            style={{
                display: "flex",
                gap: "12px",
                padding: "16px 18px",
                borderRadius: "14px",
                borderLeft: `6px solid #8b5cf6`,
                background: "rgba(255, 255, 255)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                color: "#000",
                alignItems: "flex-start",
                minWidth: "280px",
                userSelect: "none"
            }}
        >
            <Icon
                icon="streamline-freehand:server-error-404-not-found"
                width="32"
                height="32"
                style={{ color: "#8b5cf6", marginTop: "2px" }}
            />

            <div style={{ flex: 1 }}>
                <p style={{ fontWeight: "700", margin: 0 }}>Página no encontrada</p>
                <p style={{ fontSize: "14px", margin: "2px 0", opacity: 0.65 }}>
                    Parece que te perdiste. ¿Qué quieres hacer?
                </p>

                <div style={{ marginTop: "8px", display: "flex", gap: "10px" }}>
                    <button
                        onClick={() => {
                            window.history.back();
                        }}
                        style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            background: "#8b5cf6",
                            color: "#fff",
                            fontWeight: "600"
                        }}
                    >
                        Volver atrás
                    </button>

                    <button
                        onClick={() => {
                            window.location.href = "/";
                        }}
                        style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            background: "#000",
                            color: "#fff",
                            fontWeight: "600"
                        }}
                    >
                        Ir al inicio
                    </button>
                </div>
            </div>
        </div>
    ), {
        duration: Infinity,
        dismissible: false,   // <--- evita que se pueda cerrar
        id: "toast-404"       // <--- evita duplicados
    });
}
