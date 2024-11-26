"use client";

import { useState, useEffect, useCallback } from "react";
import {
  format,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  addMonths,
  eachWeekOfInterval,
  isSameMonth,
  isSameWeek,
} from "date-fns";
import { es } from "date-fns/locale";

export default function RecetasPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(startOfWeek(new Date()));
  const [recipes, setRecipes] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);

  // Obtener todas las semanas del mes actual
  const weeksInMonth = eachWeekOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const createEmptyWeek = useCallback(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push({
        date: addDays(selectedWeek, i),
        meals: [],
      });
    }
    return { days };
  }, [selectedWeek]);

  const loadWeeklyRecipes = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/recipes?weekStart=${selectedWeek.toISOString()}`
      );
      const data = await res.json();
      setRecipes(data[0] || createEmptyWeek());
    } catch (error) {
      console.error("Error loading recipes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedWeek, createEmptyWeek]);

  useEffect(() => {
    loadWeeklyRecipes();
  }, [loadWeeklyRecipes]);

  function handleMonthChange(increment) {
    const newDate = addMonths(currentDate, increment);
    setCurrentDate(newDate);
    setSelectedWeek(startOfWeek(newDate));
  }

  async function handleEditMeal(day, meal) {
    setEditingMeal({
      dayIndex: recipes.days.findIndex(
        (d) =>
          format(new Date(d.date), "yyyy-MM-dd") ===
          format(new Date(day.date), "yyyy-MM-dd")
      ),
      mealIndex: day.meals.findIndex((m) => m === meal),
      ...meal,
      day: day.date,
    });
  }

  async function saveMeal(mealData) {
    try {
      const updatedRecipes = { ...recipes };

      if (editingMeal) {
        // Actualizar comida existente
        const { dayIndex, mealIndex } = editingMeal;
        updatedRecipes.days[dayIndex].meals[mealIndex] = {
          ...updatedRecipes.days[dayIndex].meals[mealIndex],
          ...mealData,
        };
      } else {
        // Agregar nueva comida
        const dayIndex = updatedRecipes.days.findIndex(
          (d) =>
            format(new Date(d.date), "yyyy-MM-dd") ===
            format(new Date(selectedMeal.day), "yyyy-MM-dd")
        );
        updatedRecipes.days[dayIndex].meals.push({
          type: selectedMeal.type,
          ...mealData,
        });
      }

      const payload = {
        weekStart: selectedWeek,
        weekEnd: addDays(selectedWeek, 6),
        days: updatedRecipes.days,
      };

      if (recipes._id) {
        payload._id = recipes._id;
      }

      const res = await fetch("/api/recipes", {
        method: recipes._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al guardar la receta");

      const savedRecipe = await res.json();
      setRecipes(savedRecipe);
      setSelectedMeal(null);
      setEditingMeal(null);
    } catch (error) {
      console.error("Error al guardar la comida:", error);
    }
  }

  if (isLoading)
    return <div className="loading loading-spinner loading-lg"></div>;

  return (
    <div className="space-y-6">
      {/* Header con navegación de mes - más compacto en móvil */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">
            🍳 Recetas de la Semana
          </h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              className="btn btn-circle btn-outline btn-sm sm:btn-md"
              onClick={() => handleMonthChange(-1)}
            >
              ←
            </button>
            <h2 className="text-lg sm:text-xl font-semibold min-w-[150px] sm:min-w-[200px] text-center">
              {format(currentDate, "MMMM yyyy", { locale: es })}
            </h2>
            <button
              className="btn btn-circle btn-outline btn-sm sm:btn-md"
              onClick={() => handleMonthChange(1)}
            >
              →
            </button>
          </div>
        </div>

        {/* Selector de semanas - scrollable en móvil */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {weeksInMonth.map((week, index) => (
            <button
              key={index}
              onClick={() => setSelectedWeek(week)}
              className={`btn btn-xs sm:btn-sm whitespace-nowrap flex-shrink-0 ${
                isSameWeek(selectedWeek, week) ? "btn-primary" : "btn-outline"
              }`}
            >
              <span className="hidden sm:inline">Semana</span> {index + 1}
              <span className="text-xs opacity-75">
                {format(week, "d", { locale: es })}-
                {format(addDays(week, 6), "d", { locale: es })}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid de días - ajustado para móvil */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {recipes?.days.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className={`card ${
              isSameMonth(new Date(day.date), currentDate)
                ? "bg-base-200"
                : "bg-base-300 opacity-75"
            }`}
          >
            <div className="card-body p-3 sm:p-4">
              <h3 className="card-title text-sm sm:text-base flex justify-between">
                <span>
                  {format(new Date(day.date), "EEEE d", { locale: es })}
                </span>
                {!isSameMonth(new Date(day.date), currentDate) && (
                  <span className="text-xs opacity-75">
                    {format(new Date(day.date), "MMM", { locale: es })}
                  </span>
                )}
              </h3>

              {["desayuno", "comida", "cena"].map((mealType) => (
                <div key={mealType} className="space-y-1 sm:space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="capitalize text-sm">{mealType}</span>
                    {!day.meals.find((m) => m.type === mealType) && (
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() =>
                          setSelectedMeal({ day: day.date, type: mealType })
                        }
                      >
                        + Agregar
                      </button>
                    )}
                  </div>
                  {day.meals
                    .filter((meal) => meal.type === mealType)
                    .map((meal, mealIndex) => (
                      <div
                        key={mealIndex}
                        className="bg-base-100 p-2 rounded-lg text-xs sm:text-sm group relative"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{meal.name}</p>
                            {meal.ingredients?.length > 0 && (
                              <p className="text-xs opacity-75 mt-1 truncate">
                                {meal.ingredients.join(", ")}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleEditMeal(day, meal)}
                            className="btn btn-ghost btn-xs opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                          >
                            ✏️
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal - ajustado para móvil */}
      {(selectedMeal || editingMeal) && (
        <dialog className="modal modal-open">
          <div className="modal-box w-11/12 max-w-lg">
            <h3 className="font-bold text-lg">
              {editingMeal ? "Editar" : "Agregar"}{" "}
              {editingMeal?.type || selectedMeal?.type} para el{" "}
              {format(
                new Date(editingMeal?.day || selectedMeal?.day),
                "EEEE d MMMM",
                { locale: es }
              )}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveMeal({
                  name: e.target.name.value,
                  ingredients: e.target.ingredients.value
                    .split(",")
                    .map((i) => i.trim()),
                  notes: e.target.notes.value,
                  type: editingMeal?.type || selectedMeal?.type,
                });
              }}
              className="mt-4 space-y-4"
            >
              <div className="form-control">
                <label className="label">Nombre de la receta</label>
                <input
                  name="name"
                  type="text"
                  className="input input-bordered"
                  required
                  defaultValue={editingMeal?.name || ""}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  Ingredientes (separados por coma)
                </label>
                <input
                  name="ingredients"
                  type="text"
                  className="input input-bordered"
                  defaultValue={editingMeal?.ingredients?.join(", ") || ""}
                />
              </div>
              <div className="form-control">
                <label className="label">Notas</label>
                <textarea
                  name="notes"
                  className="textarea textarea-bordered"
                  defaultValue={editingMeal?.notes || ""}
                />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  {editingMeal ? "Actualizar" : "Guardar"}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setSelectedMeal(null);
                    setEditingMeal(null);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button
              onClick={() => {
                setSelectedMeal(null);
                setEditingMeal(null);
              }}
            >
              close
            </button>
          </form>
        </dialog>
      )}
    </div>
  );
}
