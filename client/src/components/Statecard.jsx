export default function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
      <p className="text-gray-500 text-sm uppercase tracking-wide">
        {title}
      </p>
      <h3 className="text-4xl font-extrabold text-slate-800 mt-3">
        {value}
      </h3>
    </div>
  );
}
