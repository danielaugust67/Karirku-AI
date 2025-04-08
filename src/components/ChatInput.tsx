import React, { useState } from 'react';
import { Send, Square } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isGenerating: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, onStop, isGenerating }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isGenerating) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 rounded-xl px-3 py-2 bg-gray-100 dark:bg-gray-700 shadow-md"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isGenerating}
        placeholder="Ketik pesan Anda di sini..."
        className="flex-1 text-sm px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
      />

      {isGenerating ? (
        <button
          type="button"
          onClick={onStop}
          className="p-2 rounded-md bg-red-500 hover:bg-red-600 transition-colors text-white"
        >
          <Square className="w-5 h-5" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2 rounded-md bg-green-500 hover:bg-green-600 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      )}
    </form>
  );
};
