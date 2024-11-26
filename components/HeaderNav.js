"use client";

function HeaderNav({ toggleSidebar }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-base-100 border-b z-30 px-4">
      <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button
            className="btn btn-ghost btn-sm lg:hidden"
            onClick={toggleSidebar}
          >
            ☰
          </button>
          <h1 className="text-xl font-bold">Mi Hogar</h1>
        </div>
      </div>
    </header>
  );
}

export default HeaderNav;
