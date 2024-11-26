"use client";
import { useState } from "react";

function CalendarCleaning({ tasks }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  function getDaysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  function getFirstDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  }

  function changeMonth(increment) {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  }

  return (
    <div className="card bg-base-200 w-full">
      <div className="card-body p-2 sm:p-4">
        <div className="flex justify-between items-center mb-4">
          <button
            className="btn btn-circle btn-sm"
            onClick={() => changeMonth(-1)}
          >
            ←
          </button>
          <h2 className="text-lg sm:text-xl font-bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            className="btn btn-circle btn-sm"
            onClick={() => changeMonth(1)}
          >
            →
          </button>
        </div>

        {/* Vista de escritorio */}
        <div className="hidden sm:grid grid-cols-7 gap-1">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-bold p-2">
              {day}
            </div>
          ))}

          {Array(getFirstDayOfMonth(currentDate))
            .fill(null)
            .map((_, index) => (
              <div key={`empty-${index}`} className="p-2"></div>
            ))}

          {Array(getDaysInMonth(currentDate))
            .fill(null)
            .map((_, index) => {
              const day = index + 1;
              const dateStr = `${currentDate.getFullYear()}-${(
                currentDate.getMonth() + 1
              )
                .toString()
                .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
              const dayTasks = tasks.filter(
                (task) =>
                  new Date(task.createdAt).toISOString().split("T")[0] ===
                  dateStr
              );

              return (
                <div
                  key={day}
                  className={`p-2 min-h-[100px] border rounded-lg ${
                    dayTasks.length ? "bg-base-100" : "bg-base-200"
                  }`}
                >
                  <div className="font-bold mb-1">{day}</div>
                  <div className="space-y-1">
                    {dayTasks.map((task, i) => (
                      <div
                        key={i}
                        className={`text-xs p-1 rounded ${
                          task.completed ? "bg-success/20" : "bg-warning/20"
                        }`}
                      >
                        <span className="capitalize">{task.task}</span>
                        <span className="text-xs block opacity-75">
                          {task.assignedTo}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Vista móvil */}
        <div className="sm:hidden">
          <div className="grid grid-cols-7 gap-1">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-xs font-bold p-1">
                {day}
              </div>
            ))}

            {Array(getFirstDayOfMonth(currentDate))
              .fill(null)
              .map((_, index) => (
                <div key={`empty-${index}`} className="p-1"></div>
              ))}

            {Array(getDaysInMonth(currentDate))
              .fill(null)
              .map((_, index) => {
                const day = index + 1;
                const dateStr = `${currentDate.getFullYear()}-${(
                  currentDate.getMonth() + 1
                )
                  .toString()
                  .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
                const dayTasks = tasks.filter(
                  (task) =>
                    new Date(task.createdAt).toISOString().split("T")[0] ===
                    dateStr
                );

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`p-1 h-12 border rounded-lg cursor-pointer ${
                      dayTasks.length ? "bg-base-100" : "bg-base-200"
                    } ${selectedDay === day ? "ring-2 ring-primary" : ""}`}
                  >
                    <div className="font-bold text-sm">{day}</div>
                    {dayTasks.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {dayTasks.map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-primary"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Modal de tareas del día seleccionado */}
          {selectedDay && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg">
                  Tareas del día {selectedDay}
                </h3>
                <div className="py-4 space-y-2">
                  {tasks
                    .filter((task) => {
                      const taskDate = new Date(task.createdAt);
                      return (
                        taskDate.getDate() === selectedDay &&
                        taskDate.getMonth() === currentDate.getMonth() &&
                        taskDate.getFullYear() === currentDate.getFullYear()
                      );
                    })
                    .map((task, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg ${
                          task.completed ? "bg-success/20" : "bg-warning/20"
                        }`}
                      >
                        <div className="font-medium capitalize">
                          {task.task}
                        </div>
                        <div className="text-sm opacity-75">
                          Asignado a: {task.assignedTo}
                        </div>
                      </div>
                    ))}
                </div>
                <div className="modal-action">
                  <button className="btn" onClick={() => setSelectedDay(null)}>
                    Cerrar
                  </button>
                </div>
              </div>
              <div
                className="modal-backdrop"
                onClick={() => setSelectedDay(null)}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarCleaning;
