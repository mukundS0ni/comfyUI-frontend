"use client"
import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [steps, setSeed] = useState(5);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, steps }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const imageObjectURL = URL.createObjectURL(blob);
        setImageUrl(imageObjectURL);
      } else {
        console.error('Failed to generate image');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-600 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">ComfyUI Image Generator</h1>
        <input
          type="text"
          placeholder="Enter text prompt"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        <input
          type="number"
          placeholder="Enter steps"
          value={steps}
          onChange={(e) => setSeed(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        <button
          onClick={handleGenerate}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
        {imageUrl && (
          <div className="mt-4">
            <h2 className="text-lg font-medium text-gray-900">Generated Image:</h2>
            <img src={imageUrl} alt="Generated" className="mt-2 rounded-lg shadow-md" />
          </div>
        )}
      </div>
    </div>
  );
}
