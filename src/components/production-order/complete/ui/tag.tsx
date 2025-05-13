import { Settings } from 'lucide-react';
import React from 'react';

interface TagProps {
  type: 'success' | 'warning' | 'info' | 'error';
  text: string;
}

export const Tag: React.FC<TagProps> = ({ type, text }) => {
  const getTagStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <span className={`flex gap-3 px-4 py-1 rounded-md text-sm font-medium ${getTagStyles()}`}>
      {text}
      {type === 'warning' && <Settings className='animate-spin' />}
    </span>
  );
};