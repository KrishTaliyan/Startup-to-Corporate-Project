export default function ActivityLog({ posts, notifications }) {
  const activities = [];

  posts.forEach((p) => {
    activities.push({
      type: "post",
      text: `You created a post: "${p.title}"`,
      time: p.createdAt,
    });

    p.interestedCorporates.forEach((c) => {
      activities.push({
        type: "interest",
        text: `${c.name} showed interest in "${p.title}"`,
        time: p.updatedAt,
      });
    });
  });

  activities.sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-6">Activity Log</h2>

      {activities.length === 0 && (
        <p className="text-gray-500">No activity yet</p>
      )}

      <ul className="space-y-4">
        {activities.map((a, i) => (
          <li key={i} className="flex gap-3">
            <span>
              {a.type === "post" ? "🟢" : "🔔"}
            </span>
            <div>
              <p>{a.text}</p>
              <p className="text-xs text-gray-400">
                {new Date(a.time).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
