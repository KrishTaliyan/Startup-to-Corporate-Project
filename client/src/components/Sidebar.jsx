export default function Sidebar({ role }) {
  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white p-6">
      <h2 className="text-2xl font-extrabold mb-10">
        Connect<span className="text-indigo-400">X</span>
      </h2>

      <nav className="space-y-4">
        <a className="block px-4 py-2 rounded-lg bg-slate-800">
          Dashboard
        </a>

        <a
          href="/profile"
          className="block px-4 py-2 rounded-lg hover:bg-slate-800"
        >
          Profile
        </a>

        {role === "startup" && (
          <p className="text-sm text-gray-400 mt-6">
            Startup Tools Enabled
          </p>
        )}

        {role === "corporate" && (
          <p className="text-sm text-gray-400 mt-6">
            Corporate Tools Enabled
          </p>
        )}
      </nav>
    </div>
  );
}
