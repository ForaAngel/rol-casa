"use client";

import { useState, useEffect, useCallback } from "react";

const CATEGORIES = [
  "Frutas y Verduras",
  "Lácteos",
  "Carnes",
  "Abarrotes",
  "Limpieza",
  "Otros",
];

export default function MandadoPage() {
  const [activeList, setActiveList] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [lists, setLists] = useState([]);
  const [newProduct, setNewProduct] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLists = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/shopping-list?history=${showHistory}`);
      const data = await res.json();
      setLists(data);
      if (!showHistory && data.length > 0) {
        setActiveList(data[0]);
      }
    } catch (error) {
      console.error("Error loading lists:", error);
    } finally {
      setIsLoading(false);
    }
  }, [showHistory]);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  async function handleAddProduct(e) {
    e.preventDefault();
    if (!newProduct.trim()) return;

    try {
      let currentList = activeList || { products: [] };

      const updatedList = {
        ...currentList,
        products: [
          ...(currentList.products || []),
          {
            name: newProduct,
            category: selectedCategory,
            quantity: 1,
            completed: false,
          },
        ],
      };

      const res = await fetch("/api/shopping-list", {
        method: currentList._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedList),
      });

      if (!res.ok) {
        throw new Error("Error al guardar la lista");
      }

      const savedList = await res.json();
      setActiveList(savedList);
      setNewProduct("");

      if (!currentList._id) {
        loadLists();
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  }

  async function handleToggleProduct(productId) {
    try {
      const updatedProducts = activeList.products.map((product) =>
        product._id === productId
          ? { ...product, completed: !product.completed }
          : product
      );

      const res = await fetch("/api/shopping-list", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: activeList._id,
          products: updatedProducts,
        }),
      });

      if (res.ok) {
        const savedList = await res.json();
        setActiveList(savedList);
      }
    } catch (error) {
      console.error("Error toggling product:", error);
    }
  }

  async function handleCompleteList() {
    try {
      const res = await fetch("/api/shopping-list", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: activeList._id,
          isActive: false,
          completedAt: new Date(),
        }),
      });

      if (res.ok) {
        loadLists();
      }
    } catch (error) {
      console.error("Error completing list:", error);
    }
  }

  async function handleUpdateQuantity(productId, newQuantity) {
    try {
      const quantity = parseInt(newQuantity) || 1;
      const updatedProducts = activeList.products.map((product) =>
        product._id === productId ? { ...product, quantity } : product
      );

      const res = await fetch("/api/shopping-list", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: activeList._id,
          products: updatedProducts,
        }),
      });

      if (res.ok) {
        const savedList = await res.json();
        setActiveList(savedList);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  }

  async function handleDeleteProduct(productId) {
    try {
      const updatedProducts = activeList.products.filter(
        (product) => product._id !== productId
      );

      const res = await fetch("/api/shopping-list", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: activeList._id,
          products: updatedProducts,
        }),
      });

      if (res.ok) {
        const savedList = await res.json();
        setActiveList(savedList);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">🛒 Lista de Mandado</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            className="btn btn-primary flex-1 sm:flex-none"
            onClick={() => setActiveList({ products: [] })}
          >
            Nueva Lista
          </button>
          <button
            className={`btn flex-1 sm:flex-none ${
              showHistory ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setShowHistory(!showHistory)}
          >
            Historial
          </button>
        </div>
      </div>

      {showHistory ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <div key={list._id} className="card bg-base-200">
              <div className="card-body p-4">
                <h3 className="card-title text-lg flex flex-col sm:flex-row gap-2">
                  {list.name || "Lista sin nombre"}
                  {list.completedAt && (
                    <span className="text-sm opacity-75">
                      Completada:{" "}
                      {new Date(list.completedAt).toLocaleDateString()}
                    </span>
                  )}
                </h3>
                <div className="space-y-2 mt-4">
                  {list.products.map((product) => (
                    <div key={product._id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={product.completed}
                        className="checkbox checkbox-sm"
                        disabled
                      />
                      <span
                        className={
                          product.completed ? "line-through opacity-50" : ""
                        }
                      >
                        {product.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <div className="mb-6">
                  <h2 className="card-title text-xl mb-4">Lista Actual</h2>
                  <form
                    onSubmit={handleAddProduct}
                    className="flex flex-col gap-3"
                  >
                    <input
                      className="input input-bordered w-full text-lg py-6 px-4"
                      placeholder="¿Qué necesitas comprar?"
                      value={newProduct}
                      onChange={(e) => setNewProduct(e.target.value)}
                    />
                    <select
                      className="select select-bordered w-full"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="btn btn-primary w-full">
                      Agregar a la lista
                    </button>
                  </form>
                </div>

                <div className="space-y-2">
                  {CATEGORIES.map((category) => {
                    const products =
                      activeList?.products.filter(
                        (p) => p.category === category
                      ) || [];

                    if (products.length === 0) return null;

                    return (
                      <div
                        key={category}
                        className="collapse collapse-arrow bg-base-100"
                      >
                        <input type="checkbox" defaultChecked />
                        <div className="collapse-title font-medium py-2">
                          {category} ({products.length})
                        </div>
                        <div className="collapse-content">
                          <div className="space-y-2">
                            {products.map((product) => (
                              <div
                                key={product._id}
                                className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-2 rounded-lg hover:bg-base-200"
                              >
                                <input
                                  type="checkbox"
                                  className="checkbox checkbox-sm"
                                  checked={product.completed}
                                  onChange={() =>
                                    handleToggleProduct(product._id)
                                  }
                                />
                                <span
                                  className={`flex-1 text-sm sm:text-base ${
                                    product.completed
                                      ? "line-through opacity-50"
                                      : ""
                                  }`}
                                >
                                  {product.name}
                                </span>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                  <input
                                    type="number"
                                    className="input input-bordered input-sm w-20"
                                    value={product.quantity}
                                    onChange={(e) =>
                                      handleUpdateQuantity(
                                        product._id,
                                        e.target.value
                                      )
                                    }
                                    min="1"
                                  />
                                  <button
                                    onClick={() =>
                                      handleDeleteProduct(product._id)
                                    }
                                    className="btn btn-ghost btn-sm"
                                    title="Eliminar producto"
                                  >
                                    <span className="text-base">🗑️</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {activeList?.products.length > 0 && (
                  <div className="mt-4">
                    <button
                      className="btn btn-success w-full"
                      onClick={handleCompleteList}
                    >
                      Completar Lista
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h2 className="card-title text-lg">Resumen</h2>
                <div className="stats stats-vertical shadow w-full">
                  <div className="stat py-2">
                    <div className="stat-title">Total Items</div>
                    <div className="stat-value text-2xl">
                      {activeList?.products.length || 0}
                    </div>
                  </div>
                  <div className="stat py-2">
                    <div className="stat-title">Completados</div>
                    <div className="stat-value text-2xl text-success">
                      {activeList?.products.filter((p) => p.completed).length ||
                        0}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h2 className="card-title text-lg">Sugerencias</h2>
                <div className="space-y-2">
                  {lists
                    .flatMap((list) => list.products)
                    .filter(
                      (product, index, self) =>
                        index === self.findIndex((p) => p.name === product.name)
                    )
                    .slice(0, 5)
                    .map((product) => (
                      <div
                        key={product._id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm sm:text-base">
                          {product.name}
                        </span>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            setNewProduct(product.name);
                            setSelectedCategory(product.category);
                          }}
                        >
                          +
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
