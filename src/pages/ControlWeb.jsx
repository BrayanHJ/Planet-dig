import { ImageCarousel } from "../Components/ui/cards/ImageCarousel";
import { useEffect, useState } from "react";

export const ControlWeb = () => {
    const [imgSalas, setImgSalas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarSalas = async () => {
            try {
                const response = await fetch('/external-site/salas.json');
                if (!response.ok) throw new Error('Error al cargar salas.json');
                const data = await response.json();
                
                // Convertir el formato de salas.json al formato que espera ImageCarousel
                const salasFormateadas = data.salas.map(sala => ({
                    src: `/external-site/Pagina-Web/${sala.img}`,
                    alt: sala.texto,
                    description: sala.texto,
                    id: sala.id
                }));
                
                setImgSalas(salasFormateadas);
                setError(null);
            } catch (err) {
                console.error('Error cargando salas:', err);
                setError('No se pudieron cargar las salas');
            } finally {
                setLoading(false);
            }
        };

        cargarSalas();
    }, []);

    const imgFunciones = [
        {
            src: "/src/assets/6458e18287853.webp",
            alt: "Función 1",
            description: "Función: Viaje Espacial"
        },
        {
            src: "/src/assets/6458e18287853.webp",
            alt: "Función 2",
            description: "Función: Universo en expansión"
        }
    ];

    const imgHorarios = [
        {
            src: "/src/assets/6458e18287853.webp",
            alt: "Horario 1",
            description: "Lunes a Viernes - 10:00 AM"
        },
        {
            src: "/src/assets/6458e18287853.webp",
            alt: "Horario 2",
            description: "Fines de semana - 12:00 PM"
        }
    ];

//     const actualizarSalas = async (nuevasSalas) => {
//   try {
//     await fetch('/api/salas/actualizar', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ salas: nuevasSalas })
//     });
//     // El backend guardará esto en salas.json
//   } catch (error) {
//     console.error('Error al actualizar salas:', error);
//   }
// };

return (
    <main>
        <h1 className="text-3xl font-bold text-center">
            Página Web <br /> Planetario Digital Chimalhuacán
        </h1>

        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <section>
                    <ImageCarousel 
                        images={imgSalas} 
                        title="Imágenes Salas"
                    />
                    <ImageCarousel images={imgFunciones} title="Imágenes Funciones" />
                    <ImageCarousel images={imgHorarios} title="Imágenes Horarios" />
                </section>
            )}
        </div>
    </main>
    );
};
