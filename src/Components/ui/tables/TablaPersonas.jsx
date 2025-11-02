import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import 'datatables.net-select-dt';
import 'datatables.net-buttons';                  // Botones funcionales
import 'datatables.net-buttons/js/buttons.html5.js'; // Botón Excel
import 'datatables.net-buttons-dt/css/buttons.dataTables.css'; // Estilos botones
import 'datatables.net-dt/css/dataTables.dataTables.css';
import JSZip from 'jszip';

DataTable.use(DT);

const columns = [
  { title: 'Name' },
  { title: 'Position' },
  { title: 'Office' },
  { title: 'Extn.' },
  { title: 'Start date' },
  { title: 'Salary' },
];

const data = [
    ['Tiger Nixon', 'System Architect', 'Edinburgh', '5421', '2011/04/25', '$320,800'],
    ['Garrett Winters', 'Accountant', 'Tokyo', '8422', '2011/07/25', '$170,750'],
    ['Ashton Cox', 'Junior Technical Author', 'San Francisco', '1562', '2009/01/12', '$86,000'],
    ['Cedric Kelly', 'Senior Javascript Developer', 'Edinburgh', '6224', '2012/03/29', '$433,060'],
    ['Airi Satou', 'Accountant', 'Tokyo', '5407', '2008/11/28', '$162,700'],
    ['Brielle Williamson', 'Integration Specialist', 'New York', '4804', '2012/12/02', '$372,000'],
    ['Herrod Chandler', 'Sales Assistant', 'San Francisco', '9608', '2012/08/06', '$137,500'],
    ['Rhona Davidson', 'Integration Specialist', 'Tokyo', '6200', '2010/10/14', '$327,900'],
    ['Colleen Hurst', 'Javascript Developer', 'San Francisco', '2360', '2009/09/15', '$205,500'],
    ['Sonya Frost', 'Software Engineer', 'Edinburgh', '1667', '2008/12/13', '$103,600'],
    ['Jena Gaines', 'Office Manager', 'London', '3814', '2008/12/19', '$90,560'],
    ['Quinn Flynn', 'Support Lead', 'Edinburgh', '9497', '2013/03/03', '$342,000'],
    ['Charde Marshall', 'Regional Director', 'San Francisco', '6741', '2008/10/16', '$470,600'],
    ['Haley Kennedy', 'Senior Marketing Designer', 'London', '3597', '2012/12/18', '$313,500'],
    ['Tatyana Fitzpatrick', 'Regional Director', 'London', '1965', '2010/03/17', '$385,750'],
];

function TablaUser() {
  return (
    <div className="p-6 min-h-screen">
      <div className="shadow-md rounded-lg p-4">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Lista de Usuarios 👥
        </h2>

        <div className="overflow-x-auto">
          <DataTable
            data={data}
            columns={columns}
            className="display w-full text-sm border-gray-200 text-white rounded-md"
            options={{
              responsive: true,
              select: true,
              pagingType: 'simple_numbers',
              language: {
                search: '🔍 Buscar:',
                lengthMenu: 'Mostrar _MENU_ registros',
                info: 'Mostrando _START_ a _END_ de _TOTAL_ entradas',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default TablaUser;
