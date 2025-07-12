export default function TailwindTestPage() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          🎨 Tailwind CSS Test
        </h1>
        <p className="text-gray-700 mb-4">
          If you can see this styled content, Tailwind CSS is working!
        </p>
        <div className="space-y-2">
          <div className="bg-green-100 text-green-800 p-2 rounded">
            ✅ Green background with green text
          </div>
          <div className="bg-yellow-100 text-yellow-800 p-2 rounded">
            ⚠️ Yellow background with yellow text
          </div>
          <div className="bg-red-100 text-red-800 p-2 rounded">
            ❌ Red background with red text
          </div>
        </div>
        <div className="mt-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Blue Button
          </button>
        </div>
      </div>
    </div>
  );
} 