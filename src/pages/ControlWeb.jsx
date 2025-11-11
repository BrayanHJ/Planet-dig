import { ImageCarousel } from "../Components/ui/cards/ImageCarousel";
import { useEffect, useState } from "react";
import { Modalimagenes } from "../Components/ui/Ventanas/Modalimagenes";
import { toast , Toaster } from "sonner";
import {Icon} from '@iconify/react';
import { motion , AnimatePresence } from "framer-motion";

import {imagenWebStore} from '../Store/imagenWebStore.jsx';

export const ControlWeb = () => {

    // Estado para las imágenes mediante Json
    const [imgSalas, setImgSalas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para el modal de edición
    const [modalOpen, setModalOpen] = useState(false);
    const [currentData, setCurrentData] = useState(null);

    const setData = imagenWebStore((state) => state.setData);

    // Estados para el botón flotante
    const [rotado, setRotado] = useState(false);
    const [ newModalOpen , setNewModalOpen] = useState(false);


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
            toast.error('Error cargando salas:', err);
            setError('No se pudieron cargar las salas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarSalas();
    }, []);

    const [imgFunciones, setImgFunciones] = useState([]);
    const [imgActividades, setImgActividades] = useState([]);

    const cargarFunciones = async () => {
        try {
            const response = await fetch('/external-site/funciones.json');
            if (!response.ok) throw new Error('Error al cargar funciones.json');
            const data = await response.json();
            const funcionesFormateadas = data.dias.map(dia => ({
                src: `/external-site/Pagina-Web/${dia.img}`,
                alt: dia.texto,
                description: dia.texto,
                id: dia.id
            }));
            setImgFunciones(funcionesFormateadas);
        } catch (err) {
            console.error('Error cargando funciones:', err);
            setImgFunciones([]);
        }
    };

    const cargarActividades = async () => {
        try {
            const response = await fetch('/external-site/actividades.json');
            if (!response.ok) throw new Error('Error al cargar actividades.json');
            const data = await response.json();
            const actividadesFormateadas = data.actividades.map(actividad => ({
                src: `/external-site/Pagina-Web/${actividad.img}`,
                alt: actividad.titulo,
                description: actividad.descripcion,
                id: actividad.id
            }));
            setImgActividades(actividadesFormateadas);
        } catch (err) {
            console.error('Error cargando actividades:', err);
            setImgActividades([]);
        }
    };

    const recargarDatos = () => {
        cargarSalas();
        cargarFunciones();
        cargarActividades();
        toast.success('Datos actualizados');
    };

    // Efectos para cargar datos iniciales
    useEffect(() => {
        cargarFunciones();
    }, []);

    useEffect(() => {
        cargarActividades();
    }, []);

// Abrir modal de edición para el slide
const handleEdit = (slide, type) => {
    setCurrentData({
        ...slide,
        type, // 'salas', 'funciones', o 'actividades'
        operacion: 'editar'
    });
    setModalOpen(true);
};

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
                          onEdit={(i) => handleEdit(imgSalas[i], 'salas')}
                      />
                      <ImageCarousel 
                          images={imgFunciones} 
                          title="Imágenes Funciones"
                          onEdit={(i) => handleEdit(imgFunciones[i], 'funciones')}
                      />
                      <ImageCarousel 
                          images={imgActividades} 
                          title="Imágenes Actividades"
                          onEdit={(i) => handleEdit(imgActividades[i], 'actividades')}
                      />
                  </section>
              )}
          </div>

          <section className="relative inset-0 flex items-center justify-center z-70 ">
              <motion.button className="bg-green-900 text-amber-50 rounded-full p-2 fixed bottom-8 right-8 shadow-lg hover:bg-green-700 transition-all text-4xl  cursor-pointer mb-12"
              animate={{ rotate: rotado ? -320 : 0, 
                        scale: rotado ? 1.5 : 1
                      }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              onClick={() => 
                {const next = !rotado;
                setRotado(next);
                setNewModalOpen(next);}
                } 
              >
                  <Icon icon="line-md:plus" />
              </motion.button>
          </section>
          <AnimatePresence mode="await">
            {newModalOpen && (
                <motion.section className="fixed bottom-4 right-20 z-50 flex"
                initial={{  x: 500 }}
                animate={{ x: 0 }}
                exit={{ x: 500 }}
                transition={{ duration: 1.5 }}
                >
                  <div className=" flex-col justify-center items-center p-4 border-2 bg-bg-dark border-blue-500 rounded-lg w-sm h-36 mb-6 mr-5">
                    <h2 className="text-2xl font-bold mb-5">Agregar Nueva:</h2>
                    <section className="flex justify-between gap-5">
                      <select name="Nuevo" id="CrearNuevo" className="border border-gray-300 rounded-md p-2 cursor-pointer bg-bg-dark w-sm">
                        <option value="Sala">Sala</option>
                        <option value="Funcion">Funcion</option>
                        <option value="Actividad">Actividad</option>
                      </select>
                      <button className="bg-blue-500 w-sm text-white rounded-md cursor-pointer"
                      onClick={() => {
                        const tipo = document.getElementById('CrearNuevo').value.toLowerCase();
                        setCurrentData({
                          operacion: 'nuevo',
                          type: tipo
                        });
                        setModalOpen(true);
                        setRotado(false);
                        setNewModalOpen(false);
                      }}
                      >
                        Aceptar
                      </button>
                    </section>
                  </div>
                </motion.section>
            )}
          </AnimatePresence>

          <Modalimagenes 
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              data={currentData}
              onUpdate={recargarDatos}
          />
          <Toaster/>
    </main>
    );
};
