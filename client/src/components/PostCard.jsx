export default function PostCard({ post, onConnect }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-1">
      <h3 className="text-xl font-bold text-slate-800 mb-2">
        {post.title}
      </h3>

      <p className="text-gray-600 mb-4">
        {post.description}
      </p>

      {onConnect && (
        <button
          onClick={onConnect}
          className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold"
        >
          Connect
        </button>
      )}
    </div>
  );
}
