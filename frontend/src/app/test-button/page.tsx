'use client';

export default function TestButtonPage() {
  const handleButtonClick = () => {
    console.log('Test button clicked!');
    alert('Test button clicked!');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted!');
    alert('Form submitted!');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Button Test Page</h1>
        
        <div className="space-y-4">
          <button 
            onClick={handleButtonClick}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Test Button Click
          </button>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <input 
              type="text" 
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <button 
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Submit Form
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 