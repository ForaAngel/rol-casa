"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function SidebarNav() {
  const pathname = usePathname();

  const menuItems = [
    { icon: "🏠", label: "Inicio", href: "/dashboard" },
    { icon: "🍳", label: "Recetas Semanales", href: "/dashboard/recetas" },
    { icon: "🧹", label: "Aseo del Hogar", href: "/dashboard/aseo" },
    { icon: "🛒", label: "Lista de Mandado", href: "/dashboard/mandado" },
  ];

  return (
    <div className="h-screen w-64 bg-base-200 text-base-content fixed left-0 top-0 p-4">
      <div className="flex items-center gap-2 mb-8">
        <span className="text-2xl">🏠</span>
        <h1 className="text-xl font-bold">Mi Hogar</h1>
      </div>

      <ul className="menu menu-vertical gap-2">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center gap-3 hover:bg-base-300 ${
                pathname === item.href ? "bg-primary text-primary-content" : ""
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SidebarNav;
