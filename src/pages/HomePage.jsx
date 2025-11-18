import { RadioButton } from 'primereact/radiobutton';

export const HomePage = () => {
    return (
        <main className="flex min-h-screen  dark:bg-bg-dark max-w-[1200px] mx-auto">
            <h1>jkhjkhslkdhlasdkhksdaffd</h1>
            FEATURES

<div className="flex flex-wrap gap-3">
    <div className="flex align-items-center">
        <RadioButton inputId="ingredient1" name="pizza" value="Cheese" />
        <label htmlFor="ingredient1" className="ml-2">Cheese</label>
    </div>
    <div className="flex align-items-center">
        <RadioButton inputId="ingredient2" name="pizza" value="Mushroom" />
        <label htmlFor="ingredient2" className="ml-2">Mushroom</label>
    </div>
    <div className="flex align-items-center">
        <RadioButton inputId="ingredient3" name="pizza" value="Pepper" />
        <label htmlFor="ingredient3" className="ml-2">Pepper</label>
    </div>
    <div className="flex align-items-center">
        <RadioButton inputId="ingredient4" name="pizza" value="Onion"/>
        <label htmlFor="ingredient4" className="ml-2">Onion</label>
    </div>
</div>
         

        </main>
    );
}