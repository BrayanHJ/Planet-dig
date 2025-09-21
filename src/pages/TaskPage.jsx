import { CardTarea } from "../Components/ui/cards/CardTarea.jsx";
import { SearchBar }  from "../Components/ui/utils/searchBar.jsx";
import { TableTarea } from "../Components/ui/tables/TableTarea.jsx";

import { motion } from "framer-motion";

export const TaskPage = () => {
    return (
        <motion.div className="bg-gray-300 dark:bg-neutral-950 h-full w-full "
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            exit={{ x: -100 }}
            transition={{ duration: 1.5 , ease: "easeInOut" }}
        >
            <div>
                <SearchBar/>

                <br />

                <div className="flex flex-wrap gap-2 justify-center">
                    <TableTarea/>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                    <CardTarea/>
                </div>

            </div>

        </motion.div>
    );
}