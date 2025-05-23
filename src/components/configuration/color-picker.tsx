import { useState } from 'react';

const ColorPicker = () => {
  const [colors, setColors] = useState(['#FF0000', '#00FF00', '#0000FF']);
  const [newColor, setNewColor] = useState('');

  const addColor = () => {
    if (/^#[0-9A-F]{6}$/i.test(newColor)) {
      setColors([...colors, newColor]);
      setNewColor('');
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap">
        {colors.map((color, index) => (
          <div
            key={index}
            className="w-8 h-8 rounded-full mr-2 mb-2"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div className="mt-4 flex">
      <input
          className="w-12 h-12 p-1 mr-4"
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
        />
        <input
          className="border p-2 rounded mr-2"
          placeholder="#FFFFFF"
          type="text"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={addColor}
        >
          Add Color
        </button>
      </div>
    </div>
  );
};

export default ColorPicker;