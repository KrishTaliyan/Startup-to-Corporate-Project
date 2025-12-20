import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ role, onLogout, children }) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-slate-800">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Navbar role={role} onLogout={onLogout} />

        {/* Page Content */}
        <main className="flex-1 p-8 text-gray-900 dark:text-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
