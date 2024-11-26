"use client";
import { useState, useEffect } from "react";
import CalendarCleaning from "@/components/CalendarCleaning";

export default function AseoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    task: "",
    assignedTo: "",
  });

  const taskTypes = [
    "barrido",
    "trapeado",
    "estufa",
    "bano",
    "basura",
    "patio",
    "popo de perros",
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch("/api/cleaning-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      const data = await response.json();
      setTasks((prevTasks) => [...prevTasks, data]);
      setIsModalOpen(false);
      setNewTask({ task: "", assignedTo: "" });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  }

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch("/api/cleaning-tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTasks();
  }, []);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">🧹 Aseo del Hogar</h1>
            <button
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              Nueva Tarea
            </button>
          </div>

          <CalendarCleaning tasks={tasks} />

          {/* Modal para nueva tarea */}
          {isModalOpen && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Asignar Nueva Tarea</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Tipo de Tarea</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={newTask.task}
                      onChange={(e) =>
                        setNewTask({ ...newTask, task: e.target.value })
                      }
                      required
                    >
                      <option value="">Selecciona una tarea</option>
                      {taskTypes.map((task) => (
                        <option key={task} value={task} className="capitalize">
                          {task}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Asignar a</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={newTask.assignedTo}
                      onChange={(e) =>
                        setNewTask({ ...newTask, assignedTo: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="modal-action">
                    <button
                      type="button"
                      className="btn"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
              <div
                className="modal-backdrop"
                onClick={() => setIsModalOpen(false)}
              ></div>
            </div>
          )}

          {/* Lista de tareas pendientes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title">Tareas Pendientes</h2>
                <div className="space-y-4">
                  {tasks
                    .filter((task) => !task.completed)
                    .map((task) => (
                      <div
                        key={task._id}
                        className="flex items-center gap-4 bg-base-100 p-4 rounded-lg"
                      >
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={task.completed}
                          onChange={async () => {
                            try {
                              const response = await fetch(
                                `/api/cleaning-tasks/${task._id}`,
                                {
                                  method: "PATCH",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    completed: !task.completed,
                                  }),
                                }
                              );
                              const updatedTask = await response.json();
                              setTasks((prevTasks) =>
                                prevTasks.map((t) =>
                                  t._id === task._id ? updatedTask : t
                                )
                              );
                            } catch (error) {
                              console.error("Error updating task:", error);
                            }
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium capitalize">{task.task}</p>
                          <p className="text-sm opacity-70">
                            Asignado a: {task.assignedTo}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
