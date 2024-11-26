export default function MandadoPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🛒 Lista de Mandado</h1>
        <div className="flex gap-2">
          <button className="btn btn-primary">Nuevo Producto</button>
          <button className="btn btn-outline">Historial</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista Principal */}
        <div className="lg:col-span-2">
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Lista Actual</h2>
              <div className="join w-full mb-4">
                <input
                  className="input input-bordered join-item flex-1"
                  placeholder="Agregar producto..."
                />
                <button className="btn join-item btn-primary">Agregar</button>
              </div>

              <div className="space-y-2">
                {["Frutas", "Verduras", "Lácteos"].map((categoria) => (
                  <div
                    key={categoria}
                    className="collapse collapse-arrow bg-base-100"
                  >
                    <input type="checkbox" />
                    <div className="collapse-title font-medium">
                      {categoria}
                    </div>
                    <div className="collapse-content">
                      <div className="space-y-2">
                        {["Producto 1", "Producto 2"].map((producto) => (
                          <div
                            key={producto}
                            className="flex items-center gap-4"
                          >
                            <input type="checkbox" className="checkbox" />
                            <span className="flex-1">{producto}</span>
                            <input
                              type="number"
                              className="input input-bordered input-sm w-20"
                              placeholder="Cant."
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resumen y Sugerencias */}
        <div className="space-y-6">
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Resumen</h2>
              <div className="stats stats-vertical shadow">
                <div className="stat">
                  <div className="stat-title">Total Items</div>
                  <div className="stat-value">15</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Completados</div>
                  <div className="stat-value text-success">8</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Sugerencias</h2>
              <div className="space-y-2">
                {["Leche", "Pan", "Huevos"].map((item) => (
                  <div key={item} className="flex justify-between items-center">
                    <span>{item}</span>
                    <button className="btn btn-ghost btn-sm">+</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
