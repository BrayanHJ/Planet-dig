
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MyRouter } from './Routes/Router.jsx'
import { UseThemStore } from './store/ThemStore.jsx'
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


function App() {
  const queryClient = new QueryClient();
  const { theme } = UseThemStore();
  document.documentElement.classList.toggle("dark", theme === "dark");
  return (
    <QueryClientProvider client={queryClient}>
      <MyRouter />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
export default App;