const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto bg-base-100 flex flex-col items-center justify-center gap-16 px-8 py-8 lg:py-20">
      <div className="flex flex-col gap-10 items-center text-center max-w-3xl">
        <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight">
          Simplifica la gestión de tu hogar
        </h1>
        <p className="text-lg opacity-80 leading-relaxed">
          Una plataforma que te ayuda a organizar el mandado, planificar recetas
          semanales y coordinar las tareas de limpieza con tus compañeros de
          casa. Todo en un solo lugar.
        </p>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <div className="flex flex-col items-center gap-3 h-full">
          <span className="text-4xl mb-2">🛒</span>
          <h3 className="font-bold text-lg mb-2">Lista de Compras</h3>
          <p className="text-sm opacity-75 text-center h-12">
            Organiza tu despensa y compras semanales
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 h-full">
          <span className="text-4xl mb-2">👩‍🍳</span>
          <h3 className="font-bold text-lg mb-2">Planificador de Comidas</h3>
          <p className="text-sm opacity-75 text-center h-12">
            Recetas y menús semanales
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 h-full">
          <span className="text-4xl mb-2">🧹</span>
          <h3 className="font-bold text-lg mb-2">Tareas Compartidas</h3>
          <p className="text-sm opacity-75 text-center h-12">
            Coordina la limpieza en equipo
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
