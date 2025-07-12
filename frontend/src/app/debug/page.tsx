export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-6">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Debug Test
          </span>
        </h1>
        
        <div className="space-y-4">
          <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg">
            <strong>✅ Success:</strong> If you see this green box, Tailwind is working!
          </div>
          
          <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg">
            <strong>ℹ️ Info:</strong> This should have a blue background and blue text.
          </div>
          
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg">
            <strong>⚠️ Warning:</strong> This should have a yellow background and yellow text.
          </div>
          
          <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg">
            <strong>❌ Error:</strong> This should have a red background and red text.
          </div>
        </div>
        
        <div className="mt-6 space-y-3">
          <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
            Gradient Button
          </button>
          
          <button className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-all duration-200">
            Gray Button
          </button>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>If all the colors above are visible, Tailwind CSS is working correctly!</p>
          <p className="mt-2">If you see plain black text on white background, there's a CSS issue.</p>
        </div>
      </div>
    </div>
  );
} 