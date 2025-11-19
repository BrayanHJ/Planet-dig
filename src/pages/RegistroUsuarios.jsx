import TablaRegistrosUser from "../Components/ui/tables/TablasRegistrosUser";
import AnimatedPage from "../Components/Animations/AnimatedPage";
export const RegistroUsuarios = () => {
    return (
        <AnimatedPage>
            <div>
                <TablaRegistrosUser />
            </div>
        </AnimatedPage>
    );
}