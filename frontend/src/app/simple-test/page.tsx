export default function SimpleTestPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: 'red', fontSize: '24px' }}>Simple Test Page</h1>
      
      <div className="bg-blue-500 text-white p-4 rounded mb-4">
        This should have a blue background and white text
      </div>
      
      <div className="bg-green-500 text-white p-4 rounded mb-4">
        This should have a green background and white text
      </div>
      
      <div className="bg-red-500 text-white p-4 rounded mb-4">
        This should have a red background and white text
      </div>
      
      <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
        Purple Button
      </button>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <p>If you see colored boxes above, Tailwind is working!</p>
        <p>If you see plain text, Tailwind is not working.</p>
      </div>
    </div>
  );
} 