const Stars = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {[...Array(80)].map((_, i) => {
        const size = Math.random() * 3 + 1.5; // Tamaño entre 1px y 4px
        const top = `${Math.random() * 100}%`;
        const left = `${Math.random() * 100}%`;
        const duration = `${1 + Math.random() * 1}s`; // Duración entre 1 y 3s
        const delay = `${Math.random() * 5}s`;
        const initialOpacity = Math.random() * 0.6 + 1.4; // Entre 0.7 y 1

        // Colores suaves variados
        const colors = ['#ffffff', '#ffe9c4', '#c4dfff', '#f8f8ff'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Animación más evidente que pulse: usa una animación personalizada
        const animationName = 'twinkle';

        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top,
              left,
              backgroundColor: color,
              opacity: initialOpacity,
              animation: `${animationName} ${duration} ease-in-out ${delay} infinite alternate`,
            }}
          />
        );
      })}
    </div>
  );
};

export default Stars;

