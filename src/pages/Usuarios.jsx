import TablaUser from "../Components/ui/tables/TablaUsuarios";
import PieChart from "../Components/ui/Graphics/PieChart";
import AnimatedPage from "../Components/Animations/AnimatedPage";

export const Usuarios = () => {
    return (
        <AnimatedPage>
            <div>
                <TablaUser />
            </div>
        </AnimatedPage>
    );
}