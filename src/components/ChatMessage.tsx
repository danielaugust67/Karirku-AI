import React from 'react';
import { MessageCircle, Bot } from 'lucide-react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import { useTypewriter } from '../hooks/useTypewriter'; // pastikan path sesuai

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Tambahkan efek typewriter hanya untuk bot
  const content = isUser ? message.content : useTypewriter(message.content, 15);

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-500' : 'bg-green-500'}`}>
        {isUser ? <MessageCircle className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
      </div>
      <div className={`flex-1 px-4 py-3 rounded-lg ${isUser ? 'bg-blue-100' : 'bg-gray-100'}`}>
        <div className="text-gray-800 whitespace-pre-wrap">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
