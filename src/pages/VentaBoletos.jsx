import { ModalVenta } from "../Components/ui/Ventanas/ModalVenta";

export const VentaBoletos = () => {
    return (
        <main className="dark:bg-bg-dark max-w-[1200px] mx-auto flex flex-col gap-4 p-4 justify-between">

            <h1 className="text-7xl justify-center text-center mb-15">Venta de Boletos</h1>

            <div className="flex flex-col justify-center items-center bg-black/50 text-white rounded-3xl">

                <h1 className="justify-center text-center mb-8 text-5xl">Boletos</h1>

                <section className="flex flex-col gap-4 p-4 w-full">

                    <div className="flex flex-row justify-between max-w-full">
                        <h2 className="text-2xl"> Boletos Individuales 20 </h2>
                        <span className="text-2xl">$ 30</span>
                    </div>
                    <div className="flex flex-row justify-between max-w-full">
                        <h2 className="text-2xl"> Boletos Individuales 20 </h2>
                        <span className="text-2xl">$ 30</span>
                    </div>
                    <div className="flex flex-row justify-between max-w-full">
                        <h2 className="text-2xl"> Boletos Individuales 20 </h2>
                        <span className="text-2xl">$ 30</span> 
                    </div>

                </section>
            </div>

            <div className="mx-auto flex flex-row gap-4 p-4 justify-between w-full">
                <button className="cursor-pointer bg-blue-600 rounded-2xl font-bold w-2/6">Aceptar</button>
                <button className="cursor-pointer bg-purple-700 rounded-2xl font-bold w-2/6">Agregar</button>
                <section>
                    <h2 className="text-2xl">Total</h2>
                    <p className="text-2xl">$ 60</p>
                </section>
            </div>

            <ModalVenta/>
            
        </main>
    );
}