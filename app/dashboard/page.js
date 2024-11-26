import ButtonAccount from "@/components/ButtonAccount";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-extrabold">Mi Hogar</h1>
        <ButtonAccount />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card Recetas */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">🍳 Recetas de la Semana</h2>
            <p>Planifica tus comidas semanales</p>
            <div className="card-actions justify-end">
              <a href="/dashboard/recetas" className="btn btn-primary">
                Ver Recetas
              </a>
            </div>
          </div>
        </div>

        {/* Card Aseo */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">🧹 Aseo del Hogar</h2>
            <p>Organiza las tareas de limpieza</p>
            <div className="card-actions justify-end">
              <a href="/dashboard/aseo" className="btn btn-primary">
                Ver Tareas
              </a>
            </div>
          </div>
        </div>

        {/* Card Lista de Mandado */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">🛒 Lista de Mandado</h2>
            <p>Gestiona tu lista de compras</p>
            <div className="card-actions justify-end">
              <a href="/dashboard/mandado" className="btn btn-primary">
                Ver Lista
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
