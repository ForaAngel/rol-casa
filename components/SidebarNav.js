"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function SidebarNav({ isOpen, setIsOpen }) {
  const pathname = usePathname();

  const menuItems = [
    { icon: "🏠", label: "Inicio", href: "/dashboard" },
    { icon: "🍳", label: "Recetas Semanales", href: "/dashboard/recetas" },
    { icon: "🧹", label: "Aseo del Hogar", href: "/dashboard/aseo" },
    { icon: "🛒", label: "Lista de Mandado", href: "/dashboard/mandado" },
  ];

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40
          h-full w-64 bg-base-200
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:top-16 lg:h-[calc(100vh-4rem)] lg:shadow-xl
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header del sidebar con botón de cierre */}
          <div className="p-4 border-b lg:hidden flex justify-between items-center">
            <h1 className="text-xl font-bold">Mi Hogar</h1>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-ghost btn-sm px-2"
              aria-label="Cerrar menú"
            >
              ✕
            </button>
          </div>

          {/* Navegación */}
          <nav className="flex-1 p-4">
            <ul className="menu menu-vertical gap-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 hover:bg-base-300 ${
                      pathname === item.href
                        ? "bg-primary text-primary-content"
                        : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}

export default SidebarNav;
