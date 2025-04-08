import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Message } from './types';
import { GEMINI_API_KEY } from './config';
import { Bot, Menu } from 'lucide-react';
import { getChats, saveChats, generateId } from './utils/localStorage';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [chats, setChats] = useState(getChats());
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    try {
      setIsGenerating(true);
      const newMessages = [...messages, { role: 'user', content }];
      setMessages(newMessages);

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const chat = model.startChat({
        history: newMessages.map((msg) => ({
          role: msg.role,
          parts: msg.content,
        })),
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });

      const abortController = new AbortController();
      abortRef.current = abortController;

      const result = await chat.sendMessage(
        `Kamu adalah Career Coach AI, seorang asisten karir profesional. Jawablah pertanyaan ini hanya jika berkaitan dengan karir, pekerjaan, wawancara, pengembangan diri, CV, atau hal-hal seputar dunia kerja. Jika pertanyaannya di luar topik tersebut, tolak dengan sopan dan beri tahu bahwa kamu hanya bisa menjawab topik seputar karir.

        Jawablah dengan gaya santai seperti ngobrol dengan teman. Ini pertanyaannya: ${content}`,
      );

      if (abortController.signal.aborted) return;

      const response = await result.response;
      const botMessage = response.text();

      const finalMessages = [...newMessages, { role: 'assistant', content: botMessage }];
      setMessages(finalMessages);

      const chatId = currentChatId || generateId();
      const updatedChat = {
        id: chatId,
        title: newMessages[0]?.content.slice(0, 30) || 'Chat Baru',
        messages: finalMessages,
        createdAt: new Date().toISOString(),
      };

      const updatedChats = chats.filter((c) => c.id !== chatId).concat(updatedChat);
      setChats(updatedChats);
      setCurrentChatId(chatId);
      saveChats(updatedChats);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Response aborted');
      } else {
        console.error('Error:', error);
        setMessages([
          ...messages,
          { role: 'assistant', content: 'Maaf, terjadi kesalahan. Silakan coba lagi.' },
        ]);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStop = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      setIsGenerating(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
  };

  const handleSelectChat = (chatId: string) => {
    const selected = chats.find((c) => c.id === chatId);
    if (selected) {
      setMessages(selected.messages);
      setCurrentChatId(chatId);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    const filtered = chats.filter((c) => c.id !== chatId);
    setChats(filtered);
    saveChats(filtered);

    if (currentChatId === chatId) {
      setMessages([]);
      setCurrentChatId(null);
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col shadow-md`}>
          {/* Toggle Sidebar */}
          <div className="mb-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 dark:text-gray-300 transition-transform hover:scale-110"
            >
              <Menu />
            </button>
          </div>

          {/* New Chat Button */}
          {sidebarOpen && (
            <div className="mb-4">
              <button
                onClick={handleNewChat}
                className="w-full py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded hover:scale-105 transition-transform shadow"
              >
                + Chat Baru
              </button>
            </div>
          )}

          {/* Chat List */}
          <div className="flex-1 overflow-auto space-y-2 custom-scrollbar pr-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className="cursor-pointer px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center transition"
              >
                <span className="truncate w-full pr-2 text-sm text-gray-800 dark:text-gray-200">
                  {sidebarOpen ? chat.title : '💬'}
                </span>
                {sidebarOpen && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(chat.id);
                    }}
                    className="text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-t-xl shadow-sm flex items-center gap-3 border-b dark:border-gray-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">Career Coach AI</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Asisten Karir & Simulator Interview</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1 text-sm rounded bg-gray-200 dark:bg-gray-700 dark:text-gray-100 text-gray-800"
            >
              {darkMode ? '🌞 Light' : '🌙 Dark'}
            </button>
          </div>

          {/* Chat Area with Scroll */}
          <div className="flex flex-col flex-1">
            <div
              ref={chatContainerRef}
              className="h-[calc(100vh-140px)] overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-900 custom-scrollbar"
            >
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-300 py-8">
                  <p className="mb-2">👋 Selamat datang di Career Coach AI!</p>
                  <p>Saya siap membantu Anda dengan:</p>
                  <ul className="mt-4 space-y-2">
                    <li>💼 Saran pengembangan karir</li>
                    <li>🎯 Simulasi wawancara kerja</li>
                    <li>📝 Tips menyusun CV & Resume</li>
                    <li>🚀 Strategi mencari kerja</li>
                  </ul>
                  <p className="mt-4">Silakan mulai dengan mengetikkan pertanyaan atau topik yang ingin Anda diskusikan.</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))
              )}
              {isGenerating && (
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-400" />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-2 bg-white dark:bg-gray-800 rounded-b-xl shadow-sm border-t dark:border-gray-700">
              <ChatInput
                onSend={handleSendMessage}
                onStop={handleStop}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
