

export const TableTarea = () => {
    return (
        <main className="flex justify-center mt-11">
            <table className="w-11/12 rounded-3xl">
                <thead className="bg-red-500 text-white ">
                    <tr >
                    <th >Tarea</th>
                    <th >Descripcion</th>
                    <th >inicio</th>
                    <th >Fin</th>
                    <th >Estado</th>
                    </tr>
                </thead>
                <tbody className="bg-Primary text-black">
                    <tr>
                        <td>Juan</td>
                        <td>25</td>
                        <td >juan@mail.com</td>
                        <td >juan@mail.com</td>
                        <td >juan@mail.com</td>
                    </tr>

                    <tr>
                    <td >María</td>
                    <td >30</td>
                    <td >juan@mail.com</td>
                    <td >juan@mail.com</td>
                    <td >maria@mail.com</td>
                    </tr>
                </tbody>
            </table>
        </main>
    );
}