import { toast } from "sonner";
import { Icon } from "@iconify/react/dist/iconify.js";

export function showToast({ severity, summary, detail, life = 3000 }) {

    const iconMap = {
        success: {
            icon: "line-md:confirm-circle-twotone",
            color: "#22c55e"
        },
        error: {
            icon: "line-md:close-circle-twotone",
            color: "#ef4444"
        },
        info: {
            icon: "line-md:alert-circle-twotone-loop",
            color: "#3b82f6"
        },
        warn: {
            icon: "line-md:alert-twotone",
            color: "#eab308"
        },
        warning: {
            icon: "line-md:alert-twotone",
            color: "#eab308"
        },
    };

    const config = iconMap[severity] || iconMap.info;

    return toast.custom((t) => (
        <div
            style={{
                display: "flex",
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "14px",
                borderLeft: `6px solid ${config.color}`,
                background: "rgba(255, 255, 255)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                color: "#000",
                alignItems: "flex-start",
                position: "relative",
                minWidth: "260px",
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none"
            }}
        >
            {/* Icono izquierdo */}
            <Icon
                icon={config.icon}
                width="28"
                height="28"
                style={{ color: config.color, marginTop: "2px" }}
            />

            {/* Contenido */}
            <div style={{ flex: 1 }}>
                <p style={{ fontWeight: "600", margin: 0 }}>{summary}</p>
                <p
                    style={{
                        fontSize: "14px",
                        margin: 0,
                        opacity: 0.65
                    }}
                >
                    {detail}
                </p>
            </div>

            {/* Botón cerrar */}
            <button
                onClick={() => toast.dismiss(t)}
                style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "0 4px",
                    opacity: 0.7,
                    display: "flex",
                    alignItems: "center"
                }}
            >
                <Icon
                    icon="line-md:close-small"
                    width="22"
                    height="22"
                    style={{ color: "#000" }}
                />
            </button>
        </div>
    ), { duration: life });
}
