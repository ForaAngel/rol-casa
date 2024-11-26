export default function AseoPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🧹 Aseo del Hogar</h1>
        <button className="btn btn-primary">Nueva Tarea</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tareas Pendientes */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Tareas Pendientes</h2>
            <div className="space-y-4">
              {["Limpiar baños", "Aspirar sala", "Lavar trastes"].map(
                (tarea) => (
                  <div
                    key={tarea}
                    className="flex items-center gap-4 bg-base-100 p-4 rounded-lg"
                  >
                    <input type="checkbox" className="checkbox" />
                    <div className="flex-1">
                      <p className="font-medium">{tarea}</p>
                      <p className="text-sm opacity-70">Asignado a: Juan</p>
                    </div>
                    <span className="badge badge-warning">Pendiente</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Calendario Semanal */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Calendario Semanal</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Área</th>
                    <th>Frecuencia</th>
                    <th>Próxima Limpieza</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Cocina</td>
                    <td>Diario</td>
                    <td>Hoy</td>
                  </tr>
                  <tr>
                    <td>Baños</td>
                    <td>Semanal</td>
                    <td>En 2 días</td>
                  </tr>
                  <tr>
                    <td>Ventanas</td>
                    <td>Quincenal</td>
                    <td>En 1 semana</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
