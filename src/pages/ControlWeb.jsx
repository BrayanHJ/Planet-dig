import { ImageCarousel } from "../Components/ui/cards/ImageCarousel";

export const ControlWeb = () => {
    const imgSalas = [
        {
            src: "/src/assets/6458e18287853.webp",
            alt: "Sala 1",
            description: "Sala de proyección 1"
        },
        {
            src: "/src/assets/6458e18287853.webp",
            alt: "Sala 2",
            description: "Sala de proyección 2"
        },
        {
            src: "/src/assets/6458e18287853.webp",
            alt: "Sala 2",
            description: "Sala de proyección 2"
        },
        {
            src: "/src/assets/6458e18287853.webp",
            alt: "Sala 2",
            description: "Sala de proyección 2"
        },
        {
            src: "/src/assets/6458e18287853.webp",
            alt: "Sala 2",
            description: "Sala de proyección 2"
        }
    ];

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

        <section>
            <ImageCarousel images={imgSalas} title="Imágenes Salas" />
            <ImageCarousel images={imgFunciones} title="Imágenes Funciones" />
            <ImageCarousel images={imgHorarios} title="Imágenes Horarios" />
        </section>

        </div>
    </main>
    );
};
