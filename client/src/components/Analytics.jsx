export default function Analytics({ posts }) {
  const totalPosts = posts.length;
  const totalInterests = posts.reduce(
    (sum, p) => sum + p.interestedCorporates.length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-6">
        <StatCard title="Total Posts" value={totalPosts} />
        <StatCard title="Total Interests" value={totalInterests} />
      </div>

      {/* Simple chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow">
        <h3 className="text-lg font-bold mb-4">Interests per Post</h3>

        {posts.map((p) => (
          <div key={p._id} className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>{p.title}</span>
              <span>{p.interestedCorporates.length}</span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full"
                style={{
                  width: `${Math.min(
                    p.interestedCorporates.length * 20,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <p className="text-gray-500">No data yet</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}
